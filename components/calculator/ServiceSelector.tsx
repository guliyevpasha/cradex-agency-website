'use client'
import { useTranslations } from 'next-intl'
import type { CalculatorSelection } from '@/types'
import type { ExtendedCalculatorSelection, FactorSelection } from './calculatorUtils'
import { getAllServicesSync } from '@/lib/data/services'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { cn } from '@/lib/utils/cn'

interface ServiceSelectorProps {
  selections: ExtendedCalculatorSelection[]
  onChange: (selections: ExtendedCalculatorSelection[]) => void
}

const durations = ['1m', '3m', '6m', '12m'] as const
const platforms = [1, 2, 3] as const

export function ServiceSelector({ selections, onChange }: ServiceSelectorProps) {
  const t = useTranslations('calculator')
  const tServices = useTranslations('services')
  const services = getAllServicesSync()

  function isSelected(slug: string) {
    return selections.some((s) => s.serviceSlug === slug)
  }

  function getSelection(slug: string) {
    return selections.find((s) => s.serviceSlug === slug)
  }

  function toggleService(slug: string) {
    if (isSelected(slug)) {
      onChange(selections.filter((s) => s.serviceSlug !== slug))
    } else {
      onChange([...selections, { serviceSlug: slug as any, duration: '1m', factors: {} }])
    }
  }

  function updateDuration(slug: string, duration: CalculatorSelection['duration']) {
    onChange(selections.map((s) => (s.serviceSlug === slug ? { ...s, duration } : s)))
  }

  function updatePlatform(slug: string, platformCount: 1 | 2 | 3) {
    onChange(selections.map((s) => (s.serviceSlug === slug ? { ...s, platformCount } : s)))
  }

  function updateFactor(slug: string, factorKey: string, value: string, multiSelect: boolean) {
    onChange(
      selections.map((s) => {
        if (s.serviceSlug !== slug) return s
        const current = s.factors ?? {}
        let newVal: string | string[]

        if (multiSelect) {
          const existing = (current[factorKey] as string[]) ?? []
          newVal = existing.includes(value)
            ? existing.filter((v) => v !== value)
            : [...existing, value]
        } else {
          newVal = value
        }

        return { ...s, factors: { ...current, [factorKey]: newVal } }
      })
    )
  }

  function isFactorSelected(sel: ExtendedCalculatorSelection, factorKey: string, value: string) {
    const v = sel.factors?.[factorKey]
    if (Array.isArray(v)) return v.includes(value)
    return v === value
  }

  return (
    <div className="space-y-3">
      <h3 className="text-text-primary font-semibold text-lg mb-4">{t('selectServices')}</h3>
      {services.map((service) => {
        const selected = isSelected(service.slug)
        const sel = getSelection(service.slug)
        const key = service.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        const isSMM = service.slug === 'smm'
        const pricing = (service as any).pricing
        const factors = pricing?.factors ?? {}
        const isOneTime = Object.values(pricing?.durationMultiplier ?? {}).every((v) => v === 1)

        return (
          <div
            key={service.id}
            className={cn(
              'rounded-2xl border transition-all duration-200',
              selected
                ? 'border-accent-primary/50 bg-accent-primary/5 shadow-[0_0_20px_rgba(108,99,255,0.1)]'
                : 'border-white/10 bg-bg-secondary/50 hover:border-white/20'
            )}
          >
            {/* Service toggle header */}
            <label className="flex items-center gap-4 p-4 cursor-pointer select-none">
              <div
                className={cn(
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                  selected
                    ? 'bg-accent-primary border-accent-primary'
                    : 'border-white/30 bg-transparent'
                )}
                onClick={() => toggleService(service.slug)}
              >
                {selected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-accent-primary"><ServiceIcon name={service.icon} className="w-6 h-6" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium text-sm">
                  {tServices(`${key}.name` as any)}
                </p>
                <p className="text-text-muted text-xs mt-0.5">
                  {pricing.baseMin}–{pricing.baseMax} AZN{isOneTime ? '' : ' / ay'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleService(service.slug)}
                className="sr-only"
                aria-label={tServices(`${key}.name` as any)}
              />
            </label>

            {/* Expanded parameters */}
            {selected && sel && (
              <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">

                {/* Duration — only for recurring services */}
                {!isOneTime && (
                  <div>
                    <p className="text-text-muted text-xs font-medium mb-2 uppercase tracking-wider">{t('duration.label')}</p>
                    <div className="flex gap-2 flex-wrap">
                      {durations.map((d) => (
                        <button
                          key={d}
                          onClick={() => updateDuration(service.slug, d)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            sel.duration === d
                              ? 'bg-accent-primary text-white shadow-[0_0_10px_rgba(108,99,255,0.4)]'
                              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/80'
                          )}
                        >
                          {t(`duration.${d}` as any)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platform count (SMM only) */}
                {isSMM && (
                  <div>
                    <p className="text-text-muted text-xs font-medium mb-2 uppercase tracking-wider">{t('platforms.label')}</p>
                    <div className="flex gap-2">
                      {platforms.map((p) => (
                        <button
                          key={p}
                          onClick={() => updatePlatform(service.slug, p)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            sel.platformCount === p
                              ? 'bg-accent-secondary text-bg-primary shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                          )}
                        >
                          {t(`platforms.${p}` as any)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic factors */}
                {Object.entries(factors).map(([factorKey, factorDef]: [string, any]) => (
                  <div key={factorKey}>
                    <p className="text-text-muted text-xs font-medium mb-2 uppercase tracking-wider">
                      {factorDef.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {factorDef.options.map((opt: any) => {
                        const isActive = isFactorSelected(sel, factorKey, opt.value)
                        return (
                          <button
                            key={opt.value}
                            onClick={() => updateFactor(service.slug, factorKey, opt.value, factorDef.multiSelect)}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                              isActive
                                ? 'bg-accent-primary/20 border-accent-primary/60 text-accent-primary'
                                : 'bg-bg-tertiary border-transparent text-text-secondary hover:text-text-primary hover:border-white/20'
                            )}
                          >
                            {opt.label}
                            {opt.addMin && opt.addMin > 0 && (
                              <span className="ml-1 text-text-muted">+{opt.addMin}₼</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
