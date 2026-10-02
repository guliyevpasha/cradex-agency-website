import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { getAllServicesSync } from '@/lib/data/services'

export function ServicesOverview() {
  const t = useTranslations('home.services')
  const tServices = useTranslations('services')
  const tCommon = useTranslations('common.cta')
  const locale = useLocale()
  const services = getAllServicesSync()

  return (
    <section id="services" className="py-20 relative overflow-hidden scroll-mt-20">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold text-text-primary mb-4">
            {t('title')}
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ScrollReveal
              key={service.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <Link href={`/${locale}/services/${service.slug}`}>
                <GlassCard className="p-6 h-full flex flex-col group">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 ring-1 ring-inset ring-accent-primary/15 text-accent-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-accent-primary/20 group-hover:ring-accent-primary/30">
                    <ServiceIcon name={service.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-text-primary font-semibold text-lg mb-2 group-hover:text-accent-primary transition-colors">
                    {tServices(`${service.slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())}.name` as any)}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                    {tServices(`${service.slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())}.shortDesc` as any)}
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
  )
}
