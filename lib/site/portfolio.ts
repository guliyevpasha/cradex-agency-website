/**
 * Helpers for showing website projects.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { PortfolioItem } from '@/types'

type Locale = 'az' | 'en' | 'ru' | 'tr'

/** Projects with fresh captures in public/images/work (<slug>-desktop.jpg / -mobile.jpg). */
const CAPTURED = new Set([
  'baku-global-education',
  'porr-group-insaat-sirk-ti',
  'orien-travel-mmc',
  'saatlar-az',
  'ciao-stellina-resto-pub',
  'executive-baku-resto-pub',
  'sanidez-mmc',
  'alov-insaat-mmc',
  'itm-store-mmc',
  'akademi-xaricd-t-hsil-sirk-ti',
])

export function shotsFor(item: PortfolioItem): { desktop: string; mobile?: string } {
  const slug = cleanSlug(item.slug)
  return CAPTURED.has(slug)
    ? { desktop: `/images/work/${slug}-desktop.jpg`, mobile: `/images/work/${slug}-mobile.jpg` }
    : { desktop: item.coverImage }
}

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

  // Drop the longest run of opening words that repeats the client's name
  // (at least two words, so a lone common word is never removed).
  const nameWords = clientName(item, locale).toLowerCase().split(/\s+/)
  const words = text.split(/\s+/)
  let n = 0
  while (n < words.length && n < nameWords.length && words[n].toLowerCase() === nameWords[n]) n++
  if (n >= 2) {
    text = words
      .slice(n)
      .join(' ')
      .replace(/^[\s,:—-]*(üçün|için|для|for)?[\s,:—-]*/i, '')
    text = text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
  }

  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text
}
