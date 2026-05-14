import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { AdvancedCalculator } from '@/components/calculator/AdvancedCalculator'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculator' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  unstable_setRequestLocale(locale)
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdvancedCalculator />
      </div>
    </section>
  )
}
