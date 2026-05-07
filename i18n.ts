import { getRequestConfig } from 'next-intl/server'

export const locales = ['az', 'en', 'ru', 'tr'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'az'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}))
