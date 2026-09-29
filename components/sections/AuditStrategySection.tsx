'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { BarChart3, Search, TrendingUp } from 'lucide-react'

interface AuditStrategyItem {
  title: string
  description: string
  icon: 'chart' | 'search' | 'trending'
}

interface AuditStrategySectionProps {
  title: string
  items: AuditStrategyItem[]
}

const iconMap = {
  chart: BarChart3,
  search: Search,
  trending: TrendingUp,
}

export function AuditStrategySection({ title, items }: AuditStrategySectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-28 bg-bg-secondary overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(108,99,255,0.15) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section title */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full" />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon]
            
            return (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative bg-bg-tertiary/50 rounded-3xl p-8 border border-accent-primary/10 hover:border-accent-primary/30 hover:bg-bg-tertiary/70 transition-all duration-300 h-full group">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mb-6 group-hover:bg-accent-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-accent-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-accent-primary transition-colors duration-200">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
