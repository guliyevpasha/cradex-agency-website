import type { PortfolioItem, ServiceSlug } from '@/types'
import portfolioData from './portfolio.data.json'
import { getAllPortfolio as getSanityPortfolio, getPortfolioBySlug as getSanityPortfolioBySlug, getFeaturedPortfolio as getSanityFeaturedPortfolio, getPortfolioByCategory as getSanityPortfolioByCategory } from '@/sanity/lib/queries'

// Check if we should use Sanity (production) or JSON (fallback)
const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test'

export async function getAllPortfolio(locale: string = 'az'): Promise<PortfolioItem[]> {
  if (USE_SANITY) {
    try {
      return await getSanityPortfolio(locale)
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  return portfolioData.portfolio as PortfolioItem[]
}

export async function getPortfolioBySlug(slug: string, locale: string = 'az'): Promise<PortfolioItem | null> {
  console.log('[Portfolio Data] getPortfolioBySlug called with:', { slug, locale, USE_SANITY })
  
  if (USE_SANITY) {
    try {
      const result = await getSanityPortfolioBySlug(slug, locale)
      console.log('[Portfolio Data] Sanity result:', result ? 'Found' : 'Not found')
      return result
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  
  const fallbackItem = (portfolioData.portfolio as PortfolioItem[]).find((i) => i.slug === slug)
  console.log('[Portfolio Data] Fallback result:', fallbackItem ? `Found: ${fallbackItem.titleKey}` : 'Not found')
  
  return fallbackItem ?? null
}

export async function getFeaturedPortfolio(limit?: number, locale: string = 'az'): Promise<PortfolioItem[]> {
  if (USE_SANITY) {
    try {
      return await getSanityFeaturedPortfolio(limit, locale)
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
      return await getSanityPortfolioByCategory(category, locale)
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
      const items = await getSanityPortfolio('az')
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
