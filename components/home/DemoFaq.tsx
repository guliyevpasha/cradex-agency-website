'use client'
/**
 * FAQ about the services and products: animated accordion cards and a
 * 3D question-mark orb. See ".faq-orb" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Reveal } from '@/components/ui/Reveal'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'

type Item = { q: string; a: string }

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
  const [open, setOpen] = useState<number | null>(0)


  return (
    <section className="py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
            <AnimatedHeading className="mt-3 text-display-lg font-extrabold tracking-[-0.035em] text-text-primary" text={t('title')} />
            <p className="mt-4 max-w-md text-lg leading-relaxed text-text-secondary">{t('subtitle')}</p>
            <Orb />
            <WhatsAppButton size="md" label={t('ask')} message={t('askMessage')} />
          </Reveal>
        </div>

        <div>
          <ul className="space-y-3 [perspective:1200px]">
            {items.map(({ q, a }, i) => {
              const isOpen = open === i
              const id = `faq-${i}`
              return (
                <li
                  key={i}
                  className={cn(
                    'faq-item overflow-hidden rounded-3xl border bg-bg-secondary transition-all duration-500',
                    isOpen ? 'faq-open border-accent-primary/40 shadow-float' : 'border-line hover:border-accent-primary/30'
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
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
                        <span className="block text-[17px] font-semibold text-text-primary">{q}</span>
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
