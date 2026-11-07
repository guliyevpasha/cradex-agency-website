'use client'
/**
 * Client reviews: rating summary on the left, a 3D deck of review cards on
 * the right. The deck advances on its own and pauses on hover or focus.
 * All cards share one grid cell, so the deck is as tall as its longest
 * review and no text is ever cut off. On service pages `badge` names the
 * service the reviewers used.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight, BadgeCheck, Quote, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Tilt } from '@/components/ui/Tilt'
import { Reveal } from '@/components/ui/Reveal'
import type { Testimonial } from '@/lib/data/testimonials'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'

type Locale = 'az' | 'en' | 'ru' | 'tr'
type Review = { id: string; name: string; role: string; company: string; photo: string; rating: number; text: string }

// The photo field doubles as an emoji fallback in older entries.
const isImage = (s: string) => /^(\/|https?:\/\/)/.test(s)

const AUTO_MS = 6500

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.round(value) ? 'fill-[#F5B301] text-[#F5B301]' : 'text-line'} />
      ))}
    </span>
  )
}

function Avatar({ t, size }: { t: Review; size: number }) {
  const initials = t.name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-strong text-sm font-bold text-snow ring-2 ring-bg-primary"
      style={{ width: size, height: size }}
    >
      {isImage(t.photo) ? <Image quality={85} src={t.photo} alt="" fill sizes={`${size}px`} className="object-cover" /> : initials}
    </span>
  )
}

export function ReviewsSection({ testimonials: raw, badge }: { testimonials: Testimonial[]; badge?: string }) {
  const t = useTranslations('site.reviews')
  const locale = useLocale() as Locale
  const testimonials: Review[] = raw.map((r) => ({
    id: r.id,
    name: r.name?.[locale] || r.name?.az || '',
    role: r.role?.[locale] || r.role?.az || '',
    company: r.company ?? '',
    photo: r.photo ?? '',
    rating: r.rating || 5,
    text: r.text?.[locale] || r.text?.az || '',
  }))
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = testimonials.length

  const go = useCallback((dir: number) => setActive((i) => (i + dir + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => go(1), AUTO_MS)
    return () => clearInterval(id)
  }, [paused, count, go])

  if (count === 0) return null

  const avg = testimonials.reduce((s, r) => s + (r.rating || 5), 0) / count

  return (
    <section className="py-14 sm:py-20 lg:py-28">
      <div className="container-x">
        <div className="relative overflow-clip rounded-[28px] border border-line bg-bg-secondary px-4 py-9 sm:rounded-[40px] sm:px-12 sm:py-14 lg:px-16 lg:py-20">
          <span aria-hidden="true" className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
          <span aria-hidden="true" className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#F5B301]/10 blur-3xl" />

          <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 sm:gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <Reveal>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
              {badge && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-primary px-3 py-1.5 text-[13px] font-semibold text-text-primary">
                  <BadgeCheck size={15} className="text-accent-ink" aria-hidden="true" />
                  {badge}
                </p>
              )}
              <AnimatedHeading className="mt-3 text-display-lg font-extrabold tracking-[-0.035em] text-text-primary" text={t('title')} />

              <div className="mt-6 flex items-end gap-4 sm:mt-10 sm:gap-5">
                <span className="text-5xl font-extrabold sm:text-7xl leading-none tracking-tight text-text-primary">{avg.toFixed(1)}</span>
                <span className="pb-1.5">
                  <Stars value={avg} size={20} />
                  <span className="mt-2 block text-sm text-text-secondary">{t('rating', { count })}</span>
                </span>
              </div>

              <div className="mt-5 flex -space-x-3 sm:mt-8">
                {testimonials.slice(0, 6).map((r) => (
                  <Avatar key={r.id} t={r} size={48} />
                ))}
                {count > 6 && (
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-text-primary text-sm font-bold text-bg-primary ring-2 ring-bg-primary">
                    +{count - 6}
                  </span>
                )}
              </div>
            </Reveal>

            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
            >
              {/* one shared grid cell: the tallest card sets the height */}
              <div className="relative grid grid-cols-[minmax(0,1fr)] [--dx:10px] [--dy:-12px] [perspective:1600px] sm:[--dx:26px] sm:[--dy:-22px]">
                {testimonials.map((r, i) => {
                  const pos = (i - active + count) % count
                  const visible = pos < 3
                  return (
                    <div
                      key={r.id}
                      aria-hidden={pos !== 0}
                      className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [grid-area:1/1]"
                      style={{
                        transform: `translate3d(calc(var(--dx) * ${pos}), calc(var(--dy) * ${pos}), ${pos * -90}px) rotateY(${pos * -5}deg)`,
                        opacity: visible ? 1 - pos * 0.28 : 0,
                        zIndex: count - pos,
                        pointerEvents: pos === 0 ? 'auto' : 'none',
                      }}
                    >
                      <Tilt max={5} className="h-full" innerClassName="h-full">
                        <figure className="flex h-full flex-col rounded-[22px] border border-line bg-bg-primary p-5 shadow-float sm:rounded-[28px] sm:p-9">
                          <span className="tilt-glare" />
                          <div className="tilt-z2 flex items-center justify-between">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-strong text-snow sm:h-12 sm:w-12 sm:rounded-2xl">
                              <Quote size={20} aria-hidden="true" />
                            </span>
                            <Stars value={r.rating || 5} />
                          </div>
                          <blockquote className={cn('tilt-z1 mt-4 flex-1 leading-relaxed text-text-primary sm:mt-6', r.text.length > 320 ? 'text-[15px] sm:text-lg' : 'text-base sm:text-xl')}>
                            {r.text}
                          </blockquote>
                          <figcaption className="tilt-z2 mt-4 flex items-center gap-3 border-t border-line pt-4 sm:mt-6 sm:gap-4 sm:pt-6">
                            <Avatar t={r} size={44} />
                            <span className="min-w-0">
                              <span className="block truncate font-bold text-text-primary">{r.name}</span>
                              <span className="block truncate text-sm text-text-secondary">
                                {[r.role, r.company].filter(Boolean).join(' · ')}
                              </span>
                              {badge && <span className="mt-1 block truncate text-xs font-semibold text-accent-ink">{badge}</span>}
                            </span>
                          </figcaption>
                        </figure>
                      </Tilt>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
                <span className="text-sm font-semibold tabular-nums text-text-secondary">
                  <span className="text-text-primary">{String(active + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  {[
                    { dir: -1, label: t('prev'), Icon: ArrowLeft },
                    { dir: 1, label: t('next'), Icon: ArrowRight },
                  ].map(({ dir, label, Icon }) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => go(dir)}
                      aria-label={label}
                      className={cn(
                        'inline-flex h-11 w-11 items-center justify-center rounded-full border sm:h-12 sm:w-12 border-line text-text-primary transition-colors',
                        dir === 1 ? 'bg-text-primary text-bg-primary hover:opacity-85' : 'bg-bg-primary hover:border-accent-primary/50'
                      )}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
