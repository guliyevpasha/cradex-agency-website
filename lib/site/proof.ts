/**
 * Which reviews and blog posts a service, pricing or product page shows.
 * Tagged entries (Sanity "services") come first; the rest fills in so a page
 * never shows an empty block while the owner is still tagging content.
 * @author Paşa Quliyev — Cradex Agency
 */

export const SERVICE_TAGS = ['web', 'mobile', 'seo', 'ads', 'support', 'chatbot', 'combo'] as const
export type ServiceTag = (typeof SERVICE_TAGS)[number]

/** Blog categories that suit a service, used for posts nobody has tagged yet. */
const BLOG_CATEGORIES: Record<ServiceTag, string[]> = {
  web: ['web-dev', 'design'],
  mobile: ['web-dev', 'design'],
  seo: ['seo', 'copywriting'],
  ads: ['smm', 'marketing-strategy'],
  support: ['web-dev', 'seo'],
  chatbot: ['marketing-strategy', 'web-dev'],
  combo: ['smm', 'marketing-strategy'],
}

type Post = { id: string; category: string; publishedAt?: string; services?: string[] }

/** Tagged posts, then posts of a matching category, then the newest — `limit` in all. */
export function postsFor<T extends Post>(posts: T[], service: ServiceTag, limit = 3): T[] {
  const sorted = [...posts].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
  const cats = BLOG_CATEGORIES[service]
  const picked: T[] = []
  const add = (list: T[]) => {
    for (const p of list) if (picked.length < limit && !picked.some((x) => x.id === p.id)) picked.push(p)
  }
  add(sorted.filter((p) => p.services?.includes(service)))
  add(sorted.filter((p) => cats.includes(p.category)))
  add(sorted)
  return picked
}

type Review = { id: string; services?: string[] }

/** Reviews tagged for the service; with none tagged yet, all of them (as on the home page). */
export function reviewsFor<T extends Review>(reviews: T[], service: ServiceTag): T[] {
  const tagged = reviews.filter((r) => r.services?.includes(service))
  if (tagged.length > 0) return tagged
  return reviews
}
