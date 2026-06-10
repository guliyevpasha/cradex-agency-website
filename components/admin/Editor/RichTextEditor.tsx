'use client'

import { useState } from 'react'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react'

interface RichTextEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  rows?: number
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 10
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: List, label: 'Bullet List', action: () => insertMarkdown('\n- ', '') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertMarkdown('\n1. ', '') },
    { icon: LinkIcon, label: 'Link', action: () => insertMarkdown('[', '](url)') },
  ]

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n- (.*)/g, '<li>$1</li>')
      .replace(/\n\d+\. (.*)/g, '<li>$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-accent-primary underline">$1</a>')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-accent-primary hover:text-accent-secondary transition-colors"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {!showPreview ? (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-bg-secondary border border-bg-tertiary rounded-t-lg">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="p-2 rounded hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            id="rich-text-area"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`
              w-full px-4 py-3 bg-bg-primary border rounded-b-lg
              focus:outline-none focus:ring-2 focus:ring-accent-primary
              text-text-primary placeholder:text-text-muted
              resize-y transition-colors
              ${error ? 'border-red-500' : 'border-bg-tertiary border-t-0'}
            `}
          />
        </>
      ) : (
        <div
          className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg min-h-[200px] text-text-primary prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-text-secondary">
        Supports: **bold**, *italic*, - bullet lists, 1. numbered lists, [link](url)
      </p>
    </div>
  )
}
