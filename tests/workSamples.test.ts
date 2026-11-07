/**
 * Sample cases and their copy have to line up: one sentence per case and a
 * label for every sector, type and metric, in all four languages.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { AD_SAMPLES, SEO_SAMPLES } from '@/lib/site/workSamples'
import az from '@/messages/az.json'
import en from '@/messages/en.json'
import ru from '@/messages/ru.json'
import tr from '@/messages/tr.json'

const LOCALES = { az, en, ru, tr }

describe.each(Object.entries(LOCALES))('work samples (%s)', (_, messages) => {
  const w = messages.site.workSamples as {
    ads: string[]
    seo: string[]
    sectors: Record<string, string>
    types: Record<string, string>
    metrics: Record<string, string>
  }

  it('has one sentence per case', () => {
    expect(w.ads).toHaveLength(AD_SAMPLES.length)
    expect(w.seo).toHaveLength(SEO_SAMPLES.length)
    expect([...w.ads, ...w.seo].every((s) => s.trim().length > 0)).toBe(true)
  })

  it('has a label for every sector, type and metric', () => {
    for (const s of [...AD_SAMPLES, ...SEO_SAMPLES]) {
      expect(w.sectors[s.sector], s.sector).toBeTruthy()
      expect(w.types[s.type], s.type).toBeTruthy()
      for (const [k] of s.metrics) expect(w.metrics[k], k).toBeTruthy()
    }
  })
})
