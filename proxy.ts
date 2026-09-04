// Next.js 16 renamed the `middleware` file convention to `proxy`. The handler is
// still next-intl's, which ships under next-intl/middleware; only the file name
// and Next's expected export changed, and a default export satisfies it.
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
