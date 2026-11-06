/**
 * "Our work" categories: ids, URLs and the ad platforms. The cases themselves
 * come from Sanity, with samples as fallback (lib/data/work.ts).
 * @author Paşa Quliyev — Cradex Agency
 */

export const WORK_IDS = ['web', 'ads', 'mobile', 'seo', 'support'] as const
export type WorkId = (typeof WORK_IDS)[number]
export type WorkCategory = Exclude<WorkId, 'web'>

/** Azerbaijani slugs in every language, like the services. Websites keep /portfolio. */
export const WORK_SLUGS: Record<WorkCategory, string> = {
  ads: 'reqemsal-reklam',
  mobile: 'mobil-tetbiq',
  seo: 'seo-geo',
  support: 'texniki-xidmet',
}

export const workHref = (locale: string, id: WorkId) =>
  id === 'web' ? `/${locale}/portfolio` : `/${locale}/portfolio/${WORK_SLUGS[id]}`

export type AdPlatform = 'meta' | 'tiktok' | 'google' | 'linkedin'
