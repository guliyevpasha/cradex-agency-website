import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { getAllServices, getServiceBySlug } from '@/lib/data/services'
import { getPortfolioByCategory } from '@/lib/data/portfolio'
import { ServiceHero } from '@/components/sections/ServiceHero'
import { DigitalMarketingHero } from '@/components/sections/DigitalMarketingHero'
import { PlatformsSection } from '@/components/sections/PlatformsSection'
import { AuditStrategySection } from '@/components/sections/AuditStrategySection'
import { ProcessTimeline } from '@/components/sections/ProcessTimeline'
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
  
  // Special layout for digital-marketing
  const isDigitalMarketing = service.slug === 'digital-marketing'

  return (
    <>
      {isDigitalMarketing ? (
        <>
          <DigitalMarketingHero
            title={t(`${key}.name` as any)}
            description={t(`${key}.heroDescription` as any)}
            ctaStart={t(`${key}.ctaStart` as any)}
            ctaProcess={t(`${key}.ctaProcess` as any)}
            locale={locale}
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
        </>
      ) : (
        <ServiceHero
          serviceName={t(`${key}.name` as any)}
          serviceDescription={t(`${key}.description` as any)}
        />
      )}

      {/* Benefits */}
      <section className="py-16 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-display-md font-display font-bold text-text-primary">
              {t('benefits')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((benefit, index) => (
              <ScrollReveal key={index} animation="scaleIn" delay={index * 100}>
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl">
                    ✨
                  </div>
                  <h3 className="text-text-primary font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-text-muted text-sm">{benefit.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <ProcessTimeline steps={service.processSteps} />

      {/* Related portfolio */}
      {relatedPortfolio.length > 0 && (
        <section className="py-16 bg-bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="text-center mb-12">
              <h2 className="text-display-md font-display font-bold text-text-primary">
                {t('relatedWork')}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPortfolio.slice(0, 3).map((item, index) => (
                <ScrollReveal key={item.id} animation="fadeInUp" delay={index * 100}>
                  <GlassCard className="p-6">
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center mb-4 text-4xl">
                      🖼️
                    </div>
                    <h3 className="text-text-primary font-semibold mb-1">{item.titleKey}</h3>
                    <p className="text-text-muted text-sm">{item.clientName}</p>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
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
    </>
  )
}
