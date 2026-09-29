'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, X, MessageCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title: string
  subtitle: string
  items: FAQItem[]
  ctaText?: string
  ctaButton: string
}

export function FAQ({ title, subtitle, items, ctaText, ctaButton }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Safety check for items
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null
  }

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left side - Title and CTA */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="lg:sticky lg:top-24">
              <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">FAQ</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
                {title}
              </h2>
              
              <p className="text-sm lg:text-base text-text-secondary mb-8">
                {subtitle}
              </p>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                <MessageCircle size={18} />
                {ctaButton}
              </a>
            </div>
          </motion.div>

          {/* Right side - FAQ Items */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 space-y-3"
          >
            {items.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <motion.div
                  key={index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full text-left transition-all duration-300 rounded-2xl ${
                      isOpen
                        ? 'bg-bg-tertiary border-accent-primary/30'
                        : 'bg-bg-secondary/50 border-bg-tertiary/50 hover:border-accent-primary/20'
                    } border p-5 sm:p-6`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3
                        className={`text-base sm:text-lg font-bold pr-4 transition-colors ${
                          isOpen ? 'text-text-primary' : 'text-text-secondary'
                        }`}
                      >
                        {item.question}
                      </h3>
                      
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                          isOpen
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-accent-primary/10 text-accent-primary'
                        }`}
                      >
                        {isOpen ? <X size={16} /> : <Plus size={16} />}
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm sm:text-base text-text-secondary leading-relaxed mt-4 pt-4 border-t border-accent-primary/10">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
