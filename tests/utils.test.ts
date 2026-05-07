import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { calculateReadingTime } from '@/lib/utils/readingTime'
import { formatPriceRange, formatPrice } from '@/lib/utils/formatPrice'
import type { PriceRange } from '@/types'

describe('calculateReadingTime', () => {
  // Unit tests
  it('returns 1 for empty string', () => {
    expect(calculateReadingTime('')).toBe(1)
  })

  it('returns 1 for single word', () => {
    expect(calculateReadingTime('hello')).toBe(1)
  })

  it('returns 1 for 200 words', () => {
    const text = Array(200).fill('word').join(' ')
    expect(calculateReadingTime(text)).toBe(1)
  })

  it('returns 2 for 201 words', () => {
    const text = Array(201).fill('word').join(' ')
    expect(calculateReadingTime(text)).toBe(2)
  })

  it('returns 5 for 1000 words', () => {
    const text = Array(1000).fill('word').join(' ')
    expect(calculateReadingTime(text)).toBe(5)
  })

  // Property-based: result is always ceil(wordCount / 200)
  it('always equals ceil(wordCount / 200)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 1000 }),
        (words) => {
          const text = words.join(' ')
          const wordCount = text.trim().split(/\s+/).length
          const expected = Math.ceil(wordCount / 200)
          expect(calculateReadingTime(text)).toBe(expected)
        }
      )
    )
  })

  // Property-based: result is always ≥ 1
  it('result is always at least 1', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (text) => {
        expect(calculateReadingTime(text)).toBeGreaterThanOrEqual(1)
      })
    )
  })
})

describe('formatPriceRange', () => {
  it('formats correctly', () => {
    const range: PriceRange = { min: 800, max: 1200, currency: 'AZN' }
    expect(formatPriceRange(range)).toBe('800 – 1200 AZN')
  })

  it('works with zero values', () => {
    const range: PriceRange = { min: 0, max: 0, currency: 'AZN' }
    expect(formatPriceRange(range)).toBe('0 – 0 AZN')
  })

  // Property-based: always contains currency
  it('always contains AZN', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 10000 }),
        fc.nat({ max: 10000 }),
        (a, b) => {
          const range: PriceRange = {
            min: Math.min(a, b),
            max: Math.max(a, b),
            currency: 'AZN',
          }
          expect(formatPriceRange(range)).toContain('AZN')
        }
      )
    )
  })

  // Property-based: min always appears before max in output
  it('min appears before max in formatted string', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 5000 }),
        fc.nat({ max: 5000 }),
        (a, b) => {
          const min = Math.min(a, b)
          const max = Math.max(a, b)
          const range: PriceRange = { min, max, currency: 'AZN' }
          const formatted = formatPriceRange(range)
          const minIndex = formatted.indexOf(String(min))
          const maxIndex = formatted.indexOf(String(max))
          // min should appear at or before max position
          expect(minIndex).toBeLessThanOrEqual(maxIndex)
        }
      )
    )
  })
})

describe('formatPrice', () => {
  it('formats single price with default currency', () => {
    expect(formatPrice(500)).toBe('500 AZN')
  })

  it('formats single price with custom currency', () => {
    expect(formatPrice(100, 'USD')).toBe('100 USD')
  })
})
