/**
 * Cases for the "Our work" category pages. Published Sanity entries win; a
 * category with none falls back to the built-in samples, which the cards
 * mark as samples. Everything comes out in one shape for the cards.
 * @author Paşa Quliyev — Cradex Agency
 */
import { getTranslations } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import type { AdPlatform, WorkCategory } from '@/lib/site/work'
import { AD_SAMPLES, SEO_SAMPLES } from '@/lib/site/workSamples'

type Loc = Partial<Record<'az' | 'en' | 'ru' | 'tr', string>>

export type WorkCase = {
  id: string
  sample: boolean
  platform?: AdPlatform
  kind?: string
  group?: 'web' | 'social'
  title?: string
  sector?: string
  goal?: string
  period?: string
  text?: string
  problem?: string
  solution?: string
  result?: string
  features: string[]
  metrics: { label: string; value: string }[]
  chart: number[]
}

const USE_SANITY = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) && process.env.NODE_ENV !== 'test'

// Used when an entry leaves the chart empty.
const DEFAULT_CHART: Record<string, number[]> = {
  ads: [32, 41, 50, 58, 70, 83, 100],
  seo: [10, 22, 38, 56, 77, 100],
}

const PLATFORMS: AdPlatform[] = ['meta', 'tiktok', 'google', 'linkedin']

const QUERY = `*[_type == "workCase" && category == $c && published != false] | order(order asc, _createdAt desc) {
  "id": _id, platform, kind, group, title, sector, goal, period, text, problem, solution, result,
  features, "metrics": metrics[]{ label, value }, chart
}`

type Raw = {
  id: string
  platform?: string
  kind?: string
  group?: string
  title?: Loc
  sector?: Loc
  goal?: Loc
  period?: Loc
  text?: Loc
  problem?: Loc
  solution?: Loc
  result?: Loc
  features?: Loc[] | null
  metrics?: { label?: Loc; value?: string }[] | null
  chart?: number[] | null
}

/** The visitor's language, else Azerbaijani (the only required one). */
const pick = (v: Loc | undefined, locale: string) => (v?.[locale as keyof Loc] || v?.az || '').trim()

function fromSanity(r: Raw, category: WorkCategory, locale: string): WorkCase {
  const chart = (r.chart ?? []).filter((n) => Number.isFinite(n)).map((n) => Math.min(100, Math.max(0, n)))
  return {
    id: r.id,
    sample: false,
    platform: PLATFORMS.includes(r.platform as AdPlatform) ? (r.platform as AdPlatform) : category === 'ads' ? 'meta' : undefined,
    kind: r.kind,
    group: r.group === 'social' ? 'social' : 'web',
    title: pick(r.title, locale),
    sector: pick(r.sector, locale),
    goal: pick(r.goal, locale),
    period: pick(r.period, locale),
    text: pick(r.text, locale),
    problem: pick(r.problem, locale),
    solution: pick(r.solution, locale),
    result: pick(r.result, locale),
    features: (r.features ?? []).map((f) => pick(f, locale)).filter(Boolean),
    metrics: (r.metrics ?? [])
      .filter((m) => m.value)
      .slice(0, 3)
      .map((m) => ({ label: pick(m.label, locale), value: String(m.value) })),
    chart: chart.length >= 2 ? chart : (DEFAULT_CHART[category] ?? []),
  }
}

async function samples(category: WorkCategory, locale: string): Promise<WorkCase[]> {
  if (category === 'ads' || category === 'seo') {
    const t = await getTranslations({ locale, namespace: 'site.workSamples' })
    const texts = t.raw(category) as string[]
    if (category === 'ads') {
      return AD_SAMPLES.map((s, i) => ({
        id: `ads-${i}`,
        sample: true,
        platform: s.platform,
        sector: t(`sectors.${s.sector}`),
        goal: t(`types.${s.type}`),
        period: t('days', { n: s.days }),
        text: texts[i],
        features: [],
        metrics: s.metrics.map(([k, value]) => ({ label: t(`metrics.${k}`), value })),
        chart: s.bars,
      }))
    }
    return SEO_SAMPLES.map((s, i) => ({
      id: `seo-${i}`,
      sample: true,
      sector: t(`sectors.${s.sector}`),
      goal: t(`types.${s.type}`),
      period: t('months', { n: s.months }),
      text: texts[i],
      features: [],
      metrics: s.metrics.map(([k, value]) => ({ label: t(`metrics.${k}`), value })),
      chart: s.line,
    }))
  }

  const t = await getTranslations({ locale, namespace: `site.workPages.${category}` })
  if (category === 'mobile') {
    const cases = t.raw('cases') as { kind: string; title: string; sector: string; text: string; features: string[] }[]
    return cases.map((c, i) => ({ id: `mobile-${i}`, sample: true, ...c, metrics: [], chart: [] }))
  }
  const cases = t.raw('cases') as { group: 'web' | 'social'; title: string; problem: string; solution: string; result: string }[]
  return cases.map((c, i) => ({ id: `support-${i}`, sample: true, ...c, features: [], metrics: [], chart: [] }))
}

export async function getWorkCases(category: WorkCategory, locale: string): Promise<WorkCase[]> {
  if (USE_SANITY) {
    try {
      const raw = await client.fetch<Raw[]>(QUERY, { c: category }, { next: { revalidate: 3600, tags: ['workCase'] } })
      if (raw.length > 0) return raw.map((r) => fromSanity(r, category, locale))
    } catch (error) {
      console.error('[work] Sanity fetch failed, showing samples:', error instanceof Error ? error.message : error)
    }
  }
  return samples(category, locale)
}
