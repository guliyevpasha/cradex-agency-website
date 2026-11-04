'use client'
/**
 * Heading whose letters flip up in 3D, one after another, the first time it
 * scrolls into view. Words never break mid-word; screen readers get the
 * plain text. Styles: ".ah" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}

export function AnimatedHeading({ text, as: Tag = 'h2', className, id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('ah-in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  let n = 0
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <Tag ref={ref} id={id} className={cn('ah', className)} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className="ah-w">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="ah-c" style={{ '--ci': n++ } as React.CSSProperties}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
