'use client'
/**
 * Fades children up the first time they scroll into view. CSS-only motion;
 * see `.rv` in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('rv-in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('rv', className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}
