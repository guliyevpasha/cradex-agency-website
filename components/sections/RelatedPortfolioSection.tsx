'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { PortfolioItem } from '@/types'

interface RelatedPortfolioSectionProps {
  portfolios: PortfolioItem[]
}

export function RelatedPortfolioSection({ portfolios }: RelatedPortfolioSectionProps) {
  const t = useTranslations('services')
  const locale = useLocale() as 'az' | 'en' | 'ru' | 'tr'
  const [displayCount, setDisplayCount] = useState(6)

  const displayedPortfolios = portfolios.slice(0, displayCount)
  const hasMore = displayCount < portfolios.length

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6)
  }

  if (portfolios.length === 0) return null

  return (
    <section className="py-16 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fadeInUp" className="text-center mb-12">
          <h2 className="text-display-md font-display font-bold text-text-primary">
            {t('relatedWork')}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedPortfolios.map((project, index) => {
            const projectTitle = project.title?.[locale] || project.titleKey
            const projectDescription = project.description?.[locale] || project.descriptionKey

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

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold hover:shadow-xl hover:shadow-accent-primary/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span>{t('loadMore')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
