'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { getAllServicesSync } from '@/lib/data/services'
import { dropdownVariants } from '@/lib/animations/variants'

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
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const services = getAllServicesSync()
  const tServices = useTranslations('services')

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setServicesOpen(true)
  }

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120)
  }

  const serviceKeyMap: Record<string, string> = {
    'digital-marketing': 'digitalMarketing',
    'traditional-marketing': 'traditionalMarketing',
    'smm': 'smm',
    'graphic-motion-design': 'graphicMotionDesign',
    'photo-video': 'photoVideo',
    'branding': 'branding',
    'copywriting': 'copywriting',
    'web-mobile-dev': 'webMobileDev',
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setServicesOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Is services section active?
  const isServicesActive = pathname.includes('/services')

  return (
    <nav className="hidden md:flex items-center gap-0.5" aria-label="Əsas naviqasiya">
      {/* Home — exact match only */}
      <NavLink href={`/${locale}`} label={t('home')} exactMatch />
      <NavLink href={`/${locale}/about`} label={t('about')} />

      {/* Services dropdown */}
      <div
        ref={dropdownRef}
        className="relative"
        onMouseLeave={closeDropdown}
      >
        <button
          onClick={() => setServicesOpen((v) => !v)}
          onMouseEnter={openDropdown}
          className={cn(
            'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 whitespace-nowrap',
            isServicesActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          )}
          aria-haspopup="true"
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

        <AnimatePresence>
          {servicesOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseEnter={openDropdown}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl border border-white/15 bg-bg-secondary/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-2 z-50"
              role="menu"
            >
              {services.map((service) => {
                const key = serviceKeyMap[service.slug] ?? service.slug
                return (
                  <Link
                    key={service.slug}
                    href={`/${locale}/services/${service.slug}`}
                    role="menuitem"
                    onClick={() => setServicesOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-150 text-sm"
                  >
                    <span className="text-accent-primary text-xs">→</span>
                    {tServices(`${key}.name` as any)}
                  </Link>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NavLink href={`/${locale}/journal`} label={t('journal')} />
      <NavLink href={`/${locale}/calculator`} label={t('calculator')} />
      <NavLink href={`/${locale}/portfolio`} label={t('portfolio')} />
    </nav>
  )
}
