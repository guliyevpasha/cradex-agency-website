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
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    // One format and one quality keep the number of generated variants low (the
    // hosting plan counts every transformation). WebP at 85 is visually lossless
    // for the screenshots; 2560 still covers retina laptops.
    formats: ['image/webp'],
    qualities: [85],
    deviceSizes: [640, 828, 1200, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 2678400,
  },
  transpilePackages: ['swiper', 'next-sanity', 'sanity'],
  async redirects() {
    // Calculator is archived (see archive/calculator); old links land on pricing.
    const L = '/:locale(az|en|ru|tr)'
    // Old service slugs (see archive/services-legacy) point at the new pages.
    const moved = { 'web-mobile-dev': 'veb-sayt-hazirlanmasi', 'digital-marketing': 'reqemsal-reklam' }
    const renamedPosts = {
      'yerli-seo-agentliyi-il-brendinizi-google-da-ir-li-c-kin': 'yerli-seo-google-da-irelilemek',
      'aeo-n-dir-aeo-v-seo-un-f-rqi': 'aeo-nedir-aeo-ve-seo-ferqi',
    }
    const dropped = ['traditional-marketing', 'smm', 'graphic-motion-design', 'photo-video', 'branding', 'copywriting']
    return [
      { source: `${L}/calculator`, destination: '/:locale/pricing', permanent: false },
      ...Object.entries(moved).map(([from, to]) => ({ source: `${L}/services/${from}`, destination: `/:locale/services/${to}`, permanent: true })),
      ...dropped.map((from) => ({ source: `${L}/services/${from}`, destination: '/:locale/services', permanent: true })),
      // the first two blog posts were rewritten under cleaner slugs
      ...Object.entries(renamedPosts).map(([from, to]) => ({ source: `${L}/journal/${from}`, destination: `/:locale/journal/${to}`, permanent: true })),
    ]
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
