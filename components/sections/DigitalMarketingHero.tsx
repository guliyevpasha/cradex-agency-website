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
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-xl mx-auto">
              {/* Main container with light green background */}
              <div className="relative bg-[#E8F5E9] rounded-3xl p-8 lg:p-12">
                
                {/* Top row - Google Ads and Meta Ads */}
                <div className="flex justify-between items-start mb-8">
                  {/* Google Ads Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center w-[140px]">
                    <svg className="w-12 h-12 mb-3" viewBox="0 0 48 48" fill="none">
                      <path d="M24 10L34 28H14L24 10Z" fill="#FBBC04"/>
                      <path d="M14 28H34L24 46L14 28Z" fill="#4285F4"/>
                      <circle cx="24" cy="28" r="6" fill="#34A853"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">Google Ads</span>
                  </div>

                  {/* Meta Ads Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center w-[140px]">
                    <svg className="w-12 h-12 mb-3" viewBox="0 0 48 48" fill="none">
                      <path d="M18 24C18 27.314 20.686 30 24 30C27.314 30 30 27.314 30 24C30 20.686 27.314 18 24 18C20.686 18 18 20.686 18 24Z" fill="#0084FF"/>
                      <path d="M24 18C20.686 18 18 20.686 18 24H30C30 20.686 27.314 18 24 18Z" fill="#0084FF"/>
                      <circle cx="36" cy="24" r="6" fill="#00C6FF"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">Meta Ads</span>
                  </div>
                </div>

                {/* Center - Kampaniyalar Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Kampaniyalar</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Son 30 gün</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Progress bars */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#8BC34A]"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[75%] bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="w-16 h-2 bg-[#8BC34A] rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[50%] bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[60%] bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom row - TikTok, ROAS, Chart, LinkedIn */}
                <div className="grid grid-cols-2 gap-4">
                  {/* TikTok Ads Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="12" fill="#000000"/>
                      <path d="M32 16C32 20 30 23 27 25L23 21C25 20 26 18 26 16V8H32V16Z" fill="#00F2EA"/>
                      <path d="M23 21L19 25C16 23 14 20 14 16V8H20V16C20 18 21 20 23 21Z" fill="#FF0050"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-800">TikTok Ads</span>
                  </div>

                  {/* ROAS Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-lg">
                    <div className="text-xs text-gray-500 mb-1">ROAS</div>
                    <div className="text-2xl font-bold text-gray-800">+180%</div>
                    <svg className="w-6 h-6 mt-1 text-[#8BC34A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14l5-5 5 5H7z"/>
                    </svg>
                  </div>

                  {/* Chart Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-lg">
                    <div className="flex items-end justify-between h-16">
                      <div className="w-6 h-8 bg-gray-300 rounded"></div>
                      <div className="w-6 h-10 bg-[#C8E6C9] rounded"></div>
                      <div className="w-6 h-12 bg-[#9CCC65] rounded"></div>
                      <div className="w-6 h-16 bg-[#8BC34A] rounded"></div>
                    </div>
                  </div>

                  {/* LinkedIn Ads Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="8" fill="#0A66C2"/>
                      <rect x="12" y="20" width="4" height="16" fill="white"/>
                      <circle cx="14" cy="14" r="2.5" fill="white"/>
                      <path d="M22 28V36H26V28C26 25 27 24 29 24C31 24 32 25 32 28V36H36V27C36 22 34 20 30 20C28 20 26 21 25 23V20H22V28Z" fill="white"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-800">LinkedIn Ads</span>
                  </div>
                </div>

                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25%" y1="22%" x2="35%" y2="35%" stroke="#C8E6C9" strokeWidth="2"/>
                  <circle cx="25%" cy="22%" r="4" fill="#8BC34A"/>
                  
                  <line x1="75%" y1="22%" x2="65%" y2="35%" stroke="#C8E6C9" strokeWidth="2"/>
                  <circle cx="75%" cy="22%" r="4" fill="#8BC34A"/>
                  
                  <line x1="25%" y1="75%" x2="35%" y2="62%" stroke="#C8E6C9" strokeWidth="2"/>
                  <circle cx="25%" cy="75%" r="4" fill="#8BC34A"/>
                  
                  <line x1="75%" y1="75%" x2="65%" y2="62%" stroke="#C8E6C9" strokeWidth="2"/>
                  <circle cx="75%" cy="75%" r="4" fill="#8BC34A"/>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
