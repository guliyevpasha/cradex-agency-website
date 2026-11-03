/**
 * Latest articles: one featured card and two compact ones, each tilting in
 * 3D with the cover, tag and text at different depths.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowUpRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Tilt } from '@/components/ui/Tilt'
import { Reveal } from '@/components/ui/Reveal'
import type { Article } from '@/types'

type Post = {
  slug: string
  title: string
  excerpt: string
  image?: string
  category?: string
  date?: string
  minutes?: number
}

// Sanity articles arrive already localised (title/excerpt/image); the bundled
// JSON uses the *Key fields. Accept both.
function toPost(a: Article): Post {
  const x = a as Article & { title?: string; excerpt?: string; image?: string }
  return {
    slug: a.slug,
    title: x.title || a.titleKey || '',
    excerpt: x.excerpt || a.excerptKey || '',
    image: x.image || a.coverImage || undefined,
    category: a.category ? String(a.category) : undefined,
    date: a.publishedAt,
    minutes: a.readingTimeMinutes,
  }
}

function PostCard({ post, locale, featured, vertical, readLabel, minutesLabel }: {
  post: Post
  locale: string
  featured?: boolean
  /** Compact card laid out top-to-bottom (used when it stands alone). */
  vertical?: boolean
  readLabel: string
  minutesLabel?: string
}) {
  const date = post.date
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.date))
    : null

  return (
    <Link href={`/${locale}/journal/${post.slug}`} className="group block h-full">
      <Tilt max={featured ? 5 : 7} className="h-full" innerClassName="h-full">
        <article
          className={cn(
            'relative flex h-full overflow-hidden rounded-[28px] border border-line bg-bg-primary shadow-card transition-shadow duration-500 group-hover:shadow-float',
            featured || vertical ? 'flex-col' : 'flex-col sm:flex-row'
          )}
        >
          <div className={cn('relative shrink-0 overflow-hidden', featured || vertical ? 'aspect-[16/10] w-full' : 'aspect-[16/10] w-full sm:aspect-auto sm:w-[42%]')}>
            {post.image ? (
              <Image
                src={post.image}
                alt=""
                fill
                sizes={featured ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 20vw, 100vw'}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            ) : (
              <span className="absolute inset-0 bg-gradient-to-br from-brand/30 via-brand-strong/30 to-[#FF8A65]/30" />
            )}
            {post.category && (
              <span className="tilt-z3 absolute left-4 top-4 rounded-full bg-snow/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink shadow-sm">
                {post.category}
              </span>
            )}
          </div>

          <div className={cn('tilt-z1 flex flex-1 flex-col', featured ? 'p-7 sm:p-9' : 'p-6')}>
            <div className="flex items-center gap-3 text-[13px] text-text-muted">
              {date && <time dateTime={post.date}>{date}</time>}
              {minutesLabel && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} aria-hidden="true" />
                  {minutesLabel}
                </span>
              )}
            </div>
            <h3
              className={cn(
                'mt-3 font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent-ink',
                featured ? 'line-clamp-3 text-2xl sm:text-3xl' : 'line-clamp-3 text-lg'
              )}
            >
              {post.title}
            </h3>
            {featured && post.excerpt && <p className="mt-3 line-clamp-3 leading-relaxed text-text-secondary">{post.excerpt}</p>}
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-text-primary">
              {readLabel}
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
          <span className="tilt-glare" />
        </article>
      </Tilt>
    </Link>
  )
}

export async function BlogShowcase({ articles }: { articles: Article[] }) {
  const locale = await getLocale()
  const t = await getTranslations('site.blog')
  const posts = articles.slice(0, 3).map(toPost).filter((p) => p.slug && p.title)
  if (posts.length === 0) return null

  const [first, ...rest] = posts
  const label = (p: Post) => (p.minutes ? t('minutes', { minutes: p.minutes }) : undefined)

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
            <h2 className="mt-3 text-display-lg font-extrabold tracking-[-0.035em] text-text-primary">{t('title')}</h2>
            <p className="mt-4 max-w-xl text-lg text-text-secondary">{t('subtitle')}</p>
          </Reveal>
          <Link
            href={`/${locale}/journal`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-text-primary px-6 py-3 text-[15px] font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
          >
            {t('all')}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Reveal className="rv-3d h-full">
            <PostCard post={first} locale={locale} featured readLabel={t('read')} minutesLabel={label(first)} />
          </Reveal>
          {rest.length > 0 && (
            <div className="grid gap-6">
              {rest.map((p, i) => (
                <Reveal key={p.slug} className="rv-3d" delay={(i + 1) * 140}>
                  <PostCard post={p} locale={locale} vertical={rest.length === 1} readLabel={t('read')} minutesLabel={label(p)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
