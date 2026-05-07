import type { PriceRange } from '@/types'

/**
 * Formats a PriceRange as "{min} – {max} AZN"
 */
export function formatPriceRange(range: PriceRange): string {
  return `${range.min} – ${range.max} ${range.currency}`
}

/**
 * Formats a single price value with currency
 */
export function formatPrice(amount: number, currency: string = 'AZN'): string {
  return `${amount} ${currency}`
}
