'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { PortfolioMarquee } from './PortfolioMarquee'
import type { PortfolioItem } from '@/types'

export default function PortfolioPreviewClient({ items }: { items: PortfolioItem[] }) {
  const t = useTranslations('home.portfolio')
  const tCommon = useTranslations('common.cta')
  const locale = useLocale()

  return (
    <section className="py-20 bg-bg-secondary/50 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fadeInUp" className="mb-12 text-center">
          <h2 className="text-display-lg font-display font-bold text-text-primary mb-3">
            {t('title')}
          </h2>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </ScrollReveal>
      </div>

      {/* Portfolio Marquee - Two rows with opposite scrolling - Full width on mobile, contained on desktop */}
      <div className="mb-12">
        <PortfolioMarquee items={items} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fadeInUp" className="text-center">
          <Button href={`/${locale}/portfolio`} variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
            {tCommon('viewAll')}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
