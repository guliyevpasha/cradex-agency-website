import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getFeaturedPortfolio } from '@/lib/data/portfolio'

export async function PortfolioPreview() {
  const featured = await getFeaturedPortfolio(6)

  return (
    <PortfolioPreviewClient items={featured} />
  )
}

// Client-renderable inner component
import type { PortfolioItem } from '@/types'

function PortfolioPreviewClient({ items }: { items: PortfolioItem[] }) {
  const t = useTranslations('home.portfolio')
  const tPortfolio = useTranslations('portfolio')
  const tCommon = useTranslations('common.cta')
  const locale = useLocale()

  return (
    <section className="py-20 bg-bg-secondary/50 relative">
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
        <ScrollReveal animation="fadeInUp" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-display-lg font-display font-bold text-text-primary mb-3">
              {t('title')}
            </h2>
            <p className="text-text-secondary">{t('subtitle')}</p>
          </div>
          <div className="shrink-0">
            <Button href={`/${locale}/portfolio`} variant="ghost" icon={<ArrowRight size={16} />}>
              {tPortfolio('viewProject')}
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ScrollReveal key={item.id} animation="scaleIn" delay={index * 100}>
              <Link
                href={`/${locale}/portfolio/${item.slug}`}
                className="group block relative overflow-hidden rounded-2xl aspect-[4/3] bg-bg-tertiary"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                  <span className="text-6xl opacity-30">🖼️</span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6">
                  <Badge variant="accent">{item.serviceCategory}</Badge>
                  <h3 className="text-text-primary font-semibold text-center text-lg">
                    {item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey}
                  </h3>
                  <p className="text-text-secondary text-sm text-center">{item.clientName}</p>
                  <div className="flex items-center gap-2 text-accent-primary text-sm font-medium mt-2">
                    <span>{tPortfolio('viewProject')}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fadeInUp" className="text-center mt-12">
          <Button href={`/${locale}/portfolio`} variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
            {tCommon('viewAll')}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
