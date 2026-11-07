/**
 * Home page.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { DemoHero } from '@/components/home/DemoHero'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { ProductsShowcase } from '@/components/home/ProductsShowcase'
import { CorporateEmail } from '@/components/home/CorporateEmail'
import { MapsListing } from '@/components/home/MapsListing'
import { DemoFaq } from '@/components/home/DemoFaq'
import { FinalCta } from '@/components/home/FinalCta'
import { LogoMarquee } from '@/components/sections/LogoMarquee'
import { WorkShowcase } from '@/components/home/WorkShowcase'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { BlogShowcase } from '@/components/home/BlogShowcase'
import { TechStack } from '@/components/home/TechStack'
import { getAllTestimonials } from '@/lib/data/testimonials'
import { getPartners } from '@/lib/data/partners'
import { getRecentBlogPosts } from '@/sanity/lib/queries'

// Hourly is enough: publishing in Sanity also refreshes pages via /api/revalidate.
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.meta' })
  return {
    title: { absolute: t('homeTitle') },
    description: t('homeDescription'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  // Client sections (Swiper, marquee) cannot query Sanity themselves.
  const [testimonials, partners, recentArticles] = await Promise.all([
    getAllTestimonials(),
    getPartners(),
    getRecentBlogPosts(3, locale),
  ])

  return (
    <>
      <DemoHero />
      <LogoMarquee partners={partners} />
      <ProcessSteps />
      <ServicesGrid />
      <WorkShowcase />
      <ProductsShowcase />
      <CorporateEmail />
      <MapsListing />
      {/* Reviews given the "Əsas səhifə" option in Studio; all of them while none is. */}
      <ReviewsSection testimonials={testimonials.some((r) => r.services?.includes('home')) ? testimonials.filter((r) => r.services?.includes('home')) : testimonials} />
      <DemoFaq />
      <TechStack />
      <BlogShowcase articles={recentArticles} />
      <FinalCta />
    </>
  )
}
