import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Clock, Calendar } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { formatArticleDate } from '@/lib/utils/formatDate'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const t = useTranslations('journal')
  const locale = useLocale()

  const formattedDate = formatArticleDate(article.publishedAt)

  return (
    <Link href={`/${locale}/journal/${article.slug}`}>
      <GlassCard className="h-full flex flex-col overflow-hidden group">
        {/* Cover image */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 overflow-hidden">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.titleKey}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
              📰
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category badge moved here */}
          <div className="mb-3">
            <Badge variant="accent">
              {t(`categories.${article.category}` as any)}
            </Badge>
          </div>
          
          <h3 className="text-text-primary font-semibold text-lg leading-snug mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
            {article.titleKey}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {article.excerptKey}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-text-muted border-t border-white/10 pt-3 mt-auto">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center text-xs font-semibold text-accent-primary">
                {article.author.name.charAt(0)}
              </div>
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {t('readingTime', { minutes: article.readingTimeMinutes })}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
