'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, CheckCircle2, Calendar } from 'lucide-react'
import type { ProcessStep } from '@/types'
import { useTranslations } from 'next-intl'

interface ProcessTimelineProps {
  steps: ProcessStep[]
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const t = useTranslations('services')
  const [activeTab, setActiveTab] = useState<'included' | 'roadmap'>('included')
  const [openIndex, setOpenIndex] = useState<number>(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Split steps: first 3 for "included", rest for "roadmap"
  const includedSteps = steps.slice(0, 3)
  const roadmapSteps = steps.slice(3)
  const displaySteps = activeTab === 'included' ? includedSteps : roadmapSteps

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
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-8">
            {t('process')}
          </h2>

          {/* Tab Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setActiveTab('included')
                setOpenIndex(0)
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'included'
                  ? 'bg-bg-tertiary border-2 border-accent-primary text-text-primary'
                  : 'bg-bg-tertiary/50 border-2 border-transparent text-text-secondary hover:border-accent-primary/30'
              }`}
            >
              <CheckCircle2 size={18} />
              <span className="text-sm sm:text-base">Nə daxildir</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('roadmap')
                setOpenIndex(0)
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'roadmap'
                  ? 'bg-bg-tertiary border-2 border-accent-primary text-text-primary'
                  : 'bg-bg-tertiary/50 border-2 border-transparent text-text-secondary hover:border-accent-primary/30'
              }`}
            >
              <Calendar size={18} />
              <span className="text-sm sm:text-base">Aylıq yol xəritəsi</span>
            </button>
          </div>
        </motion.div>

        {/* Accordion Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {displaySteps.map((step, index) => {
              const isOpen = openIndex === index
              const progress = ((index + 1) / displaySteps.length) * 100
              
              return (
                <motion.div
                  key={`${activeTab}-${step.step}`}
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
                    <div className="flex items-center justify-between p-4 sm:p-6">
                      {/* Left: Number and Title */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                            isOpen
                              ? 'bg-accent-primary text-white'
                              : 'bg-accent-primary/10 text-accent-primary'
                          }`}
                        >
                          {String(step.step).padStart(2, '0')}
                        </div>
                        <h3
                          className={`font-bold text-base sm:text-lg transition-colors truncate ${
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
                        <ChevronDown size={20} className="sm:w-6 sm:h-6" />
                      </motion.div>
                    </div>

                    {/* Content with Progress Bar */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pl-14 sm:pl-20">
                            <div className="border-l-2 border-accent-primary/50 pl-4 sm:pl-6">
                              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4">
                                {step.description}
                              </p>

                              {/* Progress Bar - only for roadmap */}
                              {activeTab === 'roadmap' && (
                                <div className="mt-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-text-muted">Tamamlanma həddi</span>
                                    <span className="text-sm font-bold text-text-primary">{Math.round(progress)}%</span>
                                  </div>
                                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progress}%` }}
                                      transition={{ duration: 1, delay: 0.3 }}
                                      className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}


