/**
 * Cradex logo. Drawn as a CSS mask of /logo.svg so it takes the current text
 * colour and works on light and dark backgrounds.
 * @author Paşa Quliyev — Cradex Agency
 */
import { cn } from '@/lib/utils/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex items-center text-text-primary', className)}>
      <span className="logo-mark aspect-[4/1] h-full" aria-hidden="true" />
      <span className="sr-only">Cradex Agency</span>
    </span>
  )
}
