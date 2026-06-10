'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface ContentListProps {
  title: string
  description: string
  createHref: string
  createLabel?: string
  emptyMessage?: string
  children: ReactNode
  isEmpty?: boolean
}

export default function ContentList({ 
  title, 
  description, 
  createHref, 
  createLabel = 'Create New',
  emptyMessage = 'No items found. Create your first one!',
  children,
  isEmpty = false
}: ContentListProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            {title}
          </h1>
          <p className="text-text-secondary">
            {description}
          </p>
        </div>

        {/* Create New Button */}
        <Link href={createHref}>
          <button className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-medium transition-colors duration-200 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            {createLabel}
          </button>
        </Link>
      </div>

      {/* Content Grid or Empty State */}
      {isEmpty ? (
        <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-12 text-center">
          <p className="text-text-secondary text-lg mb-4">{emptyMessage}</p>
          <Link href={createHref}>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-medium transition-colors duration-200">
              <Plus className="w-5 h-5" />
              {createLabel}
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {children}
        </div>
      )}
    </div>
  )
}
