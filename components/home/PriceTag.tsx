'use client'
/**
 * Package price in the visitor's currency (AZN at home, USD abroad).
 * @author Paşa Quliyev — Cradex Agency
 */
import { formatPrice, type ComboPackage } from '@/lib/site/orders'
import { useCurrency } from '@/lib/site/useCurrency'

export function PriceTag({ pack }: { pack: Pick<ComboPackage, 'azn' | 'usd'> }) {
  return <>{formatPrice(pack, useCurrency())}</>
}
