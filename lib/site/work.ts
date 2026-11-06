/**
 * "Our work" categories beyond websites: URLs and the numbers on the case
 * cards. Texts live in messages (site.workPages); numbers are kept here so
 * all four languages show the same figures.
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

/**
 * The figures below show the format, not a named client's results. While
 * this is true every card carries a "sample" badge. Replace the numbers with
 * real, client-approved ones, then switch it off.
 */
export const SAMPLE_RESULTS = true

export type AdPlatform = 'meta' | 'tiktok' | 'google' | 'linkedin'

/** Same order as site.workPages.ads.cases. `bars` is the weekly trend, 0–100. */
export const AD_CASES: { platform: AdPlatform; values: [string, string, string]; bars: number[] }[] = [
  { platform: 'meta', values: ['$600', '1 000', '$0.60'], bars: [38, 52, 47, 66, 74, 88, 100] },
  { platform: 'meta', values: ['$1 200', '310', '4.2×'], bars: [30, 41, 58, 55, 72, 81, 96] },
  { platform: 'tiktok', values: ['1.2M', '380K', '$0.37'], bars: [22, 46, 70, 100, 84, 77, 69] },
  { platform: 'tiktok', values: ['21K', '2.4%', '$0.03'], bars: [40, 48, 61, 58, 79, 86, 92] },
  { platform: 'google', values: ['420', '9.8%', '$1.20'], bars: [44, 57, 63, 70, 68, 82, 90] },
  { platform: 'google', values: ['$900', '640', '$1.40'], bars: [28, 39, 51, 64, 71, 85, 100] },
  { platform: 'linkedin', values: ['$1 500', '85', '$17.60'], bars: [35, 42, 55, 61, 58, 74, 83] },
  { platform: 'linkedin', values: ['230', '1.1%', '$3.50'], bars: [30, 47, 52, 69, 80, 76, 91] },
]

/** Same order as site.workPages.seo.cases: three figures and a 6-point growth line (0–100). */
export const SEO_CASES: { values: [string, string, string]; line: number[] }[] = [
  { values: ['+184%', '42', '+63%'], line: [12, 18, 31, 44, 63, 86] },
  { values: ['+240%', '310', '+92%'], line: [8, 15, 26, 41, 70, 100] },
  { values: ['+310%', '+170%', '+120%'], line: [10, 24, 45, 58, 74, 90] },
  { values: ['12 / 20', '+96%', '+48%'], line: [5, 9, 22, 38, 61, 80] },
]
