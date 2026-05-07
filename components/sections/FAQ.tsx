'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { cn } from '@/lib/utils/cn'

export function FAQ() {
  const t = useTranslations('home.faq')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const items = t.raw('items') as Array<{ q: string; a: string }>
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── Left: text block ── */}
          <ScrollReveal animation="fadeInLeft" className="lg:col-span-2 lg:sticky lg:top-28">
            {/* Section label */}
            <p className="text-accent-primary text-xs font-semibold tracking-[0.18em] mb-4">
              {t('sectionLabel')}
            </p>

            {/* Heading */}
            <h2 className="text-display-md font-display font-bold text-text-primary leading-tight mb-4">
              {t('title')}{' '}
              <span className="relative inline-block">
                <em className="not-italic gradient-text">{t('titleAccent')}</em>
                {/* Wavy underline */}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 160 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 5 C30 2, 60 7, 90 4 C120 1, 140 6, 158 4"
                    stroke="url(#faq-underline)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="faq-underline" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#6C63FF" />
                      <stop offset="100%" stopColor="#00D4FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {t('description')}
            </p>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
            >
              <MessageCircle size={16} />
              {t('ctaButton')}
            </a>
          </ScrollReveal>

          {/* ── Right: accordion ── */}
          <ScrollReveal animation="fadeInRight" className="lg:col-span-3">
            <div className="space-y-3" role="list">
              {items.map((item, index) => {
                const isOpen = openIndex === index

                return (
                  <div
                    key={index}
                    role="listitem"
                    className={cn(
                      'rounded-2xl border overflow-hidden transition-all duration-300',
                      isOpen
                        ? 'border-accent-primary/60 shadow-[0_0_24px_rgba(108,99,255,0.2)]'
                        : 'border-white/10 hover:border-accent-primary/30 hover:shadow-[0_0_16px_rgba(108,99,255,0.1)]'
                    )}
                  >
                    {/* Question button */}
                    <button
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                      className={cn(
                        'w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-all duration-300',
                        isOpen
                          ? 'bg-accent-primary text-white'
                          : 'bg-white/[0.04] backdrop-blur-sm text-text-primary hover:bg-white/[0.07]'
                      )}
                    >
                      <span className="font-medium text-sm leading-snug pr-2">
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="shrink-0"
                        aria-hidden="true"
                      >
                        <ChevronDown
                          size={18}
                          className={isOpen ? 'text-white' : 'text-accent-primary'}
                        />
                      </motion.span>
                    </button>

                    {/* Answer — animated height */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          role="region"
                          aria-labelledby={`faq-question-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 py-4 bg-white/[0.02] backdrop-blur-sm border-t border-white/10">
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
