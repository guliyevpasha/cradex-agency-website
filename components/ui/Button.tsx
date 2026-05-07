import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Spinner } from './Spinner'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  onClick?: () => void
  href?: string
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  target?: string
  rel?: string
  'aria-label'?: string
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90 shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]',
  secondary:
    'border border-accent-primary/50 text-text-primary hover:bg-accent-primary/10 hover:border-accent-primary',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
  whatsapp:
    'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] animate-pulse-slow',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[52px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  onClick,
  href,
  children,
  className,
  type = 'button',
  target,
  rel,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    className
  )

  const content = (
    <>
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={baseStyles}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseStyles}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {content}
    </button>
  )
}
