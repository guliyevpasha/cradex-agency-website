import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesOverview } from '@/components/sections/ServicesOverview'
import { PortfolioPreview } from '@/components/sections/PortfolioPreview'
import { StatsSection } from '@/components/sections/StatsSection'
import { LogoMarquee } from '@/components/sections/LogoMarquee'
import { AdvantagesSlider } from '@/components/sections/AdvantagesSlider'
import { FAQ } from '@/components/sections/FAQ'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { LeadSection } from '@/components/sections/LeadSection'
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel'

// Enable ISR with 60 second revalidation
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: 'Cradex Agency — Rəqəmsal Marketinq Agentliyi',
    description: t('hero.subtitle'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <HeroSection />
      <StatsSection />
      <LogoMarquee />
      <AdvantagesSlider />
      <ServicesOverview />
      <PortfolioPreview />
      <TestimonialsCarousel />
      <FAQ />
      <ProcessSection />
      <LeadSection />
    </>
  )
}
