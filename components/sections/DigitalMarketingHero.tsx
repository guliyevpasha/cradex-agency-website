'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'

interface DigitalMarketingHeroProps {
  title: string
  description: string
  ctaStart: string
  ctaProcess: string
  locale: string
}

export function DigitalMarketingHero({
  title,
  description,
  ctaStart,
  ctaProcess,
  locale,
}: DigitalMarketingHeroProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scrollToPlatforms = () => {
    document.getElementById('platforms-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary py-20 lg:py-32"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 50%, rgba(108,99,255,0.15) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 80% 50%, rgba(151,71,255,0.1) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7 }}
          >
            {/* Eyebrow */}
            <span className="inline-block px-4 py-2 rounded-full bg-bg-tertiary/50 border border-accent-primary/20 text-sm font-medium text-text-secondary uppercase tracking-wider mb-6">
              / {title} /
            </span>

            {/* Description */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text-primary mb-6 leading-tight">
              {description}
            </h1>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] transition-all duration-300 hover:scale-105"
              >
                {ctaStart}
                <ArrowRight size={18} />
              </Link>
              
              <button
                onClick={scrollToPlatforms}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-accent-primary/30 text-text-primary font-semibold hover:bg-accent-primary/10 hover:border-accent-primary transition-all duration-300"
              >
                {ctaProcess}
                <ArrowDown size={18} />
              </button>
            </div>
          </motion.div>

          {/* Right: Illustration */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] max-w-2xl mx-auto">
              {/* SVG Illustration - Campaign Dashboard with light green background */}
              <svg
                viewBox="0 0 1024 768"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Light green background */}
                <rect width="1024" height="768" fill="#E8F5E9" rx="20" />

                {/* Google Ads Card - Top Left */}
                <g transform="translate(80, 120)">
                  <rect width="180" height="140" rx="24" fill="white" filter="drop-shadow(0 4px 20px rgba(0,0,0,0.08))" />
                  {/* Google Ads Logo */}
                  <g transform="translate(90, 40)">
                    <path d="M15 0L30 26H0L15 0Z" fill="#FBBC04" />
                    <path d="M0 26H30L15 52L0 26Z" fill="#4285F4" />
                    <circle cx="15" cy="26" r="8" fill="#34A853" />
                  </g>
                  <text x="90" y="110" fill="#1a1a1a" fontSize="16" textAnchor="middle" fontWeight="600">Google Ads</text>
                </g>

                {/* Meta Ads Card - Top Right */}
                <g transform="translate(764, 120)">
                  <rect width="180" height="140" rx="24" fill="white" filter="drop-shadow(0 4px 20px rgba(0,0,0,0.08))" />
                  {/* Meta Logo - Infinity symbol */}
                  <path d="M835 175C835 190 845 200 860 200C875 200 885 190 885 175C885 160 875 150 860 150C845 150 835 160 835 175Z" fill="#0084FF" />
                  <path d="M885 175C885 190 895 200 910 200C925 200 935 190 935 175C935 160 925 150 910 150C895 150 885 160 885 175Z" fill="#0084FF" />
                  <path d="M860 175C860 165 865 155 875 155C885 155 890 165 890 175C890 185 885 195 875 195C865 195 860 185 860 175Z" fill="#0084FF" />
                  <path d="M910 175C910 165 905 155 895 155C885 155 880 165 880 175C880 185 885 195 895 195C905 195 910 185 910 175Z" fill="#0084FF" />
                  <text x="854" y="230" fill="#1a1a1a" fontSize="16" textAnchor="middle" fontWeight="600">Meta Ads</text>
                </g>

                {/* Campaign Center Card */}
                <g transform="translate(300, 200)">
                  <rect width="424" height="260" rx="28" fill="white" filter="drop-shadow(0 6px 30px rgba(0,0,0,0.12))" />
                  
                  {/* Title */}
                  <text x="30" y="50" fill="#1a1a1a" fontSize="22" fontWeight="700">Kampaniyalar</text>
                  
                  {/* Date selector */}
                  <g transform="translate(280, 30)">
                    <rect width="120" height="36" rx="18" fill="#f5f5f5" />
                    <text x="60" y="23" fill="#666" fontSize="13" textAnchor="middle">Son 30 gün</text>
                    <path d="M95 18L90 23L95 28" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                  
                  {/* Progress bars */}
                  <g transform="translate(30, 90)">
                    <circle cx="12" cy="12" r="8" fill="#8BC34A" />
                    <rect x="35" y="8" width="180" height="8" rx="4" fill="#e0e0e0" />
                    <rect x="35" y="8" width="140" height="8" rx="4" fill="#757575" />
                    <rect x="280" y="8" width="80" height="8" rx="4" fill="#8BC34A" />
                  </g>
                  
                  <g transform="translate(30, 135)">
                    <circle cx="12" cy="12" r="8" fill="#e0e0e0" />
                    <rect x="35" y="8" width="180" height="8" rx="4" fill="#e0e0e0" />
                    <rect x="35" y="8" width="90" height="8" rx="4" fill="#bdbdbd" />
                    <rect x="280" y="8" width="80" height="8" rx="4" fill="#e0e0e0" />
                  </g>
                  
                  <g transform="translate(30, 180)">
                    <circle cx="12" cy="12" r="8" fill="#e0e0e0" />
                    <rect x="35" y="8" width="180" height="8" rx="4" fill="#e0e0e0" />
                    <rect x="35" y="8" width="110" height="8" rx="4" fill="#bdbdbd" />
                    <rect x="280" y="8" width="80" height="8" rx="4" fill="#e0e0e0" />
                  </g>
                </g>

                {/* TikTok Ads Card - Bottom Left */}
                <g transform="translate(80, 508)">
                  <rect width="180" height="140" rx="24" fill="white" filter="drop-shadow(0 4px 20px rgba(0,0,0,0.08))" />
                  {/* TikTok Logo */}
                  <g transform="translate(75, 35)">
                    <path d="M30 10C30 15 28 18 25 20L20 15C22 14 23 12 23 10V0H30V10Z" fill="#00F2EA" />
                    <path d="M20 15L15 20C12 18 10 15 10 10V0H17V10C17 12 18 14 20 15Z" fill="#FF0050" />
                    <path d="M10 10C10 15 12 18 15 20V30C8 30 3 25 3 18V8C3 5 5 3 8 3H10V10Z" fill="#000000" />
                  </g>
                  <text x="90" y="110" fill="#1a1a1a" fontSize="16" textAnchor="middle" fontWeight="600">TikTok Ads</text>
                </g>

                {/* LinkedIn Ads Card - Bottom Right */}
                <g transform="translate(764, 508)">
                  <rect width="180" height="140" rx="24" fill="white" filter="drop-shadow(0 4px 20px rgba(0,0,0,0.08))" />
                  {/* LinkedIn Logo */}
                  <g transform="translate(85, 45)">
                    <rect width="40" height="40" rx="6" fill="#0A66C2" />
                    <rect x="8" y="18" width="5" height="16" fill="white" />
                    <circle cx="10.5" cy="12" r="3" fill="white" />
                    <path d="M18 24V32H23V24C23 20 25 18 28 18C31 18 32 20 32 24V32H37V23C37 17 34 15 30 15C27 15 25 16 23 18V16H18V24Z" fill="white" />
                  </g>
                  <text x="854" y="110" fill="#1a1a1a" fontSize="16" textAnchor="middle" fontWeight="600">LinkedIn Ads</text>
                </g>

                {/* ROAS Card - Bottom Center Left */}
                <g transform="translate(300, 490)">
                  <rect width="190" height="130" rx="24" fill="white" filter="drop-shadow(0 4px 20px rgba(0,0,0,0.08))" />
                  <text x="25" y="40" fill="#999" fontSize="16" fontWeight="500">ROAS</text>
                  <text x="25" y="85" fill="#1a1a1a" fontSize="40" fontWeight="700">+180%</text>
                  {/* Up arrow */}
                  <path d="M150 60L165 75L160 75L160 95L155 95L155 75L150 75Z" fill="#4CAF50" />
                  <path d="M145 65L150 60L155 65" fill="#4CAF50" />
                </g>

                {/* Chart - Bottom Center Right */}
                <g transform="translate(520, 500)">
                  <rect width="184" height="120" rx="20" fill="white" filter="drop-shadow(0 4px 20px rgba(0,0,0,0.08))" />
                  
                  {/* Chart bars */}
                  <g transform="translate(35, 30)">
                    <rect x="0" y="55" width="20" height="25" rx="4" fill="#e0e0e0" />
                    <rect x="35" y="45" width="20" height="35" rx="4" fill="#d4e7c5" />
                    <rect x="70" y="30" width="20" height="50" rx="4" fill="#b8d99b" />
                    <rect x="105" y="10" width="20" height="70" rx="4" fill="#8BC34A" />
                  </g>
                  
                  {/* Trend line */}
                  <path d="M45 75L62 65L87 50L117 35" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </g>

                {/* Connecting lines with green dots */}
                <line x1="170" y1="190" x2="300" y2="280" stroke="#C8E6C9" strokeWidth="2.5" />
                <circle cx="170" cy="190" r="6" fill="#8BC34A" />
                <circle cx="300" cy="280" r="6" fill="#8BC34A" />
                
                <line x1="764" y1="190" x2="680" y2="280" stroke="#C8E6C9" strokeWidth="2.5" />
                <circle cx="764" cy="190" r="6" fill="#8BC34A" />
                <circle cx="680" cy="280" r="6" fill="#8BC34A" />
                
                <line x1="170" y1="578" x2="300" y2="520" stroke="#C8E6C9" strokeWidth="2.5" />
                <circle cx="170" cy="578" r="6" fill="#8BC34A" />
                <circle cx="300" cy="520" r="6" fill="#8BC34A" />
                
                <line x1="764" y1="578" x2="680" y2="520" stroke="#C8E6C9" strokeWidth="2.5" />
                <circle cx="764" cy="578" r="6" fill="#8BC34A" />
                <circle cx="680" cy="520" r="6" fill="#8BC34A" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
