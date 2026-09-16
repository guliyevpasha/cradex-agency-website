'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValueItemProps {
  value: {
    id: string
    title: string
    description: string
    icon: string
  }
}

export function ValueItem({ value }: ValueItemProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Map icon name to Lucide icon component
  const IconComponent = ((Icons as any)[value.icon] as LucideIcon) || Icons.Star

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'group relative flex flex-col items-start p-8 rounded-2xl',
        'bg-gradient-to-br from-bg-tertiary/30 via-bg-secondary/20 to-bg-tertiary/30',
        'border border-border/20 backdrop-blur-sm',
        'hover:border-accent-primary/40 hover:shadow-xl hover:shadow-accent-primary/5',
        'hover:scale-105 hover:-translate-y-1',
        'transition-all duration-500 ease-out'
      )}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-primary/0 via-accent-secondary/0 to-accent-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

      {/* Icon with enhanced styling */}
      <div
        className={cn(
          'relative mb-6 p-4 rounded-xl',
          'bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10',
          'border border-accent-primary/20',
          'group-hover:border-accent-primary/40',
          'group-hover:scale-110 group-hover:rotate-3',
          'transition-all duration-500'
        )}
        aria-hidden="true"
      >
        <IconComponent className="w-7 h-7 text-accent-primary" strokeWidth={1.5} />
      </div>

      {/* Title with gradient hover effect */}
      <h4 className="relative text-xl font-display font-bold mb-3 text-text-primary group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary group-hover:bg-clip-text transition-all duration-500">
        {value.title}
      </h4>

      {/* Description */}
      <p className="relative text-base text-text-secondary/90 leading-relaxed group-hover:text-text-secondary transition-colors duration-300">
        {value.description}
      </p>
    </motion.div>
  )
}
