'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowDown } from 'lucide-react'

interface DigitalMarketingHeroProps {
  title: string
  description: string
  ctaStart: string
  ctaProcess: string
  locale: string
  imagePath?: string
}

export function DigitalMarketingHero({
  title,
  description,
  ctaStart,
  ctaProcess,
  locale,
  imagePath = '/images/digital-marketing-hero.webp',
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-text-primary mb-6 leading-tight">
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

          {/* Right: Illustration with 3D animation */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.9, rotateY: -15 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{ perspective: '1000px' }}
            className="relative"
          >
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      rotateY: [0, -5, 5, 0],
                      rotateX: [0, 2, -2, 0],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-2xl mx-auto"
            >
              {/* 3D Shadow layer */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 blur-2xl rounded-2xl"
                style={{
                  transform: 'translateZ(-50px)',
                }}
              />
              
              {/* Image with 3D effect */}
              <div
                className="relative"
                style={{
                  transform: 'translateZ(30px)',
                }}
              >
                <Image
                  src={imagePath}
                  alt="Digital Marketing Platforms - Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads"
                  width={1024}
                  height={768}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  priority
                />
                
                {/* Floating glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 blur-3xl -z-10 rounded-3xl opacity-50" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
