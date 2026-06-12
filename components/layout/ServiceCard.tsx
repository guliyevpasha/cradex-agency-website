/**
 * ServiceCard Component
 * 
 * Individual service card displayed in the mega menu.
 * Shows service icon, title, and description with hover effects.
 * 
 * @component
 * @example
 * ```tsx
 * <ServiceCard
 *   icon={TrendingUp}
 *   title="Digital Marketing"
 *   description="SEO, Google Ads and digital strategy"
 *   href="/en/services/digital-marketing"
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
        // Layout
        'group flex items-start gap-3 p-4 rounded-xl',
        // Background
        'bg-bg-tertiary/50',
        // Border
        'border border-white/5',
        // Transitions
        'transition-all duration-200',
        // Hover effects
        'hover:bg-bg-tertiary hover:scale-[1.02]',
        'hover:shadow-[0_4px_16px_rgba(108,99,255,0.2)]',
        'hover:border-accent-primary/20'
      )}
      role="menuitem"
      aria-label={`${title} - ${description}`}
    >
      {/* Icon */}
      <div className="shrink-0 text-accent-primary">
        <Icon className="w-6 h-6 md:w-7 md:h-7" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-text-primary font-semibold text-base md:text-lg mb-1">
          {title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  )
}
