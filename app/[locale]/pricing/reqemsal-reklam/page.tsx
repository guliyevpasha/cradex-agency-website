/**
 * Digital ads pricing: one monthly management package per platform (Meta,
 * Google, TikTok, LinkedIn), what every package includes, terms, real
 * results (when there are any), FAQ and the consultation CTA.
 * Copy: site.adsPricingPage, numbers: lib/site/adsPricing.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowDown, Check, ChevronDown } from 'lucide-react'
import { ADS_PACKAGES, adsAnnual, adsPricingProblems } from '@/lib/site/adsPricing'
import { AdsPackages } from '@/components/pricing/AdsPackages'
import { AdsResults } from '@/components/pricing/AdsResults'
import { AdsDashboard } from '@/components/services/AdsDashboard'
import { AdsCta } from '@/components/services/AdsSections'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { ServiceProof } from '@/components/services/ServiceProof'

// Hourly, like the home page: Studio publishes also refresh via /api/revalidate.
export const revalidate = 3600

type Item = { t: string; d: string }
type Faq = { q: string; a: string }

const SITE = 'https://cradexagency.com'
const PATH = '/pricing/reqemsal-reklam'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.adsPricingPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: `/${locale}${PATH}` },
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), url: `${SITE}/${locale}${PATH}`, type: 'website' },
  }
}

export default async function AdsPricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'site.adsPricingPage' })
  const perks = t.raw('perks') as string[]
  const common = t.raw('common') as Item[]
  const terms = t.raw('terms') as { k: string; v: string }[]
  const faq = t.raw('faq') as Faq[]

  const problems = adsPricingProblems()
  if (problems.length > 0) console.error('[ads pricing]', problems.join('; '))

  const offers = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: t('metaTitle'),
    itemListElement: ADS_PACKAGES.flatMap((p) => [
      { '@type': 'Offer', name: `${t(`packages.${p.id}.name`)} · ${t('billing.monthly')}`, price: p.fee, priceCurrency: 'AZN', url: `${SITE}/${locale}${PATH}` },
      { '@type': 'Offer', name: `${t(`packages.${p.id}.name`)} · ${t('billing.annual')}`, price: adsAnnual(p), priceCurrency: 'AZN', url: `${SITE}/${locale}${PATH}` },
    ]),
  }

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-6 pt-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-8 lg:pb-10">
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
            <WhatsAppButton label={t('ctaConsult')} message={t('consultMessage')} variant="dark" />
          </div>
        </div>

        <Reveal className="rv-3d">
          <Tilt max={6}>
            <AdsDashboard />
          </Tilt>
        </Reveal>
      </section>

      <AdsPackages />

      {/* Included in every package */}
      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('commonTitle')} />
          <p className="max-w-xl text-lg leading-relaxed text-text-secondary lg:justify-self-end">{t('commonText')}</p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {common.map((c, i) => (
            <li key={c.t}>
              <Reveal className="rv-3d h-full" delay={(i % 3) * 90}>
                <Tilt max={6} className="h-full" innerClassName="h-full">
                  <article className="svc relative h-full rounded-3xl border border-line bg-bg-secondary p-7 shadow-card">
                    <span className="tilt-glare" />
                    <span className="tilt-z3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-strong text-sm font-extrabold text-snow svc-icon">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="tilt-z1 mt-5 text-xl font-bold tracking-tight text-text-primary">{c.t}</h3>
                    <p className="tilt-z1 mt-2 leading-relaxed text-text-secondary">{c.d}</p>
                  </article>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Terms and requirements */}
      <section className="container-x py-14 lg:py-20">
        <Reveal className="rv-3d">
          <Tilt max={3}>
            <div className="svc relative rounded-[32px] border border-line bg-bg-primary p-7 shadow-card sm:p-10">
              <span className="tilt-glare" />
              <h2 className="tilt-z1 text-3xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-4xl">{t('termsTitle')}</h2>
              <dl className="tilt-z1 mt-6 divide-y divide-line">
                {terms.map((row) => (
                  <div key={row.k} className="grid gap-1 py-4 sm:grid-cols-[0.6fr_1.4fr] sm:gap-8">
                    <dt className="flex items-start gap-2 font-semibold text-text-primary">
                      <Check size={16} className="mt-1 shrink-0 text-accent-ink" aria-hidden="true" />
                      {row.k}
                    </dt>
                    <dd className="leading-relaxed text-text-secondary">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Tilt>
        </Reveal>
      </section>

      <AdsResults />

      {/* FAQ */}
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr] lg:py-20">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('faqTitle')} />
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

      <ServiceProof service="ads" locale={locale} />

      <AdsCta />

      <script
        type="application/ld+json"
        // Escape "<" so no text in the data can close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offers).replace(/</g, '\\u003c') }}
      />
    </div>
  )
}
