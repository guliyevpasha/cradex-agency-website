'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, ChevronDown } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { MEGA_MENU_SERVICES } from '@/lib/data/megaMenuServices'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const LOCALES = [
  { code: 'az', label: 'AZ' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'tr', label: 'TR' },
]

// Stagger animation for nav links
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

const panelVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:   { x: '100%', opacity: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('common.nav')
  const tServices = useTranslations('services.megaMenu')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function switchLocale(code: string) {
    if (code === locale) return
    localStorage.setItem('preferred-locale', code)
    const segments = pathname.split('/')
    segments[1] = code
    router.push(segments.join('/'))
    onClose()
  }

  const navLinks = [
    { href: `/${locale}`,             label: t('home') },
    // About will be handled separately with dropdown
    // Services will be handled separately with dropdown
    { href: `/${locale}/journal`,     label: t('journal') },
    { href: `/${locale}/calculator`,  label: t('calculator') },
    { href: `/${locale}/portfolio`,   label: t('portfolio') },
    { href: `/${locale}/contact`,     label: t('contact') },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm z-50 flex flex-col"
            style={{
              background: 'rgba(17,17,24,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Cradex Agency" className="h-7 w-auto" />
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links — staggered */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
                role="list"
              >
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href
                  
                  // Insert About and Services dropdowns after "Home"
                  if (index === 0) {
                    const isAboutActive = pathname.includes('/about') || pathname.includes('/clients')
                    const isServicesActive = pathname.includes('/services')
                    
                    return (
                      <div key="nav-group">
                        {/* Home link */}
                        <motion.li variants={itemVariants}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                              'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 min-h-[48px]',
                              isActive
                                ? 'bg-accent-primary/15 text-accent-primary'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                            )}
                          >
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-3 shadow-[0_0_6px_rgba(108,99,255,0.8)]" aria-hidden="true" />
                            )}
                            {link.label}
                          </Link>
                        </motion.li>
                        
                        {/* About dropdown */}
                        <motion.li variants={itemVariants}>
                          <button
                            onClick={() => setAboutOpen(!aboutOpen)}
                            className={cn(
                              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 min-h-[48px]',
                              isAboutActive
                                ? 'bg-accent-primary/15 text-accent-primary'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                            )}
                          >
                            <span className="flex items-center">
                              {isAboutActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-3 shadow-[0_0_6px_rgba(108,99,255,0.8)]" aria-hidden="true" />
                              )}
                              {t('about')}
                            </span>
                            <ChevronDown
                              size={16}
                              className={cn('transition-transform duration-200', aboutOpen && 'rotate-180')}
                            />
                          </button>
                          
                          {/* About submenu */}
                          <AnimatePresence>
                            {aboutOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-1 ml-4 space-y-1 overflow-hidden"
                              >
                                <li>
                                  <Link
                                    href={`/${locale}/about`}
                                    onClick={onClose}
                                    className={cn(
                                      'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                      pathname.includes('/about') && !pathname.includes('/clients')
                                        ? 'bg-accent-primary/10 text-accent-primary'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
                                    )}
                                  >
                                    {t('about')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/${locale}/clients`}
                                    onClick={onClose}
                                    className={cn(
                                      'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                      pathname.includes('/clients')
                                        ? 'bg-accent-primary/10 text-accent-primary'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
                                    )}
                                  >
                                    {t('clients')}
                                  </Link>
                                </li>
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </motion.li>
                        
                        {/* Services dropdown */}
                        <motion.li variants={itemVariants}>
                          <button
                            onClick={() => setServicesOpen(!servicesOpen)}
                            className={cn(
                              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 min-h-[48px]',
                              isServicesActive
                                ? 'bg-accent-primary/15 text-accent-primary'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                            )}
                          >
                            <span className="flex items-center">
                              {isServicesActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-3 shadow-[0_0_6px_rgba(108,99,255,0.8)]" aria-hidden="true" />
                              )}
                              {t('services')}
                            </span>
                            <ChevronDown
                              size={16}
                              className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')}
                            />
                          </button>
                          
                          {/* Services submenu */}
                          <AnimatePresence>
                            {servicesOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-1 ml-4 space-y-1 overflow-hidden"
                              >
                                {MEGA_MENU_SERVICES.map((service) => {
                                  const serviceHref = `/${locale}/services/${service.slug}`
                                  const isServiceActive = pathname === serviceHref
                                  const Icon = service.icon
                                  
                                  return (
                                    <li key={service.id}>
                                      <Link
                                        href={serviceHref}
                                        onClick={onClose}
                                        className={cn(
                                          'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                          isServiceActive
                                            ? 'bg-accent-primary/10 text-accent-primary'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
                                        )}
                                      >
                                        <Icon size={14} strokeWidth={2} />
                                        {tServices(`${service.translationKey}.title`)}
                                      </Link>
                                    </li>
                                  )
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      </div>
                    )
                  }
                  
                  return (
                    <motion.li key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 min-h-[48px]',
                          isActive
                            ? 'bg-accent-primary/15 text-accent-primary'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                        )}
                      >
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-3 shadow-[0_0_6px_rgba(108,99,255,0.8)]" aria-hidden="true" />
                        )}
                        {link.label}
                      </Link>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </nav>

            {/* Language switcher — only label, no country code prefix */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="px-6 py-5 border-t border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Globe size={13} className="text-text-muted" />
                <span className="text-text-muted text-xs uppercase tracking-wider">Dil / Language</span>
              </div>
              <div className="flex gap-2">
                {LOCALES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    aria-pressed={locale === code}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      locale === code
                        ? 'bg-accent-primary text-white shadow-[0_0_12px_rgba(108,99,255,0.4)]'
                        : 'bg-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/80'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
