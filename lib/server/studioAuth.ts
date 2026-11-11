/**
 * Checks that a request comes from someone logged in to the Studio: the
 * bearer token is the Studio session token, and Sanity confirms it can read
 * this project (only project members can). Used by the analytics API and the
 * publish → refresh call.
 * @author Paşa Quliyev — Cradex Agency
 */
import { createHash } from 'node:crypto'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const OK_MS = 5 * 60 * 1000
const DENIED_MS = 60 * 1000
// Unknown tokens cost a call to Sanity each; a flood of made-up ones must not
// turn this server into a traffic source or get its address rate-limited.
const MAX_CHECKS_PER_MINUTE = 30

// token hash → [allowed, valid until]
const seen = new Map<string, [boolean, number]>()
let windowStart = 0
let checks = 0

export async function isStudioUser(authorization: string | null): Promise<boolean> {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
  if (!token || token.length > 512 || !PROJECT_ID) return false

  const now = Date.now()
  const key = createHash('sha256').update(token).digest('hex')
  const hit = seen.get(key)
  if (hit && hit[1] > now) return hit[0]

  if (now - windowStart > 60_000) {
    windowStart = now
    checks = 0
  }
  if (++checks > MAX_CHECKS_PER_MINUTE) return false

  let allowed = false
  try {
    const res = await fetch(`https://api.sanity.io/v2021-06-07/projects/${PROJECT_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    // any Sanity account can ask; only a member of this project gets it back
    allowed = res.ok && (await res.json())?.id === PROJECT_ID
  } catch {
    return false
  }
  if (seen.size > 500) seen.clear()
  seen.set(key, [allowed, now + (allowed ? OK_MS : DENIED_MS)])
  return allowed
}
