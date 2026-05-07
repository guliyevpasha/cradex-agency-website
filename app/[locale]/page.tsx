import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesOverview } from '@/components/sections/ServicesOverview'
import { PortfolioPreview } from '@/components/sections/PortfolioPreview'
import { StatsSection } from '@/components/sections/StatsSection'
import { LogoMarquee } from '@/components/sections/LogoMarquee'
import { AdvantagesSlider } from '@/components/sections/AdvantagesSlider'
import { FAQ } from '@/components/sections/FAQ'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { LeadSection } from '@/components/sections/LeadSection'

// Swiper uses CSS imports — must be client-only
const TestimonialsCarousel = dynamic(
  () => import('@/components/sections/TestimonialsCarousel').then((m) => m.TestimonialsCarousel),
  { ssr: false, loading: () => <div className="h-96" /> }
)

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' })
  return {
    title: 'Cradex Agency — Rəqəmsal Marketinq Agentliyi',
    description: t('hero.subtitle'),
  }
}

export default function HomePage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale)
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
