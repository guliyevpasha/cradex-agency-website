import { describe, it, expect } from 'vitest'
import { calculateContrastRatio, meetsWcagAA, meetsWcagAALargeText } from '@/lib/utils/contrast'

// Color pairs from the design system (design.md section 4.1)
const colorPairs = [
  { text: '#F0F0FF', bg: '#0A0A0F', label: 'text-primary on bg-primary' },
  { text: '#F0F0FF', bg: '#111118', label: 'text-primary on bg-secondary' },
  { text: '#F0F0FF', bg: '#1A1A24', label: 'text-primary on bg-tertiary' },
  { text: '#A0A0B8', bg: '#0A0A0F', label: 'text-secondary on bg-primary' },
  { text: '#A0A0B8', bg: '#111118', label: 'text-secondary on bg-secondary' },
]

describe('calculateContrastRatio', () => {
  it('black on white has maximum contrast (21:1)', () => {
    const ratio = calculateContrastRatio('#000000', '#FFFFFF')
    expect(ratio).toBeCloseTo(21, 0)
  })

  it('same color has minimum contrast (1:1)', () => {
    const ratio = calculateContrastRatio('#FFFFFF', '#FFFFFF')
    expect(ratio).toBeCloseTo(1, 1)
  })

  it('contrast ratio is always between 1 and 21', () => {
    const pairs = [
      ['#000000', '#FFFFFF'],
      ['#FFFFFF', '#000000'],
      ['#FF0000', '#0000FF'],
      ['#6C63FF', '#0A0A0F'],
    ]
    for (const [fg, bg] of pairs) {
      const ratio = calculateContrastRatio(fg, bg)
      expect(ratio).toBeGreaterThanOrEqual(1)
      expect(ratio).toBeLessThanOrEqual(21)
    }
  })

  it('is symmetric (fg/bg order does not matter)', () => {
    const ratio1 = calculateContrastRatio('#F0F0FF', '#0A0A0F')
    const ratio2 = calculateContrastRatio('#0A0A0F', '#F0F0FF')
    expect(ratio1).toBeCloseTo(ratio2, 5)
  })
})

describe('WCAG AA compliance — design system color pairs', () => {
  for (const { text, bg, label } of colorPairs) {
    it(`${label} meets WCAG AA (≥ 4.5:1)`, () => {
      const ratio = calculateContrastRatio(text, bg)
      expect(
        ratio,
        `Contrast ratio ${ratio.toFixed(2)}:1 is below 4.5:1 for ${label}`
      ).toBeGreaterThanOrEqual(4.5)
    })
  }
})

describe('meetsWcagAA helper', () => {
  it('returns true for high-contrast pairs', () => {
    expect(meetsWcagAA('#FFFFFF', '#000000')).toBe(true)
    expect(meetsWcagAA('#F0F0FF', '#0A0A0F')).toBe(true)
  })

  it('returns false for low-contrast pairs', () => {
    expect(meetsWcagAA('#888888', '#999999')).toBe(false)
    expect(meetsWcagAA('#AAAAAA', '#BBBBBB')).toBe(false)
  })
})

describe('meetsWcagAALargeText helper', () => {
  it('returns true for pairs meeting 3:1 threshold', () => {
    expect(meetsWcagAALargeText('#FFFFFF', '#000000')).toBe(true)
  })
})
