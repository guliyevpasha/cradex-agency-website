/**
 * Site assistant API.
 *   POST { action: 'ask', message, locale, session, page }  → answer, or the
 *        question is stored in Sanity and the owner gets an e-mail
 *   POST { action: 'contact', id, session, contact }         → visitor leaves a contact
 *   GET  ?id=…  (header x-chat-session)                      → the owner's reply, once written
 * @author Paşa Quliyev — Cradex Agency
 */
import { NextRequest, NextResponse } from 'next/server'
import { bestMatch, isGreeting, stems } from '@/lib/chat/match'
import { answerBase, notify, readAnswer, saveContact, storageReady, storeQuestion, underCaps } from '@/lib/chat/server'

const LOCALES = ['az', 'en', 'ru', 'tr']
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
const SESSION_RE = new RegExp(`^${UUID}$`, 'i')
const ID_RE = new RegExp(`^chat\\.${UUID}$`, 'i')
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i
const PHONE_RE = /^\+?[\d\s()-]{9,20}$/

/*
 * Per-instance limits keep one visitor from hammering the endpoint; the
 * site-wide caps in underCaps() are what protect the inbox.
 */
const hits = new Map<string, number[]>()
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) {
    // drop the quiet keys only, never everyone's history at once
    for (const [k, v] of hits) if (now - v[v.length - 1] > windowMs) hits.delete(k)
  }
  return recent.length > max
}

// On Vercel x-real-ip / x-forwarded-for are set by the platform, not the client.
const ipOf = (req: NextRequest) =>
  req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'

function sameSite(req: NextRequest) {
  const site = req.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') return false
  const origin = req.headers.get('origin')
  if (origin) {
    try {
      return new URL(origin).host === req.headers.get('host')
    } catch {
      return false
    }
  }
  return Boolean(site)
}

const bad = (status = 400) => NextResponse.json({ error: 'invalid' }, { status })

export async function POST(request: NextRequest) {
  if (!sameSite(request)) return bad(403)
  const ip = ipOf(request)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return bad()
  }
  const session = String(body.session ?? '')
  if (!SESSION_RE.test(session)) return bad()

  if (body.action === 'contact') {
    if (limited(`c:${ip}`, 5, 10 * 60_000)) return bad(429)
    const id = String(body.id ?? '')
    const contact = String(body.contact ?? '').trim().slice(0, 120)
    if (!ID_RE.test(id) || !(EMAIL_RE.test(contact) || PHONE_RE.test(contact)) || !storageReady()) return bad()
    const ok = await saveContact(id, session, contact).catch(() => false)
    return ok ? NextResponse.json({ ok: true }) : bad()
  }

  if (limited(`a:${ip}`, 20, 10 * 60_000)) return bad(429)
  const message = String(body.message ?? '').trim()
  if (message.length < 2 || message.length > 500) return bad()
  const locale = LOCALES.includes(String(body.locale)) ? String(body.locale) : 'az'
  const rawPage = String(body.page ?? '')
  const page = /^\/[\w\-./]{0,199}$/.test(rawPage) ? rawPage : ''

  if (isGreeting(message)) return NextResponse.json({ type: 'greeting' })

  const match = bestMatch(message, await answerBase(locale))
  if (match) return NextResponse.json({ type: 'answer', text: match.entry.answer })

  // Too little to go on ("ok", "?"): ask again instead of e-mailing the owner.
  if (stems(message).length < 2) return NextResponse.json({ type: 'greeting' })

  if (!storageReady()) return NextResponse.json({ type: 'offline' })
  try {
    if (!(await underCaps(session))) return NextResponse.json({ type: 'offline' })
    const id = await storeQuestion({ question: message, locale, page, session })
    await notify(message, id, undefined, page).catch(() => false)
    return NextResponse.json({ type: 'forwarded', id })
  } catch (err) {
    console.error('[chat] store failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ type: 'offline' })
  }
}

export async function GET(request: NextRequest) {
  if (!sameSite(request)) return bad(403)
  if (limited(`g:${ipOf(request)}`, 120, 10 * 60_000)) return bad(429)
  const id = request.nextUrl.searchParams.get('id') ?? ''
  // the session is a secret: it travels in a header, never in the URL or logs
  const session = request.headers.get('x-chat-session') ?? ''
  if (!ID_RE.test(id) || !SESSION_RE.test(session) || !storageReady()) return bad()
  const answer = await readAnswer(id, session).catch(() => null)
  return NextResponse.json({ answer }, { headers: { 'Cache-Control': 'no-store' } })
}
