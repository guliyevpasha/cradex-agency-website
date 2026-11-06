/**
 * Pricing for mobile apps, SEO & GEO and technical service: packages and
 * one-off extras. Texts live in site.servicePricing.<id>.
 * Prices are mid-market for Baku (late 2026), in whole manats.
 * @author Paşa Quliyev — Cradex Agency
 */

export const SERVICE_PRICING_IDS = ['mobile', 'seo', 'support'] as const
export type ServicePricingId = (typeof SERVICE_PRICING_IDS)[number]

/** Same Azerbaijani slugs as the service pages. */
export const SERVICE_PRICING_SLUGS: Record<ServicePricingId, string> = {
  mobile: 'mobil-tetbiq',
  seo: 'seo-geo',
  support: 'texniki-xidmet',
}

export const servicePricingIdBySlug = (slug: string) =>
  SERVICE_PRICING_IDS.find((id) => SERVICE_PRICING_SLUGS[id] === slug)

export type Period = 'once' | 'month'

export type PricedItem = { id: string; price: number; period: Period; recommended?: boolean }

export type ServicePricing = {
  packages: PricedItem[]
  extras: PricedItem[]
}

export const SERVICE_PRICING: Record<ServicePricingId, ServicePricing> = {
  mobile: {
    packages: [
      { id: 'mvp', price: 3500, period: 'once' },
      { id: 'business', price: 9000, period: 'once', recommended: true },
      { id: 'pro', price: 18000, period: 'once' },
    ],
    extras: [
      { id: 'care', price: 150, period: 'month' },
      { id: 'carePlus', price: 350, period: 'month' },
      { id: 'carePro', price: 700, period: 'month' },
    ],
  },
  seo: {
    packages: [
      { id: 'local', price: 450, period: 'month' },
      { id: 'business', price: 900, period: 'month', recommended: true },
      { id: 'pro', price: 1700, period: 'month' },
    ],
    extras: [
      { id: 'audit', price: 250, period: 'once' },
      { id: 'backlinks', price: 200, period: 'once' },
    ],
  },
  support: {
    packages: [
      { id: 'base', price: 60, period: 'month' },
      { id: 'business', price: 140, period: 'month', recommended: true },
      { id: 'pro', price: 290, period: 'month' },
    ],
    extras: [
      { id: 'audit', price: 250, period: 'once' },
      { id: 'malware', price: 300, period: 'once' },
      { id: 'backlinks', price: 200, period: 'once' },
      { id: 'backlinksPlus', price: 450, period: 'once' },
      { id: 'linking', price: 150, period: 'once' },
      { id: 'recovery', price: 100, period: 'once' },
    ],
  },
}

export const ANNUAL_DISCOUNT = 0.2

/** Twelve months paid at once with the annual discount. */
export const annualOf = (monthly: number) => monthly * 12 * (1 - ANNUAL_DISCOUNT)

/** Every shown amount must be whole manats. */
export function servicePricingProblems(): string[] {
  const out: string[] = []
  for (const id of SERVICE_PRICING_IDS) {
    for (const item of [...SERVICE_PRICING[id].packages, ...SERVICE_PRICING[id].extras]) {
      const amounts = item.period === 'month' ? [item.price, annualOf(item.price)] : [item.price]
      for (const a of amounts) if (Math.abs(a - Math.round(a)) > 1e-6) out.push(`${id}.${item.id}=${a}`)
    }
  }
  return out
}
