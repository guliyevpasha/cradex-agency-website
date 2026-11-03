/**
 * Helpers for showing website projects.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { PortfolioItem } from '@/types'

type Locale = 'az' | 'en' | 'ru' | 'tr'

export const isWebsite = (item: PortfolioItem) =>
  (item.category ?? item.serviceCategory) === 'web-mobile-dev' && Boolean(item.coverImage)

/** Some Sanity slugs were saved with spaces or capitals. */
export function cleanSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "https://www.saatlar.az/" → "saatlar.az" */
export function domainOf(url?: string): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export const clientName = (item: PortfolioItem, locale: string) =>
  (item.title?.[locale as Locale] || item.clientName || item.titleKey).trim()

/**
 * First sentence of the description, short enough for the card line.
 * Descriptions usually open with the client's name ("X üçün …"), which the
 * card already shows in bold, so that opening is dropped.
 */
export function shortSummary(item: PortfolioItem, locale: string, max = 90): string {
  let text = (item.description?.[locale as Locale] ?? '').trim()
  if (!text) return ''
  text = text.split(/(?<=[.!?])\s/)[0]

  const name = clientName(item, locale)
  if (name && text.toLowerCase().startsWith(name.toLowerCase())) {
    text = text
      .slice(name.length)
      .replace(/^[\s,:—-]*(üçün|için|для|for)?[\s,:—-]*/i, '')
    text = text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
  }

  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text
}
