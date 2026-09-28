'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Building2, CalendarDays, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PortfolioItem } from '@/types'

interface PortfolioCardProps {
  item: PortfolioItem
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  smm:                     { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/30' },
  branding:                { bg: 'bg-pink-500/20',    text: 'text-pink-300',    border: 'border-pink-500/30' },
  'graphic-motion-design': { bg: 'bg-cyan-500/20',    text: 'text-cyan-300',    border: 'border-cyan-500/30' },
  'digital-marketing':     { bg: 'bg-green-500/20',   text: 'text-green-300',   border: 'border-green-500/30' },
  'web-mobile-dev':        { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/30' },
  'photo-video':           { bg: 'bg-orange-500/20',  text: 'text-orange-300',  border: 'border-orange-500/30' },
  copywriting:             { bg: 'bg-yellow-500/20',  text: 'text-yellow-300',  border: 'border-yellow-500/30' },
  'traditional-marketing': { bg: 'bg-red-500/20',     text: 'text-red-300',     border: 'border-red-500/30' },
}

const DEFAULT_COLOR = {
  bg: 'bg-accent-primary/20',
  text: 'text-accent-primary',
  border: 'border-accent-primary/30',
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const locale = useLocale()
  const t = useTranslations('portfolio')

  const title = item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey
  const description = item.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.descriptionKey
  const catColor = CATEGORY_COLORS[item.serviceCategory] ?? DEFAULT_COLOR
  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

  return (
    <Link
      href={`/${locale}/portfolio/${item.slug}`}
      className="group relative block w-full rounded-2xl overflow-hidden bg-bg-tertiary border border-white/[0.07] hover:border-accent-primary/30 transition-colors duration-300"
      style={{ aspectRatio: '4 / 3' }}
    >
      {/* ── Cover image ─────────────────────────────────────────── */}
      {item.coverImage ? (
        <Image
          src={item.coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
          <span className="text-6xl opacity-20">🖼️</span>
        </div>
      )}

      {/* ── Hover overlay — slides up from bottom ───────────────── */}
      {/*
          Default: overlay is translateY(100%) — hidden below the card
          On hover: translateY(0) — fully visible
      */}
      <div
        className={cn(
          'absolute inset-0 z-20 flex flex-col justify-between p-6',
          'transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'translate-y-full group-hover:translate-y-0',
        )}
        style={{
          background: 'linear-gradient(160deg, rgba(10,10,20,0.97) 0%, rgba(17,17,30,0.97) 100%)',
        }}
      >
        {/* Top: category + title */}
        <div className="flex flex-col gap-3">
          <span
            className={cn(
              'self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
              catColor.bg, catColor.text, catColor.border
            )}
          >
            <Tag size={10} />
            {t(`categories.${item.serviceCategory}` as any)}
          </span>

          <h3 className="text-white font-display font-bold text-xl leading-snug line-clamp-3">
            {title}
          </h3>

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
        </div>

        {/* Middle: description */}
        {description && (
          <p className="text-text-secondary/80 text-sm leading-relaxed line-clamp-3 flex-1 mt-4">
            {description}
          </p>
        )}

        {/* Bottom: tools + CTA */}
        <div className="flex items-end justify-between gap-3 mt-4">
          {/* Tools */}
          {item.tools && item.tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.07] text-text-secondary border border-white/[0.08]"
                >
                  {tool}
                </span>
              ))}
              {item.tools.length > 3 && (
                <span className="text-xs px-2 py-1 text-text-muted">
                  +{item.tools.length - 3}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <span
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap',
              catColor.text,
              'group-hover:gap-2.5 transition-all duration-300'
            )}
          >
            {t('viewProject')}
            <ArrowRight size={15} />
          </span>
        </div>
      </div>

      {/* ── Bottom gradient + title — visible when NOT hovered ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-0">
        <p className="text-white font-display font-bold text-base leading-snug line-clamp-2 drop-shadow-lg">
          {title}
        </p>
        <p className="text-white/55 text-xs mt-1 flex items-center gap-1.5">
          <Building2 size={11} />
          {item.clientName}
        </p>
      </div>
    </Link>
  )
}
