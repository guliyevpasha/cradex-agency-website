'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, Globe, ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Navbar } from './Navbar'
import { MobileMenu } from './MobileMenu'
import { LangDropdown } from './LangDropdown'

// Compact language switcher shown next to hamburger on mobile
const LOCALES = [
  { code: 'az', label: 'AZ' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'tr', label: 'TR' },
]

function MobileLangSwitcher() {
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
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Dil seçimi"
        className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-white/15
          bg-white/5 hover:bg-white/10 text-text-primary text-sm font-medium
          transition-all duration-200 min-h-[40px]"
      >
        <Globe size={13} className="text-text-secondary" aria-hidden="true" />
        <span className="text-xs font-semibold">{current.label}</span>
        <ChevronDown
          size={11}
          className={cn('text-text-secondary transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Dil seçimi"
          className="absolute top-full right-0 mt-2 w-28 rounded-xl border border-white/15
            bg-bg-secondary/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            overflow-hidden z-50"
        >
          {LOCALES.map(({ code, label }) => (
            <button
              key={code}
              role="option"
              aria-selected={locale === code}
              onClick={() => switchLocale(code)}
              className={cn(
                'w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium transition-colors duration-150',
                locale === code
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const locale = useLocale()
  const tHero = useTranslations('home.hero')
  const tCommon = useTranslations('common.cta')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(tHero('whatsappText'))}`

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30">
        <div
          className={cn(
            'w-full flex items-center justify-between gap-4 transition-all duration-300',
            'px-4 sm:px-6 lg:px-8',
            scrolled
              ? 'py-3 bg-bg-primary/95 backdrop-blur-xl border-b border-white/10 shadow-lg'
              : 'py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5'
          )}
        >
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center shrink-0"
            aria-label="Cradex Agency — Ana Səhifə"
          >
            <img
              src="/logo.svg"
              alt="Cradex Agency"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <Navbar />

          {/* Right: lang + CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <LangDropdown />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-[0_0_16px_rgba(108,99,255,0.4)] hover:shadow-[0_0_24px_rgba(108,99,255,0.6)] min-h-[36px] whitespace-nowrap"
            >
              {tCommon('freeConsultation')} ↗
            </a>
          </div>

          {/* Mobile: lang switcher + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <MobileLangSwitcher />
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Menyunu aç"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
