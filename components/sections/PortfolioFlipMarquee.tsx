'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import type { PortfolioItem } from '@/types'
import { cn } from '@/lib/utils'
import { ArrowRight, Building2, Calendar, Tag } from 'lucide-react'

interface PortfolioFlipMarqueeProps {
  items: PortfolioItem[]
}

export function PortfolioFlipMarquee({ items }: PortfolioFlipMarqueeProps) {
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || items.length === 0) return null

  // Ensure each row has at least 6 items by duplicating if necessary
  const minItemsPerRow = 6
  let allItems = [...items]
  
  // If we have fewer items, duplicate them to reach minimum
  while (allItems.length < minItemsPerRow * 2) {
    allItems = [...allItems, ...items]
  }

  // Split items into two rows - ensure each row has at least 6 items
  const midpoint = Math.ceil(allItems.length / 2)
  const topRowItems = allItems.slice(0, midpoint)
  const bottomRowItems = allItems.slice(midpoint)

  return (
    <div className="w-full overflow-hidden space-y-6">
      {/* Top row - Right to Left */}
      <MarqueeFlipRow items={topRowItems} direction="rtl" />
      
      {/* Bottom row - Left to Right */}
      <MarqueeFlipRow items={bottomRowItems} direction="ltr" />
    </div>
  )
}

interface MarqueeFlipRowProps {
  items: PortfolioItem[]
  direction: 'ltr' | 'rtl'
}

function MarqueeFlipRow({ items, direction }: MarqueeFlipRowProps) {
  const locale = useLocale()
  const t = useTranslations('portfolio')
  
  // Multiply items more for seamless loop on all screen sizes (6 copies)
  const displayItems = [...items, ...items, ...items, ...items, ...items, ...items]

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={cn(
          'flex gap-4',
          'marquee-track'
        )}
        style={{
          animation: direction === 'ltr' 
            ? 'marquee-scroll-sixth 5s linear infinite' 
            : 'marquee-scroll-sixth-reverse 5s linear infinite',
        }}
      >
        {displayItems.map((item, index) => (
          <FlipCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

interface FlipCardProps {
  item: PortfolioItem
}

function FlipCard({ item }: FlipCardProps) {
  const locale = useLocale()
  const t = useTranslations('portfolio')
  const [isFlipped, setIsFlipped] = useState(false)

  const title = item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey
  const description = item.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.descriptionKey
  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

  return (
    <div
      className={cn(
        'flex-shrink-0 w-[160px] sm:w-[220px] md:w-[280px] lg:w-[320px]',
        'group relative',
        '[perspective:1000px]'
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <Link
        href={`/${locale}/portfolio/${item.slug}`}
        className="block w-full"
      >
        <div
          className={cn(
            'relative w-full aspect-[4/3]',
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
                sizes="320px"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <span className="text-4xl opacity-30">🖼️</span>
              </div>
            )}
          </div>

          {/* ── BACK SIDE ─────────────────────────────────────────── */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary border-2 border-accent-primary/30">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-left">
              {/* Top Section */}
              <div className="space-y-2 md:space-y-3">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20">
                  <Tag size={10} className="text-accent-primary" />
                  <span className="text-accent-primary text-[10px] font-semibold uppercase tracking-wider">
                    {t(`categories.${item.serviceCategory}` as any)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-display font-bold text-sm md:text-base leading-tight line-clamp-2">
                  {title}
                </h3>

                {/* Description - show only on larger screens */}
                {description && (
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-2 hidden sm:block">
                    {description}
                  </p>
                )}
              </div>

              {/* Bottom Section - Meta Info */}
              <div className="space-y-1.5 md:space-y-2">
                {/* Client */}
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <Building2 size={12} className="text-accent-primary/70" />
                  <span className="font-medium truncate">{item.clientName}</span>
                </div>

                {/* Year */}
                {year && (
                  <div className="flex items-center gap-1.5 text-white/80 text-xs">
                    <Calendar size={12} className="text-accent-primary/70" />
                    <span>{year}</span>
                  </div>
                )}

                {/* View Project Button */}
                <div className="flex items-center gap-1.5 text-accent-primary font-semibold text-xs pt-1">
                  <span>{t('viewProject')}</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent-primary/5 rounded-bl-[100%]" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
