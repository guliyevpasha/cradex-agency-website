'use client'
/**
 * Hook that reports the prefers-reduced-motion setting.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useState } from 'react'

/**
 * Returns true if the user has requested reduced motion via
 * the prefers-reduced-motion media query.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
