import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
})

export const config = {
  // Exclude /admin, /studio, /api, /static files, and Next.js internals from locale routing
  matcher: ['/((?!api|admin|studio|_next|_vercel|.*\\..*).*)']
}
