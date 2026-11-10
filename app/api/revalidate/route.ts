/**
 * Sanity webhook → on-demand ISR.
 * @author Paşa Quliyev — Cradex Agency
 */
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { PRICING_LINKS, PRODUCT_LINKS, SERVICE_SLUGS } from '@/lib/site/navigation'
import { WORK_SLUGS } from '@/lib/site/work'

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

    if (!_type || typeof _type !== 'string') {
      return NextResponse.json({ error: 'Missing required field: _type' }, { status: 400 })
    }

    // Slugs end up in revalidated paths, so anything unusual is dropped.
    const slug = typeof rawSlug === 'string' && SLUG_RE.test(rawSlug) ? rawSlug : null
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
      if (slug) LOCALES.forEach((l) => add(`/${l}/journal/${slug}`))
      LOCALES.forEach((l) => add(`/${l}`))
      servicePages()
    } else if (_type === 'comboPackage') {
      // cards on the home page, the products page and the combo page
      LOCALES.forEach((l) => [`/${l}`, `/${l}/products`, ...PRODUCT_LINKS.map((p) => `/${l}/products/${p.slug}`)].forEach(add))
    } else if (_type === 'workCase') {
      LOCALES.forEach((l) => Object.values(WORK_SLUGS).forEach((w) => add(`/${l}/portfolio/${w}`)))
    } else if (_type === 'portfolio' || _type === 'portfolioItem') {
      LOCALES.forEach((l) => add(`/${l}/portfolio`))
      if (slug) LOCALES.forEach((l) => add(`/${l}/portfolio/${slug}`))
      LOCALES.forEach((l) => add(`/${l}`))
    } else if (_type === 'testimonial' || _type === 'partner') {
      LOCALES.forEach((l) => add(`/${l}`))
      if (_type === 'testimonial') servicePages()
      else LOCALES.forEach((l) => add(`/${l}/clients`))
    }

    console.log(`[revalidate] ${_type}${slug ? `/${slug}` : ''}: ${paths.length} paths`)

    return NextResponse.json({
      success: true,
      revalidated: true,
      _type,
      slug,
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
