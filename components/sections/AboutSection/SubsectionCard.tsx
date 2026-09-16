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
        'p-8 lg:p-12 rounded-3xl',
        'bg-gradient-to-br from-bg-secondary/50 to-bg-tertiary/30',
        'border border-border/50 backdrop-blur-sm',
        'hover:border-accent-primary/40 transition-all duration-300',
        isEven ? 'lg:mr-auto lg:max-w-5xl' : 'lg:ml-auto lg:max-w-5xl'
      )}
    >
      {/* Icon (if provided) */}
      {IconComponent && (
        <div className="mb-6">
          <div
            className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20"
            aria-hidden="true"
          >
            <IconComponent className="w-8 h-8 text-accent-primary" />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl lg:text-3xl font-display font-bold mb-4 text-text-primary">
        {subsection.title}
      </h3>

      {/* Content */}
      <div
        className="text-text-secondary text-base lg:text-lg leading-relaxed prose prose-invert max-w-none prose-p:mb-4"
        dangerouslySetInnerHTML={{ __html: subsection.content }}
      />

      {/* Values Grid (for Dəyərlərimiz subsection) */}
      {subsection.values && subsection.values.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {subsection.values.map((value) => (
            <ValueItem key={value.id} value={value} />
          ))}
        </div>
      )}
    </motion.article>
  )
}
