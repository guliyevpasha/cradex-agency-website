import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPartners } from '@/lib/data/partners'
import { ClientsGrid } from '@/components/clients/ClientsGrid'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'clients' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  
  const t = await getTranslations('clients')
  const partners = await getPartners()

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link
              href={`/${locale}`}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              {t('breadcrumb.home')}
            </Link>
            <ChevronRight size={14} className="text-text-tertiary" />
            <span className="text-text-primary font-medium">{t('title')}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          {/* Eyebrow */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-bg-tertiary/50 border border-accent-primary/20 text-sm font-medium text-text-secondary uppercase tracking-wider">
              / {t('subtitle')} /
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-text-primary">{t('heading')} </span>
            <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
              {t('headingAccent')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-text-secondary text-lg lg:text-xl max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Clients Grid */}
      <ClientsGrid partners={partners} />
    </div>
  )
}
