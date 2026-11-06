/**
 * Pricing (website as a service): CMS and custom-code packages, monthly
 * instalments or annual payment with 20% off, options that change the total,
 * custom projects, FAQ, terms and what drives the final amount.
 * The old plans block (components/home/PricingPlans) stays in code.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowDown, Check, ChevronDown, Info } from 'lucide-react'
import { PLANS, planProblems } from '@/lib/site/pricing'
import { PricingConfigurator } from '@/components/pricing/PricingConfigurator'
import { HeroDevices } from '@/components/pricing/HeroDevices'
import { PriceFactors } from '@/components/pricing/PriceFactors'
import { DomainChecker } from '@/components/home/DomainChecker'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { ServiceProof } from '@/components/services/ServiceProof'

// Hourly, like the home page: Studio publishes also refresh via /api/revalidate.
export const revalidate = 3600

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
      <section className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-6 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:pb-10">
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

        {/* What the customer gets: one site that works on every screen. */}
        <Reveal className="rv-3d mx-auto w-full max-w-[680px] px-3 pb-8 pt-6 sm:px-6">
          <HeroDevices locale={locale} />
        </Reveal>
      </section>

      <PricingConfigurator />

      <section className="overflow-x-clip pb-6">
        <DomainChecker />
      </section>

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
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12 lg:py-20">
        {/* Left side stays in view while the questions scroll, so it never sits empty. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('faqTitle')} />
          <Reveal className="rv-3d mt-8">
            <Tilt max={6}>
              <div className="faq-ask relative overflow-hidden rounded-[32px] bg-ink p-7 text-snow shadow-float sm:p-8">
                <span className="tilt-glare" />
                {/* a short chat, just to say "people ask us this all the time" */}
                <div className="tilt-z2 space-y-2" aria-hidden="true">
                  <span className="faq-bubble block w-fit max-w-[80%] rounded-2xl rounded-bl-md bg-snow/10 px-4 py-2.5 text-sm">{t('faqAskQ')}</span>
                  <span className="faq-bubble faq-bubble-2 ml-auto block w-fit max-w-[80%] rounded-2xl rounded-br-md bg-brand-strong px-4 py-2.5 text-sm">
                    {t('faqAskA')}
                  </span>
                  <span className="faq-typing flex w-fit gap-1 rounded-2xl rounded-bl-md bg-snow/10 px-4 py-3">
                    <i /><i /><i />
                  </span>
                </div>
                <h3 className="tilt-z1 mt-7 text-2xl font-extrabold">{t('faqAskTitle')}</h3>
                <p className="tilt-z1 mt-2 leading-relaxed text-snow/75">{t('faqAskText')}</p>
                <div className="tilt-z2 mt-6">
                  <WhatsAppButton label={t('faqAskCta')} message={t('faqAskMessage')} size="md" />
                </div>
              </div>
            </Tilt>
          </Reveal>
        </div>

        <div className="space-y-3">
          {faq.map((f, i) => (
            <details key={f.q} className="group rounded-3xl border border-line bg-bg-secondary px-5 py-4 transition-shadow open:shadow-card sm:px-6 sm:py-5" open={i === 0}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-4 text-lg font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                <span className="w-7 shrink-0 text-sm font-bold text-accent-ink tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">{f.q}</span>
                <ChevronDown size={20} className="shrink-0 text-accent-ink transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 pl-11 leading-relaxed text-text-secondary">{f.a}</p>
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

      <section className="container-x pb-4 text-center">
        <p className="mx-auto max-w-3xl text-2xl font-extrabold leading-snug tracking-[-0.02em] text-text-primary sm:text-3xl">{t('closing')}</p>
      </section>

      <PriceFactors />

      <ServiceProof service="web" locale={locale} />

      <script
        type="application/ld+json"
        // Escape "<" so no text in the data can close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offers).replace(/</g, '\\u003c') }}
      />
    </div>
  )
}
