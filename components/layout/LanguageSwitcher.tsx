'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const LOCALES = [
  { code: 'az', label: 'AZ', flag: '🇦🇿' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'tr', label: 'TR', flag: '🇹🇷' },
]

interface LanguageSwitcherProps {
  className?: string
  showFlags?: boolean
}

export function LanguageSwitcher({ className, showFlags = false }: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return
    localStorage.setItem('preferred-locale', newLocale)
    // Replace the current locale segment in the path
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <nav
      role="navigation"
      aria-label="Language selection"
      className={cn('flex items-center gap-1', className)}
    >
      {LOCALES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          aria-current={locale === code ? 'true' : undefined}
          aria-label={`Switch language to ${label}`}
          className={cn(
            'px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 min-w-[36px] min-h-[36px] flex items-center justify-center',
            locale === code
              ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/40'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
          )}
        >
          {showFlags && <span className="mr-1">{flag}</span>}
          {label}
        </button>
      ))}
    </nav>
  )
}
