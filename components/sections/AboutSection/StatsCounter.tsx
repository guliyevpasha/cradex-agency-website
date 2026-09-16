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
      className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'flex flex-col items-center text-center p-6 rounded-2xl',
            'bg-gradient-to-br from-bg-secondary/50 to-bg-tertiary/30',
            'border border-border/50 backdrop-blur-sm',
            'hover:border-accent-primary/30 transition-all duration-300'
          )}
        >
          {/* Number */}
          <div className="flex items-end gap-1 mb-2">
            <span
              className="font-display font-bold leading-none bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              aria-label={stat.ariaLabel}
              aria-live="polite"
            >
              {inView ? (
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={prefersReducedMotion ? 0 : 2}
                  useEasing
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
                className="font-display font-bold text-accent-primary pb-1"
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}
              >
                {stat.suffix}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="text-text-secondary text-sm sm:text-base leading-snug">
            {stat.label}
          </p>
        </div>
      ))}
    </motion.div>
  )
}
