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
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 lg:mt-20"
    >
      {/* Primary CTA */}
      <button
        onClick={handlePrimaryClick}
        className={cn(
          'group relative min-w-[200px] px-8 py-4 rounded-xl',
          'bg-gradient-to-r from-accent-primary to-accent-secondary',
          'text-white font-semibold text-base',
          'hover:shadow-lg hover:shadow-accent-primary/25',
          'hover:scale-105 active:scale-95',
          'transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2',
          inView && !prefersReducedMotion && 'animate-pulse-slow'
        )}
        aria-label={primaryText}
      >
        {primaryText}
      </button>

      {/* Secondary CTA */}
      <button
        onClick={handleSecondaryClick}
        className={cn(
          'min-w-[200px] px-8 py-4 rounded-xl',
          'border-2 border-accent-primary/50',
          'text-text-primary font-semibold text-base',
          'hover:bg-accent-primary/10 hover:border-accent-primary',
          'hover:scale-105 active:scale-95',
          'transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2'
        )}
        aria-label={secondaryText}
      >
        {secondaryText}
      </button>
    </motion.div>
  )
}
