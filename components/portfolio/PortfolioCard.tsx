import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { PortfolioItem } from '@/types'

interface PortfolioCardProps {
  item: PortfolioItem
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const locale = useLocale()
  const t = useTranslations('portfolio')

  return (
    <Link
      href={`/${locale}/portfolio/${item.slug}`}
      className="group block relative overflow-hidden rounded-2xl aspect-[4/3] bg-bg-tertiary"
    >
      {/* Cover image */}
      {item.coverImage ? (
        <Image
          src={item.coverImage}
          alt={item.titleKey}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center text-6xl opacity-40">
          🖼️
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-bg-primary/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <Badge variant="accent">{t(`categories.${item.serviceCategory}` as any)}</Badge>
        <h3 className="text-text-primary font-semibold text-lg leading-snug">
          {item.title?.[locale as 'az' | 'en' | 'ru' | 'tr'] ?? item.titleKey}
        </h3>
        <p className="text-text-secondary text-sm">{item.clientName}</p>
        <div className="flex items-center gap-2 text-accent-primary text-sm font-medium mt-1">
          <span>{t('viewProject')}</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-accent-primary/90 text-white px-2 py-0.5 rounded-full">⭐</span>
        </div>
      )}
    </Link>
  )
}
