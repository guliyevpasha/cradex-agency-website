import { client } from './client'
import { toArticle, toArticles, toPortfolioItem, toPortfolioItems } from './normalize'
import type { Article, ArticleCategory, PortfolioItem, ServiceSlug } from '@/types'

// ─── Blog Queries ────────────────────────────────────────────────────────────

export async function getAllBlogPosts(locale: string = 'az'): Promise<Article[]> {
  const query = `*[_type == "blog"] | order(publishedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "excerpt": excerpt.${locale},
    "category": category,
    "author": author,
    "publishedAt": publishedAt,
    "readingTime": readingTime,
    "image": mainImage.asset->url
  }`
  
  return toArticles(await client.fetch(query))
}

export async function getBlogPostBySlug(slug: string, locale: string = 'az') {
  const query = `*[_type == "blog" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "excerpt": excerpt.${locale},
    "content": content.${locale},
    "category": category,
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
  const query = `*[_type == "blog" && category == $category] | order(publishedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "excerpt": excerpt.${locale},
    "category": category,
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
  
  const query = `{
    "posts": *[_type == "blog" ${categoryFilter}] | order(publishedAt desc) [$start...$end] {
      "id": _id,
      "slug": slug.current,
      "title": title.${locale},
      "excerpt": excerpt.${locale},
      "category": category,
      "author": author,
      "publishedAt": publishedAt,
      "readingTime": readingTime,
      "image": mainImage.asset->url
    },
    "total": count(*[_type == "blog" ${categoryFilter}])
  }`
  
  const result = await client.fetch(query, { start, end })
  
  const total = result?.total ?? 0

  return {
    articles: toArticles(result?.posts),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

// ─── Portfolio Queries ───────────────────────────────────────────────────────

export async function getAllPortfolio(locale: string = 'az'): Promise<PortfolioItem[]> {
  const query = `*[_type == "portfolio"] | order(completedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "client": client,
    "serviceCategory": category,
    "description": description.${locale},
    "image": mainImage.asset->url,
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results.${locale},
    "projectUrl": projectUrl,
    "completedAt": completedAt,
    "featured": featured
  }`
  
  return toPortfolioItems(await client.fetch(query))
}

export async function getPortfolioBySlug(slug: string, locale: string = 'az') {
  const query = `*[_type == "portfolio" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "client": client,
    "serviceCategory": category,
    "description": description.${locale},
    "image": mainImage.asset->url,
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results.${locale},
    "projectUrl": projectUrl,
    "completedAt": completedAt,
    "featured": featured
  }`
  
  return toPortfolioItem(await client.fetch(query, { slug }))
}

export async function getFeaturedPortfolio(limit?: number, locale: string = 'az'): Promise<PortfolioItem[]> {
  const limitClause = limit ? `[0...${limit}]` : ''
  
  const query = `*[_type == "portfolio" && featured == true] | order(completedAt desc) ${limitClause} {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "client": client,
    "serviceCategory": category,
    "description": description.${locale},
    "image": mainImage.asset->url,
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results.${locale},
    "projectUrl": projectUrl,
    "completedAt": completedAt,
    "featured": featured
  }`
  
  return toPortfolioItems(await client.fetch(query))
}

export async function getPortfolioByCategory(
  category: ServiceSlug,
  locale: string = 'az'
): Promise<PortfolioItem[]> {
  const query = `*[_type == "portfolio" && category == $category] | order(completedAt desc) {
    "id": _id,
    "slug": slug.current,
    "title": title.${locale},
    "client": client,
    "serviceCategory": category,
    "description": description.${locale},
    "image": mainImage.asset->url,
    "gallery": gallery[].asset->url,
    "tools": tools,
    "results": results.${locale},
    "projectUrl": projectUrl,
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
  const query = `*[_type == "partner" && active == true] | order(order asc) {
    "id": _id,
    "name": name,
    "logo": logo.asset->url,
    "website": website,
    "order": order
  }`
  
  return client.fetch(query)
}

// ─── Testimonial Queries ─────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  photo: string
  rating: number
  text: string
  featured: boolean
  order: number
}

export async function getAllTestimonials(locale: string = 'az'): Promise<Testimonial[]> {
  const query = `*[_type == "testimonial"] | order(order asc) {
    "id": _id,
    "name": clientName,
    "role": clientPosition.${locale},
    "company": company,
    "photo": avatar.asset->url,
    "rating": rating,
    "text": testimonial.${locale},
    "featured": featured,
    "order": order
  }`
  
  return client.fetch(query)
}

export async function getFeaturedTestimonials(locale: string = 'az'): Promise<Testimonial[]> {
  const query = `*[_type == "testimonial" && featured == true] | order(order asc) {
    "id": _id,
    "name": clientName,
    "role": clientPosition.${locale},
    "company": company,
    "photo": avatar.asset->url,
    "rating": rating,
    "text": testimonial.${locale},
    "featured": featured,
    "order": order
  }`
  
  return client.fetch(query)
}
