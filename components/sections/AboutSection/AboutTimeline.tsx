'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Update active index based on scroll progress
  useEffect(() => {
    if (prefersReducedMotion) return

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const index = Math.min(
        Math.floor(latest * events.length),
        events.length - 1
      )
      setActiveIndex(index)
    })

    return () => unsubscribe()
  }, [scrollYProgress, events.length, prefersReducedMotion])

  return (
    <section
      ref={containerRef}
      className="relative py-24 lg:py-32 bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-accent-primary text-sm font-mono">{number}</span>
            <span className="text-text-muted text-xs uppercase tracking-widest">
              / {subtitle}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-text-primary">{title} </span>
            <span className="text-transparent bg-gradient-to-r from-accent-primary to-red-500 bg-clip-text">
              {titleAccent}
            </span>
            <span className="text-text-primary"> {titleEnd}</span>
          </h2>
        </motion.div>

        {/* Timeline with Scroll Progress */}
        <div className="relative min-h-[200vh]">
          {/* Sticky Container for Active Event */}
          <div className="sticky top-1/4 mb-32">
            <div className="max-w-4xl mx-auto">
              {events.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    scale: activeIndex === index ? 1 : 0.95,
                    y: activeIndex === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={cn(
                    'absolute inset-0',
                    activeIndex !== index && 'pointer-events-none'
                  )}
                >
                  <div className="relative p-10 lg:p-14 rounded-3xl bg-gradient-to-br from-bg-secondary/30 via-bg-tertiary/10 to-bg-secondary/30 border border-border/20 backdrop-blur-lg hover:border-accent-primary/30 transition-all duration-700">
                    {/* Year Badge */}
                    <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-accent-primary/10 to-red-500/10 border border-accent-primary/20">
                      <span className="text-accent-primary text-2xl lg:text-3xl font-display font-bold">
                        {event.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl lg:text-4xl font-display font-bold mb-6 text-text-primary">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary/90 text-lg lg:text-xl leading-relaxed">
                      {event.description}
                    </p>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-primary/0 via-accent-secondary/0 to-accent-primary/0 opacity-5 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
            {events.map((event, index) => (
              <button
                key={event.year}
                onClick={() => {
                  const progress = index / (events.length - 1)
                  const scrollTarget =
                    containerRef.current!.offsetTop +
                    progress * containerRef.current!.offsetHeight
                  window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
                }}
                className={cn(
                  'group relative flex items-center gap-3 transition-all duration-300',
                  activeIndex === index ? 'scale-110' : 'scale-100 opacity-50 hover:opacity-100'
                )}
              >
                {/* Dot */}
                <div
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    activeIndex === index
                      ? 'bg-accent-primary shadow-lg shadow-accent-primary/50'
                      : 'bg-text-muted'
                  )}
                />
                
                {/* Year Label (appears on hover) */}
                <span
                  className={cn(
                    'absolute right-6 px-3 py-1 rounded-lg bg-bg-tertiary border border-border/20 text-sm font-mono font-bold whitespace-nowrap transition-all duration-300',
                    activeIndex === index
                      ? 'opacity-100 translate-x-0 text-accent-primary'
                      : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-text-secondary'
                  )}
                >
                  {event.year}
                </span>
              </button>
            ))}

            {/* Connecting Line */}
            <div className="absolute top-0 left-[5px] w-px h-full bg-gradient-to-b from-transparent via-border/30 to-transparent -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
