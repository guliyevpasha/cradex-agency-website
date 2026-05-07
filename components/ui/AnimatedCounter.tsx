'use client'
import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  duration?: number
  label: string
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  duration = 2000,
  label,
  className,
}: AnimatedCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const prefersReduced = useReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    if (prefersReduced) {
      setCount(target)
      return
    }

    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration, prefersReduced])

  return (
    <div ref={ref} className={className}>
      <span className="text-display-md font-display font-bold gradient-text" aria-live="polite">
        {count}
        {suffix}
      </span>
      <p className="text-text-secondary text-sm mt-1">{label}</p>
    </div>
  )
}
