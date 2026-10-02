import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PromoPopup } from '@/components/ui/PromoPopup'
import '@/app/globals.css'

const locales = ['az', 'en', 'ru', 'tr']

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cradexagency.com'

// Viewport — mobile responsive fix
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | Cradex Agency',
      default: 'Cradex Agency — Rəqəmsal Marketinq Agentliyi',
    },
    description: 'Cradex Agency: SEO, SMM, brendinq, dizayn və veb-sayt hazırlanması xidmətləri.',
    icons: {
      icon: '/logos/cradex.svg',
      shortcut: '/logos/cradex.svg',
      apple: '/logos/cradex.svg',
    },
    openGraph: {
      type: 'website',
      siteName: 'Cradex Agency',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
    alternates: {
      languages: {
        az: `${baseUrl}/az`,
        en: `${baseUrl}/en`,
        ru: `${baseUrl}/ru`,
        tr: `${baseUrl}/tr`,
        'x-default': `${baseUrl}/az`,
      },
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) notFound()

  // Enable static rendering for next-intl
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-bg-primary text-text-primary font-body antialiased">
        {/* Skip to main content — keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Əsas məzmuna keç
        </a>

        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <Header />
            <main id="main-content" tabIndex={-1} className="pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileBottomNav locale={locale} />
            <PromoPopup />
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
