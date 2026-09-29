'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, X } from 'lucide-react'

interface WhoIsThisForProps {
  title: string
  subtitle: string
  suitable: Array<{
    title: string
    description: string
  }>
  notSuitable: Array<{
    title: string
    description: string
  }>
  ctaText?: string
}

export function WhoIsThisFor({ title, subtitle, suitable, notSuitable, ctaText }: WhoIsThisForProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            {title}
          </h2>
          <p className="text-base lg:text-lg text-text-secondary max-w-3xl">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Suitable Column - Green */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="border-t-4 border-green-500 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-text-primary">Bu xidmət sizin üçündür</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {suitable.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-bg-tertiary/30 hover:bg-bg-tertiary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-1">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Not Suitable Column - Red */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="border-t-4 border-red-500 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-text-primary">Bu xidmət sizin üçün deyil</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {notSuitable.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-bg-tertiary/30 hover:bg-bg-tertiary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-1">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {ctaText && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-text-muted">
              {ctaText.split('Pulsuz məsləhət alın')[0]}
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-secondary underline font-semibold transition-colors"
              >
                Pulsuz məsləhət alın
              </a>
              {ctaText.includes('—') && <span> — {ctaText.split('—')[1]}</span>}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
