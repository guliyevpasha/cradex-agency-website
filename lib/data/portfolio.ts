/**
 * Portfolio data access: Sanity first, bundled JSON as fallback.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { PortfolioItem, ServiceSlug } from '@/types'
import portfolioData from './portfolio.data.json'
import { client } from '@/sanity/lib/client'
import { getAllPortfolio as getSanityPortfolio, getPortfolioBySlug as getSanityPortfolioBySlug, getFeaturedPortfolio as getSanityFeaturedPortfolio, getPortfolioByCategory as getSanityPortfolioByCategory } from '@/sanity/lib/queries'

// Local draft preview (SANITY_PREVIEW_DRAFTS=1, see sanity/lib/client.ts) is for
// reviewing the batch that waits for approval: the seeded web-<slug> drafts and
// edits to published projects. A project that only exists as a draft in Studio
// is not on the live site and stays out here too.
const PREVIEW = process.env.NODE_ENV === 'development' && process.env.SANITY_PREVIEW_DRAFTS === '1'

async function reviewable(items: PortfolioItem[]): Promise<PortfolioItem[]> {
  if (!PREVIEW) return items
  const live = new Set(await client.fetch<string[]>(`*[_type == "portfolio"]._id`, {}, { perspective: 'published' }))
  return items.filter((i) => {
    const id = i.id.replace(/^drafts./, '')
    return id.startsWith('web-') || live.has(id)
  })
}

// Check if we should use Sanity (production) or JSON (fallback)
const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test'

export async function getAllPortfolio(locale: string = 'az'): Promise<PortfolioItem[]> {
  if (USE_SANITY) {
    try {
      return await reviewable(await getSanityPortfolio(locale))
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  return portfolioData.portfolio as PortfolioItem[]
}

export async function getPortfolioBySlug(slug: string, locale: string = 'az'): Promise<PortfolioItem | null> {
  if (USE_SANITY) {
    try {
      const item = await getSanityPortfolioBySlug(slug, locale)
      return item ? ((await reviewable([item]))[0] ?? null) : null
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }

  return (portfolioData.portfolio as PortfolioItem[]).find((i) => i.slug === slug) ?? null
}

export async function getFeaturedPortfolio(limit?: number, locale: string = 'az'): Promise<PortfolioItem[]> {
  if (USE_SANITY) {
    try {
      return await reviewable(await getSanityFeaturedPortfolio(limit, locale))
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  const items = (portfolioData.portfolio as PortfolioItem[]).filter((i) => i.featured)
  return limit ? items.slice(0, limit) : items
}

export async function getPortfolioByCategory(category: ServiceSlug, locale: string = 'az'): Promise<PortfolioItem[]> {
  if (USE_SANITY) {
    try {
      return await reviewable(await getSanityPortfolioByCategory(category, locale))
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  const items = await getAllPortfolio(locale)
  return items.filter((i) => i.serviceCategory === category)
}

export async function getPortfolioSlugs(): Promise<string[]> {
  if (USE_SANITY) {
    try {
      const items = await reviewable(await getSanityPortfolio('az'))
      return items.map((i) => i.slug)
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  return (portfolioData.portfolio as PortfolioItem[]).map((i) => i.slug)
}

export function getAllPortfolioSync(): PortfolioItem[] {
  return portfolioData.portfolio as PortfolioItem[]
}

export function getPortfolioBySlugSync(slug: string): PortfolioItem | null {
  return getAllPortfolioSync().find((i) => i.slug === slug) ?? null
}
