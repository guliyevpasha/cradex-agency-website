'use client'
/**
 * Pricing: free demo → yearly launch package → custom projects.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Price } from '@/components/ui/Price'
import { DomainChecker } from './DomainChecker'
import { SectionHeading } from './SectionHeading'

const PLANS = ['demo', 'launch', 'custom'] as const

export function PricingPlans({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' }) {
  const t = useTranslations('site.pricing')

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading as={headingAs} align="center" eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-3">
          {PLANS.map((p) => {
            const featured = p === 'launch'
            return (
              <article
                key={p}
                className={cn(
                  'relative flex flex-col rounded-3xl p-7 sm:p-8',
                  featured ? 'bg-ink text-snow shadow-float dark:ring-1 dark:ring-snow/10' : 'border border-line bg-bg-secondary'
                )}
              >
                {featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand-strong px-3 py-1 text-xs font-semibold text-snow">
                    {t('launchBadge')}
                  </span>
                )}
                <h3 className={cn('text-lg font-bold', featured ? 'text-snow' : 'text-text-primary')}>{t(`${p}Name`)}</h3>
                <p className="mt-4 flex items-baseline gap-2">
                  {p === 'launch' ? (
                    <Price azn={25} className={cn('text-4xl font-extrabold tracking-tight', featured ? 'text-snow' : 'text-text-primary')} />
                  ) : (
                    <span className={cn('text-4xl font-extrabold tracking-tight', featured ? 'text-snow' : 'text-text-primary')}>{t(`${p}Price`)}</span>
                  )}
                  <span className={cn('text-sm', featured ? 'text-[#A6B0BD]' : 'text-text-muted')}>{t(`${p}Period`)}</span>
                </p>
                <p className={cn('mt-3 leading-relaxed', featured ? 'text-[#C9D1DB]' : 'text-text-secondary')}>{t(`${p}Text`)}</p>
                <ul className="mb-8 mt-6 space-y-2.5">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className={cn('flex gap-2.5 text-[15px]', featured ? 'text-[#E6EAEF]' : 'text-text-secondary')}>
                      <Check size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                      {t(`${p}P${n}`)}
                    </li>
                  ))}
                </ul>
                <WhatsAppButton size="md" variant={featured ? 'primary' : 'dark'} className="mt-auto w-full" />
              </article>
            )
          })}
        </div>
        <DomainChecker />
      </div>
    </section>
  )
}
