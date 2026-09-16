import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ValueItemProps {
  value: {
    id: string
    title: string
    description: string
    icon: string
  }
}

export function ValueItem({ value }: ValueItemProps) {
  // Map icon name to Lucide icon component
  const IconComponent = ((Icons as any)[value.icon] as LucideIcon) || Icons.Star

  return (
    <div className="flex flex-col items-start p-6 rounded-xl bg-bg-tertiary/50 border border-bg-tertiary hover:border-accent-primary/30 transition-colors duration-300">
      {/* Icon */}
      <div
        className="mb-4 p-3 rounded-lg bg-accent-primary/10"
        aria-hidden="true"
      >
        <IconComponent className="w-6 h-6 text-accent-primary" />
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold mb-2 text-text-primary">
        {value.title}
      </h4>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed">
        {value.description}
      </p>
    </div>
  )
}
