// Sanity client — only initialised when NEXT_PUBLIC_SANITY_PROJECT_ID is set.
// Without it the app falls back to static JSON data.

import type { SanityClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

// Lazy getter — avoids calling createClient with an empty projectId
let _client: SanityClient | null = null

export function getSanityClient(): SanityClient | null {
  if (!projectId) return null
  if (_client) return _client
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('next-sanity') as typeof import('next-sanity')
  _client = createClient({ projectId, dataset, apiVersion, useCdn: process.env.NODE_ENV === 'production' })
  return _client
}

// Keep named export for backwards compat
export const sanityClient = null // always null at module load; use getSanityClient()

export function urlFor(source: unknown) {
  const client = getSanityClient()
  if (!client) return { url: () => '' }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const imageUrlBuilder = require('@sanity/image-url') as typeof import('@sanity/image-url')
  const builder = typeof imageUrlBuilder === 'function' ? imageUrlBuilder : (imageUrlBuilder as { default: typeof imageUrlBuilder }).default
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder(client).image(source as any)
}

// ─── GROQ Queries ─────────────────────────────────────────────────────────────

export const ALL_ARTICLES_QUERY = `
  *[_type == "article"] | order(publishedAt desc) {
    _id, "id": _id, "slug": slug.current, title, excerpt, body, category,
    author { name, role, "avatarUrl": avatar.asset->url },
    "coverImage": coverImage.asset->url, publishedAt, tags, locale,
    metaTitle, metaDescription,
    "readingTimeMinutes": round(length(pt::text(body)) / 5 / 200)
  }
`
export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug][0] {
    _id, "id": _id, "slug": slug.current, title, excerpt, body, category,
    author { name, role, "avatarUrl": avatar.asset->url },
    "coverImage": coverImage.asset->url, publishedAt, tags, locale,
    metaTitle, metaDescription,
    "readingTimeMinutes": round(length(pt::text(body)) / 5 / 200)
  }
`
export const ARTICLE_SLUGS_QUERY = `*[_type == "article"] { "slug": slug.current }`

export const ALL_PORTFOLIO_QUERY = `
  *[_type == "portfolioItem"] | order(publishedAt desc) {
    _id, "id": _id, "slug": slug.current, title, clientName, serviceCategory,
    tags, "coverImage": coverImage.asset->url, "gallery": gallery[].asset->url,
    videoUrl, description, tools, results, featured, publishedAt, locale
  }
`
export const PORTFOLIO_BY_SLUG_QUERY = `
  *[_type == "portfolioItem" && slug.current == $slug][0] {
    _id, "id": _id, "slug": slug.current, title, clientName, serviceCategory,
    tags, "coverImage": coverImage.asset->url, "gallery": gallery[].asset->url,
    videoUrl, description, tools, results, featured, publishedAt, locale
  }
`
export const FEATURED_PORTFOLIO_QUERY = `
  *[_type == "portfolioItem" && featured == true] | order(publishedAt desc) [0...$limit] {
    _id, "id": _id, "slug": slug.current, title, clientName, serviceCategory,
    "coverImage": coverImage.asset->url, featured
  }
`
export const PORTFOLIO_SLUGS_QUERY = `*[_type == "portfolioItem"] { "slug": slug.current }`
