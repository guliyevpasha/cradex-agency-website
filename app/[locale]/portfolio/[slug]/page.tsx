import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ChevronRight } from 'lucide-react'
import { getPortfolioBySlug, getPortfolioSlugs } from '@/lib/data/portfolio'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Badge } from '@/components/ui/Badge'
import { CtaSection } from '@/components/sections/CtaSection'
import type { PortfolioItem } from '@/types'

// Enable ISR with 60 second revalidation
export const revalidate = 60

const locales = ['az', 'en', 'ru', 'tr']

export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = await getPortfolioBySlug(slug)
  if (!item) return {}
  return {
    title: item.titleKey,
    description: item.descriptionKey,
    openGraph: {
      title: item.titleKey,
      images: item.coverImage ? [{ url: item.coverImage }] : [],
    },
  }
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  
  console.log('═══════════════════════════════════════')
  console.log('[Portfolio Detail Page] Starting')
  console.log('Locale:', locale)
  console.log('Slug:', slug)
  console.log('═══════════════════════════════════════')
  
  setRequestLocale(locale)
  
  console.log('[Portfolio Detail] Calling getPortfolioBySlug...')
  const item = await getPortfolioBySlug(slug)
  
  console.log('[Portfolio Detail] Result:', item ? {
    id: item.id,
    slug: item.slug,
    titleKey: item.titleKey,
    hasTitle: !!item.title,
    clientName: item.clientName
  } : 'NULL')
  
  if (!item) {
    console.log('[Portfolio Detail] Item not found - calling notFound()')
    console.log('═══════════════════════════════════════')
    notFound()
  }
  
  console.log('[Portfolio Detail] Rendering content')
  console.log('═══════════════════════════════════════')
  
  return <PortfolioDetailContent item={item} />
}

function PortfolioDetailContent({ item }: { item: PortfolioItem }) {
  const t = useTranslations('portfolio')
  const locale = useLocale() as 'az' | 'en' | 'ru' | 'tr'

  // Get localized content - prioritize locale-specific object if available, fallback to string key
  const title = item.title?.[locale] || item.titleKey
  const description = item.description?.[locale] || item.descriptionKey  
  const results = item.results?.[locale] || item.resultsKey

  const year = item.publishedAt ? new Date(item.publishedAt).getFullYear() : null

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-bg-secondary to-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href={`/${locale}`} className="hover:text-text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/portfolio`} className="hover:text-text-primary transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <ScrollReveal animation="fadeInLeft">
              <Badge variant="accent" className="mb-4">
                {t(`categories.${item.serviceCategory}` as any)}
              </Badge>
              <h1 className="text-display-md md:text-display-lg font-display font-bold text-text-primary mb-4">
                {title}
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">{description}</p>

              <div className="space-y-4 bg-bg-tertiary/50 rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm w-28 font-medium">{t('client')}:</span>
                  <span className="text-text-primary font-semibold">{item.clientName}</span>
                </div>
                
                {year && (
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-sm w-28 font-medium">{t('year')}:</span>
                    <span className="text-text-primary">{year}</span>
                  </div>
                )}

                {item.tools && item.tools.length > 0 && (
                  <div className="flex items-start gap-3">
                    <span className="text-text-muted text-sm w-28 pt-1 font-medium">{t('tools')}:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <Badge key={tool} variant="outline">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {results && (
                  <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                    <span className="text-text-muted text-sm w-28 pt-1 font-medium">{t('results')}:</span>
                    <p className="text-text-primary text-sm leading-relaxed flex-1">{results}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Cover image */}
            <ScrollReveal animation="fadeInRight">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-tertiary shadow-2xl">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center text-8xl opacity-30">
                    🖼️
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Video */}
      {item.videoUrl && (
        <section className="py-20 bg-bg-primary">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="mb-8 text-center">
              <h2 className="text-display-md font-display font-bold text-text-primary">
                {t('videoTitle')}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="scaleIn">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={item.videoUrl}
                  title={title}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Gallery */}
      {item.gallery && item.gallery.length > 0 && (
        <section className="py-20 bg-bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="mb-12 text-center">
              <h2 className="text-display-md font-display font-bold text-text-primary mb-3">
                {t('gallery')}
              </h2>
              <p className="text-text-secondary">{t('gallerySubtitle')}</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {item.gallery.map((img, index) => (
                <ScrollReveal key={index} animation="scaleIn" delay={index * 80}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-tertiary shadow-lg group cursor-pointer">
                    <Image
                      src={img}
                      alt={`${title} — ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  )
}
