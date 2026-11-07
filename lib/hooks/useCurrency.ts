'use client'
/**
 * Currency hook: detects user country and shows prices in AZN or USD.
 * Exchange rate is fetched from a public API and cached.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useState } from 'react'
import type { Currency } from '@/lib/site/orders'

const EXCHANGE_RATE_KEY = 'exchange-rate-azn-usd'
const EXCHANGE_RATE_TIMESTAMP_KEY = 'exchange-rate-timestamp'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('AZN')
  const [exchangeRate, setExchangeRate] = useState<number>(1.7) // Default fallback rate
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function detectCurrency() {
      try {
        // Fetch user's currency based on geo-location
        const res = await fetch('/api/geo')
        if (res.ok) {
          const data = await res.json()
          setCurrency(data.currency as Currency)
        }
      } catch (error) {
        console.error('Failed to detect currency:', error)
        // Default to AZN on error
        setCurrency('AZN')
      }
    }

    async function fetchExchangeRate() {
      try {
        // Check cache first
        const cachedRate = localStorage.getItem(EXCHANGE_RATE_KEY)
        const cachedTimestamp = localStorage.getItem(EXCHANGE_RATE_TIMESTAMP_KEY)

        if (cachedRate && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10)
          if (Date.now() - timestamp < CACHE_DURATION) {
            setExchangeRate(parseFloat(cachedRate))
            setLoading(false)
            return
          }
        }

        // Fetch fresh rate from API
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        if (res.ok) {
          const data = await res.json()
          const rate = data.rates.AZN || 1.7
          setExchangeRate(rate)
          
          // Cache the rate
          localStorage.setItem(EXCHANGE_RATE_KEY, rate.toString())
          localStorage.setItem(EXCHANGE_RATE_TIMESTAMP_KEY, Date.now().toString())
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
        // Use default rate
      } finally {
        setLoading(false)
      }
    }

    detectCurrency()
    fetchExchangeRate()
  }, [])

  const convertPrice = (aznPrice: number): { amount: number; currency: Currency; formatted: string } => {
    if (currency === 'AZN') {
      return {
        amount: aznPrice,
        currency: 'AZN',
        formatted: `${aznPrice} ₼`
      }
    }

    // Convert to USD
    const usdAmount = Math.ceil(aznPrice / exchangeRate)
    return {
      amount: usdAmount,
      currency: 'USD',
      formatted: `$${usdAmount}`
    }
  }

  return {
    currency,
    exchangeRate,
    loading,
    convertPrice,
    isAzerbaijan: currency === 'AZN'
  }
}
