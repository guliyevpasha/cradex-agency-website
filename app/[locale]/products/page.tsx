/**
 * Products: Chatbot and social media combo packages.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ProductsShowcase } from '@/components/home/ProductsShowcase'
import { FinalCta } from '@/components/home/FinalCta'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.meta' })
  return { title: t('productsTitle'), description: t('productsDescription') }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-16">
      <ProductsShowcase detailed headingAs="h1" />
      <FinalCta />
    </div>
  )
}
