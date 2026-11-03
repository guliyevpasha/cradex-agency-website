'use client'
/**
 * FAQ across all services and products: topic filter, animated accordion
 * cards and a 3D question-mark orb. See ".faq-orb" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Reveal } from '@/components/ui/Reveal'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

type Item = { g: string; q: string; a: string }

const GROUPS = ['all', 'web', 'mobile', 'seo', 'ads', 'support', 'products'] as const

function Orb() {
  return (
    <div className="faq-orb" aria-hidden="true">
      <span className="faq-ring faq-ring-a" />
      <span className="faq-ring faq-ring-b" />
      <span className="faq-ring faq-ring-c" />
      <span className="faq-core">?</span>
    </div>
  )
}

export function DemoFaq() {
  const t = useTranslations('site.faq')
  const items = t.raw('items') as Item[]
  const [group, setGroup] = useState<(typeof GROUPS)[number]>('all')
  const [open, setOpen] = useState<number | null>(0)

  const shown = items.map((it, i) => ({ ...it, i })).filter((it) => group === 'all' || it.g === group)

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
            <h2 className="mt-3 text-display-lg font-extrabold tracking-[-0.035em] text-text-primary">{t('title')}</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-text-secondary">{t('subtitle')}</p>
            <Orb />
            <WhatsAppButton size="md" label={t('ask')} message={t('askMessage')} />
          </Reveal>
        </div>

        <div>
          <div role="tablist" aria-label={t('title')} className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={group === g}
                onClick={() => {
                  setGroup(g)
                  setOpen(null)
                }}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  group === g
                    ? 'border-transparent bg-brand-strong text-snow'
                    : 'border-line bg-bg-secondary text-text-secondary hover:text-text-primary'
                )}
              >
                {t(`groups.${g}`)}
              </button>
            ))}
          </div>

          <ul className="mt-6 space-y-3 [perspective:1200px]">
            {shown.map(({ q, a, i, g }, idx) => {
              const isOpen = open === i
              const id = `faq-${i}`
              return (
                <li
                  key={i}
                  className={cn(
                    'faq-item overflow-hidden rounded-3xl border bg-bg-secondary transition-all duration-500',
                    isOpen ? 'faq-open border-accent-primary/40 shadow-float' : 'border-line hover:border-accent-primary/30'
                  )}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold tabular-nums transition-colors',
                          isOpen ? 'bg-brand-strong text-snow' : 'bg-bg-primary text-text-secondary'
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-ink">{t(`groups.${g}`)}</span>
                        <span className="mt-0.5 block text-[17px] font-semibold text-text-primary">{q}</span>
                      </span>
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                          isOpen ? 'rotate-45 border-transparent bg-text-primary text-bg-primary' : 'border-line text-text-secondary'
                        )}
                      >
                        <Plus size={18} aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={id}
                    role="region"
                    className={cn('grid transition-[grid-template-rows] duration-500 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-6 pl-[4.75rem] leading-relaxed text-text-secondary sm:px-7 sm:pl-[5.25rem]">{a}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
