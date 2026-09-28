'use client'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import type { ArticleCategory } from '@/types'

const categories: Array<ArticleCategory | 'all'> = [
  'all', 'seo', 'smm', 'branding', 'design', 'copywriting', 'web-dev', 'marketing-strategy',
]

interface CategoryFilterProps {
  active: ArticleCategory | 'all'
  onChange: (category: ArticleCategory | 'all') => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const t = useTranslations('journal.categories')

  return (
    <div 
      className="flex gap-2 justify-start md:justify-center overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" 
      role="group" 
      aria-label="Kateqoriya filtri"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px] whitespace-nowrap',
            active === cat
              ? 'bg-accent-primary text-white shadow-[0_0_16px_rgba(108,99,255,0.4)]'
              : 'glass-card text-text-secondary hover:text-text-primary hover:border-accent-primary/30'
          )}
        >
          {t(cat as any)}
        </button>
      ))}
    </div>
  )
}
