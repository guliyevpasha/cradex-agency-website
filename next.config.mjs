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
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.resend.com https://*.sanity.io https://*.sanity.studio",
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
    ]
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default nextConfig
