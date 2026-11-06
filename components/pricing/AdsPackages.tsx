'use client'
/**
 * Ads pricing cards: Meta, Google, TikTok and LinkedIn packages with a
 * monthly / annual switch (annual = 12 months at 20% off), setup fee, minimum
 * ad budget, what is included and what we need from the client.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Check, Info } from 'lucide-react'
import { siGoogleads, siLinkedin, siMeta, siTiktok, type SimpleIcon } from 'simple-icons'
import { cn } from '@/lib/utils/cn'
import { azn, type Billing } from '@/lib/site/pricing'
import { whatsappUrl } from '@/lib/site/navigation'
import { ADS_PACKAGES, adsAnnual, type AdsPackage, type AdsPackageId } from '@/lib/site/adsPricing'
import { Tilt } from '@/components/ui/Tilt'
import { Reveal } from '@/components/ui/Reveal'

const ICONS: Record<AdsPackageId, SimpleIcon> = { meta: siMeta, google: siGoogleads, tiktok: siTiktok, linkedin: siLinkedin }

export function AdsPackages() {
  const t = useTranslations('site.adsPricingPage')
  const [billing, setBilling] = useState<Billing>('monthly')

  const message = (p: AdsPackage) =>
    t('orderMessage', { plan: t(`packages.${p.id}.name`), billing: t(`billing.${billing}`) })

  return (
    <section id="paketler" className="container-x scroll-mt-28 py-14 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl">{t('cardsTitle')}</h2>
          <p className="mt-3 text-lg text-text-secondary">{t('cardsText')}</p>
        </div>
        <div className="pr-segment w-full sm:w-auto" data-active={billing} role="radiogroup" aria-label={t('billingTitle')}>
          <span className="pr-segment-thumb" aria-hidden="true" />
          {(['monthly', 'annual'] as const).map((b) => (
            <label key={b} className="pr-segment-item">
              <input type="radio" name="ads-billing" value={b} checked={b === billing} onChange={() => setBilling(b)} className="sr-only" />
              {t(`billing.${b}`)}
              {b === 'annual' && (
                <span className={cn('pr-badge rounded-full px-2 py-0.5 text-[11px] font-extrabold', b === billing ? 'bg-snow text-[#0A74CC]' : 'bg-brand-strong text-snow')}>
                  −20%
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {ADS_PACKAGES.map((p, i) => {
          const features = t.raw(`packages.${p.id}.features`) as string[]
          const requirements = t.raw(`packages.${p.id}.requirements`) as string[]
          return (
            <li key={p.id}>
              <Reveal className="rv-3d h-full" delay={i * 90}>
                <Tilt max={5} className="h-full" innerClassName="h-full">
                  <article
                    className={cn(
                      'pr-card relative flex h-full flex-col rounded-[28px] border bg-bg-primary p-6 shadow-card',
                      p.recommended ? 'border-brand-strong' : 'border-line'
                    )}
                  >
                    <span className="tilt-glare" />
                    {p.recommended && (
                      <span className="tilt-z2 absolute -top-3 left-6 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-bold text-snow shadow-card">
                        {t('recommended')}
                      </span>
                    )}

                    <div className="tilt-z2 flex items-center gap-3 xl:min-h-[3.875rem]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-snow shadow-card dark:bg-snow dark:text-ink">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                          <path d={ICONS[p.id].path} />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xl font-extrabold text-text-primary">{t(`packages.${p.id}.name`)}</h3>
                        <p className="text-xs font-semibold leading-snug text-text-muted">{t(`packages.${p.id}.sub`)}</p>
                      </div>
                    </div>
                    {/* fixed height keeps the price rows level across the four cards */}
                    <p className="tilt-z1 mt-4 text-sm leading-snug text-text-secondary xl:min-h-[4.25rem]">{t(`packages.${p.id}.text`)}</p>

                    {/* Same rows in both modes so the cards do not jump on switch. */}
                    <div className="tilt-z2 mt-6">
                      {billing === 'annual' ? (
                        <>
                          <p className="flex items-center gap-2 text-sm">
                            <s className="text-text-muted tabular-nums">{azn(p.fee * 12)}</s>
                            <span className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-[11px] font-extrabold text-accent-ink">−20%</span>
                          </p>
                          <p className="mt-1 text-4xl font-extrabold tracking-[-0.03em] text-text-primary tabular-nums">
                            {azn(adsAnnual(p))} <span className="text-base font-bold text-text-muted">{t('perYear')}</span>
                          </p>
                          <p className="mt-2 text-sm leading-snug text-text-secondary">{t('annualOnce')}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-text-muted" aria-hidden="true">&nbsp;</p>
                          <p className="mt-1 text-4xl font-extrabold tracking-[-0.03em] text-text-primary tabular-nums">
                            {azn(p.fee)} <span className="text-base font-bold text-text-muted">{t('perMonth')}</span>
                          </p>
                          <p className="mt-2 text-sm leading-snug text-text-secondary">{t('monthlyNote')}</p>
                        </>
                      )}
                    </div>

                    <dl className="tilt-z1 mt-5 grid gap-2 rounded-2xl bg-bg-secondary p-4 text-sm">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-text-secondary">{t('setupLabel')}</dt>
                        <dd className="font-bold text-text-primary tabular-nums">{azn(p.setup)}</dd>
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-text-secondary">{t('budgetLabel')}</dt>
                          <dd className="font-bold text-text-primary tabular-nums">{t('budgetValue', { amount: azn(p.minBudget) })}</dd>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                          <Info size={12} aria-hidden="true" />
                          {t('budgetNote')}
                        </p>
                      </div>
                    </dl>

                    <p className="tilt-z1 mt-6 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{t('includesTitle')}</p>
                    <ul className="tilt-z1 mt-3 space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex gap-2 text-[14px] leading-snug text-text-secondary">
                          <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <p className="tilt-z1 mt-6 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{t('requirementsTitle')}</p>
                    <ul className="tilt-z1 mt-3 flex-1 space-y-2 border-t border-line pt-3">
                      {requirements.map((r) => (
                        <li key={r} className="flex gap-2 text-[13.5px] leading-snug text-text-secondary">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" aria-hidden="true" />
                          {r}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={whatsappUrl(message(p))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'tilt-z2 mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5',
                        p.recommended ? 'bg-brand-strong text-snow shadow-brand' : 'bg-text-primary text-bg-primary'
                      )}
                    >
                      {t('order')}
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
  )
}
