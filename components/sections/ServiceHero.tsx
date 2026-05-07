import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

interface ServiceHeroProps {
  serviceName: string
  serviceDescription: string
}

export function ServiceHero({ serviceName, serviceDescription }: ServiceHeroProps) {
  const tNav = useTranslations('common.nav')
  const locale = useLocale()

  return (
    <section className="pt-32 pb-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href={`/${locale}`} className="hover:text-text-primary transition-colors">
            {tNav('home')}
          </Link>
          <ChevronRight size={14} />
          <Link href={`/${locale}/services`} className="hover:text-text-primary transition-colors">
            {tNav('services')}
          </Link>
          <ChevronRight size={14} />
          <span className="text-text-secondary">{serviceName}</span>
        </nav>

        <ScrollReveal animation="fadeInUp">
          <h1 className="text-display-lg font-display font-bold text-text-primary mb-4">
            {serviceName}
          </h1>
          <p className="text-text-secondary text-xl max-w-2xl leading-relaxed">
            {serviceDescription}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
