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
      className="relative py-20 lg:py-28 bg-[#E8F5E9] overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section title */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <div className="w-24 h-1 bg-[#8BC34A] rounded-full" />
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
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full border-2 border-transparent hover:border-[#8BC34A]/30">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-[#8BC34A]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Card number (decorative) */}
                  <div className="absolute top-6 right-6 text-6xl font-bold text-gray-100 select-none">
                    0{index + 1}
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
