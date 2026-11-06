/**
 * Combo price and currency rules.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { countryOf, currencyFor, formatPrice, isPackage, priceOf } from '@/lib/site/orders'

describe('combo currency', () => {
  it('uses AZN at home and when the country is unknown', () => {
    expect(currencyFor('AZ')).toBe('AZN')
    expect(currencyFor('az')).toBe('AZN')
    expect(currencyFor(null)).toBe('AZN')
  })

  it('uses USD abroad', () => {
    expect(currencyFor('TR')).toBe('USD')
    expect(priceOf('youtube', 'USD')).toBe(25)
  })

  it('formats both currencies', () => {
    expect(formatPrice('instagram', 'AZN')).toBe('20 ₼')
    expect(formatPrice('tiktok', 'USD')).toBe('$15')
  })

  it('reads the edge country header', () => {
    expect(countryOf(new Headers({ 'cf-ipcountry': 'DE' }))).toBe('DE')
    expect(countryOf(new Headers())).toBeNull()
  })
})

describe('package id', () => {
  it('accepts only our own packages, not object prototype keys', () => {
    expect(isPackage('instagram')).toBe(true)
    expect(isPackage('constructor')).toBe(false)
    expect(isPackage('toString')).toBe(false)
    expect(isPackage(1)).toBe(false)
  })
})
