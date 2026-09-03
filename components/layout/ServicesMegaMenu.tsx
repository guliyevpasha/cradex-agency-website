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
 * - CSS transitions, driven purely by class toggles
 * - Multilingual support via next-intl
 * - ARIA attributes for accessibility
 *
 * The panel stays mounted and is shown by toggling classes. It used to mount on
 * open and fade in with Framer Motion, but that made the menu completely
 * invisible whenever the animation failed to start — too fragile for a primary
 * navigation control. `visibility` keeps the closed panel out of the tab order.
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

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ServiceCard } from './ServiceCard'
import { MegaMenuActions } from './MegaMenuActions'
import { MEGA_MENU_SERVICES } from '@/lib/data/megaMenuServices'
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

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-[28] transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mega Menu Panel */}
      <div
        onMouseEnter={onMouseEnter}
        className={cn(
          // Positioning — anchored to the header bar (the nearest positioned
          // ancestor), so it spans the bar's full width and sits just below it.
          'absolute top-full left-0 right-0 mt-2 origin-top',
          // Layout
          'max-h-[calc(100vh-7rem)] overflow-y-auto',
          'rounded-2xl border border-white/15',
          // Background
          'bg-bg-secondary/95 backdrop-blur-xl',
          // Shadow
          'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          // Padding
          'p-4 md:p-6 lg:p-8',
          // Z-index
          'z-[29]',
          // Open/close transition
          'transition-all duration-200 ease-out',
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-2 scale-95 invisible pointer-events-none'
        )}
        role="menu"
        aria-label="Services mega menu"
        aria-hidden={!isOpen}
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
      </div>
    </>
  )
}
