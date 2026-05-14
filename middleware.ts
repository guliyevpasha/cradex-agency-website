import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
})

export const config = {
  // Exclude /studio, /api, /static files, and Next.js internals from locale routing
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)']
}
