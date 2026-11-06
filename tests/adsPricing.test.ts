/**
 * Ads packages: whole-manat amounts and the 20% annual discount.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { ADS_PACKAGES, ADS_PACKAGE_IDS, adsAnnual, adsPricingProblems } from '@/lib/site/adsPricing'

describe('ads pricing', () => {
  it('has one package per platform', () => {
    expect(ADS_PACKAGES.map((p) => p.id)).toEqual([...ADS_PACKAGE_IDS])
  })

  it('keeps every amount in whole manats', () => {
    expect(adsPricingProblems()).toEqual([])
  })

  it('takes 20% off twelve months when paid yearly', () => {
    for (const p of ADS_PACKAGES) expect(adsAnnual(p)).toBe(p.fee * 12 * 0.8)
  })
})
