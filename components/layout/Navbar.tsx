'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { ServicesMegaMenu } from './ServicesMegaMenu'

// ─── NavLink with active dot indicator ───────────────────────────────────────
function NavLink({ href, label, exactMatch = false }: { href: string; label: string; exactMatch?: boolean }) {
  const pathname = usePathname()
  // exactMatch=true: only active on exact path (for Home)
  // exactMatch=false: active when pathname starts with href
  const isActive = exactMatch
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap flex flex-col items-center',
        isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
      )}
    >
      <span>{label}</span>
      {/* Active dot */}
      <span
        className={cn(
          'absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300',
          isActive
            ? 'bg-accent-primary shadow-[0_0_6px_2px_rgba(108,99,255,0.7)] opacity-100 scale-100'
            : 'opacity-0 scale-0'
        )}
        aria-hidden="true"
      />
    </Link>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
  const t = useTranslations('common.nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [servicesOpen, setServicesOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const aboutDropdownRef = useRef<HTMLDivElement>(null)
  const closeServicesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeAboutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openServicesDropdown = () => {
    if (closeServicesTimer.current) clearTimeout(closeServicesTimer.current)
    setServicesOpen(true)
  }

  const closeServicesDropdown = () => {
    closeServicesTimer.current = setTimeout(() => setServicesOpen(false), 120)
  }

  const openAboutDropdown = () => {
    if (closeAboutTimer.current) clearTimeout(closeAboutTimer.current)
    setAboutOpen(true)
  }

  const closeAboutDropdown = () => {
    closeAboutTimer.current = setTimeout(() => setAboutOpen(false), 120)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target) return
      
      // Services dropdown
      if (servicesDropdownRef.current) {
        if (target.closest?.('[data-mega-menu]')) return
        if (!servicesDropdownRef.current.contains(target)) {
          setServicesOpen(false)
        }
      }
      
      // About dropdown
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(target)) {
        setAboutOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on navigation
  useEffect(() => { 
    setServicesOpen(false)
    setAboutOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') {
        setServicesOpen(false)
        setAboutOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Is services section active?
  const isServicesActive = pathname.includes('/services')
  const isAboutActive = pathname.includes('/about') || pathname.includes('/clients')

  return (
    <nav className="hidden md:flex items-center gap-0.5" aria-label="Əsas naviqasiya">
      {/* Home — exact match only */}
      <NavLink href={`/${locale}`} label={t('home')} exactMatch />
      
      {/* About dropdown */}
      <div
        ref={aboutDropdownRef}
        onMouseLeave={closeAboutDropdown}
        className="relative"
      >
        <button
          onClick={() => setAboutOpen((v) => !v)}
          onMouseEnter={openAboutDropdown}
          className={cn(
            'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 whitespace-nowrap',
            isAboutActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          )}
          aria-haspopup="menu"
          aria-expanded={aboutOpen}
        >
          {t('about')}
          <ChevronDown
            size={13}
            className={cn('transition-transform duration-200', aboutOpen && 'rotate-180')}
          />
          {/* Active dot */}
          <span
            className={cn(
              'absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300',
              isAboutActive
                ? 'bg-accent-primary shadow-[0_0_6px_2px_rgba(108,99,255,0.7)] opacity-100 scale-100'
                : 'opacity-0 scale-0'
            )}
            aria-hidden="true"
          />
        </button>

        {/* About Dropdown Menu */}
        {aboutOpen && (
          <div
            onMouseEnter={openAboutDropdown}
            className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-border/20 bg-bg-secondary/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50"
          >
            <Link
              href={`/${locale}/about`}
              className={cn(
                'block px-4 py-3 text-sm font-medium transition-colors duration-150',
                pathname.includes('/about') && !pathname.includes('/clients')
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              )}
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/clients`}
              className={cn(
                'block px-4 py-3 text-sm font-medium transition-colors duration-150',
                pathname.includes('/clients')
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              )}
            >
              {t('clients')}
            </Link>
          </div>
        )}
      </div>

      {/* Services dropdown */}
      <div
        ref={servicesDropdownRef}
        onMouseLeave={closeServicesDropdown}
        className="relative"
      >
        <button
          onClick={() => setServicesOpen((v) => !v)}
          onMouseEnter={openServicesDropdown}
          className={cn(
            'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 whitespace-nowrap',
            isServicesActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          )}
          aria-haspopup="menu"
          aria-expanded={servicesOpen}
        >
          {t('services')}
          <ChevronDown
            size={13}
            className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')}
          />
          {/* Active dot */}
          <span
            className={cn(
              'absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300',
              isServicesActive
                ? 'bg-accent-primary shadow-[0_0_6px_2px_rgba(108,99,255,0.7)] opacity-100 scale-100'
                : 'opacity-0 scale-0'
            )}
            aria-hidden="true"
          />
        </button>

        <ServicesMegaMenu
          isOpen={servicesOpen}
          onMouseEnter={openServicesDropdown}
          onClose={() => setServicesOpen(false)}
          locale={locale}
        />
      </div>

      <NavLink href={`/${locale}/journal`} label={t('journal')} />
      <NavLink href={`/${locale}/calculator`} label={t('calculator')} />
      <NavLink href={`/${locale}/portfolio`} label={t('portfolio')} />
    </nav>
  )
}
