/**
 * Site-wide navigation, locales and contact helpers.
 * @author Paşa Quliyev — Cradex Agency
 */

export const LOCALES = [
  { code: 'az', label: 'AZ', name: 'Azərbaycan' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'tr', label: 'TR', name: 'Türkçe' },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/** Same page in another language: /az/services → /ru/services */
export function localizedPath(pathname: string, code: string): string {
  const parts = pathname.split('/')
  parts[1] = code
  return parts.join('/') || `/${code}`
}

export const SERVICE_IDS = ['web', 'mobile', 'seo', 'ads', 'support'] as const
export type ServiceId = (typeof SERVICE_IDS)[number]

/** Azerbaijani slugs for the service pages, the same in every language (local SEO). */
export const SERVICE_SLUGS: Record<ServiceId, string> = {
  web: 'veb-sayt-hazirlanmasi',
  mobile: 'mobil-tetbiq',
  seo: 'seo-geo',
  ads: 'reqemsal-reklam',
  support: 'texniki-xidmet',
}

export const serviceIdBySlug = (slug: string) =>
  SERVICE_IDS.find((id) => SERVICE_SLUGS[id] === slug)

export const serviceHref = (locale: string, id: ServiceId) => `/${locale}/services/${SERVICE_SLUGS[id]}`

/** Product pages, Azerbaijani slugs in every language (like the services). */
export const PRODUCT_LINKS = [
  { id: 'chatbot', slug: 'catbot-hazirlanmasi' },
  { id: 'combo', slug: 'sosial-media-kombo-paketleri' },
] as const

export type ProductId = (typeof PRODUCT_LINKS)[number]['id']

export const productHref = (locale: string, id: ProductId) =>
  `/${locale}/products/${PRODUCT_LINKS.find((p) => p.id === id)!.slug}`

/** Top-level menu, in display order. `menu` marks items with a dropdown. */
export const NAV_ITEMS = [
  { key: 'home', href: '', exact: true },
  { key: 'services', href: '/services', menu: 'services' },
  { key: 'products', href: '/products', menu: 'products' },
  { key: 'work', href: '/portfolio' },
  { key: 'about', href: '/about' },
  { key: 'pricing', href: '/pricing' },
  { key: 'blog', href: '/journal' },
  { key: 'contact', href: '/contact' },
] as const

export function isActive(pathname: string, locale: string, href: string, exact = false): boolean {
  const full = `/${locale}${href}`
  if (exact) return pathname === full || pathname === `${full}/`
  return pathname === full || pathname.startsWith(`${full}/`)
}

export const LEGAL_PAGES = ['terms', 'privacy', 'refund'] as const
export type LegalPageId = (typeof LEGAL_PAGES)[number]
