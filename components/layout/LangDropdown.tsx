'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const LOCALES = [
  { code: 'az', label: 'AZ', fullName: 'Azərbaycan' },
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'ru', label: 'RU', fullName: 'Русский' },
  { code: 'tr', label: 'TR', fullName: 'Türkçe' },
]

export function LangDropdown() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function switchLocale(code: string) {
    if (code === locale) { setOpen(false); return }
    localStorage.setItem('preferred-locale', code)
    const segments = pathname.split('/')
    segments[1] = code
    router.push(segments.join('/'))
    setOpen(false)
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  return (
    <div ref={ref} className="relative">
      {/* Trigger button — Globe icon + current lang code */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Dil seçimi"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15
          bg-white/5 hover:bg-white/10 text-text-primary text-sm font-medium
          transition-all duration-200 min-h-[36px]"
      >
        <Globe size={14} className="text-text-secondary" aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronDown
          size={12}
          className={cn('text-text-secondary transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Dil seçimi"
          className="absolute top-full right-0 mt-2 w-40 rounded-xl border border-white/15
            bg-bg-secondary/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            overflow-hidden z-50"
        >
          {LOCALES.map(({ code, label, fullName }) => (
            <button
              key={code}
              role="option"
              aria-selected={locale === code}
              onClick={() => switchLocale(code)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150',
                locale === code
                  ? 'bg-accent-primary/15 text-accent-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              )}
            >
              <span>{fullName}</span>
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-md',
                locale === code
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-tertiary text-text-muted'
              )}>
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
