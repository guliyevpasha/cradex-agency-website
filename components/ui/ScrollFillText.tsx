'use client'
/**
 * Text that fills in word by word as it scrolls up the screen: words start
 * faint and take on full colour from left to right. Several segments can
 * carry their own styling (e.g. a bold client name followed by a summary).
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

type Segment = { text: string; className?: string }

type Props = {
  segments: Segment[]
  className?: string
  as?: 'p' | 'h2' | 'h3' | 'span'
  /** Viewport fractions where filling starts and ends (top of the element). */
  start?: number
  end?: number
}

export function ScrollFillText({ segments, className, as: Tag = 'p', start = 0.9, end = 0.45 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const words = segments.flatMap((s, si) =>
    s.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, si }))
  )
  const total = words.length
  const [lit, setLit] = useState(total)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, (vh * start - top) / (vh * (start - end))))
      setLit(Math.round(p * total))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [total, start, end])

  return (
    <Tag ref={ref as never} className={className}>
      {words.map(({ w, si }, i) => (
        <span
          key={i}
          className={cn('transition-opacity duration-300', segments[si].className, i < lit ? 'opacity-100' : 'opacity-25')}
        >
          {w}
          {i < total - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
