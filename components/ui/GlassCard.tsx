import { cn } from '@/lib/utils/cn'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  blurIntensity?: 'sm' | 'md' | 'lg'
  as?: React.ElementType
}

const blurMap = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
}

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  blurIntensity = 'md',
  as: Component = 'div',
}: GlassCardProps) {
  return (
    <Component
      className={cn(
        'glass-card',
        blurMap[blurIntensity],
        hoverEffect && 'transition-all duration-300 hover:border-accent-primary/40 hover:shadow-[0_0_24px_rgba(108,99,255,0.15)] hover:-translate-y-1',
        className
      )}
    >
      {children}
    </Component>
  )
}
