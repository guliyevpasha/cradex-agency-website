/**
 * Clients: hero with the 3D logo wall, every logo on its own card, then a
 * consultation call to action. Logos come from Sanity (static list as
 * fallback), so the brand count is always the real one.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import { getPartners } from '@/lib/data/partners'
import { ClientLogo } from '@/components/clients/ClientLogo'
import { ClientsFaq } from '@/components/clients/ClientsFaq'
import { ClientsGrid } from '@/components/clients/ClientsGrid'
import { ClientsWall } from '@/components/clients/ClientsWall'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

type Params = Promise<{ locale: string }>

// Where the four floating logo chips sit in the CTA visual.
const CTA_SPOTS = ['left-0 top-2 rotate-[-6deg]', 'right-2 top-0 rotate-[5deg]', 'left-10 bottom-2 rotate-[4deg]', 'right-0 bottom-8 rotate-[-5deg]']

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.clientsPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: `/${locale}/clients` },
  }
}

export default async function ClientsPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'site.clientsPage' })
  const partners = await getPartners()
  const faq = t.raw('faq') as { q: string; a: string }[]
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-10 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:pb-16">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
          <AnimatedHeading
            as="h1"
            className="mt-4 text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-text-primary sm:text-6xl"
            text={t('title')}
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">{t('text')}</p>
          <p className="mt-7 inline-flex items-center gap-3 rounded-full border border-line bg-bg-secondary py-2 pl-2 pr-5 text-[15px] font-semibold text-text-primary">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-strong text-snow">
              <BadgeCheck size={19} aria-hidden="true" />
            </span>
            <span>{t.rich('count', { n: partners.length, b: (chunks) => <b className="font-extrabold text-accent-ink">{chunks}</b> })}</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsAppButton label={t('cta')} message={t('ctaMessage')} size="md" />
            <Link
              href={`/${locale}/portfolio`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-text-primary px-5 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
            >
              {t('portfolio')}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <Reveal className="rv-3d">
          <ClientsWall partners={partners} />
        </Reveal>
      </section>

      {/* All logos */}
      <section className="container-x py-16 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('gridTitle')} />
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">{t('gridText')}</p>
        </div>
        <ClientsGrid partners={partners} />
      </section>

      {/* FAQ */}
      <section className="container-x py-16 lg:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('faqTitle')} />
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">{t('faqText')}</p>
        </div>
        <ClientsFaq items={faq} />
      </section>

      {/* CTA */}
      <section className="container-x pb-24 pt-4">
        <Reveal className="rv-3d">
          <Tilt max={3}>
            <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 overflow-hidden rounded-[36px] bg-brand-strong px-7 py-14 text-snow sm:px-14 sm:py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <span className="tilt-glare" />
              <span aria-hidden="true" className="hm-float absolute -right-20 -top-24 h-80 w-80 rounded-full bg-snow/15" />
              <span aria-hidden="true" className="hm-float-slow absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-ink/15" />
              <div className="tilt-z1 relative">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-snow/75">{t('ctaEyebrow')}</p>
                <AnimatedHeading className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-5xl" text={t('ctaTitle')} />
                <p className="mt-4 max-w-xl text-lg text-snow/85">{t('ctaText')}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <WhatsAppButton label={t('cta')} message={t('ctaMessage')} variant="light" />
                  <Link
                    href={`/${locale}/pricing`}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-snow/70 px-5 py-3 text-sm font-semibold text-snow transition-colors hover:bg-snow hover:text-brand-strong"
                  >
                    {t('ctaPricing')}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              {/* A few of the brands we worked with, floating on their own layer. */}
              <ul className="tilt-z3 relative hidden h-56 lg:block" aria-hidden="true">
                {partners.slice(0, 4).map((p, i) => (
                  // rotate on the <li>, float on the inner chip: both use transform
                  <li key={p.id} className={`absolute ${CTA_SPOTS[i]}`}>
                    <span className="cl-cta-chip hm-float flex h-16 w-40 items-center justify-center rounded-2xl" style={{ animationDelay: `${i * -1.4}s` }}>
                      <ClientLogo partner={p} decorative className="h-7 w-auto max-w-[70%] object-contain" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Tilt>
        </Reveal>
      </section>

      <script
        type="application/ld+json"
        // Escape "<" so no answer text can close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }}
      />
    </div>
  )
}
