'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Building2, 
  ShoppingCart, 
  Megaphone, 
  Blocks,
  Briefcase
} from 'lucide-react'

interface WebsiteType {
  title: string
  description: string
}

interface WebsiteTypesSectionProps {
  title: string
  subtitle: string
  types: WebsiteType[]
}

const iconMap = [Building2, ShoppingCart, Megaphone, Blocks, Briefcase]

export default function WebsiteTypesSection({ title, subtitle, types }: WebsiteTypesSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type, index) => {
            const IconComponent = iconMap[index] || Building2
            return (
              <motion.div
                key={type.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-bg-tertiary/30 border border-bg-tertiary/50 rounded-2xl p-6 hover:border-accent-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
              >
                {/* Icon */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300">
                    <IconComponent 
                      size={24} 
                      className="text-accent-primary"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {type.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
