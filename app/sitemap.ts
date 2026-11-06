/**
 * Builds sitemap.xml for every locale: static pages, services, products and
 * portfolio projects.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { MetadataRoute } from 'next'
import { getAllPortfolio } from '@/lib/data/portfolio'
import { cleanSlug, isShown } from '@/lib/site/portfolio'
import { PRODUCT_LINKS, SERVICE_IDS, SERVICE_SLUGS } from '@/lib/site/navigation'
import { getArticleSlugs } from '@/lib/data/journal'

const baseUrl = 'https://cradexagency.com'
const locales = ['az', 'en', 'ru', 'tr']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serviceSlugs = SERVICE_IDS.map((id) => SERVICE_SLUGS[id])
  const portfolioSlugs = (await getAllPortfolio()).filter(isShown).map((p) => cleanSlug(p.slug))
  const articleSlugs = await getArticleSlugs()

  const staticPages = [
    '',
    '/about',
    '/clients',
    '/services',
    '/products',
    '/pricing',
    '/pricing/reqemsal-reklam',
    '/pricing/mobil-tetbiq',
    '/pricing/seo-geo',
    '/pricing/texniki-xidmet',
    '/terms',
    '/privacy',
    '/refund',
    '/portfolio',
    '/journal',
    '/contact',
  ]

  const entries: MetadataRoute.Sitemap = []

  // Static pages for all locales
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      })
    }

    for (const p of PRODUCT_LINKS) {
      entries.push({ url: `${baseUrl}/${locale}/products/${p.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })
    }

    // Service pages
    for (const slug of serviceSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    // Portfolio pages
    for (const slug of portfolioSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/portfolio/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }

    // Journal pages
    for (const slug of articleSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/journal/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  return entries
}
