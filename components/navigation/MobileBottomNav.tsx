'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Briefcase, 
  FolderOpen, 
  Phone,
  X,
  Sparkles
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MobileBottomNavProps {
  locale: string
}

export function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('nav')

  const navItems = [
    {
      id: 'about',
      label: t('about'),
      href: `/${locale}/about`,
      icon: Home,
    },
    {
      id: 'services',
      label: t('services'),
      href: `/${locale}/services/smm`,
      icon: Briefcase,
    },
    {
      id: 'menu',
      label: t('menu'),
      icon: Sparkles,
      isCenter: true,
    },
    {
      id: 'portfolio',
      label: t('portfolio'),
      href: `/${locale}/portfolio`,
      icon: FolderOpen,
    },
    {
      id: 'contact',
      label: t('contact'),
      href: `/${locale}/contact`,
      icon: Phone,
    },
  ]

  const menuLinks = [
    { label: t('home'), href: `/${locale}` },
    { label: t('about'), href: `/${locale}/about` },
    { label: t('services'), href: `/${locale}/services/smm` },
    { label: t('portfolio'), href: `/${locale}/portfolio` },
    { label: t('journal'), href: `/${locale}/journal` },
    { label: t('calculator'), href: `/${locale}/calculator` },
    { label: t('contact'), href: `/${locale}/contact` },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/95 backdrop-blur-xl border-t border-white/5">
        <div className="relative flex items-center justify-around px-4 py-2 max-w-screen-sm mx-auto">
          {navItems.map((item, index) => {
            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative -mt-8"
                  aria-label="Open menu"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full blur-xl opacity-50" />
                    
                    {/* Main button */}
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary shadow-2xl shadow-accent-primary/50 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: isMenuOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isMenuOpen ? (
                          <X size={28} className="text-white" strokeWidth={2.5} />
                        ) : (
                          <item.icon size={28} className="text-white" strokeWidth={2.5} />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </button>
              )
            }

            const Icon = item.icon
            const active = item.href && isActive(item.href)

            return (
              <Link
                key={item.id}
                href={item.href || '#'}
                className="flex flex-col items-center justify-center py-2 px-2 min-w-[60px]"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    active 
                      ? 'bg-accent-primary/10 text-accent-primary' 
                      : 'text-text-muted hover:text-text-secondary'
                  }`}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${
                    active ? 'text-accent-primary' : 'text-text-muted'
                  }`}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-30 bg-bg-primary/98 backdrop-blur-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex flex-col items-center justify-center h-full px-8 pb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-sm space-y-2"
              >
                {menuLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block w-full px-6 py-4 rounded-2xl text-lg font-semibold transition-all ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/30'
                          : 'bg-bg-tertiary/50 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
