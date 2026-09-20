'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import CountUp from 'react-countup'
import { cn } from '@/lib/utils'

interface CTAStat {
  value: number
  suffix: string
  label: string
}

interface AboutFinalCTAProps {
  title: string
  titleAccent: string
  titleEnd: string
  description: string
  primaryButton: string
  stats: CTAStat[]
  locale: string
}

export function AboutFinalCTA({
  title,
  titleAccent,
  titleEnd,
  description,
  primaryButton,
  stats,
  locale,
}: AboutFinalCTAProps) {
  const router = useRouter()
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleClick = () => {
    router.push(`/${locale}/contact`)
  }

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary"
    >
      {/* Animated background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 50%, rgba(108,99,255,0.15) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 80% 50%, rgba(108,99,255,0.1) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Main Title */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6"
        >
          <span className="text-text-primary">{title} </span>
          <span className="text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text">
            {titleAccent}
          </span>
          <span className="text-text-primary"> {titleEnd}</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary/90 text-lg lg:text-xl max-w-3xl mx-auto mb-12"
        >
          {description}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <button
            onClick={handleClick}
            className={cn(
              'group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl overflow-hidden',
              'bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-[length:200%_100%]',
              'text-white font-display font-bold text-lg tracking-wide',
              'hover:bg-[position:100%_0]',
              'hover:scale-105 active:scale-95',
              'transition-all duration-700 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary',
              'shadow-2xl shadow-accent-primary/30',
              'hover:shadow-3xl hover:shadow-accent-primary/50'
            )}
          >
            {/* Animated shimmer */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-shimmer" />
            
            <span className="relative z-10">{primaryButton}</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-bg-tertiary/30 backdrop-blur-sm border border-border/20"
            >
              <div className="flex items-end justify-center gap-1 mb-3">
                <span className="text-5xl font-display font-bold text-text-primary">
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
                  <span className="text-3xl font-display font-bold text-accent-primary pb-1">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
