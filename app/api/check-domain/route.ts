/**
 * Domain availability check across 16 zones.
 *
 * A name that resolves in DNS is taken. One that does not is confirmed via
 * RDAP where the registry has it; .az zones have no RDAP, so for them the
 * DNS answer is final. The result is a guide — the registrar has the last word.
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
  if (hits.size > 5000) hits.clear()
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
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
  if (limited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const raw = request.nextUrl.searchParams.get('name') ?? ''
  const label = raw.length <= 253 ? toLabel(raw) : null
  if (!label) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const results = await Promise.all(
    ZONES.map(async (zone) => {
      const domain = `${label}.${zone}`
      return { domain, status: await check(domain, zone) }
    })
  )

  return NextResponse.json(
    { name: label, results },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
