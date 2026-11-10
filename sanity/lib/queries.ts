import { client } from './client'
import { toArticle, toArticles, toPortfolioItem, toPortfolioItems } from './normalize'
import type { Article, ArticleCategory, PortfolioItem, ServiceSlug } from '@/types'

// ─── Blog Queries ────────────────────────────────────────────────────────────

export async function getAllBlogPosts(locale: string = 'az'): Promise<Article[]> {
  // Only fetch published documents (exclude drafts)
  const query = `*[_type == "blog" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "excerpt": excerpt.${locale},
    "category": category,
    "services": coalesce(services, []),
    "author": author,
    "publishedAt": publishedAt,
    "readingTime": readingTime,
    "image": mainImage.asset->url
  }`

  return toArticles(await client.fetch(query))
}

export async function getBlogPostBySlug(slug: string, locale: string = 'az') {
  // Only fetch published document (exclude draft)
  const query = `*[_type == "blog" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "excerpt": excerpt.${locale},
    "content": content.${locale},
    "category": category,
    "services": coalesce(services, []),
    "author": author,
    "publishedAt": publishedAt,
    "readingTime": readingTime,
    "image": mainImage.asset->url
  }`

  return toArticle(await client.fetch(query, { slug }))
}

export async function getBlogPostsByCategory(
  category: ArticleCategory,
  locale: string = 'az'
): Promise<Article[]> {
  // Only fetch published documents in this category
  const query = `*[_type == "blog" && category == $category && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "excerpt": excerpt.${locale},
    "category": category,
    "services": coalesce(services, []),
    "author": author,
    "publishedAt": publishedAt,
    "readingTime": readingTime,
    "image": mainImage.asset->url
  }`

  return toArticles(await client.fetch(query, { category }))
}

export async function getPaginatedBlogPosts(
  page: number = 1,
  perPage: number = 9,
  category?: ArticleCategory,
  locale: string = 'az'
) {
  const start = (page - 1) * perPage
  const end = start + perPage

  const categoryFilter = category ? `&& category == "${category}"` : ''

  // Only fetch published documents
  const query = `{
    "posts": *[_type == "blog" ${categoryFilter} && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
      "id": _id,
      "slug": slug.current,
      "title": title.${locale},
      "excerpt": excerpt.${locale},
      "category": category,
      "services": coalesce(services, []),
      "author": author,
      "publishedAt": publishedAt,
      "readingTime": readingTime,
      "image": mainImage.asset->url
    },
    "total": count(*[_type == "blog" ${categoryFilter} && !(_id in path("drafts.**"))])
  }`

  const result = await client.fetch(query, { start, end })

  const total = result?.total ?? 0

  return {
    articles: toArticles(result?.posts),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

export async function getRecentBlogPosts(limit: number = 3, locale: string = 'az'): Promise<Article[]> {
  // Posts ticked "Əsas səhifədə göstər" first, then the newest. Only published documents.
  const query = `*[_type == "blog" && !(_id in path("drafts.**"))] | order(coalesce(featured, false) desc, publishedAt desc) [0...${limit}] {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "excerpt": excerpt.${locale},
    "category": category,
    "services": coalesce(services, []),
    "author": author,
    "publishedAt": publishedAt,
    "readingTime": readingTime,
    "image": mainImage.asset->url
  }`

  return toArticles(await client.fetch(query))
}

// ─── Portfolio Queries ───────────────────────────────────────────────────────

export async function getAllPortfolio(locale: string = 'az'): Promise<PortfolioItem[]> {
  // Only fetch published documents (exclude drafts and unpublished items)
  const query = `*[_type == "portfolio" && !(_id in path("drafts.**"))] | order(completedAt desc) [0...100] {
    "id": _id,
    "slug": slug.current,
    "title": title,
    "client": client,
    "serviceCategory": category,
    "description": description,
    "image": mainImage.asset->url,
    "websiteScreenshots": {
      "desktop": websiteScreenshots.desktop.asset->url,
      "mobile": websiteScreenshots.mobile.asset->url
    },
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results,
    "projectUrl": projectUrl,
    "videoUrl": videoUrl,
    "completedAt": completedAt,
    "featured": featured
  }`

  const result = await client.fetch(query)
  return toPortfolioItems(result)
}

export async function getPortfolioBySlug(slug: string, locale: string = 'az') {
  // Only fetch published document (exclude draft)
  const query = `*[_type == "portfolio" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    "id": _id,
    "slug": slug.current,
    "title": title,
    "client": client,
    "category": category,
    "services": coalesce(services, []),
    "serviceCategory": category,
    "description": description,
    "image": mainImage.asset->url,
    "websiteScreenshots": {
      "desktop": websiteScreenshots.desktop.asset->url,
      "mobile": websiteScreenshots.mobile.asset->url
    },
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results,
    "duration": duration,
    "projectUrl": projectUrl,
    "detailedSections": detailedSections,
    "servicesList": servicesList,
    "statistics": statistics,
    "mediaGallery": {
      "socialMediaPosts": mediaGallery.socialMediaPosts[]{
        "url": asset->url,
        "aspectRatio": aspectRatio,
        "caption": caption
      },
      "motionDesigns": mediaGallery.motionDesigns[]{
        "url": asset->url,
        "mimeType": asset->mimeType,
        "originalFilename": asset->originalFilename,
        "aspectRatio": aspectRatio,
        "caption": caption
      },
      "videoContent": mediaGallery.videoContent[]{
        "url": asset->url,
        "mimeType": asset->mimeType,
        "originalFilename": asset->originalFilename,
        "aspectRatio": aspectRatio,
        "caption": caption
      },
      "adResults": mediaGallery.adResults[]{
        "url": asset->url,
        "caption": caption
      }
    },
    "videoUrl": videoUrl,
    "completedAt": completedAt,
    "featured": featured
  }`

  return toPortfolioItem(await client.fetch(query, { slug }))
}

export async function getFeaturedPortfolio(limit?: number, locale: string = 'az'): Promise<PortfolioItem[]> {
  const limitClause = limit ? `[0...${limit}]` : ''

  // Only fetch published and featured documents
  const query = `*[_type == "portfolio" && featured == true && !(_id in path("drafts.**"))] | order(completedAt desc) ${limitClause} {
    "id": _id,
    "slug": slug.current,
    "title": title,
    "client": client,
    "serviceCategory": category,
    "description": description,
    "image": mainImage.asset->url,
    "websiteScreenshots": {
      "desktop": websiteScreenshots.desktop.asset->url,
      "mobile": websiteScreenshots.mobile.asset->url
    },
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results,
    "projectUrl": projectUrl,
    "videoUrl": videoUrl,
    "completedAt": completedAt,
    "featured": featured
  }`

  return toPortfolioItems(await client.fetch(query))
}

export async function getPortfolioByCategory(
  category: ServiceSlug,
  locale: string = 'az'
): Promise<PortfolioItem[]> {
  // Only fetch published documents in this category
  const query = `*[_type == "portfolio" && category == $category && !(_id in path("drafts.**"))] | order(completedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": title,
    "client": client,
    "serviceCategory": category,
    "description": description,
    "image": mainImage.asset->url,
    "websiteScreenshots": {
      "desktop": websiteScreenshots.desktop.asset->url,
      "mobile": websiteScreenshots.mobile.asset->url
    },
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results,
    "projectUrl": projectUrl,
    "videoUrl": videoUrl,
    "completedAt": completedAt,
    "featured": featured
  }`

  return toPortfolioItems(await client.fetch(query, { category }))
}

// ─── Partner Queries ─────────────────────────────────────────────────────────

export interface Partner {
  id: string
  name: string
  logo: string
  website?: string
  order: number
}

export async function getAllPartners(): Promise<Partner[]> {
  // Only fetch published and active partners
  const query = `*[_type == "partner" && active == true && !(_id in path("drafts.**"))] | order(order asc) {
    "id": _id,
    "name": name,
    "logo": logo.asset->url,
    "website": website,
    "order": order
  }`

  return client.fetch(query)
}

// ─── Testimonial Queries ─────────────────────────────────────────────────────

export interface LocalizedText {
  az: string
  en: string
  ru: string
  tr: string
}

export interface Testimonial {
  id: string
  name: LocalizedText
  role: LocalizedText
  company: string
  photo: string
  rating: number
  text: LocalizedText
  featured: boolean
  services?: string[]
  order: number
}

// Every locale is returned rather than one, because the carousel is a client
// component that reads name/role/text by the active locale and falls back to az.
// Resolving a single language here would leave nothing to fall back to.
//
// photo prefers an uploaded asset and otherwise takes photoPath, which points at
// a file already in public/ — that is how the original entries keep their photos
// without all of them being re-uploaded into Sanity.
const TESTIMONIAL_FIELDS = `
  "id": _id,
  "name": clientName,
  "role": clientPosition,
  "company": coalesce(company, ""),
  "photo": coalesce(avatar.asset->url, photoPath, ""),
  "rating": coalesce(rating, 5),
  "text": testimonial,
  "featured": coalesce(featured, false),
  "order": coalesce(order, 0),
  "services": coalesce(services, [])
`

export async function getAllTestimonials(): Promise<Testimonial[]> {
  // Only fetch published testimonials
  return client.fetch(`*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(order asc) {${TESTIMONIAL_FIELDS}}`)
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  // Only fetch published and featured testimonials
  return client.fetch(
    `*[_type == "testimonial" && featured == true && !(_id in path("drafts.**"))] | order(order asc) {${TESTIMONIAL_FIELDS}}`
  )
}
