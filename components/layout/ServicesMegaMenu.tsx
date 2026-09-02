/**
 * ServicesMegaMenu Component
 * 
 * Main container for the services mega menu dropdown navigation.
 * Displays 6 service cards in a responsive grid with action buttons.
 * Supports hover interactions, keyboard navigation, and animations.
 * 
 * Features:
 * - Hover-triggered mega menu with backdrop overlay
 * - 2-column responsive grid layout (1-column on mobile)
 * - Keyboard navigation (Escape to close, Tab for focus management)
 * - Framer Motion animations with AnimatePresence
 * - Multilingual support via next-intl
 * - ARIA attributes for accessibility
 * 
 * @component
 * @example
 * ```tsx
 * <ServicesMegaMenu
 *   isOpen={true}
 *   onMouseEnter={() => handleOpen()}
 *   onClose={() => setOpen(false)}
 *   locale="en"
 * />
 * ```
 */

'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ServiceCard } from './ServiceCard'
import { MegaMenuActions } from './MegaMenuActions'
import { MEGA_MENU_SERVICES } from '@/lib/data/megaMenuServices'
import { megaMenuVariants } from '@/lib/animations/variants'
import { cn } from '@/lib/utils/cn'

export interface ServicesMegaMenuProps {
  isOpen: boolean
  onMouseEnter: () => void
  onClose: () => void
  locale: string
}

export function ServicesMegaMenu({
  isOpen,
  onMouseEnter,
  onClose,
  locale
}: ServicesMegaMenuProps) {
  const t = useTranslations('services.megaMenu')

  // Rendered through a portal: the header bar uses `backdrop-blur`, which makes
  // it the containing block for fixed-position descendants. Left in place, the
  // panel and its backdrop would be clipped to the header bar instead of the
  // viewport.
  const [container, setContainer] = useState<HTMLElement | null>(null)
  useEffect(() => setContainer(document.body), [])

  // Vertical anchor. The panel is positioned against the viewport rather than
  // the narrow nav button, so it has to track the bottom edge of the fixed
  // header — which changes height once the page is scrolled.
  const [top, setTop] = useState(96)

  useLayoutEffect(() => {
    if (!isOpen) return

    const measure = () => {
      const header = document.querySelector('header')
      setTop(header ? header.getBoundingClientRect().bottom + 8 : 96)
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [isOpen])

  // Keyboard navigation - Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!container) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[28]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Mega Menu Panel */}
          <motion.div
            variants={megaMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={onMouseEnter}
            style={{ top }}
            className={cn(
              // Positioning — anchored to the viewport and centred like the
              // header bar. Centring uses `mx-auto`, not a transform, because
              // Framer Motion owns the `transform` property on this element.
              'fixed left-0 right-0 mx-auto',
              // Layout
              'w-[calc(100%-2rem)] max-w-6xl',
              'max-h-[calc(100vh-7rem)] overflow-y-auto',
              'rounded-2xl border border-white/15',
              // Background
              'bg-bg-secondary/95 backdrop-blur-xl',
              // Shadow
              'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
              // Padding
              'p-4 md:p-6 lg:p-8',
              // Z-index
              'z-[29]'
            )}
            role="menu"
            aria-label="Services mega menu"
            data-mega-menu=""
          >
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-6">
              {MEGA_MENU_SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={t(`${service.translationKey}.title`)}
                  description={t(`${service.translationKey}.description`)}
                  href={`/${locale}/services/${service.slug}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <MegaMenuActions locale={locale} />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    container
  )
}
