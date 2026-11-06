/**
 * Social media combo packages: active ones from Sanity (comboPackage), the
 * three built-in packages when the CMS has none. findComboPackage is what the
 * order API trusts for the price, so it never uses a cached copy.
 * @author Paşa Quliyev — Cradex Agency
 */
import { getTranslations } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { STATIC_PACKAGES, isPlatform, type ComboPackage } from '@/lib/site/orders'

type Loc = Partial<Record<'az' | 'en' | 'ru' | 'tr', string>>
type Raw = { id?: string; platform?: string; title?: Loc; features?: Loc[] | null; azn?: number; usd?: number }

export type ComboView = ComboPackage & { title: string; features: string[] }

const USE_SANITY = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) && process.env.NODE_ENV !== 'test'

const FIELDS = `"id": slug.current, platform, title, features, azn, usd`
const LIST = `*[_type == "comboPackage" && active != false && defined(slug.current)] | order(order asc, _createdAt asc) { ${FIELDS} }`
const ONE = `*[_type == "comboPackage" && active != false && slug.current == $id][0] { ${FIELDS} }`

const pick = (v: Loc | undefined, locale: string) => (v?.[locale as keyof Loc] || v?.az || '').trim()

/** Positive amounts, two decimals at most; anything else makes the package unusable. */
const price = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n > 0 && n <= 100_000 ? Math.round(n * 100) / 100 : null)

function toPackage(r: Raw | null | undefined): ComboPackage | null {
  if (!r?.id || !isPlatform(r.platform)) return null
  const azn = price(r.azn)
  const usd = price(r.usd)
  if (azn === null || usd === null) return null
  return { id: r.id, platform: r.platform, azn, usd }
}

async function staticViews(locale: string): Promise<ComboView[]> {
  const t = await getTranslations({ locale, namespace: 'site.products.combo' })
  return STATIC_PACKAGES.map((p) => ({ ...p, title: t(`${p.id}Title`), features: t.raw(`${p.id}Features`) as string[] }))
}

export async function getComboPackages(locale: string): Promise<ComboView[]> {
  if (USE_SANITY) {
    try {
      const { total, raw } = await client.fetch<{ total: number; raw: Raw[] }>(`{ "total": count(*[_type == "comboPackage"]), "raw": ${LIST} }`, {}, { next: { revalidate: 3600, tags: ['comboPackage'] } })
      const list = raw.flatMap((r) => {
        const p = toPackage(r)
        return p ? [{ ...p, title: pick(r.title, locale), features: (r.features ?? []).map((f) => pick(f, locale)).filter(Boolean) }] : []
      })
      // Packages kept in Studio rule, even when all of them are switched off.
      if (total > 0) return list
    } catch (error) {
      console.error('[combos] Sanity fetch failed, using built-in packages:', error instanceof Error ? error.message : error)
    }
  }
  return staticViews(locale)
}

/** Price source for the order API: fresh from Sanity, else the built-in list. */
export async function findComboPackage(id: string): Promise<(ComboPackage & { title: string }) | null> {
  if (USE_SANITY) {
    try {
      const count = await client.fetch<number>(`count(*[_type == "comboPackage"])`, {}, { cache: 'no-store' })
      if (count > 0) {
        const r = await client.fetch<Raw | null>(ONE, { id }, { cache: 'no-store' })
        const p = toPackage(r)
        return p ? { ...p, title: pick(r?.title, 'az') } : null
      }
    } catch (error) {
      // Without the CMS we cannot know the live price list, so refuse rather than guess.
      console.error('[combos] price lookup failed:', error instanceof Error ? error.message : error)
      return null
    }
  }
  const p = STATIC_PACKAGES.find((x) => x.id === id)
  return p ? { ...p, title: p.id } : null
}
