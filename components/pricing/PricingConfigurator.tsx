'use client'
/**
 * Package picker: category (CMS / custom code) → billing (monthly
 * instalments / annual −20%) → package, with a live payment plan on the
 * right whose figures count to the new value. The cards below share the
 * same state. All numbers come from lib/site/pricing.ts.
 * Styles: ".pr-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Check, Code2, LayoutTemplate } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'
import { PLAN_CATEGORIES, azn, percent, plansIn, quote, type Billing, type Plan, type PlanCategory } from '@/lib/site/pricing'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

const CATEGORY_ICONS = { cms: LayoutTemplate, code: Code2 }

/** Counts from the previous value to the new one (instant with reduced motion). */
function useCountUp(value: number, ms = 550) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const start = from.current
    if (start === value) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = value
      setShown(value)
      return
    }
    let frame = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      const v = Math.round(start + (value - start) * eased)
      from.current = v
      setShown(v)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, ms])

  return shown
}

function Money({ value, className }: { value: number; className?: string }) {
  // The final figure is announced once by the summary below, not every frame.
  return <span aria-hidden="true" className={cn('tabular-nums', className)}>{azn(useCountUp(value))}</span>
}

export function PricingConfigurator() {
  const t = useTranslations('site.pricingPage')
  const [category, setCategory] = useState<PlanCategory>('cms')
  const [billing, setBilling] = useState<Billing>('monthly')
  const plans = plansIn(category)
  const [planId, setPlanId] = useState(plans.find((p) => p.recommended)?.id ?? plans[0].id)
  const plan = plans.find((p) => p.id === planId) ?? plans[0]
  const q = quote(plan)
  const panelRef = useRef<HTMLDivElement>(null)

  function pickCategory(c: PlanCategory) {
    setCategory(c)
    const list = plansIn(c)
    setPlanId(list.find((p) => p.recommended)?.id ?? list[0].id)
  }

  function choose(p: Plan) {
    setPlanId(p.id)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    panelRef.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' })
  }

  const name = (p: Plan) => t(`plans.${p.id}.name`)

  const message = (p: Plan) => {
    const x = quote(p)
    return billing === 'monthly'
      ? t('messageMonthly', { plan: name(p), total: azn(x.total), initial: azn(x.initial), monthly: azn(x.monthly) })
      : t('messageAnnual', { plan: name(p), annual: azn(x.annual) })
  }

  const features = t.raw(`plans.${plan.id}.features`) as string[]

  return (
    <>
      <section id="paketler" className="container-x scroll-mt-28 py-10 lg:py-14">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6">
          {/* Choices */}
          <div className="space-y-5">
            <fieldset className="rounded-[28px] border border-line bg-bg-secondary p-5 sm:p-6">
              <legend className="sr-only">{t('pickerTitle')}</legend>
              <p aria-hidden="true" className="text-lg font-bold text-text-primary">{t('pickerTitle')}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PLAN_CATEGORIES.map((c) => {
                  const Icon = CATEGORY_ICONS[c]
                  const on = c === category
                  return (
                    <label key={c} className={cn('pr-option', on && 'pr-option-on')}>
                      <input type="radio" name="pr-category" value={c} checked={on} onChange={() => pickCategory(c)} className="sr-only" />
                      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', on ? 'bg-snow/15 text-snow' : 'bg-accent-primary/10 text-accent-ink')}>
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold">{t(`categories.${c}.label`)}</span>
                        <span className={cn('mt-0.5 block text-[13px] leading-snug', on ? 'text-snow/75' : 'text-text-muted')}>{t(`categories.${c}.text`)}</span>
                      </span>
                      <span className="pr-radio" aria-hidden="true" />
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="rounded-[28px] border border-line bg-bg-secondary p-5 sm:p-6">
              <legend className="sr-only">{t('billingTitle')}</legend>
              <p aria-hidden="true" className="text-lg font-bold text-text-primary">{t('billingTitle')}</p>
              <div className="pr-segment mt-4" data-active={billing}>
                <span className="pr-segment-thumb" aria-hidden="true" />
                {(['monthly', 'annual'] as const).map((b) => (
                  <label key={b} className={cn('pr-segment-item', b === billing && 'text-snow')}>
                    <input type="radio" name="pr-billing" value={b} checked={b === billing} onChange={() => setBilling(b)} className="sr-only" />
                    {t(`billing.${b}`)}
                    {b === 'annual' && (
                      <span className={cn('pr-badge rounded-full px-2 py-0.5 text-[11px] font-extrabold', b === billing ? 'bg-snow text-[#0A74CC]' : 'bg-brand-strong text-snow')}>
                        −20%
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-[28px] border border-line bg-bg-secondary p-5 sm:p-6">
              <legend className="sr-only">{t('packageTitle')}</legend>
              <p aria-hidden="true" className="text-lg font-bold text-text-primary">{t('packageTitle')}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {plans.map((p) => {
                  const on = p.id === plan.id
                  const x = quote(p)
                  return (
                    <label key={p.id} className={cn('pr-option pr-option-col', on && 'pr-option-on')}>
                      <input type="radio" name="pr-plan" value={p.id} checked={on} onChange={() => setPlanId(p.id)} className="sr-only" />
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="font-bold">{name(p)}</span>
                        <span className="pr-radio" aria-hidden="true" />
                      </span>
                      <span className="mt-2 flex items-baseline gap-2">
                        {billing === 'annual' ? (
                          <>
                            <span className="text-xl font-extrabold tabular-nums">{azn(x.annual)}</span>
                            <s className={cn('text-sm tabular-nums', on ? 'text-snow/60' : 'text-text-muted')}>{azn(x.total)}</s>
                          </>
                        ) : (
                          <>
                            <span className="text-xl font-extrabold tabular-nums">{azn(x.monthly)}</span>
                            <span className={cn('text-sm', on ? 'text-snow/70' : 'text-text-muted')}>{t('perMonth')}</span>
                          </>
                        )}
                      </span>
                      {p.recommended && (
                        <span className={cn('mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold', on ? 'bg-snow/15 text-snow' : 'bg-accent-primary/10 text-accent-ink')}>
                          {t('recommended')}
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>

          {/* Live payment plan */}
          <div ref={panelRef} className="lg:sticky lg:top-24 lg:self-start">
            <div className="pr-panel relative overflow-hidden rounded-[32px] bg-ink p-6 text-snow sm:p-8">
              <p className="sr-only" aria-live="polite">
                {name(plan)}: {billing === 'monthly' ? `${azn(q.initial)}, ${t('then', { amount: azn(q.monthly) })}` : azn(q.annual)}
              </p>
              <p className="text-sm text-snow/60">
                {t('summaryTitle')} · {t(`categories.${category}.short`)}
              </p>
              <p className="mt-1 text-2xl font-extrabold">{name(plan)}</p>

              {billing === 'monthly' ? (
                <>
                  <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Money value={q.initial} className="text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl" />
                    <span className="text-snow/70">{t('initialNote')}</span>
                  </p>
                  <p className="mt-2 text-lg text-snow/80">
                    {t('then', { amount: azn(q.monthly) })}
                  </p>
                  {/* share paid up front vs. instalments */}
                  <div className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-snow/10" aria-hidden="true">
                    <span className="pr-bar rounded-full bg-brand" style={{ width: percent(q.initialRate) }} />
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Money value={q.annual} className="text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl" />
                    <s className="text-xl text-snow/50 tabular-nums">{azn(q.total)}</s>
                  </p>
                  <p className="mt-3">
                    <span className="rounded-full bg-brand-strong px-3 py-1 text-xs font-extrabold tracking-wide">{t('discountBadge')}</span>
                  </p>
                </>
              )}

              <dl className="mt-6 divide-y divide-snow/10 border-y border-snow/10 text-[15px]">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-snow/70">{t('totalLabel')}</dt>
                  <dd className={cn('font-bold tabular-nums', billing === 'annual' && 'text-snow/50 line-through')}>{azn(q.total)}</dd>
                </div>
                {billing === 'monthly' ? (
                  <>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-snow/70">{t('initialLabel', { rate: percent(q.initialRate) })}</dt>
                      <dd className="font-bold"><Money value={q.initial} /></dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-snow/70">{t('monthlyLabel')}</dt>
                      <dd className="font-bold tabular-nums">{t('monthlyValue', { amount: azn(q.monthly) })}</dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-snow/70">{t('savingLabel')}</dt>
                      <dd className="font-bold text-brand">−<Money value={q.saving} /></dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-snow/70">{t('annualLabel')}</dt>
                      <dd className="font-bold"><Money value={q.annual} /></dd>
                    </div>
                  </>
                )}
              </dl>

              <p className="mt-6 text-sm font-semibold text-snow/60">{t('includes')}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f} className="flex gap-2 text-[14px] leading-snug text-snow/85">
                    <Check size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappUrl(message(plan))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-strong px-6 py-4 font-semibold text-snow shadow-brand transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t('order')}
              </a>
              <p className="mt-4 text-xs leading-relaxed text-snow/50">{t('summaryNote')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* All four packages side by side */}
      <section className="container-x py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl">{t('cardsTitle')}</h2>
            <p className="mt-3 max-w-xl text-lg text-text-secondary">{t('cardsText')}</p>
          </div>
          <p className="text-sm font-semibold text-accent-ink">
            {t(`categories.${category}.label`)} · {t(`billing.${billing}`)}
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => {
            const x = quote(p)
            const list = t.raw(`plans.${p.id}.features`) as string[]
            const on = p.id === plan.id
            return (
              <li key={p.id}>
                <Tilt max={5} className="h-full" innerClassName="h-full">
                  <article className={cn('pr-card relative flex h-full flex-col rounded-[28px] border bg-bg-primary p-6 shadow-card', p.recommended ? 'border-brand-strong' : 'border-line', on && 'pr-card-on')}>
                    <span className="tilt-glare" />
                    {p.recommended && (
                      <span className="tilt-z2 absolute -top-3 left-6 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-bold text-snow shadow-card">
                        {t('recommended')}
                      </span>
                    )}
                    <h3 className="tilt-z1 text-xl font-extrabold text-text-primary">{name(p)}</h3>
                    <p className="tilt-z1 mt-1 text-sm leading-snug text-text-secondary">{t(`plans.${p.id}.text`)}</p>

                    <div className="tilt-z2 mt-6">
                      {billing === 'annual' ? (
                        <>
                          <s className="text-sm text-text-muted tabular-nums">{azn(x.total)}</s>
                          <p className="text-4xl font-extrabold tracking-[-0.03em] text-text-primary tabular-nums">{azn(x.annual)}</p>
                          <p className="mt-1 text-sm font-semibold text-accent-ink">{t('annualNote')}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-4xl font-extrabold tracking-[-0.03em] text-text-primary tabular-nums">{azn(x.total)}</p>
                          <p className="text-xs text-text-muted">{t('totalLabel')}</p>
                          <p className="mt-3 text-[15px] font-bold text-text-primary">{t('upfront', { amount: azn(x.initial) })} <span className="font-semibold text-text-muted">({percent(x.initialRate)})</span></p>
                          <p className="text-sm text-text-secondary">{t('then', { amount: azn(x.monthly) })}</p>
                        </>
                      )}
                    </div>

                    <ul className="tilt-z1 mt-6 flex-1 space-y-2 border-t border-line pt-5">
                      {list.map((f) => (
                        <li key={f} className="flex gap-2 text-[14px] leading-snug text-text-secondary">
                          <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="tilt-z2 mt-6 grid gap-2">
                      <a
                        href={whatsappUrl(message(p))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5',
                          p.recommended ? 'bg-brand-strong text-snow shadow-brand' : 'bg-text-primary text-bg-primary'
                        )}
                      >
                        {t('order')}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={() => choose(p)}
                        aria-pressed={on}
                        className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/50"
                      >
                        {on ? t('chosen') : t('choose')}
                      </button>
                    </div>
                  </article>
                </Tilt>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
