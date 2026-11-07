'use client'
/**
 * Price component with automatic currency conversion based on user location.
 * Shows AZN for Azerbaijan, USD for other countries.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useCurrency } from '@/lib/hooks/useCurrency'

type Props = {
  azn: number
  className?: string
}

export function Price({ azn, className }: Props) {
  const { convertPrice, loading } = useCurrency()

  if (loading) {
    // Show AZN while loading
    return <span className={className}>{azn} ₼</span>
  }

  const { formatted } = convertPrice(azn)
  return <span className={className}>{formatted}</span>
}
