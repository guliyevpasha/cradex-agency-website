'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Building2, CalendarDays, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PortfolioItem } from '@/types'

interface PortfolioCardProps {
  item: PortfolioItem
}

// Category colour mapping — matches Cradex brand palette
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  smm:                   { bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'border-purple-500/30' },
  branding:              { bg: 'bg-pink-500/15',    text: 'text-pink-400',    border: 'border-pink-500/30' },
  'graphic-motion-design': { bg: 'bg-cyan-500/15',  text: 'text-cyan-400',    border: 'border-cyan-500/30' },
  'digital-marketing':   { bg: 'bg-green-500/15',   text: 'text-green-400',   border: 'border-green-500/30' },
  'web-mobile-dev':      { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  'photo-video':         { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30' },
  copywriting:           { bg: 'bg-yellow-500/15',  text: 'text-yellow-400',  border: 'border-yellow-500/30' },
  'traditional-marketing': { bg: 'bg-red-500/15',   text: 'text-red-400',     border: 'border-red-500/30' },
}

const DEFAULT_COLOR = { bg: 'bg-accent-primary/15', text: 'text-accent-primary', border: 'border-accent-primary/30' }

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [flipped, setFlipped] = useState(false)
  const locale = useLocale()
  const t = useTranslations('portfolio')

  const title = item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey
  const description = item.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.descriptionKey
  const catColor = CATEGORY_COLORS[item.serviceCategory] ?? DEFAULT_COLOR
  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

  return (
    <div
      className="group relative w-full"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      {/* ── Card wrapper — flips on hover ───────────────────────────── */}
      <div
        className="relative w-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          /* 800×600 ratio = 4:3 */
          aspectRatio: '4 / 3',
        }}
      >
        {/* ────────────────── FRONT ────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Cover image — 800×600 equivalent in 4:3 aspect */}
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
              <span className="text-6xl opacity-30">🖼️</span>
            </div>
          )}

          {/* Gradient scrim — bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Featured badge */}
          {item.featured && (
            <div className="absolute top-4 right-4 z-10">
              <span className="text-xs bg-accent-primary text-white px-3 py-1.5 rounded-full font-semibold shadow-lg shadow-accent-primary/30">
                Featured
              </span>
            </div>
          )}

          {/* Category pill — top left */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm',
                catColor.bg, catColor.text, catColor.border
              )}
            >
              <Tag size={10} />
              {t(`categories.${item.serviceCategory}` as any)}
            </span>
          </div>

          {/* Client name — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="text-white font-display font-bold text-lg leading-snug drop-shadow-lg line-clamp-2">
              {title}
            </p>
            <p className="text-white/60 text-sm mt-1 flex items-center gap-1.5">
              <Building2 size={12} />
              {item.clientName}
            </p>
          </div>
        </div>

        {/* ────────────────── BACK ────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #111118 0%, #1A1A28 60%, #0d0d18 100%)',
            border: '1px solid rgba(108,99,255,0.25)',
            boxShadow: '0 0 40px rgba(108,99,255,0.12)',
          }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-accent-primary via-purple-400 to-red-400 shrink-0" />

          <div className="flex flex-col flex-1 p-6 gap-4 overflow-hidden">
            {/* Category badge */}
            <span
              className={cn(
                'self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
                catColor.bg, catColor.text, catColor.border
              )}
            >
              <Tag size={10} />
              {t(`categories.${item.serviceCategory}` as any)}
            </span>

            {/* Title */}
            <h3 className="text-white font-display font-bold text-xl leading-snug line-clamp-3">
              {title}
            </h3>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-text-secondary text-xs">
              <span className="flex items-center gap-1.5">
                <Building2 size={12} className={catColor.text} />
                {item.clientName}
              </span>
              {year && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={12} className={catColor.text} />
                  {year}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-text-secondary/80 text-sm leading-relaxed line-clamp-4 flex-1">
                {description}
              </p>
            )}

            {/* Tools */}
            {item.tools && item.tools.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tools.slice(0, 4).map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.05] text-text-secondary border border-white/[0.08]"
                  >
                    {tool}
                  </span>
                ))}
                {item.tools.length > 4 && (
                  <span className="text-xs px-2 py-1 text-text-muted">
                    +{item.tools.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* CTA button — bottom */}
          <Link
            href={`/${locale}/portfolio/${item.slug}`}
            className={cn(
              'flex items-center justify-between px-6 py-4 shrink-0',
              'bg-accent-primary/10 hover:bg-accent-primary/20 border-t border-accent-primary/20',
              'text-accent-primary font-semibold text-sm transition-all duration-300 group/cta'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <span>{t('viewProject')}</span>
            <ArrowRight
              size={16}
              className="group-hover/cta:translate-x-1.5 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
