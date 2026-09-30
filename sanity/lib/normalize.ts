/**
 * Sanity → app model normalisation.
 *
 * The Sanity schemas store documents in their own shape (`title`, `excerpt`,
 * `author` as a plain string, bodies as Portable Text), while the app renders
 * the `Article` / `PortfolioItem` types from `@/types`. Without this layer the
 * page components read fields that do not exist — `article.author.name` threw
 * during static export.
 */

import type {
  Article,
  ArticleAuthor,
  ArticleCategory,
  PortfolioItem,
  ServiceSlug,
} from '@/types'

// ─── Portable Text ───────────────────────────────────────────────────────────

interface PortableTextSpan {
  text?: string
  marks?: string[]
}

interface PortableTextBlock {
  _type?: string
  style?: string
  listItem?: string
  children?: PortableTextSpan[]
}

/**
 * Flattens Portable Text into the light markdown that `ArticleBody` renders:
 * blank-line separated blocks, `## ` / `### ` headings, `- ` bullets, `1. `
 * numbered items, `> ` quotes and `**bold**` inline. Cheaper than pulling in a
 * Portable Text renderer for this one page.
 *
 * Strong marks and numbered lists are carried through rather than dropped —
 * losing them turned every emphasised term and every step-by-step list in an
 * editor's article into flat prose.
 */
export function portableTextToPlainText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''

  const paragraphs: string[] = []
  let list: string[] = []
  let listCounter = 0

  const flushList = () => {
    if (list.length) {
      paragraphs.push(list.join('\n'))
      list = []
    }
    listCounter = 0
  }

  for (const block of value as PortableTextBlock[]) {
    if (!block || block._type !== 'block') continue

    const text = (block.children ?? [])
      .map((child) => {
        const raw = child?.text ?? ''
        if (!raw.trim()) return raw
        return child?.marks?.includes('strong') ? `**${raw.trim()}**` : raw
      })
      .join('')
      .trim()
    if (!text) continue

    if (block.listItem) {
      // A bullet list and a numbered list never share one run, so a single
      // counter is enough to number the items of the current run.
      if (block.listItem === 'number') list.push(`${++listCounter}. ${text}`)
      else list.push(`- ${text}`)
      continue
    }

    flushList()

    if (block.style === 'h2') paragraphs.push(`## ${text}`)
    else if (block.style === 'h3' || block.style === 'h4') paragraphs.push(`### ${text}`)
    else if (block.style === 'blockquote') paragraphs.push(`> ${text}`)
    else paragraphs.push(text)
  }

  flushList()
  return paragraphs.join('\n\n')
}

// ─── Articles ────────────────────────────────────────────────────────────────

const FALLBACK_AUTHOR: ArticleAuthor = {
  id: 'cradex-agency',
  name: 'Cradex Agency',
  avatarUrl: '',
  role: 'Cradex Agency',
}

const DEFAULT_ARTICLE_CATEGORY: ArticleCategory = 'marketing-strategy'
const DEFAULT_SERVICE_CATEGORY: ServiceSlug = 'digital-marketing'

function toId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

/** Sanity's `blog.author` is a plain string; the app expects an author object. */
function toAuthor(value: unknown): ArticleAuthor {
  if (typeof value === 'string' && value.trim()) {
    const name = value.trim()
    return { id: toId(name), name, avatarUrl: '', role: FALLBACK_AUTHOR.role }
  }

  if (value && typeof value === 'object') {
    const author = value as Partial<ArticleAuthor>
    if (author.name && author.name.trim()) {
      const name = author.name.trim()
      return {
        id: author.id ?? toId(name),
        name,
        avatarUrl: author.avatarUrl ?? '',
        role: author.role ?? FALLBACK_AUTHOR.role,
      }
    }
  }

  return FALLBACK_AUTHOR
}

/** Roughly 200 words per minute, never less than a minute. */
function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export interface SanityBlogDoc {
  id?: string
  slug?: string
  title?: string
  excerpt?: string
  content?: unknown
  category?: string
  author?: unknown
  publishedAt?: string
  readingTime?: number
  image?: string
  tags?: string[]
}

export function toArticle(doc: SanityBlogDoc | null | undefined): Article | null {
  if (!doc || !doc.slug) return null

  const titleKey = doc.title ?? ''
  const excerptKey = doc.excerpt ?? ''
  const contentKey = portableTextToPlainText(doc.content)
  const coverImage = doc.image ?? ''
  const publishedAt = doc.publishedAt ?? ''
  const author = toAuthor(doc.author)

  return {
    id: doc.id ?? doc.slug,
    slug: doc.slug,
    titleKey,
    excerptKey,
    contentKey,
    category: (doc.category as ArticleCategory) || DEFAULT_ARTICLE_CATEGORY,
    author,
    coverImage,
    publishedAt,
    readingTimeMinutes: doc.readingTime ?? estimateReadingTime(contentKey),
    tags: doc.tags ?? [],
    metaTitleKey: titleKey,
    metaDescriptionKey: excerptKey,
    ogImage: coverImage,
    jsonLd: {
      '@type': 'Article',
      headline: titleKey,
      author: { '@type': 'Person', name: author.name },
      datePublished: publishedAt,
      image: coverImage,
    },
  }
}

export function toArticles(docs: unknown): Article[] {
  if (!Array.isArray(docs)) return []
  return docs
    .map((doc) => toArticle(doc as SanityBlogDoc))
    .filter((article): article is Article => article !== null)
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

/**
 * Sanitizes a slug to ensure it's URL-safe kebab-case format.
 * Converts spaces to hyphens, removes special characters, and lowercases.
 */
function sanitizeSlug(slug: string): string {
  if (!slug) return ''
  
  return slug
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}

export interface SanityPortfolioDoc {
  id?: string
  slug?: string
  title?: string | { az: string; en: string; ru: string; tr: string }
  client?: string
  category?: string
  serviceCategory?: string
  description?: string | { az: string; en: string; ru: string; tr: string }
  image?: string
  gallery?: (string | null)[]
  tools?: string[]
  tags?: string[]
  results?: string | { az: string; en: string; ru: string; tr: string }
  duration?: string
  projectUrl?: string
  detailedSections?: Array<{
    title?: { az?: string; en?: string; ru?: string; tr?: string }
    description?: { az?: string; en?: string; ru?: string; tr?: string }
  }>
  servicesList?: Array<{
    title?: { az?: string; en?: string; ru?: string; tr?: string }
    description?: { az?: string; en?: string; ru?: string; tr?: string }
  }>
  statistics?: Array<{
    label?: { az?: string; en?: string; ru?: string; tr?: string }
    value?: string
    icon?: string
  }>
  mediaGallery?: {
    socialMediaPosts?: Array<{
      url?: string
      caption?: { az?: string; en?: string; ru?: string; tr?: string }
    }>
    motionDesigns?: Array<{
      url?: string
      caption?: { az?: string; en?: string; ru?: string; tr?: string }
    }>
    videoContent?: Array<{
      url?: string
      caption?: { az?: string; en?: string; ru?: string; tr?: string }
    }>
    adResults?: Array<{
      url?: string
      caption?: { az?: string; en?: string; ru?: string; tr?: string }
    }>
  }
  videoUrl?: string
  completedAt?: string
  featured?: boolean
}

export function toPortfolioItem(
  doc: SanityPortfolioDoc | null | undefined
): PortfolioItem | null {
  if (!doc || !doc.slug) return null

  // Sanitize slug to ensure URL-safe format
  const cleanSlug = sanitizeSlug(doc.slug)
  if (!cleanSlug) {
    console.warn('[Portfolio Normalize] Invalid slug after sanitization:', doc.slug)
    return null
  }

  // Helper to extract localized text
  const getLocalizedText = (field: string | { az: string; en: string; ru: string; tr: string } | undefined): string => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field.az || field.en || ''
  }

  // Helper to get object format if available
  const getLocalizedObject = (field: string | { az: string; en: string; ru: string; tr: string } | undefined) => {
    if (!field) return undefined
    if (typeof field === 'object') return field as { az: string; en: string; ru: string; tr: string }
    return undefined
  }

  return {
    id: doc.id ?? cleanSlug,
    slug: cleanSlug,
    titleKey: getLocalizedText(doc.title),
    title: getLocalizedObject(doc.title),
    clientName: doc.client ?? '',
    category: doc.category,
    serviceCategory: (doc.serviceCategory as ServiceSlug) || DEFAULT_SERVICE_CATEGORY,
    tags: doc.tags ?? [],
    coverImage: doc.image ?? '',
    gallery: (doc.gallery ?? []).filter((url): url is string => Boolean(url)),
    videoUrl: doc.videoUrl,
    projectUrl: doc.projectUrl,
    descriptionKey: getLocalizedText(doc.description),
    description: getLocalizedObject(doc.description),
    tools: doc.tools ?? [],
    resultsKey: getLocalizedText(doc.results),
    results: getLocalizedObject(doc.results),
    duration: doc.duration,
    detailedSections: doc.detailedSections,
    servicesList: doc.servicesList,
    statistics: doc.statistics,
    mediaGallery: doc.mediaGallery,
    publishedAt: doc.completedAt ?? '',
    featured: Boolean(doc.featured),
  }
}

export function toPortfolioItems(docs: unknown): PortfolioItem[] {
  if (!Array.isArray(docs)) return []
  return docs
    .map((doc) => toPortfolioItem(doc as SanityPortfolioDoc))
    .filter((item): item is PortfolioItem => item !== null)
}
