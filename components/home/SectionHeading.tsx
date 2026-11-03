/**
 * @author Paşa Quliyev — Cradex Agency
 */
import { cn } from '@/lib/utils/cn'

type Props = {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', as: Tag = 'h2', className }: Props) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{eyebrow}</p>
      <Tag className={cn('mt-3 font-extrabold tracking-[-0.035em] text-text-primary', Tag === 'h1' ? 'text-display-xl' : 'text-display-lg')}>
        {title}
      </Tag>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">{subtitle}</p>}
    </div>
  )
}
