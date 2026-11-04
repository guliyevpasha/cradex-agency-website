'use client'
/**
 * Package price in the visitor's currency (AZN at home, USD abroad).
 * @author Paşa Quliyev — Cradex Agency
 */
import { formatPrice, type PackageId } from '@/lib/site/orders'
import { useCurrency } from '@/lib/site/useCurrency'

export function PriceTag({ pkg }: { pkg: PackageId }) {
  return <>{formatPrice(pkg, useCurrency())}</>
}
