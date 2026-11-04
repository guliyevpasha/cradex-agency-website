'use client'
/**
 * Client reviews: rating summary on the left, a 3D deck of review cards on
 * the right. The deck advances on its own and pauses on hover or focus.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'
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
      {isImage(t.photo) ? <Image quality={92} src={t.photo} alt="" fill sizes={`${size}px`} className="object-cover" /> : initials}
    </span>
  )
}

export function ReviewsSection({ testimonials: raw }: { testimonials: Testimonial[] }) {
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
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[40px] border border-line bg-bg-secondary px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <span aria-hidden="true" className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
          <span aria-hidden="true" className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#F5B301]/10 blur-3xl" />

          <div className="relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
              <AnimatedHeading className="mt-3 text-display-lg font-extrabold tracking-[-0.035em] text-text-primary" text={t('title')} />

              <div className="mt-10 flex items-end gap-5">
                <span className="text-7xl font-extrabold leading-none tracking-tight text-text-primary">{avg.toFixed(1)}</span>
                <span className="pb-1.5">
                  <Stars value={avg} size={20} />
                  <span className="mt-2 block text-sm text-text-secondary">{t('rating', { count })}</span>
                </span>
              </div>

              <div className="mt-8 flex -space-x-3">
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
              <div className="relative h-[400px] [perspective:1600px] sm:h-[360px]" aria-live="polite">
                {testimonials.map((r, i) => {
                  const pos = (i - active + count) % count
                  const visible = pos < 3
                  return (
                    <div
                      key={r.id}
                      aria-hidden={pos !== 0}
                      className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        transform: `translate3d(${pos * 26}px, ${pos * -22}px, ${pos * -90}px) rotateY(${pos * -5}deg)`,
                        opacity: visible ? 1 - pos * 0.28 : 0,
                        zIndex: count - pos,
                        pointerEvents: pos === 0 ? 'auto' : 'none',
                      }}
                    >
                      <Tilt max={5} className="h-full" innerClassName="h-full">
                        <figure className="flex h-full flex-col rounded-[28px] border border-line bg-bg-primary p-7 shadow-float sm:p-9">
                          <span className="tilt-glare" />
                          <div className="tilt-z2 flex items-center justify-between">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-strong text-snow">
                              <Quote size={22} aria-hidden="true" />
                            </span>
                            <Stars value={r.rating || 5} />
                          </div>
                          <blockquote className="tilt-z1 mt-6 line-clamp-6 flex-1 text-lg leading-relaxed text-text-primary sm:text-xl">
                            {r.text}
                          </blockquote>
                          <figcaption className="tilt-z2 mt-6 flex items-center gap-4 border-t border-line pt-6">
                            <Avatar t={r} size={52} />
                            <span className="min-w-0">
                              <span className="block truncate font-bold text-text-primary">{r.name}</span>
                              <span className="block truncate text-sm text-text-secondary">
                                {[r.role, r.company].filter(Boolean).join(' · ')}
                              </span>
                            </span>
                          </figcaption>
                        </figure>
                      </Tilt>
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 flex items-center justify-between gap-4 sm:mt-8">
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
                        'inline-flex h-12 w-12 items-center justify-center rounded-full border border-line text-text-primary transition-colors',
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
