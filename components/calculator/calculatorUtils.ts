import type { CalculatorSelection, PriceRange } from '@/types'
import { getAllServicesSync } from '@/lib/data/services'

export interface FactorSelection {
  [factorKey: string]: string | string[]
}

export interface ExtendedCalculatorSelection extends CalculatorSelection {
  factors?: FactorSelection
}

/**
 * Calculates the total price range for a list of service selections,
 * taking into account all selected factors for each service.
 */
export function calculatePrice(selections: ExtendedCalculatorSelection[]): PriceRange {
  if (selections.length === 0) {
    return { min: 0, max: 0, currency: 'AZN' }
  }

  const services = getAllServicesSync()
  let totalMin = 0
  let totalMax = 0

  for (const selection of selections) {
    const service = services.find((s) => s.slug === selection.serviceSlug)
    if (!service) continue

    const pricing = (service as any).pricing
    if (!pricing) continue

    const factors = (pricing as any).factors ?? {}
    const selectedFactors = selection.factors ?? {}

    // Check if any factor overrides the base price
    let overrideMin: number | null = null
    let overrideMax: number | null = null

    for (const [factorKey, factorDef] of Object.entries(factors) as [string, any][]) {
      if (factorDef.overridePrice) {
        const selectedValue = selectedFactors[factorKey]
        if (selectedValue && typeof selectedValue === 'string') {
          const opt = factorDef.options.find((o: any) => o.value === selectedValue)
          if (opt && opt.priceMin !== undefined) {
            overrideMin = opt.priceMin
            overrideMax = opt.priceMax
          }
        }
      }
    }

    let baseMin = overrideMin !== null ? overrideMin : pricing.baseMin
    let baseMax = overrideMax !== null ? overrideMax : pricing.baseMax

    // Duration multiplier (only if not a one-time service)
    const durationMult = pricing.durationMultiplier?.[selection.duration] ?? 1
    // For one-time services (branding, web), duration doesn't multiply
    const isOneTime = durationMult === 1 || Object.values(pricing.durationMultiplier ?? {}).every((v) => v === 1)

    let serviceMin = baseMin * (isOneTime ? 1 : durationMult)
    let serviceMax = baseMax * (isOneTime ? 1 : durationMult)

    // Platform multiplier (SMM)
    if (selection.platformCount && pricing.platformMultiplier) {
      const platMult = pricing.platformMultiplier[String(selection.platformCount)] ?? 1
      serviceMin *= platMult
      serviceMax *= platMult
    }

    // Apply non-override factors
    for (const [factorKey, factorDef] of Object.entries(factors) as [string, any][]) {
      if (factorDef.overridePrice) continue

      const selectedValue = selectedFactors[factorKey]
      if (!selectedValue) continue

      const values = Array.isArray(selectedValue) ? selectedValue : [selectedValue]

      for (const val of values) {
        const opt = factorDef.options.find((o: any) => o.value === val)
        if (!opt) continue

        if (opt.multiplier !== undefined && opt.multiplier !== 1) {
          // Apply multiplier only once (not stacked with duration for one-time)
          serviceMin = serviceMin * opt.multiplier
          serviceMax = serviceMax * opt.multiplier
        }
        if (opt.addMin !== undefined) {
          serviceMin += opt.addMin
          serviceMax += opt.addMax ?? opt.addMin
        }
      }
    }

    totalMin += serviceMin
    totalMax += serviceMax
  }

  return {
    min: Math.round(totalMin),
    max: Math.round(totalMax),
    currency: 'AZN',
  }
}

/**
 * Builds a WhatsApp pre-fill message from calculator selections and price.
 */
export function buildWhatsAppMessage(
  selections: ExtendedCalculatorSelection[],
  price: PriceRange
): string {
  const services = getAllServicesSync()
  const serviceNames = selections
    .map((s) => {
      const svc = services.find((sv) => sv.slug === s.serviceSlug)
      return svc?.slug.replace(/-/g, ' ') ?? s.serviceSlug
    })
    .join(', ')
  return encodeURIComponent(
    `Salam! Kalkulyatorda seçdiyim xidmətlər: ${serviceNames}. Təxmini qiymət: ${price.min}–${price.max} AZN.`
  )
}
