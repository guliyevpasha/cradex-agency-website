import type { Article, ArticleCategory } from '@/types'
import journalData from './journal.data.json'

export async function getAllArticles(): Promise<Article[]> {
  return journalData.articles as Article[]
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (journalData.articles as Article[]).find((a) => a.slug === slug) ?? null
}

export async function getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
  const all = await getAllArticles()
  return all.filter((a) => a.category === category)
}

export async function getArticleSlugs(): Promise<string[]> {
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
