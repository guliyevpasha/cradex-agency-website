import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Clock, Calendar, ChevronRight } from 'lucide-react'
import { getArticleBySlug, getArticleSlugs } from '@/lib/data/journal'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Badge } from '@/components/ui/Badge'
import { CtaSection } from '@/components/sections/CtaSection'
import type { Article } from '@/types'

const locales = ['az', 'en', 'ru', 'tr']

// ISR: Revalidate every 60 seconds
export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getArticleSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.metaTitleKey || article.titleKey,
    description: article.metaDescriptionKey || article.excerptKey,
    openGraph: {
      title: article.titleKey,
      description: article.excerptKey,
      images: article.ogImage ? [{ url: article.ogImage }] : [],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const article = await getArticleBySlug(slug)
  if (!article) notFound()
  return <ArticleContent article={article} />
}

function ArticleContent({ article }: { article: Article }) {
  const t = useTranslations('journal')
  const locale = useLocale()

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    locale === 'az' ? 'az-AZ' : locale === 'ru' ? 'ru-RU' : locale === 'tr' ? 'tr-TR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.titleKey,
    description: article.excerptKey,
    author: { '@type': 'Person', name: article.author.name },
    datePublished: article.publishedAt,
    image: article.coverImage || article.ogImage,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href={`/${locale}`} className="hover:text-text-primary transition-colors">Ana Səhifə</Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/journal`} className="hover:text-text-primary transition-colors">{t('title')}</Link>
            <ChevronRight size={14} />
            <span className="text-text-secondary line-clamp-1">{article.titleKey}</span>
          </nav>

          {/* Category + meta */}
          <ScrollReveal animation="fadeInUp">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="accent">{t(`categories.${article.category}` as any)}</Badge>
              <span className="flex items-center gap-1 text-text-muted text-sm">
                <Clock size={14} />
                {t('readingTime', { minutes: article.readingTimeMinutes })}
              </span>
              <span className="flex items-center gap-1 text-text-muted text-sm">
                <Calendar size={14} />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-display-md font-display font-bold text-text-primary mb-6 leading-tight">
              {article.titleKey}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-semibold">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-text-primary font-medium text-sm">{article.author.name}</p>
                <p className="text-text-muted text-xs">{article.author.role}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Cover image */}
          {article.coverImage && (
            <ScrollReveal animation="scaleIn" className="mb-10">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.titleKey}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </ScrollReveal>
          )}

          {/* Article body */}
          <ScrollReveal animation="fadeInUp">
            <div className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:text-text-primary
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-text-primary
              prose-code:text-accent-secondary prose-code:bg-bg-tertiary prose-code:px-1 prose-code:rounded
              prose-blockquote:border-accent-primary prose-blockquote:text-text-secondary
              prose-ul:text-text-secondary prose-ol:text-text-secondary
            ">
              {/* Render plain text content (Sanity rich text would use @portabletext/react) */}
              {typeof article.contentKey === 'string' ? (
                article.contentKey.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={i}>{paragraph.replace('## ', '')}</h2>
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={i}>{paragraph.replace('### ', '')}</h3>
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={i}>
                        {paragraph.split('\n').map((item, j) => (
                          <li key={j}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    )
                  }
                  return <p key={i}>{paragraph}</p>
                })
              ) : null}
            </div>
          </ScrollReveal>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
              {article.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </article>

      <CtaSection />
    </>
  )
}
