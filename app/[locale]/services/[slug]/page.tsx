import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { getAllServices, getServiceBySlug } from '@/lib/data/services'
import { getPortfolioByCategory } from '@/lib/data/portfolio'
import { ServiceHero } from '@/components/sections/ServiceHero'
import { DigitalMarketingHero } from '@/components/sections/DigitalMarketingHero'
import { PlatformsSection } from '@/components/sections/PlatformsSection'
import { AuditStrategySection } from '@/components/sections/AuditStrategySection'
import { StrategicApproach } from '@/components/sections/StrategicApproach'
import { WhoIsThisFor } from '@/components/sections/WhoIsThisFor'
import { ProcessTimeline } from '@/components/sections/ProcessTimeline'
import { Glossary } from '@/components/sections/Glossary'
import { FAQ } from '@/components/sections/FAQ'
import { RelatedPortfolioSection } from '@/components/sections/RelatedPortfolioSection'
import WebDevHero from '@/components/sections/WebDevHero'
import PortfolioShowcase from '@/components/sections/PortfolioShowcase'
import PricingPackages from '@/components/sections/PricingPackages'
import ProcessCards from '@/components/sections/ProcessCards'
import WebDevProcessTimeline from '@/components/sections/WebDevProcessTimeline'
import WebDevFAQ from '@/components/sections/WebDevFAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'
import type { Service, PortfolioItem } from '@/types'

const locales = ['az', 'en', 'ru', 'tr']

export async function generateStaticParams() {
  const services = await getAllServices()
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug }))
  )
  // 4 locales × 8 services = 32 static pages
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  const t = await getTranslations({ locale, namespace: 'services' })
  const key = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  return {
    title: t(`${key}.metaTitle` as any),
    description: t(`${key}.metaDescription` as any),
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const relatedPortfolio = await getPortfolioByCategory(service.slug)

  return <ServicePageContent service={service} relatedPortfolio={relatedPortfolio} />
}

function ServicePageContent({
  service,
  relatedPortfolio,
}: {
  service: Service
  relatedPortfolio: PortfolioItem[]
}) {
  const t = useTranslations('services')
  const locale = useLocale()
  const key = service.slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())
  
  // Special layout for digital-marketing, smm, and web-mobile-dev
  const isDigitalMarketing = service.slug === 'digital-marketing'
  const isSMM = service.slug === 'smm'
  const isWebMobileDev = service.slug === 'web-mobile-dev'
  const hasCustomLayout = isDigitalMarketing || isSMM || isWebMobileDev

  // Web-mobile-dev has completely different layout
  if (isWebMobileDev) {
    const heroData = {
      title: t(`${key}.hero.title` as any),
      titleAccent: t(`${key}.hero.titleAccent` as any),
      subtitle: t(`${key}.hero.subtitle` as any),
      primaryButton: t(`${key}.hero.primaryButton` as any),
      secondaryButton: t(`${key}.hero.secondaryButton` as any),
      demoNote: t(`${key}.hero.demoNote` as any),
    }

    const portfolioShowcaseData = {
      label: t(`${key}.portfolioShowcase.label` as any),
      title: t(`${key}.portfolioShowcase.title` as any),
      subtitle: t(`${key}.portfolioShowcase.subtitle` as any),
      categories: t.raw(`${key}.portfolioShowcase.categories` as any),
      viewDetails: t(`${key}.portfolioShowcase.viewDetails` as any),
    }

    const pricingData = {
      title: t(`${key}.pricing.title` as any),
      subtitle: t(`${key}.pricing.subtitle` as any),
      monthlyLabel: t(`${key}.pricing.monthlyLabel` as any),
      yearlyLabel: t(`${key}.pricing.yearlyLabel` as any),
      saveLabel: t(`${key}.pricing.saveLabel` as any),
      perMonthLabel: t(`${key}.pricing.perMonthLabel` as any),
      corporateTitle: t(`${key}.pricing.corporate.title` as any),
      corporateDescription: t(`${key}.pricing.corporate.description` as any),
      corporateButton: t(`${key}.pricing.corporate.button` as any),
      tiers: [
        {
          name: t(`${key}.pricing.tiers.start.name` as any),
          monthlyPrice: 299,
          yearlyPrice: 2988,
          features: t.raw(`${key}.pricing.tiers.start.features` as any),
          cta: t(`${key}.pricing.tiers.start.cta` as any),
          ctaHref: `/${locale}/contact`,
        },
        {
          name: t(`${key}.pricing.tiers.pro.name` as any),
          monthlyPrice: 399,
          yearlyPrice: 3996,
          popular: true,
          features: t.raw(`${key}.pricing.tiers.pro.features` as any),
          cta: t(`${key}.pricing.tiers.pro.cta` as any),
          ctaHref: `/${locale}/contact`,
        },
        {
          name: t(`${key}.pricing.tiers.max.name` as any),
          monthlyPrice: 599,
          yearlyPrice: 5988,
          features: t.raw(`${key}.pricing.tiers.max.features` as any),
          cta: t(`${key}.pricing.tiers.max.cta` as any),
          ctaHref: `/${locale}/contact`,
        },
      ],
    }

    const processCardsData = {
      cards: t.raw(`${key}.processCards.cards` as any).map((card: any, index: number) => ({
        ...card,
        icon: ['Clock', 'DollarSign', 'Shield', 'MessageCircle'][index] as any,
      })),
    }

    const processTimelineData = {
      title: t(`${key}.processTimeline.title` as any),
      subtitle: t(`${key}.processTimeline.subtitle` as any),
      steps: t.raw(`${key}.processTimeline.steps` as any),
    }

    const faqData = {
      title: t(`${key}.faq.title` as any),
      subtitle: t(`${key}.faq.subtitle` as any),
      items: t.raw(`${key}.faq.items` as any),
    }

    const finalCTAData = {
      title: t(`${key}.finalCTA.title` as any),
      subtitle: t(`${key}.finalCTA.subtitle` as any),
      primaryButton: {
        text: t(`${key}.finalCTA.primaryButton` as any),
        href: `/${locale}/contact`,
      },
      secondaryButton: {
        text: t(`${key}.finalCTA.secondaryButton` as any),
        href: 'https://super-intellect.az',
      },
    }

    return (
      <>
        <WebDevHero {...heroData} />
        <PortfolioShowcase {...portfolioShowcaseData} portfolios={relatedPortfolio} />
        <PricingPackages {...pricingData} />
        <ProcessCards {...processCardsData} />
        <WebDevProcessTimeline {...processTimelineData} />
        <WebDevFAQ {...faqData} />
        <FinalCTA {...finalCTAData} />
      </>
    )
  }

  return (
    <>
      {hasCustomLayout ? (
        <>
          <DigitalMarketingHero
            title={t(`${key}.name` as any)}
            description={t(`${key}.heroDescription` as any)}
            ctaStart={t(`${key}.ctaStart` as any)}
            ctaProcess={t(`${key}.ctaProcess` as any)}
            locale={locale}
            imagePath={isSMM ? '/images/smm-hero.webp' : '/images/digital-marketing-hero.webp'}
          />
          <PlatformsSection
            title={t(`${key}.platformsTitle` as any)}
            subtitle={t(`${key}.platformsSubtitle` as any)}
            platforms={t.raw(`${key}.platforms` as any)}
          />
          <AuditStrategySection
            title={t(`${key}.auditTitle` as any)}
            items={t.raw(`${key}.auditItems` as any)}
          />
          <StrategicApproach
            title={t(`${key}.strategicApproach.title` as any)}
            description={t(`${key}.strategicApproach.description` as any)}
            highlights={t.raw(`${key}.strategicApproach.highlights` as any)}
          />
          <WhoIsThisFor
            title={t(`${key}.whoIsThisFor.title` as any)}
            subtitle={t(`${key}.whoIsThisFor.subtitle` as any)}
            suitable={t.raw(`${key}.whoIsThisFor.suitable` as any)}
            notSuitable={t.raw(`${key}.whoIsThisFor.notSuitable` as any)}
            ctaText={t(`${key}.whoIsThisFor.ctaText` as any)}
          />
        </>
      ) : (
        <ServiceHero
          serviceName={t(`${key}.name` as any)}
          serviceDescription={t(`${key}.description` as any)}
        />
      )}

      {/* Process timeline */}
      <ProcessTimeline steps={service.processSteps} />

      {/* Glossary and FAQ - only for services with custom layout */}
      {hasCustomLayout && (
        <>
          <Glossary
            title={t(`${key}.glossary.title` as any)}
            subtitle={t(`${key}.glossary.subtitle` as any)}
            terms={t.raw(`${key}.glossary.terms` as any)}
          />
          <FAQ
            title={t(`${key}.faq.title` as any)}
            subtitle={t(`${key}.faq.subtitle` as any)}
            items={t.raw(`${key}.faq.items` as any)}
            ctaButton={t(`${key}.faq.ctaButton` as any)}
          />
        </>
      )}

      {/* Related portfolio */}
      <RelatedPortfolioSection portfolios={relatedPortfolio} />

      {/* CTA - only for services without custom layout */}
      {!hasCustomLayout && (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <ScrollReveal animation="scaleIn">
              <GlassCard className="p-10">
                <h2 className="text-display-md font-display font-bold text-text-primary mb-4">
                  Bu xidməti sifariş et
                </h2>
                <p className="text-text-secondary mb-8">
                  {t(`${key}.shortDesc` as any)} xidməti üçün bizimlə əlaqə saxlayın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href={`/${locale}/contact`} size="lg" icon={<ArrowRight size={18} />}>
                    Əlaqə
                  </Button>
                  <Button
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'}`}
                  variant="whatsapp"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<MessageCircle size={18} />}
                >
                  WhatsApp
                </Button>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
      )}
    </>
  )
}
