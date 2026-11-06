'use client'
/**
 * Packages and one-off extras for the mobile, SEO & GEO and technical service
 * pricing pages. Monthly services get a monthly / annual (−20%) switch,
 * one-time projects show their price once. Texts: site.servicePricing.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { azn, type Billing } from '@/lib/site/pricing'
import { whatsappUrl } from '@/lib/site/navigation'
import { SERVICE_PRICING, annualOf, type ServicePricingId } from '@/lib/site/servicePricing'
import { Tilt } from '@/components/ui/Tilt'
import { Reveal } from '@/components/ui/Reveal'

export function ServicePackages({ id }: { id: ServicePricingId }) {
  const t = useTranslations(`site.servicePricing.${id}`)
  const c = useTranslations('site.servicePricing.common')
  const tMenu = useTranslations('site.pricingMenu')
  const [billing, setBilling] = useState<Billing>('monthly')
  const { packages, extras } = SERVICE_PRICING[id]
  const monthly = packages.some((p) => p.period === 'month')
  const service = tMenu(`${id}.title`)

  return (
    <>
      <section id="paketler" className="container-x scroll-mt-28 py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl">{t('cardsTitle')}</h2>
            <p className="mt-3 text-lg text-text-secondary">{t('cardsText')}</p>
          </div>
          {monthly && (
            <div className="pr-segment w-full sm:w-auto" data-active={billing} role="radiogroup" aria-label={c('billingTitle')}>
              <span className="pr-segment-thumb" aria-hidden="true" />
              {(['monthly', 'annual'] as const).map((b) => (
                <label key={b} className="pr-segment-item">
                  <input type="radio" name={`${id}-billing`} value={b} checked={b === billing} onChange={() => setBilling(b)} className="sr-only" />
                  {c(`billing.${b}`)}
                  {b === 'annual' && (
                    <span className={cn('pr-badge rounded-full px-2 py-0.5 text-[11px] font-extrabold', b === billing ? 'bg-snow text-[#0A74CC]' : 'bg-brand-strong text-snow')}>
                      −20%
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
          {packages.map((p, i) => {
            const features = t.raw(`packages.${p.id}.features`) as string[]
            const name = t(`packages.${p.id}.name`)
            const annual = p.period === 'month' && billing === 'annual'
            return (
              <li key={p.id}>
                <Reveal className="rv-3d h-full" delay={i * 90}>
                  <Tilt max={5} className="h-full" innerClassName="h-full">
                    <article
                      className={cn(
                        'pr-card relative flex h-full flex-col rounded-[28px] border bg-bg-primary p-6 shadow-card sm:p-7',
                        p.recommended ? 'border-brand-strong' : 'border-line'
                      )}
                    >
                      <span className="tilt-glare" />
                      {p.recommended && (
                        <span className="tilt-z2 absolute -top-3 left-6 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-bold text-snow shadow-card">
                          {c('recommended')}
                        </span>
                      )}
                      <div className="tilt-z1 flex items-baseline justify-between gap-3">
                        <h3 className="text-2xl font-extrabold text-text-primary">{name}</h3>
                        <span className="rounded-full bg-accent-primary/10 px-2.5 py-1 text-[11px] font-bold text-accent-ink">{t(`packages.${p.id}.meta`)}</span>
                      </div>
                      <p className="tilt-z1 mt-2 text-sm leading-snug text-text-secondary md:min-h-[2.6rem]">{t(`packages.${p.id}.text`)}</p>

                      <div className="tilt-z2 mt-6">
                        {annual ? (
                          <p className="flex items-center gap-2 text-sm">
                            <s className="text-text-muted tabular-nums">{azn(p.price * 12)}</s>
                            <span className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-[11px] font-extrabold text-accent-ink">−20%</span>
                          </p>
                        ) : (
                          <p className="text-sm text-text-muted">{p.period === 'once' ? c('from') : ' '}</p>
                        )}
                        <p className="mt-1 text-4xl font-extrabold tracking-[-0.03em] text-text-primary tabular-nums">
                          {azn(annual ? annualOf(p.price) : p.price)}{' '}
                          <span className="text-base font-bold text-text-muted">
                            {p.period === 'once' ? c('once') : annual ? c('perYear') : c('perMonth')}
                          </span>
                        </p>
                        <p className="mt-2 text-sm leading-snug text-text-secondary">
                          {/* one-time projects: the staged payment line from the hero perks */}
                          {p.period === 'once' ? (t.raw('perks') as string[])[1] : annual ? c('annualOnce') : c('monthlyNote')}
                        </p>
                      </div>

                      <p className="tilt-z1 mt-6 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{c('includesTitle')}</p>
                      <ul className="tilt-z1 mt-3 flex-1 space-y-2 border-t border-line pt-3">
                        {features.map((f) => (
                          <li key={f} className="flex gap-2 text-[14px] leading-snug text-text-secondary">
                            <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <a
                        href={whatsappUrl(c('orderMessage', { service, plan: name }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'tilt-z2 mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5',
                          p.recommended ? 'bg-brand-strong text-snow shadow-brand' : 'bg-text-primary text-bg-primary'
                        )}
                      >
                        {c('order')}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    </article>
                  </Tilt>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      {extras.length > 0 && (
        <section className="container-x py-14 lg:py-20">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-4xl">{t('extrasTitle')}</h2>
          <p className="mt-3 max-w-2xl text-lg text-text-secondary">{t('extrasText')}</p>
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((e, i) => {
              const name = t(`extras.${e.id}.name`)
              return (
                <li key={e.id}>
                  <Reveal className="rv-3d h-full" delay={(i % 3) * 80}>
                    <Tilt max={6} className="h-full" innerClassName="h-full">
                      <a
                        href={whatsappUrl(c('extraMessage', { service, item: name }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="svc group relative flex h-full flex-col rounded-3xl border border-line bg-bg-secondary p-6 shadow-card"
                      >
                        <span className="tilt-glare" />
                        <span className="tilt-z1 flex items-start justify-between gap-3">
                          <span className="text-lg font-bold text-text-primary group-hover:text-accent-ink">{name}</span>
                          <ArrowUpRight size={17} className="mt-1 shrink-0 text-accent-ink" aria-hidden="true" />
                        </span>
                        <span className="tilt-z1 mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{t(`extras.${e.id}.text`)}</span>
                        <span className="tilt-z2 mt-4 text-2xl font-extrabold text-text-primary tabular-nums">
                          {azn(e.price)}{' '}
                          <span className="text-sm font-bold text-text-muted">{e.period === 'month' ? c('perMonth') : c('once')}</span>
                        </span>
                      </a>
                    </Tilt>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
