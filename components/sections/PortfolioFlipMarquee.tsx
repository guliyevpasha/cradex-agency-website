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

  // Use ALL items from Sanity - no limit
  let displayItems = [...items]
  
  // Duplicate items 2x for smooth infinite scrolling
  displayItems = [...displayItems, ...displayItems]

  // Split into two rows (distribute evenly)
  const halfLength = Math.ceil(displayItems.length / 2)
  const topRowItems = displayItems.slice(0, halfLength)
  const bottomRowItems = displayItems.slice(halfLength)

  return (
    <div className="w-full overflow-hidden space-y-6">
      {/* Top row - Right to Left - 6 items */}
      <MarqueeFlipRow items={topRowItems} direction="rtl" />
      
      {/* Bottom row - Left to Right - 6 items */}
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
  
  // Multiply items 3 times for seamless infinite loop
  const displayItems = [...items, ...items, ...items]

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={cn(
          'flex gap-2 md:gap-4',
          'marquee-track'
        )}
        style={{
          animation: direction === 'ltr' 
            ? 'marquee-scroll-third 15s linear infinite'  // Much faster - 15 seconds
            : 'marquee-scroll-third-reverse 15s linear infinite',
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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const title = item.title?.[locale] || item.titleKey
  const description = item.description?.[locale] || item.descriptionKey
  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

  // Sanitize slug for URL (handle cases where Sanity slug has spaces)
  const sanitizedSlug = item.slug
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Debug log
  if (typeof window !== 'undefined') {
    console.log('[FlipCard] Item data:', {
      originalSlug: item.slug,
      sanitizedSlug,
      titleType: typeof item.title,
      title: title,
      locale
    })
  }

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe || isRightSwipe) {
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div
      className={cn(
        // Much smaller cards on mobile to show more portfolios at once
        'flex-shrink-0 w-[160px] sm:w-[220px] md:w-[260px] lg:w-[300px]',
        'group relative',
        '[perspective:1000px]'
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Link
        href={`/${locale}/portfolio/${sanitizedSlug}`}
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
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] border border-white/5">
            <div className="absolute inset-0 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between">
              {/* Top Section */}
              <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
                {/* Title - Optimized for smaller mobile cards */}
                <h3 className="text-white font-display font-bold text-[11px] sm:text-sm md:text-base lg:text-lg leading-tight line-clamp-2">
                  {item.clientName} üçün hazırlanmış {t(`categories.${item.serviceCategory}` as any).toLowerCase()}
                </h3>

                {/* Description - Visible on all screens */}
                {description && (
                  <p className="text-white/60 text-[10px] sm:text-xs md:text-sm leading-relaxed line-clamp-2">
                    {description}
                  </p>
                )}
              </div>

              {/* Bottom Section */}
              <div className="space-y-1.5 sm:space-y-2">
                {/* Meta Row - Client & Year */}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 text-white/50 text-[10px] sm:text-xs md:text-sm">
                  <span className="font-medium text-white/70 truncate">{item.clientName}</span>
                  {year && (
                    <>
                      <span>•</span>
                      <span>{year}</span>
                    </>
                  )}
                </div>

                {/* Button Row */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {/* Category Badge */}
                  <div className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-white/80 text-[9px] sm:text-[10px] md:text-xs font-medium truncate max-w-[60px] sm:max-w-none">
                      {t(`categories.${item.serviceCategory}` as any)}
                    </span>
                  </div>

                  {/* View Project Button */}
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 text-white text-[10px] sm:text-xs md:text-sm font-medium group-hover:text-accent-primary transition-colors whitespace-nowrap">
                    <span className="hidden sm:inline">Layihəyə keçid et</span>
                    <span className="sm:hidden">Keçid</span>
                    <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform" />
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
