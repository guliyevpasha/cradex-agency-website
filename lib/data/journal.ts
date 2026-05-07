import type { Article, ArticleCategory } from '@/types'
import journalData from './journal.data.json'

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

export async function getAllArticles(): Promise<Article[]> {
  const { ALL_ARTICLES_QUERY } = await import('@/lib/sanity/client')
  const data = await fetchFromSanity<Article[]>(ALL_ARTICLES_QUERY)
  if (data && data.length > 0) return data
  return journalData.articles as Article[]
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { ARTICLE_BY_SLUG_QUERY } = await import('@/lib/sanity/client')
  const data = await fetchFromSanity<Article>(ARTICLE_BY_SLUG_QUERY, { slug })
  if (data) return data
  return (journalData.articles as Article[]).find((a) => a.slug === slug) ?? null
}

export async function getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
  const all = await getAllArticles()
  return all.filter((a) => a.category === category)
}

export async function getArticleSlugs(): Promise<string[]> {
  const { ARTICLE_SLUGS_QUERY } = await import('@/lib/sanity/client')
  const data = await fetchFromSanity<{ slug: string }[]>(ARTICLE_SLUGS_QUERY)
  if (data && data.length > 0) return data.map((d) => d.slug)
  return (journalData.articles as Article[]).map((a) => a.slug)
}

export async function getPaginatedArticles(
  page: number,
  perPage = 9,
  category?: ArticleCategory
): Promise<{ articles: Article[]; total: number; totalPages: number }> {
  const all = category ? await getArticlesByCategory(category) : await getAllArticles()
  const sorted = [...all].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  const total = sorted.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  return { articles: sorted.slice(start, start + perPage), total, totalPages }
}

export function getAllArticlesSync(): Article[] {
  return journalData.articles as Article[]
}
