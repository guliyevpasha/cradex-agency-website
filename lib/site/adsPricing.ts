/**
 * Digital ads management packages: monthly fee, one-time setup and the
 * minimum monthly ad budget (paid by the client straight to the platform).
 * Texts live in site.adsPricingPage.packages.
 * @author Paşa Quliyev — Cradex Agency
 */

export const ADS_PACKAGE_IDS = ['meta', 'google', 'tiktok', 'linkedin'] as const
export type AdsPackageId = (typeof ADS_PACKAGE_IDS)[number]

export type AdsPackage = {
  id: AdsPackageId
  /** Monthly management fee, AZN. */
  fee: number
  /** One-time setup, AZN. */
  setup: number
  /** Minimum monthly ad budget, AZN — goes to the platform, not to us. */
  minBudget: number
  recommended?: boolean
}

// TikTok asks for at least $50/day per campaign, LinkedIn about $10/day, hence the higher floors.
export const ADS_PACKAGES: AdsPackage[] = [
  { id: 'meta', fee: 300, setup: 100, minBudget: 500, recommended: true },
  { id: 'google', fee: 350, setup: 150, minBudget: 500 },
  { id: 'tiktok', fee: 350, setup: 100, minBudget: 1500 },
  { id: 'linkedin', fee: 450, setup: 150, minBudget: 1000 },
]

export const ADS_ANNUAL_DISCOUNT = 0.2

/** Twelve months of the fee paid at once, with the annual discount. */
export const adsAnnual = (p: AdsPackage) => p.fee * 12 * (1 - ADS_ANNUAL_DISCOUNT)

/** Every amount must be whole manats, or the page would show kopecks. */
export function adsPricingProblems(): string[] {
  return ADS_PACKAGES.flatMap((p) =>
    [
      ['fee', p.fee],
      ['setup', p.setup],
      ['minBudget', p.minBudget],
      ['annual', adsAnnual(p)],
    ]
      .filter(([, v]) => !Number.isInteger(Math.round((v as number) * 1e6) / 1e6))
      .map(([k, v]) => `${p.id}.${k}=${v}`)
  )
}
