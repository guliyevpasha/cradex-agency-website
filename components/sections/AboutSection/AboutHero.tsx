'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { AboutBadgesMarquee } from './AboutBadgesMarquee'

interface Badge {
  icon: string
  text: string
}

interface Stat {
  value: number
  suffix: string
  label: string
}

interface AboutHeroProps {
  eyebrow: string
  title: string
  titleAccent: string
  titleEnd: string
  description: string
  badges: Badge[] // Keep for compatibility but won't use
  stats: Stat[]
}

export function AboutHero({
  eyebrow,
  title,
  titleAccent,
  titleEnd,
  description,
  stats,
}: AboutHeroProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary py-32 lg:py-40"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        {/* Eyebrow */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-bg-tertiary/50 border border-accent-primary/20 text-sm font-medium text-text-secondary uppercase tracking-wider">
            / {eyebrow} /
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight">
            <div className="text-text-primary mb-2">{title}</div>
            <div className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
              {titleAccent}
            </div>
            <div className="text-text-primary mt-2">{titleEnd}</div>
          </div>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-text-secondary text-lg lg:text-xl max-w-4xl mx-auto mb-12"
        >
          {description}
        </motion.p>
      </div>

      {/* Animated Badges Marquee - Full Width */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full mb-20"
      >
        <AboutBadgesMarquee />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">

        {/* Stats */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-bg-tertiary/30 border border-border/20"
            >
              <div className="flex items-end justify-center gap-1 mb-3">
                <span className="text-4xl lg:text-5xl font-display font-bold text-text-primary">
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={prefersReducedMotion ? 0 : 2.5}
                      separator=""
                      useEasing
                    />
                  ) : (
                    '0'
                  )}
                </span>
                {stat.suffix && (
                  <span className="text-2xl lg:text-3xl font-display font-bold text-accent-primary pb-1">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
