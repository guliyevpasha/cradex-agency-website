'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Target, TrendingUp, BarChart3 } from 'lucide-react'

interface StrategicApproachProps {
  title: string
  description: string
  highlights: Array<{
    icon: string
    text: string
  }>
}

const iconMap = {
  target: Target,
  trending: TrendingUp,
  chart: BarChart3,
}

export function StrategicApproach({ title, description, highlights }: StrategicApproachProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-gradient-to-b from-bg-primary to-bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Remove title section - only show description as intro */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed max-w-4xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {highlights.map((highlight, index) => {
            const IconComponent = iconMap[highlight.icon as keyof typeof iconMap] || Target

            return (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-bg-tertiary/40 backdrop-blur-sm border border-accent-primary/20 rounded-2xl p-5 sm:p-6 lg:p-8 h-full hover:border-accent-primary/40 transition-all duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    
                    <p className="text-xs sm:text-sm lg:text-base text-text-secondary leading-relaxed pt-1 sm:pt-2">
                      {highlight.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
