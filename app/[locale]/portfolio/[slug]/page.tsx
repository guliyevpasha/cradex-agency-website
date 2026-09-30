import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ChevronRight, TrendingUp, Users, MessageCircle, Target, Eye, Heart, BarChart3, Link as LinkIcon, DollarSign, ShoppingCart, Phone } from 'lucide-react'
import { getPortfolioBySlug, getPortfolioSlugs } from '@/lib/data/portfolio'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Badge } from '@/components/ui/Badge'
import { Accordion } from '@/components/ui/Accordion'
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

  // Debug: Log media gallery data
  if (item.mediaGallery) {
    console.log('[Portfolio] Media Gallery:', {
      socialMediaPosts: item.mediaGallery.socialMediaPosts?.length || 0,
      motionDesigns: item.mediaGallery.motionDesigns?.map(m => ({ url: m.url, caption: m.caption?.[locale] })),
      videoContent: item.mediaGallery.videoContent?.map(v => ({ url: v.url, caption: v.caption?.[locale] })),
      adResults: item.mediaGallery.adResults?.length || 0,
    })
  }

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
              <Badge variant="accent" className="mb-6">
                {t(`categories.${item.serviceCategory}` as any)}
              </Badge>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">{description}</p>

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

                {/* Duration - Only for SMM */}
                {item.category === 'smm' && item.duration && (
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

      {/* Statistics - Only for SMM category */}
      {item.category === 'smm' && item.statistics && item.statistics.length > 0 && (
        <section className="py-16 bg-bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-text-primary">
                {t('achievedResults')}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {item.statistics.map((stat, index) => {
                const statLabel = stat.label?.[locale] || ''
                
                // Modern lucide icon component mapping
                const IconComponent = stat.icon === 'trending-up' ? TrendingUp :
                  stat.icon === 'users' ? Users :
                  stat.icon === 'message-circle' ? MessageCircle :
                  stat.icon === 'target' ? Target :
                  stat.icon === 'eye' ? Eye :
                  stat.icon === 'heart' ? Heart :
                  stat.icon === 'bar-chart' ? BarChart3 :
                  stat.icon === 'link' ? LinkIcon :
                  stat.icon === 'dollar-sign' ? DollarSign :
                  stat.icon === 'trending-up-dollar' ? TrendingUp :
                  stat.icon === 'shopping-cart' ? ShoppingCart :
                  stat.icon === 'phone' ? Phone :
                  BarChart3
                
                return (
                  <ScrollReveal key={index} animation="scaleIn" delay={index * 100}>
                    <div className="group relative bg-gradient-to-br from-bg-tertiary to-bg-secondary p-6 rounded-xl border border-white/5 hover:border-accent-primary/30 transition-all duration-500 hover:scale-105 text-center overflow-hidden">
                      {/* Animated background glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 via-accent-primary/5 to-accent-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* 3D Icon with animation */}
                      <div className="relative mb-4 flex justify-center">
                        <div className="relative">
                          {/* Icon shadow/glow effect */}
                          <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Main icon with 3D effect */}
                          <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:-translate-y-1">
                            <IconComponent 
                              className="w-12 h-12 text-accent-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(139,92,246,0.8)]" 
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Value with gradient text */}
                      <div className="relative text-3xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-2 transition-all duration-300 group-hover:scale-110">
                        {stat.value}
                      </div>
                      
                      {/* Label */}
                      <div className="relative text-sm text-text-muted transition-colors duration-300 group-hover:text-text-secondary">
                        {statLabel}
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Sections - Only for SMM category */}
      {item.category === 'smm' && item.detailedSections && item.detailedSections.length > 0 && (
        <section className="py-20 bg-bg-primary">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {item.detailedSections.map((section, index) => {
                const sectionTitle = section.title?.[locale] || ''
                const sectionDescription = section.description?.[locale] || ''
                
                return (
                  <ScrollReveal key={index} animation="fadeInUp" delay={index * 100}>
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-12 items-start">
                      {/* Section Title */}
                      <div className="lg:sticky lg:top-32">
                        <h3 className="text-xl lg:text-2xl font-display font-bold text-text-primary">
                          {sectionTitle}
                        </h3>
                      </div>
                      
                      {/* Section Description */}
                      <div className="bg-bg-secondary/50 rounded-xl p-6 lg:p-8 border border-white/5">
                        <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                          {sectionDescription}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services List - Only for SMM category - Accordion */}
      {item.category === 'smm' && item.servicesList && item.servicesList.length > 0 && (
        <section className="py-20 bg-bg-secondary/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="mb-8">
              <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
                {t('services')}
              </h2>
              <p className="text-text-muted text-sm">Xidmət üzərinə klikləyərək ətraflı məlumat əldə edin</p>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={100}>
              <Accordion 
                items={item.servicesList.map((service) => ({
                  title: service.title?.[locale] || '',
                  description: service.description?.[locale] || ''
                }))}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Media Gallery - Only for SMM category */}
      {item.category === 'smm' && item.mediaGallery && (
        <section className="py-20 bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Social Media Posts */}
            {item.mediaGallery.socialMediaPosts && item.mediaGallery.socialMediaPosts.length > 0 && (
              <div className="mb-20">
                <ScrollReveal animation="fadeInUp" className="mb-12">
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
                    {locale === 'az' ? 'Sosial Media Postları' : 
                     locale === 'en' ? 'Social Media Posts' : 
                     locale === 'ru' ? 'Посты в социальных сетях' : 
                     'Sosyal Medya Gönderileri'}
                  </h2>
                  <p className="text-text-muted">
                    {locale === 'az' ? 'Hazırladığımız sosial media post dizaynları' : 
                     locale === 'en' ? 'Social media post designs we created' : 
                     locale === 'ru' ? 'Созданные нами дизайны постов' : 
                     'Oluşturduğumuz sosyal medya gönderi tasarımları'}
                  </p>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {item.mediaGallery.socialMediaPosts.map((post, index) => {
                    // Aspect ratio: 4:5 (1080x1350 - Feed) or 9:16 (1080x1920 - Story)
                    const aspectRatio = post.aspectRatio || '4:5'
                    const aspectClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[4/5]'
                    
                    return (
                      <ScrollReveal key={index} animation="scaleIn" delay={index * 60}>
                        <div className={`relative ${aspectClass} rounded-xl overflow-hidden bg-bg-tertiary shadow-lg group cursor-pointer border border-white/5 hover:border-accent-primary/30 transition-all duration-300`}>
                          {post.url && (
                            <Image
                              src={post.url}
                              alt={post.caption?.[locale] || `Post ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {post.caption?.[locale] && (
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white text-sm font-medium">{post.caption[locale]}</p>
                              </div>
                            )}
                          </div>
                          {/* Format badge */}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {aspectRatio === '9:16' ? 'Story' : 'Feed'}
                          </div>
                        </div>
                      </ScrollReveal>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Motion Designs */}
            {item.mediaGallery.motionDesigns && item.mediaGallery.motionDesigns.length > 0 && (
              <div className="mb-20">
                <ScrollReveal animation="fadeInUp" className="mb-12">
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
                    {locale === 'az' ? 'Motion Dizaynlar' : 
                     locale === 'en' ? 'Motion Designs' : 
                     locale === 'ru' ? 'Моушн-дизайн' : 
                     'Hareketli Tasarımlar'}
                  </h2>
                  <p className="text-text-muted">
                    {locale === 'az' ? 'Animasiyalı video və GIF dizaynlarımız' : 
                     locale === 'en' ? 'Our animated video and GIF designs' : 
                     locale === 'ru' ? 'Наши анимированные видео и GIF-дизайны' : 
                     'Animasyonlu video ve GIF tasarımlarımız'}
                  </p>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {item.mediaGallery.motionDesigns.map((motion, index) => (
                    <ScrollReveal key={index} animation="scaleIn" delay={index * 80}>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-tertiary shadow-lg border border-white/5 hover:border-accent-primary/30 transition-all duration-300">
                        {motion.url && (
                          <video
                            src={`${motion.url}#t=0.1`}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                            preload="metadata"
                          >
                            {locale === 'az' ? 'Brauzerniz video dəstəkləmir' : 
                             locale === 'en' ? 'Your browser does not support video' : 
                             locale === 'ru' ? 'Ваш браузер не поддерживает видео' : 
                             'Tarayıcınız videoyu desteklemiyor'}
                          </video>
                        )}
                        {motion.caption?.[locale] && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
                            <p className="text-white text-sm font-medium">{motion.caption[locale]}</p>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {/* Video Content (Reels) */}
            {item.mediaGallery.videoContent && item.mediaGallery.videoContent.length > 0 && (
              <div className="mb-20">
                <ScrollReveal animation="fadeInUp" className="mb-12">
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
                    {locale === 'az' ? 'Video Kontent (Reels)' : 
                     locale === 'en' ? 'Video Content (Reels)' : 
                     locale === 'ru' ? 'Видеоконтент (Reels)' : 
                     'Video İçerik (Reels)'}
                  </h2>
                  <p className="text-text-muted">
                    {locale === 'az' ? 'Çəkdiyimiz və montaj etdiyimiz reels videoları' : 
                     locale === 'en' ? 'Reels videos we shot and edited' : 
                     locale === 'ru' ? 'Снятые и смонтированные нами Reels-видео' : 
                     'Çektiğimiz ve düzenlediğimiz reels videoları'}
                  </p>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {item.mediaGallery.videoContent.map((video, index) => (
                    <ScrollReveal key={index} animation="scaleIn" delay={index * 60}>
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-bg-tertiary shadow-lg border border-white/5 hover:border-accent-primary/30 transition-all duration-300">
                        {video.url && (
                          <video
                            src={`${video.url}#t=0.1`}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                            preload="metadata"
                          >
                            {locale === 'az' ? 'Brauzerniz video dəstəkləmir' : 
                             locale === 'en' ? 'Your browser does not support video' : 
                             locale === 'ru' ? 'Ваш браузер не поддерживает видео' : 
                             'Tarayıcınız videoyu desteklemiyor'}
                          </video>
                        )}
                        {video.caption?.[locale] && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
                            <p className="text-white text-sm font-medium">{video.caption[locale]}</p>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Ad Results */}
            {item.mediaGallery.adResults && item.mediaGallery.adResults.length > 0 && (
              <div>
                <ScrollReveal animation="fadeInUp" className="mb-12">
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
                    {locale === 'az' ? 'Meta Reklam Nəticələri' : 
                     locale === 'en' ? 'Meta Ad Results' : 
                     locale === 'ru' ? 'Результаты Meta Рекламы' : 
                     'Meta Reklam Sonuçları'}
                  </h2>
                  <p className="text-text-muted">
                    {locale === 'az' ? 'Kampaniya nəticələrinin ekran görüntüləri' : 
                     locale === 'en' ? 'Campaign results screenshots' : 
                     locale === 'ru' ? 'Скриншоты результатов кампании' : 
                     'Kampanya sonuçlarının ekran görüntüleri'}
                  </p>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {item.mediaGallery.adResults.map((result, index) => (
                    <ScrollReveal key={index} animation="scaleIn" delay={index * 100}>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-tertiary shadow-xl border border-white/5 hover:border-accent-primary/30 transition-all duration-300 group cursor-pointer">
                        {result.url && (
                          <Image
                            src={result.url}
                            alt={result.caption?.[locale] || `Result ${index + 1}`}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                          />
                        )}
                        {result.caption?.[locale] && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                            <p className="text-white font-medium">{result.caption[locale]}</p>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Video */}
      {item.videoUrl && (
        <section className="py-20 bg-bg-primary">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fadeInUp" className="mb-8 text-center">
              <h2 className="text-3xl font-display font-bold text-text-primary">
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
              <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
                {t('gallery')}
              </h2>
              <p className="text-text-secondary text-sm">{t('gallerySubtitle')}</p>
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

      {/* Related Projects */}
      {relatedPortfolios.length > 0 && (
        <section className="py-20 bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <ScrollReveal animation="fadeInUp" className="mb-12 text-center">
              <h2 className="text-3xl font-display font-bold text-text-primary">
                {t('relatedProjects')}
              </h2>
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
                      className="group flex flex-col h-full bg-bg-secondary rounded-2xl overflow-hidden border border-white/5 hover:border-accent-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-primary/10"
                    >
                      <div className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden flex-shrink-0">
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
                      <div className="p-6 flex flex-col flex-grow">
                        <Badge variant="outline" className="mb-3 w-fit">
                          {t(`categories.${project.serviceCategory}` as any)}
                        </Badge>
                        <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                          {projectTitle}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2 flex-grow">
                          {projectDescription}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
            
            {/* View All Button */}
            <ScrollReveal animation="fadeInUp" delay={300}>
              <div className="flex justify-center mt-12">
                <Link
                  href={`/${locale}/portfolio`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-accent-primary/30 transition-all duration-300 hover:scale-105 group"
                >
                  <span>{t('viewAll')}</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </>
  )
}
