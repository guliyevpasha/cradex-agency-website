/**
 * Pricing pages for mobile apps, SEO & GEO and technical service, in the
 * style of the website pricing page: hero with the service's 3D scene,
 * packages, one-off extras, terms, FAQ and a consultation CTA.
 * Copy: site.servicePricing.<id>, numbers: lib/site/servicePricing.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowDown, Check, ChevronDown } from 'lucide-react'
import { LOCALES } from '@/lib/site/navigation'
import { SERVICE_PRICING, SERVICE_PRICING_IDS, SERVICE_PRICING_SLUGS, annualOf, servicePricingIdBySlug, servicePricingProblems } from '@/lib/site/servicePricing'
import { ServicePackages } from '@/components/pricing/ServicePackages'
import { HERO_MOCKS } from '@/components/services/HeroMocks'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { ServiceProof } from '@/components/services/ServiceProof'
import { ogImage } from '@/lib/site/og'

// Hourly, like the home page: Studio publishes also refresh via /api/revalidate.
export const revalidate = 3600

type Params = Promise<{ locale: string; slug: string }>
type Faq = { q: string; a: string }

const SITE = 'https://cradexagency.com'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.flatMap(({ code }) => SERVICE_PRICING_IDS.map((id) => ({ locale: code, slug: SERVICE_PRICING_SLUGS[id] })))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const id = servicePricingIdBySlug(slug)
  if (!id) return {}
  const t = await getTranslations({ locale, namespace: `site.servicePricing.${id}` })
  const url = `/${locale}/pricing/${slug}`
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: url },
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), url: `${SITE}${url}`, type: 'website', images: [ogImage(locale)] },
  }
}

export default async function ServicePricingPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const id = servicePricingIdBySlug(slug)
  if (!id) notFound()
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: `site.servicePricing.${id}` })
  const c = await getTranslations({ locale, namespace: 'site.servicePricing.common' })
  const perks = t.raw('perks') as string[]
  const terms = t.raw('terms') as { k: string; v: string }[]
  const faq = t.raw('faq') as Faq[]
  const HeroMock = HERO_MOCKS[id]

  const problems = servicePricingProblems()
  if (problems.length > 0) console.error('[service pricing]', problems.join('; '))

  const url = `${SITE}/${locale}/pricing/${slug}`
  const offers = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: t('metaTitle'),
    itemListElement: SERVICE_PRICING[id].packages.flatMap((p) => {
      const name = t(`packages.${p.id}.name`)
      return p.period === 'month'
        ? [
            { '@type': 'Offer', name: `${name} · ${c('billing.monthly')}`, price: p.price, priceCurrency: 'AZN', url },
            { '@type': 'Offer', name: `${name} · ${c('billing.annual')}`, price: annualOf(p.price), priceCurrency: 'AZN', url },
          ]
        : [{ '@type': 'Offer', name, price: p.price, priceCurrency: 'AZN', url }]
    }),
  }

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-6 pt-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-8 lg:pb-10">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
          <AnimatedHeading
            as="h1"
            className="mt-4 text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-text-primary sm:text-6xl xl:text-[4.2rem]"
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
              {t('cardsTitle')}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <WhatsAppButton label={c('ctaButton')} message={t('message')} variant="dark" />
          </div>
        </div>

        <Reveal className="rv-3d">
          <Tilt max={6}>
            <HeroMock />
          </Tilt>
        </Reveal>
      </section>

      <ServicePackages id={id} />

      {/* Terms */}
      <section className="container-x py-14 lg:py-20">
        <Reveal className="rv-3d">
          <Tilt max={3}>
            <div className="svc relative rounded-[32px] border border-line bg-bg-primary p-7 shadow-card sm:p-10">
              <span className="tilt-glare" />
              <h2 className="tilt-z1 text-3xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-4xl">{c('termsTitle')}</h2>
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

      {/* FAQ */}
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr] lg:py-20">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={c('faqTitle')} />
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

      <ServiceProof service={id} locale={locale} />

      {/* CTA */}
      <section className="overflow-hidden pb-20 lg:pb-28">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[32px] bg-brand-strong px-7 py-14 text-snow sm:px-14 sm:py-20">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-snow/20" />
            <div aria-hidden="true" className="absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-ink/10" />
            <div className="relative max-w-2xl">
              <AnimatedHeading className="text-display-lg font-extrabold tracking-[-0.035em]" text={t('cta.title')} />
              <p className="mt-4 text-lg text-snow/85">{t('cta.text')}</p>
              <div className="mt-9">
                <WhatsAppButton label={c('ctaButton')} message={t('message')} variant="dark" className="bg-snow text-ink hover:bg-snow/90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // Escape "<" so no text in the data can close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offers).replace(/</g, '\\u003c') }}
      />
    </div>
  )
}
