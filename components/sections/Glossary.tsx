'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface GlossaryProps {
  title: string
  subtitle: string
  terms: Array<{
    term: string
    definition: string
    icon?: string
  }>
}

export function Glossary({ title, subtitle, terms }: GlossaryProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            {title}
          </h2>
          <p className="text-base lg:text-lg text-text-secondary max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {terms.map((term, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full bg-gradient-to-br from-green-500/5 to-accent-primary/5 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                {/* Color indicator */}
                <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-green-500 to-accent-primary rounded-b-full" />
                
                <div className="pt-2">
                  <div className="flex items-start gap-2 mb-3">
                    {term.icon && (
                      <span className="flex-shrink-0 w-5 h-5 rounded bg-green-500/20 flex items-center justify-center text-xs">
                        {term.icon}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-text-primary group-hover:text-green-400 transition-colors">
                      {term.term}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {term.definition}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
