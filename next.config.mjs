/**
 * Next.js config — security headers, redirects, i18n.
 * @author Paşa Quliyev — Cradex Agency
 */
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const isDev = process.env.NODE_ENV !== 'production'

// eval is only needed by the dev overlay and by Sanity Studio.
const csp = (allowEval) => ({
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    `script-src 'self'${allowEval ? " 'unsafe-eval'" : ''} 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: https://cdn.sanity.io",
    "media-src 'self' blob: https://cdn.sanity.io",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.sanity.io https://*.sanity.studio wss://*.sanity.io https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
    "frame-src 'self' https://cradex-agency.sanity.studio",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '),
})

const baseHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]),
]

const studioHeaders = [...baseHeaders, csp(true), { key: 'X-Robots-Tag', value: 'noindex, nofollow' }]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Older Sanity/portfolio files still carry type errors; new code is checked with `npx tsc`.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    // Sharp source captures, served as AVIF/WebP at high quality.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 92],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    minimumCacheTTL: 2678400,
  },
  transpilePackages: ['swiper', 'next-sanity', 'sanity'],
  async redirects() {
    // Calculator is archived (see archive/calculator); old links land on pricing.
    return [{ source: '/:locale(az|en|ru|tr)/calculator', destination: '/:locale/pricing', permanent: false }]
  },
  async headers() {
    return [
      { source: '/((?!studio).*)', headers: [...baseHeaders, csp(isDev)] },
      { source: '/studio', headers: studioHeaders },
      { source: '/studio/:path*', headers: studioHeaders },
    ]
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default withNextIntl(nextConfig)
