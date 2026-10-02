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
  Info
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MobileBottomNavProps {
  locale: string
}

export function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname()
  const t = useTranslations('common.nav')

  const navItems = [
    {
      id: 'about',
      label: t('about'),
      href: `/${locale}/about`,
      icon: Info,
    },
    {
      id: 'services',
      label: t('services'),
      href: `/${locale}/services/smm`,
      icon: Briefcase,
    },
    {
      id: 'home',
      label: t('home'),
      href: `/${locale}`,
      icon: Home,
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

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="relative mx-4 mb-4 px-4 py-2.5 bg-bg-secondary/95 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              if (item.isCenter) {
                return (
                  <Link
                    key={item.id}
                    href={item.href || '#'}
                    className="relative -mt-6"
                    aria-label={item.label}
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full blur-lg opacity-40" />
                      
                      {/* Main button */}
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary shadow-xl shadow-accent-primary/30 flex items-center justify-center">
                        <item.icon size={24} className="text-white" strokeWidth={2.5} />
                      </div>
                    </motion.div>
                  </Link>
                )
              }

              const Icon = item.icon
              const active = item.href && isActive(item.href)

              return (
                <Link
                  key={item.id}
                  href={item.href || '#'}
                  className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[56px]"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className={`transition-colors ${
                      active 
                        ? 'text-accent-primary' 
                        : 'text-text-muted'
                    }`}>
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className={`text-[9px] font-medium transition-colors ${
                      active ? 'text-accent-primary' : 'text-text-muted'
                    }`}>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
