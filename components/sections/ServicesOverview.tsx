import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { getAllServicesSync } from '@/lib/data/services'

export function ServicesOverview() {
  const t = useTranslations('home.services')
  const tServices = useTranslations('services')
  const tCommon = useTranslations('common.cta')
  const locale = useLocale()
  const services = getAllServicesSync()

  return (
    <section className="py-20 relative">
      {/* Diagonal grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, currentColor 1px, transparent 1px),
            linear-gradient(-45deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent-primary/20 transition-colors">
                    <span className="text-accent-primary text-2xl">
                      {service.icon === 'TrendingUp' && '📈'}
                      {service.icon === 'Tv' && '📺'}
                      {service.icon === 'Share2' && '🔗'}
                      {service.icon === 'Palette' && '🎨'}
                      {service.icon === 'Camera' && '📷'}
                      {service.icon === 'Award' && '🏆'}
                      {service.icon === 'FileText' && '📝'}
                      {service.icon === 'Code' && '💻'}
                    </span>
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
