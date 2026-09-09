'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { imageZoom } from '@/lib/animations/variants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import type { PortfolioItem } from '@/types'

export default function PortfolioPreviewClient({ items }: { items: PortfolioItem[] }) {
  const t = useTranslations('home.portfolio')
  const tPortfolio = useTranslations('portfolio')
  const tCommon = useTranslations('common.cta')
  const locale = useLocale()
  const prefersReducedMotion = useReducedMotion()

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
        {/* One link to the portfolio per section, not two: the "view all"
            button below the grid already goes there. */}
        <ScrollReveal animation="fadeInUp" className="mb-12">
          <h2 className="text-display-lg font-display font-bold text-text-primary mb-3">
            {t('title')}
          </h2>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ScrollReveal key={item.id} animation="scaleIn" delay={index * 100}>
              <Link
                href={`/${locale}/portfolio/${item.slug}`}
                className="group"
              >
                <motion.div
                  className="block relative overflow-hidden rounded-2xl aspect-[4/3] bg-bg-tertiary"
                  variants={prefersReducedMotion ? undefined : imageZoom}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    transformOrigin: 'center',
                    willChange: 'transform',
                  }}
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
                </motion.div>
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
