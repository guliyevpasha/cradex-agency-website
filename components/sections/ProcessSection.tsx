'use client'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

/* ── SVG icons ── */
const STEP_ICONS = [
  <svg key="brief" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-7 h-7">
    <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M16 16h16M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="36" cy="36" r="7" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M33 36l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  <svg key="analysis" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-7 h-7">
    <circle cx="22" cy="22" r="13" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M31.5 31.5L41 41" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 22h12M22 16v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>,
  <svg key="exec" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-7 h-7">
    <path d="M8 40l8-8 6 6 10-14 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 8l2 2-18 18-4 2 2-4L38 8z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  <svg key="report" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-7 h-7">
    <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M14 32v-8M20 32v-12M26 32v-6M32 32v-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M14 18l6-4 6 6 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
]

const STEP_COLORS = [
  { bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.45)', glow: '0 0 40px rgba(108,99,255,0.3)', accent: '#6C63FF', particle: 'rgba(108,99,255,0.6)' },
  { bg: 'rgba(0,212,255,0.10)',  border: 'rgba(0,212,255,0.4)',   glow: '0 0 40px rgba(0,212,255,0.25)',  accent: '#00D4FF', particle: 'rgba(0,212,255,0.6)' },
  { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.45)', glow: '0 0 40px rgba(139,92,246,0.3)', accent: '#8B5CF6', particle: 'rgba(139,92,246,0.6)' },
  { bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.4)',   glow: '0 0 40px rgba(34,197,94,0.25)',  accent: '#22C55E', particle: 'rgba(34,197,94,0.6)' },
]

/* Floating dot positions per card (deterministic, no random) */
const PARTICLES = [
  [{ x: 12, y: 10 }, { x: 80, y: 18 }, { x: 55, y: 75 }],
  [{ x: 20, y: 15 }, { x: 75, y: 12 }, { x: 60, y: 80 }],
  [{ x: 15, y: 20 }, { x: 78, y: 10 }, { x: 50, y: 78 }],
  [{ x: 18, y: 12 }, { x: 72, y: 20 }, { x: 58, y: 72 }],
]

export function ProcessSection() {
  const t = useTranslations('home.process')
  const prefersReduced = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.1 })

  const steps = t.raw('steps') as Array<{ number: string; title: string; desc: string }>

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Diagonal grid background - stronger pattern */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, currentColor 1px, transparent 1px),
            linear-gradient(-45deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />
      
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(108,99,255,0.07) 0%, transparent 70%)',
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.span
            initial={prefersReduced ? false : { opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-primary/30 bg-accent-primary/10 text-accent-primary text-xs font-semibold tracking-[0.16em] mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            {t('sectionLabel')}
          </motion.span>

          <motion.h2
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-display-lg font-display font-bold text-text-primary mb-4"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="text-text-secondary text-base max-w-lg mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* ── Steps grid ── */}
        <div className="relative">



          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-stretch">
            {steps.map((step, i) => {
              const color = STEP_COLORS[i % STEP_COLORS.length]
              const dots = PARTICLES[i]

              return (
                <motion.div
                  key={step.number}
                  initial={prefersReduced ? false : { opacity: 0, y: 56, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.65, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col items-center text-center h-full"
                >
                  {/* Card */}
                  <div
                    className="relative w-full h-full rounded-2xl p-6 pt-9 flex flex-col items-center text-center overflow-hidden transition-all duration-500 group-hover:-translate-y-3"
                    style={{
                      background: color.bg,
                      border: `1px solid ${color.border}`,
                      boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset',
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ boxShadow: color.glow }}
                    />

                    {/* Floating particles */}
                    {!prefersReduced && dots.map((dot, di) => (
                      <motion.div
                        key={di}
                        className="absolute w-1 h-1 rounded-full pointer-events-none"
                        style={{
                          left: `${dot.x}%`,
                          top: `${dot.y}%`,
                          background: color.particle,
                        }}
                        animate={inView ? {
                          y: [0, -8, 0, -5, 0],
                          opacity: [0.3, 0.8, 0.3, 0.7, 0.3],
                          scale: [1, 1.4, 1, 1.2, 1],
                        } : {}}
                        transition={{
                          duration: 3 + di * 0.7,
                          delay: 0.8 + i * 0.15 + di * 0.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}

                    {/* Step number badge */}
                    <motion.div
                      initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
                      animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold text-white tracking-wider z-10"
                      style={{ background: color.accent }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon box */}
                    <motion.div
                      initial={prefersReduced ? false : { scale: 0.6, opacity: 0, rotate: -10 }}
                      animate={inView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
                      transition={{ duration: 0.55, delay: 0.45 + i * 0.15, type: 'spring', stiffness: 200, damping: 16 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative"
                      style={{
                        background: `linear-gradient(135deg, ${color.bg}, rgba(255,255,255,0.03))`,
                        border: `1.5px solid ${color.border}`,
                        color: color.accent,
                      }}
                    >
                      {/* Pulse ring on hover */}
                      <span
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none"
                        style={{ border: `1px solid ${color.accent}`, animationDuration: '1s' }}
                      />
                      {STEP_ICONS[i]}
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.55 + i * 0.15 }}
                      className="font-display font-bold text-base mb-2.5 leading-snug w-full"
                      style={{ color: color.accent }}
                    >
                      {step.title}
                    </motion.h3>

                    {/* Description — flex-1 pushes all cards to equal height */}
                    <motion.p
                      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.62 + i * 0.15 }}
                      className="text-text-secondary text-sm leading-relaxed flex-1 w-full"
                    >
                      {step.desc}
                    </motion.p>
                  </div>                  {/* Mobile down arrow */}
                  {i < steps.length - 1 && (
                    <motion.div
                      className="sm:hidden mt-4 mb-1"
                      initial={prefersReduced ? false : { opacity: 0, y: -6 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.7 + i * 0.15 }}
                      aria-hidden="true"
                    >
                      <motion.svg
                        width="20" height="24" viewBox="0 0 20 24" fill="none"
                        animate={inView && !prefersReduced ? { y: [0, 4, 0] } : {}}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 1 + i * 0.2 }}
                      >
                        <path d="M10 2v16M4 14l6 6 6-6" stroke={color.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    </motion.div>
                  )}

                  {/* Desktop arrow between cards */}
                  {i < steps.length - 1 && (
                    <motion.div
                      className="absolute top-[60px] -right-3 z-10 hidden lg:flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: STEP_COLORS[i + 1].accent + '22',
                        border: `1px solid ${STEP_COLORS[i + 1].accent}44`,
                      }}
                      initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
                      animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: 1.2 + i * 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                      aria-hidden="true"
                    >
                      <motion.svg
                        width="10" height="10" viewBox="0 0 10 10" fill="none"
                        animate={inView && !prefersReduced ? { x: [0, 2, 0] } : {}}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 + i * 0.2 }}
                      >
                        <path d="M2 5h6M5 2l3 3-3 3" stroke={STEP_COLORS[i + 1].accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
