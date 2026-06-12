/**
 * MegaMenuActions Component
 * 
 * Action buttons container displayed at the bottom of the services mega menu.
 * Contains "View All Services" and "Calculate Price" buttons with responsive layout.
 * 
 * @component
 * @example
 * ```tsx
 * <MegaMenuActions locale="en" />
 * ```
 */

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

export interface MegaMenuActionsProps {
  locale: string
}

export function MegaMenuActions({ locale }: MegaMenuActionsProps) {
  const t = useTranslations('services.megaMenu')

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
      {/* View All Services - Secondary button */}
      <Link
        href={`/${locale}/services`}
        className={cn(
          'flex-1 px-4 py-2.5 rounded-xl text-center',
          'bg-bg-tertiary text-text-primary',
          'border border-white/10',
          'hover:bg-bg-quaternary hover:border-white/20',
          'transition-all duration-200',
          'text-sm font-medium'
        )}
      >
        {t('viewAllServices')}
      </Link>

      {/* Calculate Price - Primary button */}
      <Link
        href={`/${locale}/calculator`}
        className={cn(
          'flex-1 px-4 py-2.5 rounded-xl text-center',
          'bg-gradient-to-r from-accent-primary to-accent-secondary',
          'text-white font-semibold',
          'hover:opacity-90',
          'shadow-[0_0_16px_rgba(108,99,255,0.4)]',
          'hover:shadow-[0_0_24px_rgba(108,99,255,0.6)]',
          'transition-all duration-200',
          'text-sm'
        )}
      >
        {t('calculatePrice')}
      </Link>
    </div>
  )
}
