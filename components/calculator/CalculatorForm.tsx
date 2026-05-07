'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { calculatePrice } from './calculatorUtils'
import type { ExtendedCalculatorSelection } from './calculatorUtils'
import { ServiceSelector } from './ServiceSelector'
import { PriceDisplay } from './PriceDisplay'

export function CalculatorForm() {
  const t = useTranslations('calculator')
  const [selections, setSelections] = useState<ExtendedCalculatorSelection[]>([])
  const [showWarning, setShowWarning] = useState(false)

  const price = calculatePrice(selections)
  const isValid = selections.length > 0

  function handleGetQuote() {
    if (!isValid) {
      setShowWarning(true)
      return
    }
    setShowWarning(false)
    const params = new URLSearchParams({
      services: selections.map((s) => s.serviceSlug).join(','),
      price: `${price.min}-${price.max}`,
    })
    window.location.href = `contact?${params.toString()}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: service selector */}
      <div className="lg:col-span-2">
        <ServiceSelector
          selections={selections}
          onChange={(newSelections) => {
            setSelections(newSelections)
            if (newSelections.length > 0) setShowWarning(false)
          }}
        />

        {showWarning && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm"
          >
            {t('noSelection')}
          </div>
        )}
      </div>

      {/* Right: price panel */}
      <div>
        <PriceDisplay
          price={price}
          selections={selections}
          onGetQuote={handleGetQuote}
          isValid={isValid}
        />
      </div>
    </div>
  )
}
