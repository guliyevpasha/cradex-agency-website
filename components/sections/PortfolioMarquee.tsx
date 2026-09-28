'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { PortfolioItem } from '@/types'
import { cn } from '@/lib/utils'

interface PortfolioMarqueeProps {
  items: PortfolioItem[]
}

export function PortfolioMarquee({ items }: PortfolioMarqueeProps) {
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
      <MarqueeRow items={topRowItems} direction="rtl" />
      
      {/* Bottom row - Left to Right */}
      <MarqueeRow items={bottomRowItems} direction="ltr" />
    </div>
  )
}

interface MarqueeRowProps {
  items: PortfolioItem[]
  direction: 'ltr' | 'rtl'
}

function MarqueeRow({ items, direction }: MarqueeRowProps) {
  const locale = useLocale()
  
  // Multiply items more for seamless loop on all screen sizes (6 copies instead of 3)
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
          <Link
            key={`${item.id}-${index}`}
            href={`/${locale}/portfolio/${item.slug}`}
            className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-tertiary border border-white/5 hover:border-accent-primary/30 transition-all duration-300">
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  alt={item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="320px"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                  <span className="text-6xl opacity-30">🖼️</span>
                </div>
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-bg-primary/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-base leading-tight line-clamp-2 mb-1">
                  {item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey}
                </h3>
                <p className="text-white/70 text-sm">
                  {item.clientName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
