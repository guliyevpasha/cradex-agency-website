'use client'

import { ReactNode } from 'react'
import { Save, X } from 'lucide-react'
import Link from 'next/link'

interface ContentEditorProps {
  title: string
  onSave: () => void
  onCancel: () => void
  isSaving?: boolean
  children: ReactNode
}

export default function ContentEditor({ 
  title, 
  onSave, 
  onCancel, 
  isSaving = false,
  children 
}: ContentEditorProps) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">
          {title}
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 border border-bg-tertiary text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 md:p-8">
        {children}
      </div>
    </div>
  )
}
