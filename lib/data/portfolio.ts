import type { PortfolioItem, ServiceSlug } from '@/types'
import portfolioData from './portfolio.data.json'

async function fetchFromSanity<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  try {
    const { getSanityClient } = await import('@/lib/sanity/client')
    const client = getSanityClient()
    if (!client) return null
    return await client.fetch<T>(query, params ?? {})
  } catch {
    return null
  }
}

export async function getAllPortfolio(): Promise<PortfolioItem[]> {
  const { ALL_PORTFOLIO_QUERY } = await import('@/lib/sanity/client')
  const data = await fetchFromSanity<PortfolioItem[]>(ALL_PORTFOLIO_QUERY)
  if (data && data.length > 0) return data
  return portfolioData.portfolio as PortfolioItem[]
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  const { PORTFOLIO_BY_SLUG_QUERY } = await import('@/lib/sanity/client')
  const data = await fetchFromSanity<PortfolioItem>(PORTFOLIO_BY_SLUG_QUERY, { slug })
  if (data) return data
  return (portfolioData.portfolio as PortfolioItem[]).find((i) => i.slug === slug) ?? null
}

export async function getFeaturedPortfolio(limit?: number): Promise<PortfolioItem[]> {
  const { FEATURED_PORTFOLIO_QUERY } = await import('@/lib/sanity/client')
  const data = await fetchFromSanity<PortfolioItem[]>(FEATURED_PORTFOLIO_QUERY, { limit: limit ?? 6 })
  if (data && data.length > 0) return data
  const items = (portfolioData.portfolio as PortfolioItem[]).filter((i) => i.featured)
  return limit ? items.slice(0, limit) : items
}

export async function getPortfolioByCategory(category: ServiceSlug): Promise<PortfolioItem[]> {
  const items = await getAllPortfolio()
  return items.filter((i) => i.serviceCategory === category)
}

export async function getPortfolioSlugs(): Promise<string[]> {
  const { PORTFOLIO_SLUGS_QUERY } = await import('@/lib/sanity/client')
  const data = await fetchFromSanity<{ slug: string }[]>(PORTFOLIO_SLUGS_QUERY)
  if (data && data.length > 0) return data.map((d) => d.slug)
  return (portfolioData.portfolio as PortfolioItem[]).map((i) => i.slug)
}

export function getAllPortfolioSync(): PortfolioItem[] {
  return portfolioData.portfolio as PortfolioItem[]
}

export function getPortfolioBySlugSync(slug: string): PortfolioItem | null {
  return getAllPortfolioSync().find((i) => i.slug === slug) ?? null
}
