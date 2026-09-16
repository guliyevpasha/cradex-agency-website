'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { aboutFadeIn } from '@/lib/animations/variants'
import { ValueItem } from './ValueItem'
import { cn } from '@/lib/utils'

interface ValueItemType {
  id: string
  title: string
  description: string
  icon: string
}

interface SubsectionCardProps {
  subsection: {
    id: string
    title: string
    content: string
    icon?: string
    values?: ValueItemType[]
  }
  index: number
}

export function SubsectionCard({ subsection, index }: SubsectionCardProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const isEven = index % 2 === 0

  // Map icon name to Lucide icon component
  const IconComponent = subsection.icon
    ? ((Icons as any)[subsection.icon] as LucideIcon) || Icons.Star
    : null

  return (
    <motion.article
      ref={ref}
      initial={prefersReducedMotion ? false : 'hidden'}
      animate={inView ? 'visible' : 'hidden'}
      variants={aboutFadeIn}
      className={cn(
        'group relative p-10 lg:p-14 rounded-3xl',
        'bg-gradient-to-br from-bg-secondary/30 via-bg-tertiary/10 to-bg-secondary/30',
        'border border-border/20 backdrop-blur-lg',
        'hover:border-accent-primary/30 hover:shadow-2xl hover:shadow-accent-primary/5',
        'transition-all duration-700 ease-out',
        isEven ? 'lg:mr-auto lg:max-w-6xl' : 'lg:ml-auto lg:max-w-6xl'
      )}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-primary/0 via-accent-secondary/0 to-accent-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
      
      {/* Icon (if provided) */}
      {IconComponent && (
        <div className="relative mb-8">
          <div
            className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 group-hover:border-accent-primary/40 transition-all duration-500"
            aria-hidden="true"
          >
            <IconComponent className="w-10 h-10 text-accent-primary" strokeWidth={1.5} />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-3xl lg:text-4xl font-display font-bold mb-6 text-text-primary group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:via-accent-secondary group-hover:to-accent-primary group-hover:bg-clip-text transition-all duration-500">
        {subsection.title}
      </h3>

      {/* Content */}
      <div
        className="text-text-secondary text-lg lg:text-xl leading-relaxed prose prose-invert prose-lg max-w-none prose-p:mb-5 prose-p:text-text-secondary/90"
        dangerouslySetInnerHTML={{ __html: subsection.content }}
      />

      {/* Values Grid (for Dəyərlərimiz subsection) */}
      {subsection.values && subsection.values.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {subsection.values.map((value) => (
            <ValueItem key={value.id} value={value} />
          ))}
        </div>
      )}
    </motion.article>
  )
}
