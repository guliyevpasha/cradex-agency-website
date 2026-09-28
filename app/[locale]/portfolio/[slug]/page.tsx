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
  
  setRequestLocale(locale)
  
  const item = await getPortfolioBySlug(slug)
  
  if (!item) {
    notFound()
  }
  
  // Get related portfolio items (same category, exclude current)
  const { getAllPortfolio } = await import('@/lib/data/portfolio')
  const allPortfolios = await getAllPortfolio(locale)
  const relatedPortfolios = allPortfolios
    .filter(p => p.serviceCategory === item.serviceCategory && p.slug !== item.slug)
    .slice(0, 3)
  
  return <PortfolioDetailContent item={item} relatedPortfolios={relatedPortfolios} />
}

function PortfolioDetailContent({ item, relatedPortfolios }: { item: PortfolioItem; relatedPortfolios: PortfolioItem[] }) {
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
              <p className="text-text-secondary text-lg leading-relaxed mb-6">{description}</p>

              {/* Meta Info Grid - Compact 2-column layout */}
              <div className="grid grid-cols-2 gap-4 bg-bg-tertiary/50 rounded-xl p-5 border border-white/5 mb-6">
                {/* Client */}
                <div className="space-y-1">
                  <span className="text-text-muted text-xs uppercase tracking-wider font-medium">{t('client')}</span>
                  <p className="text-text-primary font-semibold">{item.clientName}</p>
                </div>
                
                {/* Year */}
                {year && (
                  <div className="space-y-1">
                    <span className="text-text-muted text-xs uppercase tracking-wider font-medium">{t('year')}</span>
                    <p className="text-text-primary font-semibold">{year}</p>
                  </div>
                )}

                {/* Duration */}
                {item.duration && (
                  <div className="space-y-1">
                    <span className="text-text-muted text-xs uppercase tracking-wider font-medium">{t('duration')}</span>
                    <p className="text-text-primary font-semibold">{item.duration}</p>
                  </div>
                )}

                {/* Tools - Full width if exists */}
                {item.tools && item.tools.length > 0 && (
                  <div className="col-span-2 space-y-2 pt-4 border-t border-white/5">
                    <span className="text-text-muted text-xs uppercase tracking-wider font-medium block">{t('tools')}</span>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Results - Full width if exists */}
                {results && (
                  <div className="col-span-2 space-y-2 pt-4 border-t border-white/5">
                    <span className="text-text-muted text-xs uppercase tracking-wider font-medium block">{t('results')}</span>
                    <p className="text-text-primary text-sm leading-relaxed">{results}</p>
                  </div>
                )}
              </div>

              {/* Visit Website Button - Prominent placement */}
              {item.projectUrl && (
                <a
                  href={item.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-accent-primary/30 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <span>{t('visitWebsite')}</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </ScrollReveal>

            {/* Cover image */}
            <ScrollReveal animation="fadeInRight">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-tertiary shadow-2xl ring-1 ring-white/5">
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

      {/* Related Projects */}
      {relatedPortfolios.length > 0 && (
        <section className="py-20 bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="mb-12 text-center">
              <h2 className="text-display-md font-display font-bold text-text-primary mb-3">
                {t('relatedProjects')}
              </h2>
              <p className="text-text-secondary">{t('relatedProjectsSubtitle')}</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPortfolios.map((project, index) => {
                const projectTitle = project.title?.[locale] || project.titleKey
                const projectDescription = project.description?.[locale] || project.descriptionKey
                
                // Sanitize slug
                const sanitizedSlug = project.slug
                  .toLowerCase()
                  .trim()
                  .replace(/[\s_]+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/-+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                return (
                  <ScrollReveal key={project.id} animation="fadeInUp" delay={index * 100}>
                    <Link 
                      href={`/${locale}/portfolio/${sanitizedSlug}`}
                      className="group block bg-bg-secondary rounded-2xl overflow-hidden border border-white/5 hover:border-accent-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-primary/10"
                    >
                      <div className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden">
                        {project.coverImage ? (
                          <Image
                            src={project.coverImage}
                            alt={projectTitle}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                            <span className="text-6xl opacity-20">🖼️</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6">
                        <Badge variant="outline" className="mb-3">
                          {t(`categories.${project.serviceCategory}` as any)}
                        </Badge>
                        <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                          {projectTitle}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2">
                          {projectDescription}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  )
}
