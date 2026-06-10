import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
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
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const item = await getPortfolioBySlug(params.slug)
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
  params: { locale: string; slug: string }
}) {
  unstable_setRequestLocale(params.locale)
  const item = await getPortfolioBySlug(params.slug)
  if (!item) notFound()
  return <PortfolioDetailContent item={item} />
}

function PortfolioDetailContent({ item }: { item: PortfolioItem }) {
  const t = useTranslations('portfolio')
  const locale = useLocale()

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href={`/${locale}`} className="hover:text-text-primary transition-colors">Ana Səhifə</Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/portfolio`} className="hover:text-text-primary transition-colors">{t('title')}</Link>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{item.titleKey}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <ScrollReveal animation="fadeInLeft">
              <Badge variant="accent" className="mb-4">
                {t(`categories.${item.serviceCategory}` as any)}
              </Badge>
              <h1 className="text-display-md font-display font-bold text-text-primary mb-4">
                {item.titleKey}
              </h1>
              <p className="text-text-secondary leading-relaxed mb-6">{item.descriptionKey}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm w-24">{t('client')}:</span>
                  <span className="text-text-primary font-medium">{item.clientName}</span>
                </div>
                {item.tools && item.tools.length > 0 && (
                  <div className="flex items-start gap-3">
                    <span className="text-text-muted text-sm w-24 pt-0.5">{t('tools')}:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <Badge key={tool}>{tool}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {item.resultsKey && (
                  <div className="flex items-start gap-3">
                    <span className="text-text-muted text-sm w-24 pt-0.5">{t('results')}:</span>
                    <span className="text-text-primary text-sm">{item.resultsKey}</span>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Cover image */}
            <ScrollReveal animation="fadeInRight">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-tertiary">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt={item.titleKey}
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
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="scaleIn">
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={item.videoUrl}
                  title={item.titleKey}
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
        <section className="py-12 bg-bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="mb-8">
              <h2 className="text-display-md font-display font-bold text-text-primary">
                {t('gallery')}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.gallery.map((img, index) => (
                <ScrollReveal key={index} animation="scaleIn" delay={index * 80}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-tertiary">
                    <Image
                      src={img}
                      alt={`${item.titleKey} — ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
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
