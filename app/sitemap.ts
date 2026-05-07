import type { MetadataRoute } from 'next'
import { getServiceSlugs } from '@/lib/data/services'
import { getPortfolioSlugs } from '@/lib/data/portfolio'
import { getArticleSlugs } from '@/lib/data/journal'

const baseUrl = 'https://cradexagency.com'
const locales = ['az', 'en', 'ru', 'tr']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serviceSlugs = await getServiceSlugs()
  const portfolioSlugs = await getPortfolioSlugs()
  const articleSlugs = await getArticleSlugs()

  const staticPages = [
    '',
    '/about',
    '/services',
    '/calculator',
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
