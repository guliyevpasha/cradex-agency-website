'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface IntroCard {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
}

interface AboutIntroCardsProps {
  number: string
  subtitle: string
  title: string
  cards: IntroCard[]
}

export function AboutIntroCards({
  number,
  subtitle,
  title,
  cards,
}: AboutIntroCardsProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 bg-gradient-to-b from-bg-primary to-bg-secondary overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-accent-primary text-sm font-mono">{number}</span>
            <span className="text-text-muted text-xs uppercase tracking-widest">
              / {subtitle}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-primary max-w-4xl">
            {title.split(' ').map((word, i) => (
              <span
                key={i}
                className={cn(
                  word.toLowerCase().includes('təcrübə') ||
                    word.toLowerCase().includes('verilərə')
                    ? 'text-transparent bg-gradient-to-r from-accent-primary to-red-500 bg-clip-text'
                    : ''
                )}
              >
                {word}{' '}
              </span>
            ))}
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <motion.article
              key={card.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className={cn(
                'group relative p-10 lg:p-12 rounded-3xl',
                'bg-white/[0.02] backdrop-blur-sm',
                'border border-border/10',
                'hover:border-accent-primary/20',
                'transition-all duration-500'
              )}
            >
              {/* Card Number */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-display font-bold text-transparent bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 bg-clip-text">
                  {card.number}
                </span>
              </div>

              {/* Card Title */}
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary group-hover:bg-clip-text transition-all duration-500">
                {card.title}
              </h3>

              {/* Card Subtitle */}
              <p className="text-xs text-accent-primary/70 uppercase tracking-widest font-mono mb-6">
                {card.subtitle}
              </p>

              {/* Card Description */}
              <p className="text-text-secondary/90 text-base lg:text-lg leading-relaxed whitespace-pre-line">
                {card.description}
              </p>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-primary/0 via-accent-secondary/0 to-accent-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
