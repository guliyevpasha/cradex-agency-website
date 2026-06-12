import type { Article, ArticleCategory } from '@/types'
import journalData from './journal.data.json'
import { getAllBlogPosts, getBlogPostBySlug, getBlogPostsByCategory, getPaginatedBlogPosts } from '@/sanity/lib/queries'

// Helper function to check if we should use Sanity (production) or JSON (fallback)
function shouldUseSanity(): boolean {
  return !!(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test')
}

export async function getAllArticles(locale: string = 'az'): Promise<Article[]> {
  if (shouldUseSanity()) {
    try {
      return await getAllBlogPosts(locale)
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  return journalData.articles as Article[]
}

export async function getArticleBySlug(slug: string, locale: string = 'az'): Promise<Article | null> {
  if (shouldUseSanity()) {
    try {
      return await getBlogPostBySlug(slug, locale)
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  return (journalData.articles as Article[]).find((a) => a.slug === slug) ?? null
}

export async function getArticlesByCategory(category: ArticleCategory, locale: string = 'az'): Promise<Article[]> {
  if (shouldUseSanity()) {
    try {
      return await getBlogPostsByCategory(category, locale)
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  const all = await getAllArticles(locale)
  return all.filter((a) => a.category === category)
}

export async function getArticleSlugs(): Promise<string[]> {
  if (shouldUseSanity()) {
    try {
      const articles = await getAllBlogPosts('az')
      return articles.map((a) => a.slug)
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  return (journalData.articles as Article[]).map((a) => a.slug)
}

export async function getPaginatedArticles(
  page: number,
  perPage = 9,
  category?: ArticleCategory,
  locale: string = 'az'
): Promise<{ articles: Article[]; total: number; totalPages: number }> {
  if (shouldUseSanity()) {
    try {
      return await getPaginatedBlogPosts(page, perPage, category, locale)
    } catch (error) {
      console.error('Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  const all = category ? await getArticlesByCategory(category, locale) : await getAllArticles(locale)
  const sorted = [...all].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  const total = sorted.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  return { articles: sorted.slice(start, start + perPage), total, totalPages }
}

export function getAllArticlesSync(): Article[] {
  return journalData.articles as Article[]
}
