'use client'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

interface UseScrollAnimationOptions {
  once?: boolean
  amount?: number
}

/**
 * Returns a ref and a boolean indicating whether the element is in view.
 * Designed for scroll-triggered animations.
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { once = true, amount = 0.1 } = options
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  return { ref, isInView }
}
