/**
 * The logged-in Studio session token. The Studio signs in with a token
 * (auth.loginMethod in sanity.config.ts) and keeps it in localStorage; our
 * own API routes check it with Sanity before answering.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { SanityClient } from 'sanity'

export function studioToken(client: SanityClient): string {
  const fromConfig = client.config().token
  if (fromConfig) return fromConfig
  try {
    const raw = localStorage.getItem(`__studio_auth_token_${client.config().projectId}`)
    return raw ? (JSON.parse(raw).token ?? '') : ''
  } catch {
    return ''
  }
}
