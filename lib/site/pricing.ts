/**
 * Website packages (WaaS) and the payment maths, in one place. Cards, the
 * selector and the WhatsApp messages all read from here; nothing hard-codes
 * a price. Texts live in messages/*.json → site.pricingPage.plans.<id>.
 * @author Paşa Quliyev — Cradex Agency
 */

export type PlanCategory = 'cms' | 'code'
export type Billing = 'monthly' | 'annual'

export type Plan = {
  id: string
  category: PlanCategory
  /** Full project price in AZN. */
  total: number
  recommended?: boolean
}

export const MONTHS = 12
export const ANNUAL_DISCOUNT = 0.2

/** Up-front share: CMS projects 25%, custom code 10% (higher totals). */
export const INITIAL_RATE: Record<PlanCategory, number> = { cms: 0.25, code: 0.1 }

export const PLAN_CATEGORIES: PlanCategory[] = ['cms', 'code']

export const PLANS: Plan[] = [
  { id: 'start', category: 'cms', total: 800 },
  { id: 'business', category: 'cms', total: 1200, recommended: true },
  { id: 'professional', category: 'cms', total: 1600 },
  { id: 'premium', category: 'cms', total: 2400 },
  { id: 'codeStart', category: 'code', total: 3200 },
  { id: 'codeBusiness', category: 'code', total: 4800, recommended: true },
  { id: 'codePro', category: 'code', total: 6400 },
  { id: 'codeEnterprise', category: 'code', total: 8000 },
]

export const plansIn = (category: PlanCategory) => PLANS.filter((p) => p.category === category)

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
export function quote(plan: Plan): Quote {
  const initialRate = INITIAL_RATE[plan.category]
  const initial = plan.total * initialRate
  const remaining = plan.total - initial
  const annual = plan.total * (1 - ANNUAL_DISCOUNT)
  return {
    total: plan.total,
    initialRate,
    initial,
    remaining,
    monthly: remaining / MONTHS,
    annual,
    saving: plan.total - annual,
  }
}

// Float noise (e.g. 800 * 0.1) must not count as kopecks.
const isWhole = (n: number) => Math.abs(n - Math.round(n)) < 1e-9

/**
 * Every amount a customer sees must be whole AZN. Returns one message per
 * problem so a future price change that breaks this is caught (tests + a
 * visible warning in development) instead of being rounded quietly.
 */
export function planProblems(plans: Plan[] = PLANS): string[] {
  const problems: string[] = []
  for (const plan of plans) {
    const q = quote(plan)
    for (const key of ['initial', 'monthly', 'annual', 'saving'] as const) {
      if (!isWhole(q[key])) problems.push(`${plan.id}: ${key} = ${q[key]} AZN is not a whole amount`)
    }
  }
  return problems
}

/** 1200 → "1 200 ₼" (thin non-breaking group space, as written in Azerbaijan). */
export function azn(n: number): string {
  const whole = Math.round(n)
  return `${String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₼`
}

export const percent = (rate: number) => `${Math.round(rate * 100)}%`
