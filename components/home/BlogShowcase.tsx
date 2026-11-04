/**
 * Latest articles: big title, three cover cards with a date pill, title
 * underneath. Covers tilt in 3D on hover.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowUpRight } from 'lucide-react'
import { Tilt } from '@/components/ui/Tilt'
import { Reveal } from '@/components/ui/Reveal'
import type { Article } from '@/types'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'

type Post = { slug: string; title: string; image?: string; date?: string }

// Sanity articles arrive already localised (title/image); the bundled JSON
// uses the *Key fields. Accept both.
function toPost(a: Article): Post {
  const x = a as Article & { title?: string; image?: string }
  return {
    slug: a.slug,
    title: x.title || a.titleKey || '',
    image: x.image || a.coverImage || undefined,
    date: a.publishedAt,
  }
}

export async function BlogShowcase({ articles }: { articles: Article[] }) {
  const locale = await getLocale()
  const t = await getTranslations('site.blog')
  const posts = articles.slice(0, 3).map(toPost).filter((p) => p.slug && p.title)
  if (posts.length === 0) return null

  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <AnimatedHeading
              className="text-[2.75rem] font-extrabold leading-none tracking-[-0.045em] text-text-primary sm:text-6xl xl:text-[4.4rem]"
              text={t('title')}
            />
          </Reveal>
          <Link
            href={`/${locale}/journal`}
            className="inline-flex items-center gap-3 rounded-full border-2 border-text-primary px-7 py-3.5 text-[17px] font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
          >
            {t('all')}
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Reveal className="rv-3d" delay={i * 140}>
                <Link href={`/${locale}/journal/${post.slug}`} className="group block">
                  <Tilt max={8}>
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-bg-secondary shadow-card transition-shadow duration-500 group-hover:shadow-float">
                      {post.image ? (
                        <Image
                          quality={92}
                          src={post.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                      ) : (
                        <span className="absolute inset-0 bg-gradient-to-br from-brand/30 via-brand-strong/30 to-[#FF8A65]/30" />
                      )}
                      <span className="tilt-glare" />
                    </div>
                    {post.date && (
                      <time
                        dateTime={post.date}
                        className="tilt-z3 absolute bottom-5 left-5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-snow shadow-card"
                      >
                        {fmt.format(new Date(post.date))}
                      </time>
                    )}
                  </Tilt>
                  <h3 className="mt-6 px-2 text-xl font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-ink sm:text-2xl">
                    {post.title}
                  </h3>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
