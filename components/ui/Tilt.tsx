'use client'
/**
 * Pointer-driven 3D tilt. Children marked with `tilt-z1` / `tilt-z2` /
 * `tilt-z3` sit at increasing depth, so they drift apart as the card turns.
 * Mouse only; touch and reduced-motion get a flat card. See `.tilt` in
 * app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useRef } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  /** Largest rotation in degrees. */
  max?: number
}

export function Tilt({ children, className, innerClassName, max = 7 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      const x = (clientX - r.left) / r.width - 0.5
      const y = (clientY - r.top) / r.height - 0.5
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(x * max * 1.3).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
    })
  }

  function onLeave() {
    cancelAnimationFrame(frame.current)
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn('tilt', className)}>
      <div className={cn('tilt-inner', innerClassName)}>{children}</div>
    </div>
  )
}
