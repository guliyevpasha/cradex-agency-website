import type { Article, ArticleCategory } from '@/types'
import journalData from './journal.data.json'
import { getAllBlogPosts, getBlogPostBySlug, getBlogPostsByCategory, getPaginatedBlogPosts } from '@/sanity/lib/queries'

// Helper function to check if we should use Sanity (production) or JSON (fallback)
function shouldUseSanity(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const nodeEnv = process.env.NODE_ENV
  const shouldUse = !!(projectId && nodeEnv !== 'test')
  
  console.log('[Journal] Sanity check:', {
    projectId: projectId ? `${projectId.substring(0, 4)}...` : 'missing',
    nodeEnv,
    shouldUse
  })
  
  return shouldUse
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
  const useSanity = shouldUseSanity()
  console.log('[Journal] getPaginatedArticles called:', { page, perPage, category, locale, useSanity })
  
  if (useSanity) {
    try {
      const result = await getPaginatedBlogPosts(page, perPage, category, locale)
      console.log('[Journal] Sanity returned:', { articles: result.articles.length, total: result.total })
      return result
    } catch (error) {
      console.error('[Journal] Failed to fetch from Sanity, using fallback data:', error)
    }
  }
  
  console.log('[Journal] Using fallback JSON data')
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
