'use client'

import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { aboutFadeIn } from '@/lib/animations/variants'
import { cn } from '@/lib/utils'

interface Stat {
  value: number
  suffix: string
  label: string
  ariaLabel: string
}

interface StatsCounterProps {
  stats: Stat[]
  inView: boolean
}

export function StatsCounter({ stats, inView }: StatsCounterProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial={prefersReducedMotion ? false : 'hidden'}
      animate={inView ? 'visible' : 'hidden'}
      variants={aboutFadeIn}
      className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 mb-24"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'group relative flex flex-col items-center text-center p-10 lg:p-12 rounded-3xl',
            'bg-gradient-to-br from-bg-secondary/40 via-bg-tertiary/20 to-bg-secondary/40',
            'border border-border/30 backdrop-blur-md',
            'hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/10',
            'transition-all duration-500 ease-out',
            'hover:scale-105'
          )}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-primary/0 via-accent-secondary/0 to-accent-primary/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          
          {/* Number */}
          <div className="relative flex items-end gap-2 mb-4">
            <span
              className="font-display font-bold leading-none bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent"
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
              aria-label={stat.ariaLabel}
              aria-live="polite"
            >
              {inView ? (
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={prefersReducedMotion ? 0 : 2.5}
                  useEasing
                  separator=""
                  easingFn={(t) => {
                    // easeOutCubic
                    return ((t = t - 1) * t * t + 1)
                  }}
                />
              ) : (
                '0'
              )}
            </span>
            {stat.suffix && (
              <span
                className="font-display font-bold text-accent-primary pb-2"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
              >
                {stat.suffix}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="relative text-text-secondary text-base sm:text-lg font-medium leading-snug">
            {stat.label}
          </p>
        </div>
      ))}
    </motion.div>
  )
}
