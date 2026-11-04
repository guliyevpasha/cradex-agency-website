/**
 * Package maths: up-front shares, 12 instalments, annual discount and the
 * whole-manat rule.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { PLANS, azn, defaultOptions, planProblems, plansIn, priceLines, quote, totalOf, type Plan } from '@/lib/site/pricing'

const byId = (id: string) => PLANS.find((p) => p.id === id)!

describe('website packages', () => {
  it('has four packages in each category', () => {
    expect(plansIn('cms')).toHaveLength(4)
    expect(plansIn('code')).toHaveLength(4)
  })

  it('takes 25% up front for CMS sites', () => {
    for (const p of plansIn('cms')) expect(quote(p).initialRate).toBe(0.25)
    expect(quote(byId('start'))).toMatchObject({ initial: 200, monthly: 50, annual: 640, saving: 160 })
    expect(quote(byId('premium'))).toMatchObject({ initial: 600, monthly: 150, annual: 1920 })
  })

  it('takes 10% up front for custom-code sites', () => {
    for (const p of plansIn('code')) expect(quote(p).initialRate).toBe(0.1)
    expect(quote(byId('codeStart'))).toMatchObject({ initial: 320, monthly: 240, annual: 2560 })
    expect(quote(byId('codeEnterprise'))).toMatchObject({ initial: 800, monthly: 600, annual: 6400 })
  })

  it('adds up: initial + 12 instalments = total, annual = total - 20%', () => {
    for (const p of PLANS) {
      const q = quote(p)
      expect(q.initial + q.monthly * 12).toBeCloseTo(p.total)
      expect(q.annual).toBeCloseTo(p.total * 0.8)
    }
  })

  it('keeps every amount in whole manats', () => {
    expect(planProblems()).toEqual([])
  })

  it('reports a price that would need kopecks instead of rounding it', () => {
    const odd: Plan = { id: 'odd', category: 'cms', total: 850, pages: 1, languages: 1, design: 'standard' }
    expect(planProblems([odd]).join(' ')).toMatch(/odd: monthly/)
  })

  it('formats AZN with grouped thousands', () => {
    expect(azn(1200)).toBe('1 200 ₼')
    expect(azn(50)).toBe('50 ₼')
  })

  it('charges only for what the package does not include', () => {
    const business = byId('business')
    expect(totalOf(priceLines(business, defaultOptions(business)))).toBe(1200)
    // 10 pages (2 extra), AZ+EN (1 extra), detailed design, logo
    const o = { pages: 10, languages: 2, design: 'detailed' as const, extras: ['logo' as const] }
    expect(totalOf(priceLines(business, o))).toBe(1200 + 160 + 320 + 640 + 320)
    // premium already has custom design and 3 languages
    const premium = byId('premium')
    expect(totalOf(priceLines(premium, { pages: 30, languages: 3, design: 'standard', extras: [] }))).toBe(2400)
  })

  it('keeps any configured total in whole manats', () => {
    for (const p of PLANS) {
      for (const pages of [1, p.pages + 1, p.pages + 7, 40]) {
        for (const languages of [1, 2, 4]) {
          const q = quote(p, { pages, languages, design: 'custom', extras: ['logo', 'chatbot'] })
          for (const v of [q.initial, q.monthly, q.annual]) expect(Number.isInteger(Math.round(v * 1e6) / 1e6)).toBe(true)
        }
      }
    }
  })
})
