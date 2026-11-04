'use client'
/**
 * "What changes the final amount": numbered rows; the one in the middle of
 * the screen lights up and its icon tile turns to face the reader.
 * Styles: ".pf-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Files, Languages, LifeBuoy, Palette, Plug, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'

const ICONS = [Files, Palette, Languages, Puzzle, Plug, LifeBuoy]

type Factor = { t: string; d: string }

export function PriceFactors() {
  const t = useTranslations('site.pricingPage')
  const factors = t.raw('factors') as Factor[]
  const [active, setActive] = useState(0)
  const rows = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    // A thin band across the middle of the viewport decides which row is "read".
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    rows.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <AnimatedHeading className="text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-text-primary sm:text-6xl" text={t('factorsTitle')} />
        <p className="max-w-xl text-lg leading-relaxed text-text-secondary lg:pt-3">{t('factorsText')}</p>
      </div>

      <ol className="mt-12 border-t-2 border-text-primary">
        {factors.map((f, i) => {
          const Icon = ICONS[i % ICONS.length]
          return (
            <li
              key={f.t}
              ref={(el) => {
                rows.current[i] = el
              }}
              data-i={i}
              className={cn(
                'pf-row relative flex flex-col gap-4 border-b border-line py-8 sm:py-10 lg:grid lg:grid-cols-[80px_120px_minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-x-8 lg:gap-y-0',
                i === active && 'pf-on'
              )}
            >
              {/* phones: number and tile share a row; desktop: each gets its own column */}
              <div className="flex items-center gap-4 lg:contents">
                <span className="text-sm font-semibold text-text-muted tabular-nums lg:pt-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="pf-cube flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-bg-secondary text-accent-ink lg:h-16 lg:w-16">
                  <Icon size={24} aria-hidden="true" />
                </span>
              </div>
              <h3 className="min-w-0 break-words text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:pt-2 [hyphens:auto]">{f.t}</h3>
              <div className="min-w-0">
                <p className="text-[17px] leading-relaxed text-text-secondary">{f.d}</p>
                <span className="pf-line mt-4 block h-0.5 w-24 rounded-full bg-brand-strong" aria-hidden="true" />
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
