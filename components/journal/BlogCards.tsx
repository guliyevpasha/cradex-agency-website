/**
 * Blog list pieces: the featured (latest) post on a dark panel and the
 * coloured 3D post cards. Card colours rotate through the brand palette.
 * Styles: ".bl-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Tag } from 'lucide-react'
import { Tilt } from '@/components/ui/Tilt'
import { cn } from '@/lib/utils/cn'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  image?: string
  date?: string
  category: string
  minutes?: number
}

type Labels = { read: string; category: (c: string) => string; date: (d: string) => string; minutes: (n: number) => string }

// sky = light blue, ink = black, blue = brand blue. White text only on the dark two.
const TONES = ['bl-sky', 'bl-ink', 'bl-blue'] as const

export function FeaturedPost({ post, href, labels, eyebrow }: { post: BlogPost; href: string; labels: Labels; eyebrow: string }) {
  return (
    <Link href={href} className="group block">
      <Tilt max={4}>
        <article className="relative grid items-center gap-10 rounded-[40px] bg-ink p-8 text-snow shadow-float sm:p-12 lg:grid-cols-[1fr_1.15fr] lg:p-14">
          <span className="tilt-glare" />
          <div className="tilt-z1">
            <p className="flex flex-wrap items-center gap-3 text-sm text-snow/60">
              <span className="rounded-full bg-brand-strong px-3 py-1 font-semibold text-snow">{eyebrow}</span>
              {post.date && <time dateTime={post.date}>{labels.date(post.date)}</time>}
            </p>
            <h2 className="mt-6 text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-[2.6rem]">
              <span className="bl-underline">{post.title}</span>
            </h2>
            {post.excerpt && <p className="mt-6 line-clamp-3 text-lg leading-relaxed text-snow/75">{post.excerpt}</p>}
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-brand">
              {labels.read}
              <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
          <div className="tilt-z2 relative aspect-[16/10] overflow-hidden rounded-[28px] bg-snow/5">
            {post.image ? (
              <Image
                quality={85}
                src={post.image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <span className="absolute inset-0 bg-gradient-to-br from-brand-strong to-ink" />
            )}
          </div>
        </article>
      </Tilt>
    </Link>
  )
}

export function PostCard({ post, href, labels, index }: { post: BlogPost; href: string; labels: Labels; index: number }) {
  const tone = TONES[index % TONES.length]
  return (
    <Link href={href} className="group block h-full">
      <Tilt max={7} className="h-full" innerClassName="h-full">
        <article className={cn('bl-card relative flex h-full flex-col rounded-[28px] p-6 shadow-card sm:p-7', tone)}>
          <span className="tilt-glare" />
          <p className="bl-meta tilt-z1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px]">
            <span className="inline-flex items-center gap-1.5">
              <Tag size={13} aria-hidden="true" />
              {labels.category(post.category)}
            </span>
            {post.date && (
              <time dateTime={post.date} className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} aria-hidden="true" />
                {labels.date(post.date)}
              </time>
            )}
          </p>
          <h3 className="tilt-z1 mt-4 line-clamp-3 text-xl font-bold leading-snug tracking-tight sm:text-[1.4rem]">{post.title}</h3>
          <span className="tilt-z1 mt-6 flex items-center gap-4 text-[15px] font-semibold">
            <span className="bl-line h-px flex-1" aria-hidden="true" />
            {labels.read}
            <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
          <div className="tilt-z2 relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-snow/40">
            {post.image ? (
              <Image
                quality={85}
                src={post.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
            ) : (
              <span className="absolute inset-0 bg-gradient-to-br from-brand/40 to-brand-strong/40" />
            )}
          </div>
          {post.minutes ? <p className="bl-meta tilt-z1 mt-4 text-[13px]">{labels.minutes(post.minutes)}</p> : null}
        </article>
      </Tilt>
    </Link>
  )
}
