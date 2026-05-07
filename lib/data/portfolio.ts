import type { PortfolioItem, ServiceSlug } from '@/types'
import portfolioData from './portfolio.data.json'

export async function getAllPortfolio(): Promise<PortfolioItem[]> {
  return portfolioData.portfolio as PortfolioItem[]
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  return (portfolioData.portfolio as PortfolioItem[]).find((i) => i.slug === slug) ?? null
}

export async function getFeaturedPortfolio(limit?: number): Promise<PortfolioItem[]> {
  const items = (portfolioData.portfolio as PortfolioItem[]).filter((i) => i.featured)
  return limit ? items.slice(0, limit) : items
}

export async function getPortfolioByCategory(category: ServiceSlug): Promise<PortfolioItem[]> {
  const items = await getAllPortfolio()
  return items.filter((i) => i.serviceCategory === category)
}

export async function getPortfolioSlugs(): Promise<string[]> {
  return (portfolioData.portfolio as PortfolioItem[]).map((i) => i.slug)
}

export function getAllPortfolioSync(): PortfolioItem[] {
  return portfolioData.portfolio as PortfolioItem[]
}

export function getPortfolioBySlugSync(slug: string): PortfolioItem | null {
  return getAllPortfolioSync().find((i) => i.slug === slug) ?? null
}
