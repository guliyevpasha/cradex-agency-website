'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { 
  Sparkles, 
  Share2, 
  Award, 
  Code2, 
  Palette, 
  TrendingUp, 
  Camera,
  Tv,
  PenLine
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ServiceSlug } from '@/types'

export type PortfolioCategory = ServiceSlug | 'all'

export const PORTFOLIO_FILTER_VALUES: PortfolioCategory[] = [
  'all',
  'smm',
  'branding',
  'web-mobile-dev',
  'graphic-motion-design',
  'digital-marketing',
  'photo-video',
]

const FILTER_ICONS: Record<PortfolioCategory, any> = {
  'all':                   Sparkles,
  'smm':                   Share2,
  'branding':              Award,
  'web-mobile-dev':        Code2,
  'graphic-motion-design': Palette,
  'digital-marketing':     TrendingUp,
  'photo-video':           Camera,
  'traditional-marketing': Tv,
  'copywriting':           PenLine,
}

interface PortfolioFilterProps {
  active: PortfolioCategory
  onChange: (category: PortfolioCategory) => void
  counts: Record<string, number>
}

export function PortfolioFilter({ active, onChange, counts }: PortfolioFilterProps) {
  const t = useTranslations('portfolio.categories')

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div
      className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-thin"
      role="group"
      aria-label="Portfolio kateqoriya filtri"
    >
      {PORTFOLIO_FILTER_VALUES.map((value) => {
        const isActive = active === value
        const count = value === 'all' ? totalCount : (counts[value] ?? 0)
        const label = t(value as any)
        const IconComponent = FILTER_ICONS[value] ?? Sparkles

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className={cn(
              'relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
              'min-h-[44px] flex items-center gap-2.5',
              isActive
                ? 'text-white shadow-[0_0_20px_rgba(108,99,255,0.5)]'
                : 'glass-card text-text-secondary hover:text-text-primary hover:border-accent-primary/40'
            )}
          >
            {/* Animated active background */}
            {isActive && (
              <motion.span
                layoutId="portfolio-filter-bg"
                className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full -z-0"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconComponent className="w-4 h-4 shrink-0" strokeWidth={2} />
              <span className="font-medium">{label}</span>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-normal shrink-0',
                  isActive ? 'bg-white/20 text-white' : 'bg-bg-tertiary text-text-muted'
                )}
              >
                {count}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
