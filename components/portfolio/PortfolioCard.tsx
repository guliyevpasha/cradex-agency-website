'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Building2 } from 'lucide-react'
import type { PortfolioItem } from '@/types'

interface PortfolioCardProps {
  item: PortfolioItem
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const locale = useLocale()
  const t = useTranslations('portfolio')

  const title = item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey
  const description = item.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.descriptionKey
  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

  return (
    <Link
      href={`/${locale}/portfolio/${item.slug}`}
      className="group relative block w-full rounded-2xl overflow-hidden bg-bg-tertiary border-2 border-transparent hover:border-accent-primary/60 transition-all duration-300"
      style={{ aspectRatio: '4 / 3' }}
    >
      {/* ── Cover image ─────────────────────────────────────────── */}
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

      {/* ── Hover Overlay — Markup.az style ───────────────────────── */}
      <div className="absolute inset-0 bg-bg-primary/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 md:p-8 text-center">
        {/* Category */}
        <span className="text-accent-primary text-xs font-semibold uppercase tracking-wider mb-3">
          {t(`categories.${item.serviceCategory}` as any)}
        </span>

        {/* Title */}
        <h3 className="text-white font-display font-bold text-lg md:text-2xl leading-tight mb-3 line-clamp-3 max-w-md">
          {title}
        </h3>

        {/* Client & Year */}
        <div className="flex items-center gap-3 text-white/70 text-sm mb-4">
          <span className="flex items-center gap-1.5">
            <Building2 size={14} />
            {item.clientName}
          </span>
          {year && (
            <>
              <span>•</span>
              <span>{year}</span>
            </>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2 max-w-md mb-6">
            {description}
          </p>
        )}

        {/* Arrow Icon in Circle */}
        <div className="w-12 h-12 rounded-full border-2 border-accent-primary flex items-center justify-center">
          <ArrowRight size={20} className="text-accent-primary" />
        </div>
      </div>
    </Link>
  )
}
