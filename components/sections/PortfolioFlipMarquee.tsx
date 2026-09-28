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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const title = item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey
  const description = item.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.descriptionKey
  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

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
        // BIGGER cards on mobile for readability
        'flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] lg:w-[360px]',
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
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] border border-white/5">
            <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
              {/* Top Section */}
              <div className="space-y-2 sm:space-y-2.5">
                {/* Title - Larger on mobile for readability */}
                <h3 className="text-white font-display font-bold text-sm sm:text-base md:text-lg leading-tight line-clamp-2">
                  {item.clientName} üçün hazırlanmış {t(`categories.${item.serviceCategory}` as any).toLowerCase()}
                </h3>

                {/* Description - Visible on all screens */}
                {description && (
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                    {description}
                  </p>
                )}
              </div>

              {/* Bottom Section */}
              <div className="space-y-2">
                {/* Meta Row - Client & Year */}
                <div className="flex items-center gap-2 sm:gap-3 text-white/50 text-xs sm:text-sm">
                  <span className="font-medium text-white/70 truncate">{item.clientName}</span>
                  {year && (
                    <>
                      <span>•</span>
                      <span>{year}</span>
                    </>
                  )}
                </div>

                {/* Button Row */}
                <div className="flex items-center justify-between gap-2">
                  {/* Category Badge */}
                  <div className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-white/80 text-[10px] sm:text-xs font-medium">
                      {t(`categories.${item.serviceCategory}` as any)}
                    </span>
                  </div>

                  {/* View Project Button */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm font-medium group-hover:text-accent-primary transition-colors">
                    <span>Layihəyə keçid et</span>
                    <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
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
