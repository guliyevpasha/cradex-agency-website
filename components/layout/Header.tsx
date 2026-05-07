'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { Navbar } from './Navbar'
import { MobileMenu } from './MobileMenu'
import { LangDropdown } from './LangDropdown'

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
      <header className="fixed top-0 left-0 right-0 z-30 flex justify-center px-4 pt-4">
        <div
          className={cn(
            'w-full max-w-6xl flex items-center justify-between gap-4',
            'rounded-2xl border transition-all duration-300',
            scrolled
              ? 'px-4 py-2.5 bg-bg-primary/80 backdrop-blur-xl border-white/15 shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
              : 'px-5 py-3.5 bg-bg-primary/40 backdrop-blur-md border-white/8'
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

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Menyunu aç"
            aria-expanded={mobileOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
