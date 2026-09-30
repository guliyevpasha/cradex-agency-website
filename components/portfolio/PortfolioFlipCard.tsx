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

  // Sanitize slug for URL (handle cases where Sanity slug has spaces)
  const sanitizedSlug = item.slug
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

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
        href={`/${locale}/portfolio/${sanitizedSlug}`}
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
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] border border-white/5">
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
              {/* Top Section */}
              <div className="space-y-3">
                {/* Title - "[Client] üçün həyata keçirilən [service] xidməti" */}
                <h3 className="text-white font-display font-bold text-lg md:text-xl leading-tight">
                  {item.clientName} {t('deliveredFor')} {t(`categories.${item.serviceCategory}` as any)} {t('serviceText')}
                </h3>

                {/* Description - Short project info (2-3 lines) */}
                {description && (
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                    {description}
                  </p>
                )}
              </div>

              {/* Bottom Section - Meta & Button */}
              <div className="space-y-3">
                {/* Meta Row - Client name & Year */}
                <div className="flex items-center gap-4 text-white/50 text-sm">
                  <span className="font-medium text-white/70">{item.clientName}</span>
                  {year && (
                    <>
                      <span>•</span>
                      <span>{year}</span>
                    </>
                  )}
                </div>

                {/* Button Row */}
                <div className="flex items-center justify-between gap-4">
                  {/* Category Badge */}
                  <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-white/80 text-xs font-medium">
                      {t(`categories.${item.serviceCategory}` as any)}
                    </span>
                  </div>

                  {/* View Project Button */}
                  <div className="inline-flex items-center gap-2 text-white font-medium text-sm group-hover:text-accent-primary transition-colors">
                    <span>{t('viewProject')}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
