'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ArrowRight } from 'lucide-react'
import type { PortfolioItem } from '@/types'
import { cn } from '@/lib/utils'

interface PortfolioShowcaseProps {
  portfolios: PortfolioItem[]
}

// Industry categories for filtering
const CATEGORIES = [
  { id: 'all', labelKey: 'all' },
  { id: 'medical', labelKey: 'medical' },
  { id: 'automotive', labelKey: 'automotive' },
  { id: 'realestate', labelKey: 'realestate' },
  { id: 'beauty', labelKey: 'beauty' },
  { id: 'law', labelKey: 'law' },
  { id: 'education', labelKey: 'education' },
  { id: 'other', labelKey: 'other' },
] as const

// Helper function to determine industry from portfolio data
function getPortfolioIndustry(portfolio: PortfolioItem): string {
  const clientName = portfolio.clientName?.toLowerCase() || ''
  const title = portfolio.titleKey?.toLowerCase() || ''
  const description = portfolio.descriptionKey?.toLowerCase() || ''
  
  // Medical/Health keywords
  if (
    clientName.includes('klinika') ||
    clientName.includes('clinic') ||
    clientName.includes('tibb') ||
    clientName.includes('medical') ||
    clientName.includes('sağlamlıq') ||
    clientName.includes('health') ||
    title.includes('diş') ||
    title.includes('dental') ||
    description.includes('xəstəxana')
  ) {
    return 'medical'
  }
  
  // Automotive keywords
  if (
    clientName.includes('avto') ||
    clientName.includes('auto') ||
    clientName.includes('car') ||
    title.includes('maşın') ||
    description.includes('nəqliyyat')
  ) {
    return 'automotive'
  }
  
  // Real Estate keywords
  if (
    clientName.includes('daşınmaz') ||
    clientName.includes('estate') ||
    clientName.includes('property') ||
    title.includes('mənzil') ||
    title.includes('apartment') ||
    description.includes('tikinti')
  ) {
    return 'realestate'
  }
  
  // Beauty/Cosmetics keywords
  if (
    clientName.includes('gözəllik') ||
    clientName.includes('beauty') ||
    clientName.includes('salon') ||
    clientName.includes('kosmetik') ||
    title.includes('bərber') ||
    title.includes('spa')
  ) {
    return 'beauty'
  }
  
  // Law/Consulting keywords
  if (
    clientName.includes('hüquq') ||
    clientName.includes('law') ||
    clientName.includes('konsalt') ||
    clientName.includes('consult') ||
    title.includes('vəkil') ||
    title.includes('lawyer')
  ) {
    return 'law'
  }
  
  // Education keywords
  if (
    clientName.includes('təhsil') ||
    clientName.includes('education') ||
    clientName.includes('məktəb') ||
    clientName.includes('school') ||
    clientName.includes('universitet') ||
    title.includes('kurs')
  ) {
    return 'education'
  }
  
  return 'other'
}

export function PortfolioShowcase({ portfolios }: PortfolioShowcaseProps) {
  const t = useTranslations('services.webMobileDev.portfolioShowcase')
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState('all')

  // Filter portfolios by category
  const filteredPortfolios = activeCategory === 'all' 
    ? portfolios 
    : portfolios.filter(p => getPortfolioIndustry(p) === activeCategory)

  // Limit to 12 items for initial display
  const displayedPortfolios = filteredPortfolios.slice(0, 12)

  return (
    <section className="py-20 bg-bg-secondary/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-accent-primary uppercase mb-3">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        {/* Category Filter Tabs */}
        <ScrollReveal animation="fadeInUp" delay={100}>
          <div className="mb-12">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-2 mx-auto">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap',
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/30'
                        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/70 hover:text-text-primary'
                    )}
                  >
                    {t(`categories.${category.labelKey}` as any)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedPortfolios.map((portfolio, index) => {
            const title = portfolio.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] || portfolio.titleKey
            const industry = getPortfolioIndustry(portfolio)
            const industryLabel = t(`categories.${industry}` as any)
            
            // Sanitize slug
            const sanitizedSlug = portfolio.slug
              .toLowerCase()
              .trim()
              .replace(/[\s_]+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '')

            return (
              <ScrollReveal 
                key={portfolio.id} 
                animation="scaleIn" 
                delay={index * 50}
              >
                <Link
                  href={`/${locale}/portfolio/${sanitizedSlug}`}
                  className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-tertiary shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Portfolio Image */}
                  {portfolio.coverImage ? (
                    <Image
                      src={portfolio.coverImage}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                      <span className="text-6xl opacity-20">🌐</span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {/* Industry Badge */}
                      <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                        <span className="text-white text-xs font-medium">
                          {industryLabel}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {portfolio.clientName}
                      </h3>

                      {/* View Details Link */}
                      <div className="flex items-center gap-2 text-white font-medium text-sm">
                        <span>{t('viewDetails')}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <ArrowRight size={20} className="text-white" />
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Show message if no portfolios found */}
        {displayedPortfolios.length === 0 && (
          <ScrollReveal animation="fadeInUp">
            <div className="text-center py-12">
              <p className="text-text-muted text-lg">
                {t('noPortfolios') || 'Bu kateqoriyada hələ portfolio yoxdur.'}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Load More / View All CTA */}
        {filteredPortfolios.length > 12 && (
          <ScrollReveal animation="fadeInUp">
            <div className="text-center">
              <Link
                href={`/${locale}/portfolio`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-accent-primary/30 transition-all duration-300 hover:scale-105"
              >
                <span>{t('viewAllPortfolios') || 'Bütün portfoliolara bax'}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
