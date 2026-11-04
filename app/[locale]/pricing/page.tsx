/**
 * Pricing (website as a service): CMS and custom-code packages, monthly
 * instalments or annual payment with 20% off, custom projects, FAQ and terms.
 * The old plans block (components/home/PricingPlans) stays in code.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowDown, Check, ChevronDown, Info } from 'lucide-react'
import { PLANS, azn, planProblems, quote } from '@/lib/site/pricing'
import { PricingConfigurator } from '@/components/pricing/PricingConfigurator'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

type Faq = { q: string; a: string }

const SITE = 'https://cradexagency.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.pricingPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: `/${locale}/pricing` },
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), url: `${SITE}/${locale}/pricing`, type: 'website' },
  }
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'site.pricingPage' })
  const perks = t.raw('perks') as string[]
  const faq = t.raw('faq') as Faq[]
  const notes = t.raw('notes') as string[]
  const customItems = t.raw('customItems') as string[]

  // A price that does not split into whole manats is a data mistake: say so, never round it.
  const problems = planProblems()
  if (problems.length > 0) console.error('[pricing]', problems.join('; '))

  const sample = PLANS.find((p) => p.id === 'business') ?? PLANS[0]
  const sq = quote(sample)

  const offers = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: t('metaTitle'),
    itemListElement: PLANS.map((p) => ({
      '@type': 'Offer',
      name: t(`plans.${p.id}.name`),
      description: t(`plans.${p.id}.text`),
      price: p.total,
      priceCurrency: 'AZN',
      url: `${SITE}/${locale}/pricing`,
    })),
  }

  return (
    <div className="pt-24 lg:pt-28">
      {problems.length > 0 && process.env.NODE_ENV !== 'production' && (
        <p role="alert" className="container-x mb-4 rounded-2xl border border-[#F59E0B] bg-[#FEF3C7] p-4 text-sm font-semibold text-[#78350F]">
          {t('priceWarning')} {problems.join(' · ')}
        </p>
      )}

      {/* Hero */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-6 pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pb-10">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
          <AnimatedHeading
            as="h1"
            className="mt-4 text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-text-primary sm:text-6xl xl:text-[4.4rem]"
            text={t('title')}
          />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">{t('text')}</p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {perks.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-secondary px-3.5 py-2 text-[13px] font-semibold text-text-primary">
                <Check size={14} className="text-accent-ink" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#paketler"
              className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-7 py-4 text-[15px] font-semibold text-snow shadow-brand transition-transform hover:-translate-y-0.5"
            >
              {t('ctaPlans')}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <WhatsAppButton label={t('ctaCustom')} message={t('customMessage')} variant="dark" />
          </div>
        </div>

        {/* A real example from the table, so the idea is clear at a glance. */}
        <Reveal className="rv-3d hidden lg:block">
          <Tilt max={9}>
            <div className="svc-stage relative rounded-[36px] border border-line bg-bg-secondary p-8 shadow-card">
              <span className="tilt-glare" />
              <span className="svc-stage-grid" aria-hidden="true" />
              <div className="tilt-z2 relative rounded-3xl bg-ink p-6 text-snow shadow-float">
                <p className="text-sm text-snow/60">{t(`plans.${sample.id}.name`)} · {t('categories.cms.short')}</p>
                <p className="mt-3 text-5xl font-extrabold tracking-[-0.04em] tabular-nums">{azn(sq.initial)}</p>
                <p className="mt-1 text-snow/75">{t('initialNote')}</p>
                <div className="mt-5 grid grid-cols-6 gap-1.5" aria-hidden="true">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="pr-month h-7 rounded-md bg-snow/10" style={{ animationDelay: `${i * 90}ms` }} />
                  ))}
                </div>
                <p className="mt-4 font-semibold">{t('then', { amount: azn(sq.monthly) })}</p>
              </div>
              <div className="tilt-z3 relative -mb-2 ml-auto mt-[-18px] w-max rounded-2xl border border-line bg-bg-primary px-5 py-3 shadow-float">
                <p className="text-xs text-text-muted">{t('billing.annual')}</p>
                <p className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-text-primary tabular-nums">{azn(sq.annual)}</span>
                  <s className="text-sm text-text-muted tabular-nums">{azn(sq.total)}</s>
                </p>
                <span className="mt-1 inline-flex rounded-full bg-brand-strong px-2.5 py-0.5 text-[11px] font-extrabold text-snow">{t('discountBadge')}</span>
              </div>
            </div>
          </Tilt>
        </Reveal>
      </section>

      <PricingConfigurator />

      {/* Projects outside the packages */}
      <section className="container-x py-14 lg:py-20">
        <Reveal className="rv-3d">
          <div className="pr-panel relative overflow-hidden rounded-[40px] bg-ink p-8 text-snow sm:p-12 lg:p-14">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">{t('customTitle')}</h2>
                <p className="mt-5 text-lg leading-relaxed text-snow/75">{t('customText')}</p>
                <div className="mt-8">
                  <WhatsAppButton label={t('customCta')} message={t('customMessage')} />
                </div>
                <p className="mt-4 text-sm text-snow/60">WhatsApp: +994 50 778 68 87</p>
              </div>
              <ul className="grid content-start gap-3 sm:grid-cols-2">
                {customItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-snow/10 bg-snow/5 p-4 text-[15px] leading-snug">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:py-20">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('faqTitle')} />
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="group rounded-3xl border border-line bg-bg-secondary px-6 py-5 open:shadow-card">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown size={20} className="shrink-0 text-accent-ink transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 leading-relaxed text-text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Terms: present, but quieter than the offer */}
      <section className="container-x pb-16">
        <div className="rounded-[28px] border border-line p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-base font-bold text-text-primary">
            <Info size={18} className="text-accent-ink" aria-hidden="true" />
            {t('notesTitle')}
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm leading-relaxed text-text-secondary md:grid-cols-2">
            {notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" aria-hidden="true" />
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-text-muted">{t('notesFooter')}</p>
        </div>
      </section>

      <section className="container-x pb-24 text-center">
        <p className="mx-auto max-w-3xl text-2xl font-extrabold leading-snug tracking-[-0.02em] text-text-primary sm:text-3xl">{t('closing')}</p>
      </section>

      <script
        type="application/ld+json"
        // Escape "<" so no text in the data can close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offers).replace(/</g, '\\u003c') }}
      />
    </div>
  )
}
