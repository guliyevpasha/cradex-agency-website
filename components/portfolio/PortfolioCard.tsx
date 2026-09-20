'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { PortfolioItem } from '@/types'

interface PortfolioCardProps {
  item: PortfolioItem
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const locale = useLocale()
  const t = useTranslations('portfolio')

  return (
    <Link
      href={`/${locale}/portfolio/${item.slug}`}
      className="group block perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div 
        className="relative w-full aspect-[4/3] transition-transform duration-700 transform-style-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side - Image */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden bg-bg-tertiary border border-border/20"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={item.titleKey}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center text-6xl opacity-40">
              🖼️
            </div>
          )}
          
          {/* Subtle overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent" />
          
          {/* Featured badge */}
          {item.featured && (
            <div className="absolute top-4 right-4">
              <span className="text-xs bg-accent-primary text-white px-3 py-1.5 rounded-full font-medium shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}
          
          {/* Client name on front */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-medium text-lg drop-shadow-lg">{item.clientName}</p>
          </div>
        </div>

        {/* Back Side - Details */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary border border-accent-primary/30 shadow-2xl shadow-accent-primary/20 p-6 flex flex-col justify-between"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Category Badge */}
          <div className="flex gap-2 items-start">
            <Badge variant="accent" className="shrink-0">
              {t(`categories.${item.serviceCategory}` as any)}
            </Badge>
            {item.featured && (
              <span className="text-xs bg-accent-primary/20 text-accent-primary px-2 py-1 rounded-full">
                ⭐
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            {/* Title */}
            <h3 className="text-text-primary font-display font-bold text-xl lg:text-2xl leading-snug">
              {item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey}
            </h3>
            
            {/* Client */}
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Tag size={14} className="text-accent-primary" />
              <span>{item.clientName}</span>
            </div>

            {/* Year from publishedAt */}
            {item.publishedAt && (
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <Calendar size={14} className="text-accent-primary" />
                <span>{new Date(item.publishedAt).getFullYear()}</span>
              </div>
            )}

            {/* Description if available */}
            {item.description?.[locale as 'az' | 'en' | 'ru' | 'tr'] && (
              <p className="text-text-secondary text-sm line-clamp-2 mt-2">
                {item.description[locale as 'az' | 'en' | 'ru' | 'tr']}
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-accent-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
            <span>{t('viewProject')}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </Link>
  )
}
