'use client'

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea' | 'number' | 'url'
  placeholder?: string
  required?: boolean
  error?: string
  rows?: number
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  rows = 4
}: FormFieldProps) {
  const baseClasses = "w-full px-4 py-3 bg-bg-primary border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary placeholder:text-text-muted transition-colors"
  const errorClasses = error ? "border-red-500" : "border-bg-tertiary"

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseClasses} ${errorClasses} resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${errorClasses}`}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
