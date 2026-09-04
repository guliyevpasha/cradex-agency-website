import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: https://cdn.sanity.io",
      // data: is needed for fonts inlined as base64 — Sanity Studio and the dev
      // overlay both do this, and the policy was blocking them. Inline font data
      // cannot execute, so this is not the risk that data: poses in script-src.
      "font-src 'self' data: https://fonts.gstatic.com",
      // api.resend.com dropped: nothing calls Resend. app/api/contact/ has no
      // route file and RESEND_API_KEY is read nowhere in the codebase.
      "connect-src 'self' https://*.sanity.io https://*.sanity.studio",
      "frame-src 'self' https://cradex-agency.sanity.studio",
    ].join('; ')
  },
]

const nextConfig = {
  // Removed 'output: export' to enable Sanity Studio (requires SSR)
  // trailingSlash: true, // Not needed without static export
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  transpilePackages: ['swiper', 'next-sanity', 'sanity'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // robots.txt asks crawlers not to fetch /studio, but a URL linked from
      // anywhere else can still be indexed without being fetched. This header
      // is the part search engines honour once they have the page. Access
      // control is Sanity's: the Studio needs a project membership to log in.
      ...['/studio', '/studio/:path*'].map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      })),
    ]
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default withNextIntl(nextConfig)
