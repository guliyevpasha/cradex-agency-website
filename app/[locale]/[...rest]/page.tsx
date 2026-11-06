/**
 * Catch-all for unknown paths under a locale, so they get the localized
 * not-found page inside the site layout instead of Next's bare root 404.
 * @author Paşa Quliyev — Cradex Agency
 */
import { notFound } from 'next/navigation'

export default function UnknownPage() {
  notFound()
}
