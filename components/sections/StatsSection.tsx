'use client'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export function StatsSection() {
  const t = useTranslations('home.statistics')
  const prefersReduced = useReducedMotion()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  const stats = t.raw('stats') as Array<{ value: number; suffix: string; label: string }>

  return (
    <section
      ref={ref}
      className="relative py-14 overflow-hidden"
      style={{
        background: `linear-gradient(180deg,
          transparent 0%,
          #08081e 30%,
          #0a0a1f 60%,
          #0A0A0F 100%)`,
        marginTop: '-1px',
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%,
            rgba(108,99,255,0.06) 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              {/* Number */}
              <div className="flex items-end gap-0.5 mb-1">
                <span
                  className="font-display font-bold leading-none"
                  style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  aria-live="polite"
                >
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={prefersReduced ? 0 : 2}
                      useEasing
                    />
                  ) : '0'}
                </span>
                <span
                  className="font-display font-bold pb-0.5"
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <p className="text-text-secondary text-xs sm:text-sm leading-tight">
                {stat.label}
              </p>

              {/* Divider dot */}
              <div className="w-1 h-1 rounded-full bg-accent-primary/40 mt-3" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  )
}
