/**
 * Combo price, currency, package id and order field rules.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { STATIC_PACKAGES, countryOf, currencyFor, formatPrice, isPackageId, isPlatform, priceOf, validateOrder } from '@/lib/site/orders'
import { orderNumber } from '@/lib/data/comboOrders'

const youtube = STATIC_PACKAGES.find((p) => p.id === 'youtube')!
const tiktok = STATIC_PACKAGES.find((p) => p.id === 'tiktok')!

describe('combo currency', () => {
  it('uses AZN at home and when the country is unknown', () => {
    expect(currencyFor('AZ')).toBe('AZN')
    expect(currencyFor('az')).toBe('AZN')
    expect(currencyFor(null)).toBe('AZN')
  })

  it('uses USD abroad', () => {
    expect(currencyFor('TR')).toBe('USD')
    expect(priceOf(youtube, 'USD')).toBe(25)
  })

  it('formats both currencies', () => {
    expect(formatPrice(tiktok, 'USD')).toBe('$15')
    expect(formatPrice(tiktok, 'AZN')).toBe('20 ₼')
  })

  it('reads the edge country header', () => {
    expect(countryOf(new Headers({ 'cf-ipcountry': 'DE' }))).toBe('DE')
    expect(countryOf(new Headers())).toBeNull()
  })
})

describe('package id and platform', () => {
  it('accepts slugs only', () => {
    expect(isPackageId('instagram')).toBe(true)
    expect(isPackageId('tiktok-pro-2')).toBe(true)
    expect(isPackageId('constructor ')).toBe(false)
    expect(isPackageId('../x')).toBe(false)
    expect(isPackageId('Instagram')).toBe(false)
    expect(isPackageId(1)).toBe(false)
  })

  it('knows the platforms', () => {
    expect(isPlatform('telegram')).toBe(true)
    expect(isPlatform('toString')).toBe(false)
  })
})

describe('order fields', () => {
  const base = { name: 'Paşa Quliyev', phone: '+994 50 778 68 87', email: 'a@b.az' }

  it('asks for a YouTube channel link on YouTube packages', () => {
    expect(validateOrder({ ...base, username: 'cradex' }, 'youtube').username).toBe('youtube')
    expect(validateOrder({ ...base, username: 'https://youtube.com/@cradex' }, 'youtube')).toEqual({})
  })

  it('takes a page or channel link for Facebook and Telegram', () => {
    expect(validateOrder({ ...base, username: 'https://t.me/cradex' }, 'telegram')).toEqual({})
    expect(validateOrder({ ...base, username: 'facebook.com/cradexagency' }, 'facebook')).toEqual({})
  })

  it('requires a WhatsApp number', () => {
    expect(validateOrder({ ...base, phone: '', username: 'cradex' }, 'instagram').phone).toBe('required')
    expect(validateOrder({ ...base, phone: '12', username: 'cradex' }, 'instagram').phone).toBe('phone')
  })
})

describe('order number', () => {
  it('is short and readable', () => {
    expect(orderNumber('4f2a9c10-0000-4000-8000-000000000000', new Date('2026-11-07T10:00:00Z'))).toBe('CX-261107-4F2A')
  })
})
