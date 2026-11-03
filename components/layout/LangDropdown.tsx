'use client'
/**
 * Language picker for the desktop header.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { LOCALES, localizedPath } from '@/lib/site/navigation'

export function LangDropdown() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('site.nav')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function pick(code: string) {
    setOpen(false)
    if (code === locale) return
    try {
      localStorage.setItem('preferred-locale', code)
    } catch {}
    router.push(localizedPath(pathname, code) + window.location.search + window.location.hash)
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language')}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/50"
      >
        <Globe size={15} className="text-text-muted" aria-hidden="true" />
        {current.label}
        <ChevronDown size={13} className={cn('text-text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('language')}
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-bg-primary p-1.5 shadow-float"
        >
          {LOCALES.map(({ code, label, name }) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                onClick={() => pick(code)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                  code === locale ? 'bg-bg-secondary font-semibold text-text-primary' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                )}
              >
                <span className="w-6 text-xs font-bold text-text-muted">{label}</span>
                <span className="flex-1">{name}</span>
                {code === locale && <Check size={14} className="text-accent-primary" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
