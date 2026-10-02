'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import type { Article } from '@/types'
import { format } from 'date-fns'
import { az, enUS, ru, tr } from 'date-fns/locale'

interface BlogPreviewProps {
  articles: Article[]
}

const localeMap = {
  az,
  en: enUS,
  ru,
  tr,
}

export function BlogPreview({ articles }: BlogPreviewProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const t = useTranslations('home.blog')
  const locale = useLocale() as 'az' | 'en' | 'ru' | 'tr'

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Show only first 3 articles
  const displayArticles = articles.slice(0, 3)

  if (displayArticles.length === 0) return null

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-bg-primary relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 30% 50%, rgba(108,99,255,0.2) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 50%, rgba(151,71,255,0.15) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-text-primary">{t('title')} </span>
            <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
              {t('titleAccent')}
            </span>
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/${locale}/journal/${article.slug}`}
                className="group block h-full"
              >
                <article className="h-full flex flex-col rounded-2xl overflow-hidden bg-bg-tertiary/30 border border-border/20 hover:border-accent-primary/40 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-accent-primary/20 via-bg-secondary to-accent-secondary/20">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-bg-tertiary/50 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-text-tertiary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-6 bg-bg-secondary/80">
                    {/* Title */}
                    <h3 className="text-xl font-display font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-accent-primary transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    {article.excerpt && (
                      <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-text-tertiary mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {format(new Date(article.publishedAt), 'dd.MM.yyyy', {
                          locale: localeMap[locale],
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {t('readingTime', { minutes: article.readingTime })}
                      </span>
                    </div>

                    {/* Read more link */}
                    <div className="flex items-center gap-2 text-sm font-medium text-accent-primary group-hover:gap-3 transition-all duration-200">
                      {t('readMore')}
                      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href={`/${locale}/journal`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] text-white font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all duration-300 hover:scale-105"
          >
            {t('viewAll')}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
