'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown } from 'lucide-react'
import type { ProcessStep } from '@/types'
import { useTranslations } from 'next-intl'

interface ProcessTimelineProps {
  steps: ProcessStep[]
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const t = useTranslations('services')
  const [openIndex, setOpenIndex] = useState<number>(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary">
            {t('process')}
          </h2>
        </motion.div>

        {/* Accordion Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isOpen = openIndex === index
            
            return (
              <motion.div
                key={step.step}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className={`w-full text-left transition-all duration-300 rounded-2xl ${
                    isOpen
                      ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border-accent-primary/30'
                      : 'bg-bg-tertiary/30 border-bg-tertiary/50 hover:border-accent-primary/20'
                  } border`}
                >
                  <div className="flex items-center justify-between p-6">
                    {/* Left: Number and Title */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                          isOpen
                            ? 'bg-accent-primary text-white'
                            : 'bg-accent-primary/10 text-accent-primary'
                        }`}
                      >
                        {String(step.step).padStart(2, '0')}
                      </div>
                      <h3
                        className={`font-bold text-lg transition-colors ${
                          isOpen ? 'text-text-primary' : 'text-text-secondary'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Right: Icon */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-shrink-0 ${
                        isOpen ? 'text-accent-primary' : 'text-text-muted'
                      }`}
                    >
                      <ChevronDown size={24} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-20">
                          <div className="border-l-2 border-accent-primary/50 pl-6">
                            <p className="text-text-secondary leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

