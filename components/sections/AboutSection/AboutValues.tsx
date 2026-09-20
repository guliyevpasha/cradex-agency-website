'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValueItem {
  id: string
  icon: string
  title: string
  description: string
}

interface AboutValuesProps {
  number: string
  subtitle: string
  title: string
  titleAccent: string
  titleEnd: string
  description: string
  items: ValueItem[]
}

export function AboutValues({
  number,
  subtitle,
  title,
  titleAccent,
  titleEnd,
  description,
  items,
}: AboutValuesProps) {
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
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,99,255,0.1) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,212,255,0.1) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-accent-primary text-sm font-mono">{number}</span>
            <span className="text-text-muted text-xs uppercase tracking-widest">
              / {subtitle}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-white">{title} </span>
            <span className="text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text">
              {titleAccent}
            </span>
            <span className="text-white"> {titleEnd}</span>
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const IconComponent =
              ((Icons as any)[item.icon] as LucideIcon) || Icons.Star

            return (
              <motion.div
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className={cn(
                  'group relative p-8 rounded-2xl',
                  'bg-gradient-to-br from-bg-secondary/40 to-bg-tertiary/40',
                  'border border-border/10',
                  'hover:border-accent-primary/30',
                  'hover:shadow-2xl hover:shadow-accent-primary/5',
                  'transition-all duration-500'
                )}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20 group-hover:border-accent-primary/40 group-hover:scale-110 transition-all duration-500">
                    <IconComponent className="w-7 h-7 text-accent-primary" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary group-hover:bg-clip-text transition-all duration-500">
                  / {item.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary/80 text-base leading-relaxed">
                  {item.description}
                </p>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-primary/0 via-accent-secondary/0 to-accent-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
