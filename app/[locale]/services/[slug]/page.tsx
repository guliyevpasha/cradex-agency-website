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
  
  // Special layout for digital-marketing and smm
  const isDigitalMarketing = service.slug === 'digital-marketing'
  const isSMM = service.slug === 'smm'
  const hasCustomLayout = isDigitalMarketing || isSMM

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
      {relatedPortfolio.length > 0 && (
        <section className="py-16 bg-bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="text-center mb-12">
              <h2 className="text-display-md font-display font-bold text-text-primary">
                {t('relatedWork')}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPortfolio.slice(0, 3).map((project, index) => {
                const projectTitle = project.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] || project.titleKey
                const projectDescription = project.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] || project.descriptionKey
                
                // Sanitize slug
                const sanitizedSlug = project.slug
                  .toLowerCase()
                  .trim()
                  .replace(/[\s_]+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/-+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                return (
                  <ScrollReveal key={project.id} animation="fadeInUp" delay={index * 100}>
                    <Link 
                      href={`/${locale}/portfolio/${sanitizedSlug}`}
                      className="group flex flex-col h-full bg-bg-secondary rounded-2xl overflow-hidden border border-white/5 hover:border-accent-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-primary/10"
                    >
                      <div className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden flex-shrink-0">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage}
                            alt={projectTitle}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                            <span className="text-6xl opacity-20">🖼️</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-white/5 border border-white/10 mb-3 w-fit">
                          <span className="text-white/80 text-xs font-medium">
                            {project.serviceCategory?.toUpperCase() || 'SMM'}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                          {projectTitle}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2 flex-grow">
                          {projectDescription}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

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
