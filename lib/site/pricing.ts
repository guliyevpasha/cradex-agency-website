/**
 * Website packages (WaaS) and the payment maths, in one place. Cards, the
 * selector and the WhatsApp messages all read from here; nothing hard-codes
 * a price. Texts live in messages/*.json → site.pricingPage.
 * @author Paşa Quliyev — Cradex Agency
 */

export type PlanCategory = 'cms' | 'code'
export type Billing = 'monthly' | 'annual'
export type DesignLevel = 'standard' | 'detailed' | 'custom'
export type ExtraId = 'logo' | 'branding' | 'chatbot'

export type Plan = {
  id: string
  category: PlanCategory
  /** Starting price in AZN, with the included pages, languages and design level. */
  total: number
  pages: number
  languages: number
  design: DesignLevel
  recommended?: boolean
}

export const MONTHS = 12
export const ANNUAL_DISCOUNT = 0.2

/** Up-front share: CMS projects 25%, custom code 10% (higher totals). */
export const INITIAL_RATE: Record<PlanCategory, number> = { cms: 0.25, code: 0.1 }

export const PLAN_CATEGORIES: PlanCategory[] = ['cms', 'code']

export const PLANS: Plan[] = [
  { id: 'start', category: 'cms', total: 800, pages: 3, languages: 1, design: 'standard' },
  { id: 'business', category: 'cms', total: 1200, pages: 8, languages: 1, design: 'standard', recommended: true },
  { id: 'professional', category: 'cms', total: 1600, pages: 20, languages: 2, design: 'detailed' },
  { id: 'premium', category: 'cms', total: 2400, pages: 30, languages: 3, design: 'custom' },
  { id: 'codeStart', category: 'code', total: 3200, pages: 5, languages: 1, design: 'standard' },
  { id: 'codeBusiness', category: 'code', total: 4800, pages: 10, languages: 1, design: 'detailed', recommended: true },
  { id: 'codePro', category: 'code', total: 6400, pages: 15, languages: 2, design: 'detailed' },
  { id: 'codeEnterprise', category: 'code', total: 8000, pages: 25, languages: 3, design: 'custom' },
]

/*
 * Add-on prices follow the Baku market (one extra page ≈ 100 ₼, language
 * ≈ 300 ₼, logo ≈ 300 ₼, branding ≈ 800 ₼, chatbot ≈ 900 ₼) but are set to
 * multiples of 80 ₼: with 25% up front the rest splits into 12 whole-manat
 * instalments only when the total divides by 80 (by 40 for custom code).
 */
export const PAGE_PRICE = 80
export const LANGUAGE_PRICE = 320
export const MAX_PAGES = 40
export const SITE_LANGUAGES = ['az', 'en', 'ru', 'tr'] as const
export type SiteLanguage = (typeof SITE_LANGUAGES)[number]

export const DESIGN_LEVELS: DesignLevel[] = ['standard', 'detailed', 'custom']
export const DESIGN_PRICE: Record<DesignLevel, number> = { standard: 0, detailed: 640, custom: 960 }

export const EXTRAS: Record<ExtraId, number> = { logo: 320, branding: 800, chatbot: 880 }
export const EXTRA_IDS = Object.keys(EXTRAS) as ExtraId[]

/** Monthly SEO is a running service: billed per month, never part of the project instalments. */
export const SEO_MONTHLY = 700

export const plansIn = (category: PlanCategory) => PLANS.filter((p) => p.category === category)

export type Options = {
  pages: number
  languages: number
  design: DesignLevel
  extras: ExtraId[]
}

export const defaultOptions = (plan: Plan): Options => ({
  pages: plan.pages,
  languages: plan.languages,
  design: plan.design,
  extras: [],
})

export type Line =
  | { kind: 'base'; amount: number }
  | { kind: 'pages'; amount: number; count: number }
  | { kind: 'languages'; amount: number; count: number }
  | { kind: 'design'; amount: number; level: DesignLevel }
  | { kind: 'extra'; amount: number; id: ExtraId }

/** What the chosen options add on top of the package. Anything the package already includes costs 0. */
export function priceLines(plan: Plan, o: Options): Line[] {
  const lines: Line[] = [{ kind: 'base', amount: plan.total }]
  const extraPages = Math.max(0, Math.min(o.pages, MAX_PAGES) - plan.pages)
  if (extraPages > 0) lines.push({ kind: 'pages', amount: extraPages * PAGE_PRICE, count: extraPages })
  const extraLangs = Math.max(0, Math.min(o.languages, SITE_LANGUAGES.length) - plan.languages)
  if (extraLangs > 0) lines.push({ kind: 'languages', amount: extraLangs * LANGUAGE_PRICE, count: extraLangs })
  const design = Math.max(0, DESIGN_PRICE[o.design] - DESIGN_PRICE[plan.design])
  if (design > 0) lines.push({ kind: 'design', amount: design, level: o.design })
  for (const id of EXTRA_IDS) if (o.extras.includes(id)) lines.push({ kind: 'extra', amount: EXTRAS[id], id })
  return lines
}

export const totalOf = (lines: Line[]) => lines.reduce((sum, l) => sum + l.amount, 0)

export type Quote = {
  total: number
  initialRate: number
  initial: number
  remaining: number
  monthly: number
  annual: number
  saving: number
}

/** Exact figures, no rounding: whether they are whole manats is checked separately. */
export function quoteFor(category: PlanCategory, total: number): Quote {
  const initialRate = INITIAL_RATE[category]
  const initial = total * initialRate
  const remaining = total - initial
  const annual = total * (1 - ANNUAL_DISCOUNT)
  return { total, initialRate, initial, remaining, monthly: remaining / MONTHS, annual, saving: total - annual }
}

export const quote = (plan: Plan, o?: Options) =>
  quoteFor(plan.category, o ? totalOf(priceLines(plan, o)) : plan.total)

// Float noise (e.g. 800 * 0.1) must not count as kopecks.
const isWhole = (n: number) => Math.abs(n - Math.round(n)) < 1e-9

function check(label: string, category: PlanCategory, amount: number, problems: string[]) {
  const q = quoteFor(category, amount)
  for (const key of ['initial', 'monthly', 'annual', 'saving'] as const) {
    if (!isWhole(q[key])) problems.push(`${label}: ${key} = ${q[key]} AZN is not a whole amount`)
  }
}

/**
 * Every amount a customer sees must be whole AZN. Packages and every add-on
 * price are checked on their own; since the maths is linear, any mix of them
 * is then whole too. A future price change that breaks this is reported
 * (tests + a visible warning in development) instead of being rounded quietly.
 */
export function planProblems(plans: Plan[] = PLANS): string[] {
  const problems: string[] = []
  for (const plan of plans) check(plan.id, plan.category, plan.total, problems)
  const addOns: [string, number][] = [
    ['page', PAGE_PRICE],
    ['language', LANGUAGE_PRICE],
    ...DESIGN_LEVELS.map((d): [string, number] => [`design.${d}`, DESIGN_PRICE[d]]),
    ...EXTRA_IDS.map((id): [string, number] => [`extra.${id}`, EXTRAS[id]]),
  ]
  for (const [label, amount] of addOns) for (const c of PLAN_CATEGORIES) check(`${label} (${c})`, c, amount, problems)
  return problems
}

/** 1200 → "1 200 ₼" (thin non-breaking group space, as written in Azerbaijan). */
export function azn(n: number): string {
  const whole = Math.round(n)
  return `${String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₼`
}

export const percent = (rate: number) => `${Math.round(rate * 100)}%`
