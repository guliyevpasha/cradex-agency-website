/**
 * ServiceCard Component
 * 
 * Individual service item displayed in the dropdown menu.
 * Compact list item with icon and title, markup.az style.
 * 
 * @component
 * @example
 * ```tsx
 * <ServiceCard
 *   icon={TrendingUp}
 *   title="Rəqəmsal Marketing"
 *   description=""
 *   href="/az/services/digital-marketing"
 * />
 * ```
 */

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Layout - Compact dropdown item
        'group flex items-center gap-2.5 px-4 py-2.5',
        // Transitions
        'transition-colors duration-150',
        // Hover effects
        'hover:bg-bg-tertiary/80',
      )}
      role="menuitem"
      aria-label={title}
    >
      {/* Icon - Small and subtle */}
      <div className="shrink-0 text-text-secondary group-hover:text-accent-primary transition-colors">
        <Icon className="w-4 h-4" strokeWidth={2} />
      </div>

      {/* Title only - Compact */}
      <span className="text-text-primary text-sm font-medium group-hover:text-accent-primary transition-colors">
        {title}
      </span>
    </Link>
  )
}
