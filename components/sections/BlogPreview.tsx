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
                <article className="h-full flex flex-col rounded-2xl overflow-hidden bg-bg-tertiary/30 backdrop-blur-sm border border-white/5 hover:border-accent-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent-primary/10">
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 overflow-hidden">
                    {((article as any).image || (article as any).coverImage) ? (
                      <Image
                        src={(article as any).image || (article as any).coverImage}
                        alt={(article as any).title || (article as any).titleKey || 'Article'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
                        📰
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 bg-bg-secondary/80">
                    {/* Category badge */}
                    {article.category && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                          {article.category.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Title - use both title and titleKey for compatibility */}
                    <h3 className="text-text-primary font-semibold text-lg leading-snug mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                      {(article as any).title || (article as any).titleKey || 'Untitled'}
                    </h3>

                    {/* Excerpt - use both excerpt and excerptKey for compatibility */}
                    <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {(article as any).excerpt || (article as any).excerptKey || ''}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-text-muted border-t border-white/10 pt-3 mt-auto">
                      <div className="flex items-center gap-1.5">
                        {article.author && (
                          <>
                            <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center text-xs font-semibold text-accent-primary">
                              {typeof article.author === 'string' 
                                ? article.author.charAt(0) 
                                : (article.author as any).name?.charAt(0) || 'A'}
                            </div>
                            <span>
                              {typeof article.author === 'string' 
                                ? article.author 
                                : (article.author as any).name || 'Anonymous'}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {((article as any).readingTime || (article as any).readingTimeMinutes) && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {(article as any).readingTime || (article as any).readingTimeMinutes} {locale === 'az' ? 'dəq' : locale === 'en' ? 'min' : locale === 'ru' ? 'мин' : 'dk'}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(article.publishedAt), 'dd.MM.yyyy', {
                            locale: localeMap[locale],
                          })}
                        </span>
                      </div>
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
