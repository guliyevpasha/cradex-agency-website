'use client'
import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PortfolioFilter, type PortfolioCategory } from '@/components/portfolio/PortfolioFilter'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'
import { getAllPortfolio } from '@/lib/data/portfolio'
import type { PortfolioItem } from '@/types'

export default function PortfolioPage() {
  return <PortfolioContent />
}

function PortfolioContent() {
  const t = useTranslations('portfolio')
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all')
  const [allItems, setAllItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(9) // Start with 9 for mobile, 15 for desktop

  useEffect(() => {
    getAllPortfolio().then((items) => {
      setAllItems(items)
      setLoading(false)
    })
  }, [])

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(9)
  }, [activeCategory])

  // Count items per category
  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const item of allItems) {
      result[item.serviceCategory] = (result[item.serviceCategory] ?? 0) + 1
    }
    return result
  }, [allItems])

  // Filter items
  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? allItems
        : allItems.filter((item) => item.serviceCategory === activeCategory),
    [allItems, activeCategory]
  )

  // Display items (limited by displayCount)
  const displayedItems = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount])
  const hasMore = displayedItems.length < filtered.length

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 9) // Load 9 more items each time
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeInUp" className="text-center mb-12">
            <h1 className="text-display-lg font-display font-bold text-text-primary mb-4">
              {t('title')}
            </h1>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </ScrollReveal>

          {/* Filter tabs */}
          {!loading && (
            <div>
              <PortfolioFilter
                active={activeCategory}
                onChange={setActiveCategory}
                counts={counts}
              />
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-bg-secondary animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <PortfolioGrid items={displayedItems} />
              
              {/* Load More Button - Show when there are more items */}
              {hasMore && (
                <div className="mt-12 flex justify-center">
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
            </>
          )}
        </div>
      </section>
    </>
  )
}
