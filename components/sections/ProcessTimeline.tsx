'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ChevronDown, 
  CheckCircle2, 
  Calendar,
  Search,
  Target,
  FileEdit,
  Rocket,
  BarChart3,
  Zap
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ProcessTimelineProps {
  steps?: any[] // Optional, not used for Digital Marketing
}

// Icon mapping for each step
const stepIcons = [
  Search,      // 01 - K╔Ö┼ƒfiyyat v╔Ö Audit
  Target,      // 02 - Strategiya v╔Ö Planla┼ƒd─▒rma
  FileEdit,    // 03 - Kontent Yarad─▒lmas─▒
  Rocket,      // 04 - ─░cra v╔Ö Optimizasiya
  BarChart3,   // 05 - Hesabat v╔Ö T╔Öhlil
  Zap,         // 06 - Davaml─▒ ─░nki┼ƒaf
]

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const t = useTranslations('services')
  const tDM = useTranslations('services.digitalMarketing')
  const [activeTab, setActiveTab] = useState<'included' | 'roadmap'>('included')
  const [openIndex, setOpenIndex] = useState<number>(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Get process data from translations
  const processData = {
    included: [
      {
        step: 1,
        title: tDM('process.included.0.title'),
        description: tDM('process.included.0.description'),
      },
      {
        step: 2,
        title: tDM('process.included.1.title'),
        description: tDM('process.included.1.description'),
      },
      {
        step: 3,
        title: tDM('process.included.2.title'),
        description: tDM('process.included.2.description'),
      },
      {
        step: 4,
        title: tDM('process.included.3.title'),
        description: tDM('process.included.3.description'),
      },
      {
        step: 5,
        title: tDM('process.included.4.title'),
        description: tDM('process.included.4.description'),
      },
      {
        step: 6,
        title: tDM('process.included.5.title'),
        description: tDM('process.included.5.description'),
      },
    ],
    roadmap: [
      {
        step: 1,
        title: tDM('process.roadmap.0.title'),
        description: tDM('process.roadmap.0.description'),
        progress: 15,
      },
      {
        step: 2,
        title: tDM('process.roadmap.1.title'),
        description: tDM('process.roadmap.1.description'),
        progress: 30,
      },
      {
        step: 3,
        title: tDM('process.roadmap.2.title'),
        description: tDM('process.roadmap.2.description'),
        progress: 55,
      },
      {
        step: 4,
        title: tDM('process.roadmap.3.title'),
        description: tDM('process.roadmap.3.description'),
        progress: 75,
      },
      {
        step: 5,
        title: tDM('process.roadmap.4.title'),
        description: tDM('process.roadmap.4.description'),
        progress: 100,
      },
    ],
  }

  const displaySteps = activeTab === 'included' ? processData.included : processData.roadmap

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
              <span className="text-sm sm:text-base">{tDM('process.tabIncluded')}</span>
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
              <span className="text-sm sm:text-base">{tDM('process.tabRoadmap')}</span>
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
              const progress = 'progress' in step ? step.progress : undefined
              
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
                      {/* Left: Icon and Title */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        {/* Modern Icon with 3D effect and glow */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotateY: 15 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            isOpen
                              ? 'bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary shadow-[0_0_30px_rgba(99,102,241,0.6)]'
                              : 'bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                          }`}
                          style={{
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {(() => {
                            const IconComponent = stepIcons[index] || Search
                            return (
                              <IconComponent
                                size={28}
                                className={`transition-all duration-300 ${
                                  isOpen ? 'text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' : 'text-accent-primary'
                                }`}
                                strokeWidth={2.5}
                              />
                            )
                          })()}
                        </motion.div>
                        <h3
                          className={`font-bold text-base sm:text-lg lg:text-xl transition-colors ${
                            isOpen ? 'text-text-primary' : 'text-text-secondary'
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>

                      {/* Right: Chevron */}
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
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pl-16 sm:pl-24">
                            <div className="border-l-2 border-accent-primary/30 pl-4 sm:pl-6">
                              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4">
                                {step.description}
                              </p>

                              {/* Progress Bar - only for roadmap */}
                              {activeTab === 'roadmap' && progress !== undefined && (
                                <div className="mt-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-text-muted">{tDM('process.progressLabel')}</span>
                                    <span className="text-sm font-bold text-text-primary">{progress}%</span>
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



