import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { calculatePrice } from '@/components/calculator/calculatorUtils'
import type { CalculatorSelection } from '@/types'

const validSlugs = [
  'digital-marketing', 'traditional-marketing', 'smm',
  'graphic-motion-design', 'photo-video', 'branding',
  'copywriting', 'web-mobile-dev',
] as const

const validDurations = ['1m', '3m', '6m', '12m'] as const

// Arbitrary for a single valid selection
const arbitrarySelection = fc.record({
  serviceSlug: fc.constantFrom(...validSlugs),
  duration: fc.constantFrom(...validDurations),
  platformCount: fc.option(fc.constantFrom(1, 2, 3), { nil: undefined }),
}) as fc.Arbitrary<CalculatorSelection>

describe('Calculator — correctness properties', () => {
  // Property 1: Empty selection → zero price
  it('empty selection returns zero price', () => {
    const result = calculatePrice([])
    expect(result.min).toBe(0)
    expect(result.max).toBe(0)
    expect(result.currency).toBe('AZN')
  })

  // Property 2: Price is always non-negative
  it('price is always non-negative', () => {
    fc.assert(
      fc.property(fc.array(arbitrarySelection, { maxLength: 8 }), (selections) => {
        const result = calculatePrice(selections)
        expect(result.min).toBeGreaterThanOrEqual(0)
        expect(result.max).toBeGreaterThanOrEqual(0)
      })
    )
  })

  // Property 3: min ≤ max always
  it('min is always ≤ max', () => {
    fc.assert(
      fc.property(fc.array(arbitrarySelection, { maxLength: 8 }), (selections) => {
        const result = calculatePrice(selections)
        expect(result.min).toBeLessThanOrEqual(result.max)
      })
    )
  })

  // Property 4: Adding more services increases price (monotonicity)
  it('adding a service never decreases price', () => {
    fc.assert(
      fc.property(
        fc.array(arbitrarySelection, { minLength: 1, maxLength: 4 }),
        arbitrarySelection,
        (selections, extra) => {
          const basePrice = calculatePrice(selections)
          const extendedPrice = calculatePrice([...selections, extra])
          expect(extendedPrice.min).toBeGreaterThanOrEqual(basePrice.min)
          expect(extendedPrice.max).toBeGreaterThanOrEqual(basePrice.max)
        }
      )
    )
  })

  // Property 5: Longer duration → higher or equal price
  it('longer duration gives higher or equal price', () => {
    fc.assert(
      fc.property(fc.constantFrom(...validSlugs), (slug) => {
        const price1m = calculatePrice([{ serviceSlug: slug, duration: '1m' }])
        const price3m = calculatePrice([{ serviceSlug: slug, duration: '3m' }])
        const price6m = calculatePrice([{ serviceSlug: slug, duration: '6m' }])
        const price12m = calculatePrice([{ serviceSlug: slug, duration: '12m' }])

        expect(price1m.min).toBeLessThanOrEqual(price3m.min)
        expect(price3m.min).toBeLessThanOrEqual(price6m.min)
        expect(price6m.min).toBeLessThanOrEqual(price12m.min)
      })
    )
  })

  // Property 6: Currency is always AZN
  it('currency is always AZN', () => {
    fc.assert(
      fc.property(fc.array(arbitrarySelection, { maxLength: 8 }), (selections) => {
        const result = calculatePrice(selections)
        expect(result.currency).toBe('AZN')
      })
    )
  })

  // Property 7: More SMM platforms → higher or equal price
  it('more SMM platforms gives higher or equal price', () => {
    const price1 = calculatePrice([{ serviceSlug: 'smm', duration: '1m', platformCount: 1 }])
    const price2 = calculatePrice([{ serviceSlug: 'smm', duration: '1m', platformCount: 2 }])
    const price3 = calculatePrice([{ serviceSlug: 'smm', duration: '1m', platformCount: 3 }])

    expect(price1.min).toBeLessThanOrEqual(price2.min)
    expect(price2.min).toBeLessThanOrEqual(price3.min)
  })
})
