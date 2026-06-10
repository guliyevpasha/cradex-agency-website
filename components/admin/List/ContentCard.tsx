'use client'

import { ReactNode } from 'react'
import ActionButtons from './ActionButtons'

interface ContentCardProps {
  title: string
  subtitle?: string
  metadata?: ReactNode
  editHref: string
  onDelete: () => void
}

export default function ContentCard({ 
  title, 
  subtitle, 
  metadata, 
  editHref, 
  onDelete 
}: ContentCardProps) {
  return (
    <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 hover:border-accent-primary transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-display font-bold text-text-primary mb-1 truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-text-secondary mb-3">
              {subtitle}
            </p>
          )}
          {metadata && (
            <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
              {metadata}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0">
          <ActionButtons editHref={editHref} onDelete={onDelete} />
        </div>
      </div>
    </div>
  )
}
