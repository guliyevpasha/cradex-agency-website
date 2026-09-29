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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6 leading-tight">
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
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* SVG Illustration - Campaign Dashboard */}
              <svg
                viewBox="0 0 600 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Background gradient */}
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(108,99,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(151,71,255,0.1)" />
                  </linearGradient>
                </defs>
                <rect width="600" height="600" fill="url(#grad1)" rx="40" />

                {/* Google Ads Card - Top Left */}
                <g transform="translate(60, 80)">
                  <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(108,99,255,0.3)" strokeWidth="2" />
                  <circle cx="60" cy="45" r="20" fill="#4285F4" />
                  <text x="60" y="95" fill="white" fontSize="14" textAnchor="middle" fontWeight="600">Google Ads</text>
                </g>

                {/* Meta Ads Card - Top Right */}
                <g transform="translate(420, 80)">
                  <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(108,99,255,0.3)" strokeWidth="2" />
                  <circle cx="60" cy="45" r="20" fill="#0084FF" />
                  <text x="60" y="95" fill="white" fontSize="14" textAnchor="middle" fontWeight="600">Meta Ads</text>
                </g>

                {/* Campaign Center Card */}
                <g transform="translate(150, 240)">
                  <rect width="300" height="180" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(108,99,255,0.4)" strokeWidth="2" />
                  
                  {/* Title */}
                  <text x="20" y="35" fill="white" fontSize="18" fontWeight="600">Kampaniyalar</text>
                  
                  {/* Progress bars */}
                  <rect x="20" y="60" width="120" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
                  <rect x="20" y="60" width="80" height="8" rx="4" fill="#4CAF50" />
                  
                  <rect x="20" y="85" width="120" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
                  <rect x="20" y="85" width="60" height="8" rx="4" fill="rgba(255,255,255,0.3)" />
                  
                  <rect x="20" y="110" width="120" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
                  <rect x="20" y="110" width="90" height="8" rx="4" fill="rgba(255,255,255,0.3)" />
                  
                  {/* Stats */}
                  <text x="160" y="95" fill="white" fontSize="12">Son 30 gün</text>
                </g>

                {/* TikTok Ads Card - Bottom Left */}
                <g transform="translate(60, 400)">
                  <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(108,99,255,0.3)" strokeWidth="2" />
                  <circle cx="60" cy="45" r="20" fill="#00F2EA" />
                  <text x="60" y="95" fill="white" fontSize="14" textAnchor="middle" fontWeight="600">TikTok Ads</text>
                </g>

                {/* LinkedIn Ads Card - Bottom Right */}
                <g transform="translate(420, 400)">
                  <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(108,99,255,0.3)" strokeWidth="2" />
                  <circle cx="60" cy="45" r="20" fill="#0A66C2" />
                  <text x="60" y="95" fill="white" fontSize="14" textAnchor="middle" fontWeight="600">LinkedIn Ads</text>
                </g>

                {/* ROAS Card */}
                <g transform="translate(160, 450)">
                  <rect width="140" height="80" rx="15" fill="rgba(255,255,255,0.08)" stroke="rgba(76,175,80,0.4)" strokeWidth="2" />
                  <text x="20" y="30" fill="rgba(255,255,255,0.6)" fontSize="12">ROAS</text>
                  <text x="20" y="58" fill="#4CAF50" fontSize="28" fontWeight="700">+180%</text>
                </g>

                {/* Chart */}
                <g transform="translate(320, 450)">
                  <rect x="0" y="50" width="20" height="20" rx="4" fill="rgba(255,255,255,0.2)" />
                  <rect x="30" y="40" width="20" height="30" rx="4" fill="rgba(108,99,255,0.4)" />
                  <rect x="60" y="25" width="20" height="45" rx="4" fill="rgba(108,99,255,0.6)" />
                  <rect x="90" y="10" width="20" height="60" rx="4" fill="#4CAF50" />
                </g>

                {/* Connecting lines */}
                <line x1="120" y1="140" x2="200" y2="260" stroke="rgba(108,99,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="480" y1="140" x2="400" y2="260" stroke="rgba(108,99,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="120" y1="460" x2="200" y2="380" stroke="rgba(108,99,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="480" y1="460" x2="400" y2="380" stroke="rgba(108,99,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
