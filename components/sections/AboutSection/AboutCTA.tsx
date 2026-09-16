'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/navigation'
import { aboutFadeIn } from '@/lib/animations/variants'
import { cn } from '@/lib/utils'

interface AboutCTAProps {
  primaryText: string
  secondaryText: string
  onPrimaryClick: () => void
  onSecondaryClick: () => void
  locale: string
}

export function AboutCTA({
  primaryText,
  secondaryText,
  onPrimaryClick,
  onSecondaryClick,
  locale,
}: AboutCTAProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const router = useRouter()
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  const handlePrimaryClick = () => {
    onPrimaryClick()
    router.push(`/${locale}/contact`)
  }

  const handleSecondaryClick = () => {
    onSecondaryClick()
    router.push(`/${locale}/contact?consultation=true`)
  }

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : 'hidden'}
      animate={inView ? 'visible' : 'hidden'}
      variants={aboutFadeIn}
      className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-20 lg:mt-24"
    >
      {/* Primary CTA with Premium Glow */}
      <button
        onClick={handlePrimaryClick}
        className={cn(
          'group relative min-w-[220px] px-10 py-5 rounded-2xl overflow-hidden',
          'bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-[length:200%_100%]',
          'text-white font-display font-bold text-lg tracking-wide',
          'hover:bg-[position:100%_0]',
          'hover:scale-105 active:scale-95',
          'transition-all duration-700 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary',
          'shadow-lg shadow-accent-primary/25',
          'hover:shadow-2xl hover:shadow-accent-primary/40'
        )}
        aria-label={primaryText}
      >
        {/* Animated glow effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-shimmer" />
        
        {/* Button text */}
        <span className="relative z-10">{primaryText}</span>
      </button>

      {/* Secondary CTA with Elegant Border */}
      <button
        onClick={handleSecondaryClick}
        className={cn(
          'group relative min-w-[220px] px-10 py-5 rounded-2xl overflow-hidden',
          'bg-gradient-to-br from-bg-secondary/40 to-bg-tertiary/40 backdrop-blur-sm',
          'border-2 border-accent-primary/40',
          'text-text-primary font-display font-bold text-lg tracking-wide',
          'hover:bg-gradient-to-br hover:from-accent-primary/10 hover:to-accent-secondary/10',
          'hover:border-accent-primary/70',
          'hover:scale-105 active:scale-95',
          'transition-all duration-500 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary',
          'hover:shadow-xl hover:shadow-accent-primary/15'
        )}
        aria-label={secondaryText}
      >
        {/* Subtle glow effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-accent-primary/0 via-accent-secondary/10 to-accent-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Button text */}
        <span className="relative z-10 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary group-hover:bg-clip-text transition-all duration-500">
          {secondaryText}
        </span>
      </button>
    </motion.div>
  )
}
