'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink } from 'lucide-react'
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
  archiveLink,
}: AboutTimelineProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-accent-primary/30 to-transparent hidden lg:block" />

          {/* Events */}
          <div className="space-y-16">
            {events.map((event, index) => {
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
                  transition={{ duration: 0.7, delay: 0.1 * (index + 1) }}
                  className={cn(
                    'relative flex items-center',
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  )}
                >
                  {/* Card */}
                  <div
                    className={cn(
                      'flex-1 p-8 rounded-2xl',
                      'bg-white/[0.02] backdrop-blur-sm',
                      'border border-border/20',
                      'hover:border-accent-primary/30',
                      'transition-all duration-500',
                      'lg:w-[calc(50%-3rem)]',
                      isLeft ? 'lg:mr-auto lg:text-right' : 'lg:ml-auto lg:text-left'
                    )}
                  >
                    {/* Year Badge */}
                    <div className={cn(
                      'inline-block mb-4 px-4 py-2 rounded-full',
                      'bg-gradient-to-r from-accent-primary/10 to-red-500/10',
                      'border border-accent-primary/20'
                    )}>
                      <span className="text-accent-primary text-sm font-mono font-bold">
                        {event.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-display font-bold text-text-primary mb-3">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-base leading-relaxed">
                      {event.description}
                    </p>

                    {/* Archive Link */}
                    {event.title.includes('Arxiv') && (
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-accent-primary hover:text-accent-secondary transition-colors"
                      >
                        <span className="text-text-muted">{archiveLink}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Center Dot */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 rounded-full bg-accent-primary border-4 border-bg-primary shadow-lg shadow-accent-primary/50" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
