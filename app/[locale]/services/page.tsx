/**
 * Services overview.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { FinalCta } from '@/components/home/FinalCta'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.meta' })
  return { title: t('servicesTitle'), description: t('servicesDescription') }
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-16">
      <ServicesGrid detailed headingAs="h1" />
      <ProcessSteps />
      <FinalCta />
    </div>
  )
}
