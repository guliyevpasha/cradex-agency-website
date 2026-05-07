import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import azMessages from '@/messages/az.json'
import enMessages from '@/messages/en.json'
import ruMessages from '@/messages/ru.json'
import trMessages from '@/messages/tr.json'

// Flatten nested object keys into dot-notation paths
function flattenKeys(obj: Record<string, unknown>, prefix = ''): Set<string> {
  const keys = new Set<string>()
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const k of flattenKeys(value as Record<string, unknown>, fullKey)) {
        keys.add(k)
      }
    } else {
      keys.add(fullKey)
    }
  }
  return keys
}

// Simulate locale path switching
function switchLocalePath(currentPath: string, newLocale: string): string {
  const segments = currentPath.split('/')
  segments[1] = newLocale
  return segments.join('/')
}

const locales = ['az', 'en', 'ru', 'tr'] as const
const azKeys = flattenKeys(azMessages as Record<string, unknown>)
const enKeys = flattenKeys(enMessages as Record<string, unknown>)
const ruKeys = flattenKeys(ruMessages as Record<string, unknown>)
const trKeys = flattenKeys(trMessages as Record<string, unknown>)

describe('i18n — correctness properties', () => {
  // Property 1: All locales have the same keys as AZ
  it('EN has all keys that AZ has', () => {
    for (const key of azKeys) {
      expect(enKeys.has(key), `EN missing key: ${key}`).toBe(true)
    }
  })

  it('RU has all keys that AZ has', () => {
    for (const key of azKeys) {
      expect(ruKeys.has(key), `RU missing key: ${key}`).toBe(true)
    }
  })

  it('TR has all keys that AZ has', () => {
    for (const key of azKeys) {
      expect(trKeys.has(key), `TR missing key: ${key}`).toBe(true)
    }
  })

  // Property 2: AZ has all keys that EN has (bidirectional)
  it('AZ has all keys that EN has', () => {
    for (const key of enKeys) {
      expect(azKeys.has(key), `AZ missing key: ${key}`).toBe(true)
    }
  })

  // Property 3: Locale switch updates URL correctly
  it('locale switch produces URL starting with new locale', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/az', '/en', '/ru', '/tr'),
        fc.constantFrom(...locales),
        (currentPath, newLocale) => {
          const newPath = switchLocalePath(currentPath, newLocale)
          expect(newPath.startsWith(`/${newLocale}`)).toBe(true)
        }
      )
    )
  })

  // Property 4: Locale switch on nested path preserves path structure
  it('locale switch on nested path preserves path depth', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/az/services',
          '/en/portfolio',
          '/ru/journal/some-article',
          '/tr/contact'
        ),
        fc.constantFrom(...locales),
        (currentPath, newLocale) => {
          const newPath = switchLocalePath(currentPath, newLocale)
          const originalSegments = currentPath.split('/').length
          const newSegments = newPath.split('/').length
          expect(newSegments).toBe(originalSegments)
        }
      )
    )
  })

  // Property 5: No translation value is empty string
  it('no AZ translation value is an empty string', () => {
    function checkNoEmpty(obj: Record<string, unknown>, path = ''): void {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key
        if (typeof value === 'string') {
          expect(value.length, `Empty value at: ${fullPath}`).toBeGreaterThan(0)
        } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          checkNoEmpty(value as Record<string, unknown>, fullPath)
        }
      }
    }
    checkNoEmpty(azMessages as Record<string, unknown>)
  })
})
