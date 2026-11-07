/**
 * Catch-all for unknown paths under a locale, so they get the localized
 * not-found page inside the site layout instead of Next's bare root 404.
 * @author Paşa Quliyev — Cradex Agency
 */
import { notFound, permanentRedirect } from 'next/navigation'

// Home page slugs of the old WordPress site that search engines still list,
// e.g. /ru/ana-səhifə-русский. They go to the home page of that language.
const OLD_HOME = /^(ana-s[əe]hif[əe]|home|glavnaya|главная|ana-sayfa)(-|$)/i

export default async function UnknownPage({ params }: { params: Promise<{ locale: string; rest: string[] }> }) {
  const { locale, rest } = await params
  let first = rest[0] ?? ''
  try {
    first = decodeURIComponent(first)
  } catch {
    // malformed escape: treat as unknown
  }
  if (rest.length === 1 && OLD_HOME.test(first)) permanentRedirect(`/${locale}`)
  notFound()
}
