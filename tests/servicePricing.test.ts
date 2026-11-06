/**
 * Mobile, SEO & GEO and technical service pricing: whole manats, slugs match.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { SERVICE_PRICING, SERVICE_PRICING_IDS, SERVICE_PRICING_SLUGS, annualOf, servicePricingIdBySlug, servicePricingProblems } from '@/lib/site/servicePricing'
import { SERVICE_SLUGS } from '@/lib/site/navigation'

describe('service pricing', () => {
  it('keeps every amount in whole manats', () => {
    expect(servicePricingProblems()).toEqual([])
  })

  it('uses the service page slugs', () => {
    for (const id of SERVICE_PRICING_IDS) {
      expect(SERVICE_PRICING_SLUGS[id]).toBe(SERVICE_SLUGS[id])
      expect(servicePricingIdBySlug(SERVICE_PRICING_SLUGS[id])).toBe(id)
    }
  })

  it('has three packages per service, one recommended', () => {
    for (const id of SERVICE_PRICING_IDS) {
      expect(SERVICE_PRICING[id].packages).toHaveLength(3)
      expect(SERVICE_PRICING[id].packages.filter((p) => p.recommended)).toHaveLength(1)
    }
  })

  it('takes 20% off twelve months', () => {
    expect(annualOf(450)).toBeCloseTo(4320)
  })
})
