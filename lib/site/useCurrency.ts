'use client'
/**
 * Visitor's display currency, asked once per visit from /api/geo.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useState } from 'react'
import type { Currency } from './orders'

const KEY = 'cradex-currency'
let pending: Promise<Currency> | null = null

function load(): Promise<Currency> {
  pending ??= fetch('/api/geo')
    .then((r) => r.json())
    .then((d) => (d.currency === 'USD' ? 'USD' : 'AZN') as Currency)
    .catch(() => 'AZN' as Currency)
  return pending
}

export function useCurrency(): Currency {
  const [currency, setCurrency] = useState<Currency>('AZN')

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY)
      if (saved === 'AZN' || saved === 'USD') {
        setCurrency(saved)
        return
      }
    } catch {}
    load().then((c) => {
      setCurrency(c)
      try {
        sessionStorage.setItem(KEY, c)
      } catch {}
    })
  }, [])

  return currency
}
