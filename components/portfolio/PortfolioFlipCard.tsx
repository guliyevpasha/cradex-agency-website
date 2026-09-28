'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Building2, Calendar, Tag } from 'lucide-react'
import type { PortfolioItem } from '@/types'
import { cn } from '@/lib/utils'

interface PortfolioFlipCardProps {
  item: PortfolioItem
  className?: string
}

export function PortfolioFlipCard({ item, className }: PortfolioFlipCardProps) {
  const locale = useLocale()
  const t = useTranslations('portfolio')
  const [isFlipped, setIsFlipped] = useState(false)

  const title = item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey
  const description = item.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.descriptionKey
  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

  return (
    <div
      className={cn(
        'group relative w-full h-full',
        '[perspective:1000px]',
        className
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <Link
        href={`/${locale}/portfolio/${item.slug}`}
        className="block w-full h-full"
        style={{ aspectRatio: '4 / 3' }}
      >
        <div
          className={cn(
            'relative w-full h-full',
            'transition-transform duration-700',
            '[transform-style:preserve-3d]',
            isFlipped && '[transform:rotateY(180deg)]'
          )}
        >
          {/* ── FRONT SIDE ─────────────────────────────────────────── */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden bg-bg-tertiary border-2 border-white/5">
            {item.coverImage ? (
              <Image
                src={item.coverImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <span className="text-6xl opacity-20">🖼️</span>
              </div>
            )}

            {/* Gradient overlay on front */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* ── BACK SIDE ─────────────────────────────────────────── */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary border-2 border-accent-primary/30">
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between overflow-y-auto">
              {/* Top Section */}
              <div className="space-y-2.5">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20">
                  <Tag size={12} className="text-accent-primary" />
                  <span className="text-accent-primary text-xs font-semibold uppercase tracking-wider">
                    {t(`categories.${item.serviceCategory}` as any)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-display font-bold text-lg md:text-xl leading-tight">
                  {title}
                </h3>

                {/* Description - FULL text without line-clamp */}
                {description && (
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Bottom Section - Meta Info */}
              <div className="space-y-2 flex-shrink-0">
                {/* Client & Year - Combined */}
                <div className="flex items-center gap-3 text-white text-sm flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-accent-primary/70" />
                    <span className="font-bold">{item.clientName}</span>
                  </div>
                  {year && (
                    <>
                      <span className="text-white/40">•</span>
                      <div className="flex items-center gap-1.5 text-white/80">
                        <Calendar size={14} className="text-accent-primary/70" />
                        <span>{year}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* View Project Button */}
                <div className="flex items-center gap-2 text-accent-primary font-semibold text-sm">
                  <span>{t('viewProject')}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-bl-[100%] pointer-events-none" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
