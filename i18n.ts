import { getRequestConfig } from 'next-intl/server'

export const locales = ['az', 'en', 'ru', 'tr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'az'

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the request
  const locale = (await requestLocale) ?? defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
