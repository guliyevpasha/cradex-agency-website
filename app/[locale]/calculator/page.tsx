import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import dynamic from 'next/dynamic'

const AdvancedCalculator = dynamic(
  () => import('@/components/calculator/AdvancedCalculator').then((m) => m.AdvancedCalculator),
  { ssr: false, loading: () => <div className="h-96 animate-pulse bg-bg-secondary rounded-2xl" /> }
)

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'calculator' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default function CalculatorPage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale)
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdvancedCalculator />
      </div>
    </section>
  )
}
