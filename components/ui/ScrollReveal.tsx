'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '@/lib/animations/variants'

const animationVariants = { fadeInUp, fadeInLeft, fadeInRight, scaleIn }

interface ScrollRevealProps {
  children: React.ReactNode
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn'
  delay?: number
  threshold?: number
  className?: string
}

export function ScrollReveal({
  children,
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.1,
  className,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={animationVariants[animation]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
