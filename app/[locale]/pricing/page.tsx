/**
 * Pricing.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PricingPlans } from '@/components/home/PricingPlans'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { DemoFaq } from '@/components/home/DemoFaq'
import { FinalCta } from '@/components/home/FinalCta'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.meta' })
  return { title: t('pricingTitle'), description: t('pricingDescription') }
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-16">
      <PricingPlans headingAs="h1" />
      <ProcessSteps />
      <DemoFaq />
      <FinalCta />
    </div>
  )
}
