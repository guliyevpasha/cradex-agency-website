'use client'

import { useState } from 'react'
import { Upload, Link as LinkIcon, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
}

export default function ImageUploader({
  label,
  value,
  onChange,
  required = false,
  error
}: ImageUploaderProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlInput(false)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {value ? (
        <div className="relative group">
          <div className="relative w-full h-64 bg-bg-secondary border border-bg-tertiary rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-xs text-text-secondary mt-2 truncate">{value}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* URL Input */}
          {showUrlInput ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary placeholder:text-text-muted"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleUrlSubmit()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-4 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false)
                  setUrlInput('')
                }}
                className="px-4 py-3 bg-bg-tertiary hover:bg-bg-secondary text-text-primary rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Upload Button (Placeholder for Task 11) */}
              <button
                type="button"
                disabled
                className="flex flex-col items-center justify-center gap-2 p-6 bg-bg-secondary border-2 border-dashed border-bg-tertiary rounded-lg hover:border-accent-primary transition-colors opacity-50 cursor-not-allowed"
              >
                <Upload className="w-8 h-8 text-text-secondary" />
                <span className="text-sm text-text-secondary">Upload File</span>
                <span className="text-xs text-text-muted">(Coming in Task 11)</span>
              </button>

              {/* URL Input Button */}
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="flex flex-col items-center justify-center gap-2 p-6 bg-bg-secondary border-2 border-dashed border-bg-tertiary rounded-lg hover:border-accent-primary transition-colors"
              >
                <LinkIcon className="w-8 h-8 text-text-secondary" />
                <span className="text-sm text-text-secondary">Image URL</span>
                <span className="text-xs text-text-muted">Paste image link</span>
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
