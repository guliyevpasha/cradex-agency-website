'use client'
/**
 * Day / night switch.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { THEME_STORAGE_KEY } from './ThemeScript'

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('site.theme')
  // null until mounted: the server cannot know the visitor's theme.
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))

    // Follow the device setting live, unless the visitor picked a theme.
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return
      } catch {}
      apply(e.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  function apply(next: boolean) {
    const root = document.documentElement
    root.classList.toggle('dark', next)
    root.style.colorScheme = next ? 'dark' : 'light'
    setDark(next)
  }

  function toggle() {
    const next = !document.documentElement.classList.contains('dark')
    apply(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
    } catch {}
  }

  const label = dark ? t('toLight') : t('toDark')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line',
        'text-text-secondary transition-colors hover:border-accent-primary/50 hover:text-text-primary',
        className
      )}
    >
      <Sun
        size={17}
        aria-hidden="true"
        className={cn('absolute transition-all duration-300', dark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0')}
      />
      <Moon
        size={17}
        aria-hidden="true"
        className={cn('absolute transition-all duration-300', dark === false ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0')}
      />
    </button>
  )
}
