import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CtaSection } from '@/components/sections/CtaSection'
import { getAllServices } from '@/lib/data/services'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'services' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale)
  const services = await getAllServices()
  return <ServicesContent services={services} locale={params.locale} />
}

function ServicesContent({ services, locale: _locale }: { services: Awaited<ReturnType<typeof getAllServices>>; locale: string }) {
  const t = useTranslations('services')
  const tCommon = useTranslations('common.cta')
  const locale = useLocale()

  const iconMap: Record<string, string> = {
    TrendingUp: '📈', Tv: '📺', Share2: '🔗', Palette: '🎨',
    Camera: '📷', Award: '🏆', FileText: '📝', Code: '💻',
  }

  return (
    <>
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeInUp" className="text-center mb-16">
            <h1 className="text-display-lg font-display font-bold text-text-primary mb-4">
              {t('title')}
            </h1>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={service.id} animation="fadeInUp" delay={index * 80}>
                <Link href={`/${locale}/services/${service.slug}`}>
                  <GlassCard className="p-6 h-full flex flex-col group">
                    <div className="w-14 h-14 rounded-xl bg-accent-primary/10 flex items-center justify-center mb-4 text-3xl group-hover:bg-accent-primary/20 transition-colors">
                      {iconMap[service.icon] ?? '⚡'}
                    </div>
                    <h2 className="text-text-primary font-semibold text-lg mb-2 group-hover:text-accent-primary transition-colors">
                      {t(`${service.slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())}.name` as any)}
                    </h2>
                    <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                      {t(`${service.slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())}.shortDesc` as any)}
                    </p>
                    <div className="flex items-center gap-2 text-accent-primary text-sm font-medium group-hover:gap-3 transition-all">
                      <span>{tCommon('learnMore')}</span>
                      <ArrowRight size={14} />
                    </div>
                  </GlassCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  )
}
