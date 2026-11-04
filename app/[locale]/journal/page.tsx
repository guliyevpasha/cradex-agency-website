/**
 * Blog: big heading with topic chips, the latest post on a dark panel, then
 * coloured 3D cards and numbered pages. Rendered on the server so every page
 * and category has its own crawlable URL (?category=seo&page=2).
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getAllArticles } from '@/lib/data/journal'
import { FeaturedPost, PostCard, type BlogPost } from '@/components/journal/BlogCards'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils/cn'
import type { Article } from '@/types'

// Hourly is enough: publishing in Sanity also refreshes pages via /api/revalidate.
export const revalidate = 3600

const PER_PAGE = 9

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.blogPage' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

// Sanity articles arrive localised in the *Key fields; accept both shapes.
function toPost(a: Article): BlogPost {
  const x = a as Article & { title?: string; excerpt?: string; image?: string }
  return {
    slug: a.slug,
    title: x.title || a.titleKey || '',
    excerpt: x.excerpt || a.excerptKey || '',
    image: x.image || a.coverImage || undefined,
    date: a.publishedAt || undefined,
    category: a.category,
    minutes: a.readingTimeMinutes,
  }
}

export default async function JournalPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'site.blogPage' })
  const tNav = await getTranslations({ locale, namespace: 'site.nav' })

  const all = (await getAllArticles(locale))
    .map(toPost)
    .filter((p) => p.slug && p.title)
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())

  // Only offer topics that actually have posts; ignore anything else in the URL.
  const categories = [...new Set(all.map((p) => p.category).filter(Boolean))]
  const category = sp.category && categories.includes(sp.category) ? sp.category : undefined
  const posts = category ? all.filter((p) => p.category === category) : all

  // Page 1 shows the newest post as the featured panel, the grid continues after it.
  const featured = posts[0]
  const rest = posts.slice(1)
  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE))
  const page = Math.min(Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1), totalPages)
  const grid = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  const labels = {
    read: t('read'),
    category: (c: string) => (t.has(`categories.${c}`) ? t(`categories.${c}`) : c),
    date: (d: string) => fmt.format(new Date(d)),
    minutes: (n: number) => t('minutes', { count: n }),
  }

  const base = `/${locale}/journal`
  const href = (p: number, c = category) => {
    const q = new URLSearchParams()
    if (c) q.set('category', c)
    if (p > 1) q.set('page', String(p))
    const s = q.toString()
    return s ? `${base}?${s}` : base
  }
  const postHref = (slug: string) => `${base}/${slug}`

  return (
    <div className="pt-24 lg:pt-28">
      {/* Heading */}
      <section className="mx-auto w-full max-w-[1680px] px-4 pb-10 pt-8 sm:px-6 lg:px-12">
        <h1 className="text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-text-primary sm:text-6xl xl:text-[5.4rem]">
          <span className="bl-pill" aria-hidden="true">
            <i />
          </span>
          {t('title')}
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed text-text-secondary">{t('text')}</p>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <ul className="flex flex-wrap gap-2.5">
            {[undefined, ...categories].map((c) => (
              <li key={c ?? 'all'}>
                <Link
                  href={href(1, c)}
                  aria-current={c === category ? 'page' : undefined}
                  className={cn(
                    'inline-flex rounded-full border-2 px-4 py-2 text-[15px] font-semibold transition-colors',
                    c === category
                      ? 'border-brand-strong bg-brand-strong text-snow'
                      : 'border-text-primary/80 text-text-primary hover:border-brand-strong hover:text-accent-ink'
                  )}
                >
                  {c ? labels.category(c) : t('all')}
                </Link>
              </li>
            ))}
          </ul>
          <nav aria-label="breadcrumb" className="text-[15px] text-text-muted">
            <Link href={`/${locale}`} className="font-semibold text-text-primary hover:text-accent-ink">{tNav('home')}</Link>
            <span className="mx-2">/</span>
            <span>{tNav('blog')}</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 pb-24 sm:px-6 lg:px-12">
        {!featured ? (
          <p className="py-20 text-center text-lg text-text-secondary">{t('empty')}</p>
        ) : (
          <>
            {page === 1 && (
              <Reveal className="rv-3d">
                <FeaturedPost post={featured} href={postHref(featured.slug)} labels={labels} eyebrow={t('latest')} />
              </Reveal>
            )}

            {grid.length > 0 && (
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {grid.map((post, i) => (
                  <li key={post.slug}>
                    <Reveal className="rv-3d h-full" delay={(i % 3) * 110}>
                      <PostCard post={post} href={postHref(post.slug)} labels={labels} index={i} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav aria-label={t('page', { page })} className="mt-16 flex items-center justify-between gap-4">
                {page > 1 ? (
                  <Link href={href(page - 1)} className="inline-flex items-center gap-2 text-lg font-semibold text-text-primary hover:text-accent-ink">
                    <ArrowLeft size={20} aria-hidden="true" /> {t('prev')}
                  </Link>
                ) : (
                  <span />
                )}
                <ol className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p}>
                      <Link
                        href={href(p)}
                        aria-current={p === page ? 'page' : undefined}
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold transition-colors',
                          p === page ? 'bg-brand-strong text-snow shadow-card' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                        )}
                      >
                        {p}
                      </Link>
                    </li>
                  ))}
                </ol>
                {page < totalPages ? (
                  <Link href={href(page + 1)} className="inline-flex items-center gap-2 text-lg font-semibold text-text-primary hover:text-accent-ink">
                    {t('next')} <ArrowRight size={20} aria-hidden="true" />
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  )
}
