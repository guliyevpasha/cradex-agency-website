/**
 * Domain availability check across 16 zones.
 *
 * A name that resolves in DNS is taken. One that does not is confirmed via
 * RDAP where the registry has it; .az zones have no RDAP, so for them the
 * DNS answer is final. The result is a guide — the registrar has the last word.
 * With ?stream=1 the answer is NDJSON: first the list of domains, then one
 * line per domain the moment its registry answers, so the page fills in live.
 *
 * @author Paşa Quliyev — Cradex Agency
 */
import { NextRequest, NextResponse } from 'next/server'
import { Resolver, lookup } from 'node:dns/promises'

export const runtime = 'nodejs'

const ZONES = [
  'az', 'com.az', 'net.az', 'org.az',
  'com', 'net', 'org', 'io', 'info', 'biz', 'co', 'me', 'app', 'dev', 'xyz', 'online',
] as const

const NO_RDAP = new Set(['az', 'com.az', 'net.az', 'org.az'])
const LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/
const TIMEOUT_MS = 4500

type Status = 'available' | 'taken' | 'unknown'

// Small in-memory limits; enough to stop one visitor hammering the registries.
const hits = new Map<string, number[]>()
const cache = new Map<string, { at: number; status: Status }>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 8
const CACHE_MS = 10 * 60_000

function limited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    // drop the quiet keys only, never everyone's history at once
    for (const [k, v] of hits) if (now - v[v.length - 1] > WINDOW_MS) hits.delete(k)
  }
  return recent.length > MAX_PER_WINDOW
}

/** "https://www.MenBiznes.com/path" → "menbiznes" */
function toLabel(input: string): string | null {
  let s = input.trim().toLowerCase()
  s = s.replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[/?#]/)[0]
  const label = s.split('.')[0]
  return LABEL_RE.test(label) && !label.includes('--') ? label : null
}

async function dnsExists(domain: string): Promise<boolean | null> {
  // A registered domain is delegated, so it answers an NS query.
  const resolver = new Resolver({ timeout: TIMEOUT_MS, tries: 1 })
  try {
    const ns = await resolver.resolveNs(domain)
    return ns.length > 0
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOTFOUND') return false
    if (code === 'ENODATA') return null
  }
  // No direct DNS access (some hosts block port 53): fall back to the OS
  // resolver. A name with an address is certainly taken.
  try {
    await lookup(domain)
    return true
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === 'ENOTFOUND' ? false : null
  }
}

async function rdapRegistered(domain: string): Promise<boolean | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { accept: 'application/rdap+json' },
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    if (res.status === 404) return false
    if (res.ok) return true
    return null
  } catch {
    return null
  }
}

async function check(domain: string, zone: string): Promise<Status> {
  const cached = cache.get(domain)
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.status

  let status: Status
  const inDns = await dnsExists(domain)
  if (inDns === true) {
    status = 'taken'
  } else if (NO_RDAP.has(zone)) {
    status = inDns === false ? 'available' : 'unknown'
  } else {
    const reg = await rdapRegistered(domain)
    status = reg === true ? 'taken' : reg === false ? 'available' : inDns === false ? 'available' : 'unknown'
  }

  if (status !== 'unknown') cache.set(domain, { at: Date.now(), status })
  if (cache.size > 20_000) cache.clear()
  return status
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
  if (limited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const raw = request.nextUrl.searchParams.get('name') ?? ''
  const label = raw.length <= 253 ? toLabel(raw) : null
  if (!label) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const domains = ZONES.map((zone) => `${label}.${zone}`)

  if (request.nextUrl.searchParams.get('stream') === '1') {
    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        // the visitor may leave before every registry answers
        let open = true
        request.signal.addEventListener('abort', () => (open = false))
        const send = (data: unknown) => {
          if (!open) return
          try {
            controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))
          } catch {
            open = false
          }
        }
        send({ name: label, domains })
        await Promise.all(
          ZONES.map(async (zone, i) => {
            send({ domain: domains[i], status: await check(domains[i], zone), source: NO_RDAP.has(zone) ? 'dns' : 'rdap' })
          })
        )
        if (open) controller.close()
      },
    })
    return new Response(body, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' } })
  }

  const results = await Promise.all(ZONES.map(async (zone, i) => ({ domain: domains[i], status: await check(domains[i], zone) })))

  return NextResponse.json(
    { name: label, results },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
