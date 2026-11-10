/**
 * Sanity webhook → on-demand ISR.
 * Automatically revalidates pages when content is published/updated in Sanity.
 * @author Paşa Quliyev — Cradex Agency
 */
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { PRICING_LINKS, PRODUCT_LINKS, SERVICE_SLUGS } from '@/lib/site/navigation'
import { WORK_SLUGS } from '@/lib/site/work'

// Optimize runtime for webhook - no cache needed
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds max (Sanity webhooks timeout at 30s)

const LOCALES = ['az', 'en', 'ru', 'tr']
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,120}$/i

function tokenMatches(header: string | null, expected: string | undefined): boolean {
  if (!header || !expected) return false
  const a = Buffer.from(header)
  const b = Buffer.from(`Bearer ${expected}`)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  if (!tokenMatches(request.headers.get('authorization'), process.env.REVALIDATION_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const _type: unknown = body?._type
    const rawSlug: unknown = body?.slug
    const previousSlug: unknown = body?.previousSlug

    if (!_type || typeof _type !== 'string') {
      return NextResponse.json({ error: 'Missing required field: _type' }, { status: 400 })
    }

    // Slugs end up in revalidated paths, so anything unusual is dropped.
    const slug = typeof rawSlug === 'string' && SLUG_RE.test(rawSlug) ? rawSlug : null
    const oldSlug = typeof previousSlug === 'string' && SLUG_RE.test(previousSlug) ? previousSlug : null
    const paths: string[] = []
    const add = (p: string) => {
      revalidatePath(p)
      paths.push(p)
    }

    // Reviews and posts also appear on every service, pricing and product page.
    const servicePages = () =>
      LOCALES.forEach((l) =>
        [...Object.values(SERVICE_SLUGS).map((s) => `/services/${s}`), '/pricing', ...PRICING_LINKS.filter((p) => p.path).map((p) => `/pricing${p.path}`), ...PRODUCT_LINKS.map((p) => `/products/${p.slug}`)].forEach((p) =>
          add(`/${l}${p}`)
        )
      )

    if (_type === 'blog' || _type === 'article') {
      LOCALES.forEach((l) => add(`/${l}/journal`))
      // Revalidate current slug
      if (slug) LOCALES.forEach((l) => add(`/${l}/journal/${slug}`))
      // CRITICAL: Revalidate previous slug if it changed (fixes 404 after slug rename)
      if (oldSlug && oldSlug !== slug) LOCALES.forEach((l) => add(`/${l}/journal/${oldSlug}`))
      LOCALES.forEach((l) => add(`/${l}`))
      servicePages()
    } else if (_type === 'comboPackage') {
      // cards on the home page, the products page and the combo page
      LOCALES.forEach((l) => [`/${l}`, `/${l}/products`, ...PRODUCT_LINKS.map((p) => `/${l}/products/${p.slug}`)].forEach(add))
    } else if (_type === 'workCase') {
      LOCALES.forEach((l) => Object.values(WORK_SLUGS).forEach((w) => add(`/${l}/portfolio/${w}`)))
    } else if (_type === 'portfolio' || _type === 'portfolioItem') {
      // Portfolio index page (shows all published portfolios)
      LOCALES.forEach((l) => add(`/${l}/portfolio`))
      
      // Current portfolio detail page
      if (slug) {
        LOCALES.forEach((l) => add(`/${l}/portfolio/${slug}`))
      }
      
      // CRITICAL: Previous slug (if renamed) to clear 404 cache
      if (oldSlug && oldSlug !== slug) {
        LOCALES.forEach((l) => add(`/${l}/portfolio/${oldSlug}`))
      }
      
      // Home page (shows featured portfolios)
      LOCALES.forEach((l) => add(`/${l}`))
      
      // Service pages (may show related portfolios)
      LOCALES.forEach((l) =>
        Object.values(SERVICE_SLUGS).forEach((s) => add(`/${l}/services/${s}`))
      )
      
      console.log(`[revalidate] Portfolio updated - will refresh in ~60 seconds`)
    } else if (_type === 'testimonial' || _type === 'partner') {
      LOCALES.forEach((l) => add(`/${l}`))
      if (_type === 'testimonial') servicePages()
      else LOCALES.forEach((l) => add(`/${l}/clients`))
    }

    console.log(`[revalidate] ${_type}${slug ? `/${slug}` : ''}${oldSlug && oldSlug !== slug ? ` (prev: ${oldSlug})` : ''}: ${paths.length} paths`)

    return NextResponse.json({
      success: true,
      revalidated: true,
      _type,
      slug,
      previousSlug: oldSlug || undefined,
      paths,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('[revalidate] failed:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Revalidation failed', timestamp: Date.now() },
      { status: 500 }
    )
  }
}
