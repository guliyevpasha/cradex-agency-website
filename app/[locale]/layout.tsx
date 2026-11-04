/**
 * Locale layout: fonts, theme, header, footer and the phone bottom bar.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata, Viewport } from 'next'
import { Onest } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { FloatingActions } from '@/components/layout/FloatingActions'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { ThemeScript } from '@/components/theme/ThemeScript'
import '@/app/globals.css'

const locales = ['az', 'en', 'ru', 'tr']

const onest = Onest({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
  variable: '--font-onest',
  weight: ['400', '500', '600', '700', '800'],
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cradexagency.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#080A0D' },
  ],
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.meta' })
  return {
    metadataBase: new URL(baseUrl),
    title: { template: '%s | Cradex Agency', default: t('homeTitle') },
    description: t('homeDescription'),
    authors: [{ name: 'Paşa Quliyev', url: baseUrl }],
    creator: 'Cradex Agency',
    publisher: 'Cradex Agency',
    // app/icon.png, app/apple-icon.png and app/favicon.ico (scripts/make-icons.mjs) are picked up by Next.
    openGraph: {
      type: 'website',
      siteName: 'Cradex Agency',
      locale,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
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
  setRequestLocale(locale)

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'site.nav' })

  return (
    <html lang={locale} className={onest.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      {/* Browser extensions (Grammarly etc.) add attributes to <body>. */}
      <body className="bg-bg-primary font-body text-text-primary antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-strong focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-snow"
        >
          {t('skip')}
        </a>
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <Header />
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <MobileBottomNav locale={locale} />
            <FloatingActions />
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
