'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ArticleGrid } from '@/components/journal/ArticleGrid'
import { CategoryFilter } from '@/components/journal/CategoryFilter'
import { Pagination } from '@/components/journal/Pagination'
import { getPaginatedArticles } from '@/lib/data/journal'
import type { Article, ArticleCategory } from '@/types'

export default function JournalPage() {
  return <JournalContent />
}

function JournalContent() {
  const t = useTranslations('journal')
  const [category, setCategory] = useState<ArticleCategory | 'all'>('all')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{
    articles: Article[]
    total: number
    totalPages: number
  }>({ articles: [], total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPaginatedArticles(page, 9, category === 'all' ? undefined : category)
      .then(setData)
      .finally(() => setLoading(false))
  }, [page, category])

  function handleCategoryChange(newCategory: ArticleCategory | 'all') {
    setCategory(newCategory)
    setPage(1)
  }

  return (
    <>
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeInUp" className="text-center mb-12">
            <h1 className="text-display-lg font-display font-bold text-text-primary mb-4">
              {t('title')}
            </h1>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
          </ScrollReveal>

          <div className="flex justify-center mb-12">
            <CategoryFilter active={category} onChange={handleCategoryChange} />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-bg-secondary animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <ArticleGrid articles={data.articles} />
              {data.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
