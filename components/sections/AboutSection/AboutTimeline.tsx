'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  year: string
  title: string
  description: string
}

interface AboutTimelineProps {
  number: string
  subtitle: string
  title: string
  titleAccent: string
  titleEnd: string
  events: TimelineEvent[]
  archiveLink: string
}

export function AboutTimeline({
  number,
  subtitle,
  title,
  titleAccent,
  titleEnd,
  events,
}: AboutTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)

  // Each event gets its own ref for intersection tracking
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Section scroll progress for the vertical line fill
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Track which item is in view via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((el, index) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index)
            setHasEntered(true)
          }
        },
        { rootMargin: '-30% 0px -30% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [events.length])

  function scrollToIndex(index: number) {
    itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-36 bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(108,99,255,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-accent-primary text-sm font-mono tracking-widest">{number}</span>
            <span className="w-px h-4 bg-border/30" />
            <span className="text-text-muted text-xs uppercase tracking-widest">{subtitle}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
            <span className="text-text-primary">{title} </span>
            <span className="text-transparent bg-gradient-to-r from-accent-primary via-purple-400 to-cyan-400 bg-clip-text">
              {titleAccent}
            </span>
            {titleEnd && <span className="text-text-primary"> {titleEnd}</span>}
          </h2>
        </motion.div>

        {/* ── Timeline Body ── */}
        <div className="relative flex gap-8 lg:gap-16">
          {/* Left: vertical line + dots nav (desktop) */}
          <div className="hidden lg:flex flex-col items-center shrink-0 w-16 pt-2">
            {/* Track */}
            <div className="relative flex-1 w-px bg-white/10 mt-1">
              {/* Animated fill */}
              <motion.div
                className="absolute top-0 left-0 w-full origin-top bg-gradient-to-b from-accent-primary to-cyan-400 rounded-full"
                style={{ height: lineHeight }}
              />
            </div>
          </div>

          {/* Right: event cards */}
          <div className="flex-1 flex flex-col gap-6">
            {events.map((event, index) => {
              const isActive = activeIndex === index

              return (
                <div
                  key={event.year}
                  ref={(el) => { itemRefs.current[index] = el }}
                  className="relative"
                >
                  {/* Mobile line dot */}
                  <div className="lg:hidden absolute -left-6 top-7 w-2.5 h-2.5 rounded-full border-2 border-accent-primary bg-bg-primary shrink-0" />

                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, delay: index * 0.04 }}
                    className={cn(
                      'relative p-8 lg:p-10 rounded-2xl border transition-all duration-500',
                      isActive && hasEntered
                        ? 'border-accent-primary/40 bg-white/[0.04] shadow-[0_0_40px_rgba(108,99,255,0.08)]'
                        : 'border-white/[0.06] bg-white/[0.02]'
                    )}
                  >
                    {/* Year pill */}
                    <div
                      className={cn(
                        'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-mono font-bold mb-5 transition-all duration-500',
                        isActive && hasEntered
                          ? 'bg-accent-primary text-white shadow-[0_0_16px_rgba(108,99,255,0.5)]'
                          : 'bg-white/[0.06] text-text-secondary border border-white/10'
                      )}
                    >
                      {event.year}
                    </div>

                    {/* Title */}
                    <h3
                      className={cn(
                        'text-xl lg:text-2xl font-display font-bold mb-3 transition-colors duration-500',
                        isActive && hasEntered ? 'text-white' : 'text-text-primary/80'
                      )}
                    >
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary/80 text-sm lg:text-base leading-relaxed">
                      {event.description}
                    </p>

                    {/* Active left accent bar */}
                    <AnimatePresence>
                      {isActive && hasEntered && (
                        <motion.div
                          key="bar"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-gradient-to-b from-accent-primary to-cyan-400 origin-top"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right-side year nav (desktop sticky helper) ── */}
        <div className="hidden lg:block">
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end gap-3">
            {events.map((event, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  key={event.year}
                  onClick={() => scrollToIndex(index)}
                  aria-label={`${event.year} ilinə get`}
                  className="group flex items-center gap-2.5 focus:outline-none"
                >
                  {/* Label — slides in on active */}
                  <span
                    className={cn(
                      'text-xs font-mono font-semibold transition-all duration-300',
                      isActive
                        ? 'opacity-100 text-accent-primary translate-x-0'
                        : 'opacity-0 text-text-muted translate-x-2 group-hover:opacity-70 group-hover:translate-x-0'
                    )}
                  >
                    {event.year}
                  </span>

                  {/* Dot */}
                  <div
                    className={cn(
                      'rounded-full transition-all duration-300',
                      isActive
                        ? 'w-3 h-3 bg-accent-primary shadow-[0_0_10px_rgba(108,99,255,0.7)]'
                        : 'w-2 h-2 bg-white/20 group-hover:bg-white/40'
                    )}
                  />
                </button>
              )
            })}

            {/* Connector line behind dots */}
            <div className="absolute right-[5px] top-3 bottom-3 w-px bg-white/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
