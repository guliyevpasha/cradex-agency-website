/**
 * Combo package orders: package shape, prices and field rules shared by the
 * order form and the API, so the server never trusts a price sent by the
 * browser. Packages themselves come from Sanity (lib/data/combos); the three
 * below are the fallback when the CMS has none.
 * @author Paşa Quliyev — Cradex Agency
 */

export const COMBO_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'facebook', 'telegram'] as const
export type ComboPlatform = (typeof COMBO_PLATFORMS)[number]

/** What the price and validation need; titles and features are display copy. */
export type ComboPackage = { id: string; platform: ComboPlatform; azn: number; usd: number }

// AZN for buyers in Azerbaijan, USD for everyone else.
export const STATIC_PACKAGES: ComboPackage[] = [
  { id: 'instagram', platform: 'instagram', azn: 20, usd: 15 },
  { id: 'tiktok', platform: 'tiktok', azn: 20, usd: 15 },
  { id: 'youtube', platform: 'youtube', azn: 35, usd: 25 },
]

export type Currency = 'AZN' | 'USD'

/** Unknown country (local dev, no geo header) counts as Azerbaijan. */
export const currencyFor = (country: string | null | undefined): Currency =>
  !country || country.toUpperCase() === 'AZ' ? 'AZN' : 'USD'

/** Country set by the hosting edge (Vercel or Cloudflare). */
export const countryOf = (headers: Headers) =>
  headers.get('x-vercel-ip-country') ?? headers.get('cf-ipcountry')

export const priceOf = (pack: Pick<ComboPackage, 'azn' | 'usd'>, currency: Currency) => (currency === 'USD' ? pack.usd : pack.azn)

export const formatAmount = (amount: number, currency: Currency) =>
  currency === 'USD' ? `$${amount}` : `${amount} ₼`

export const formatPrice = (pack: Pick<ComboPackage, 'azn' | 'usd'>, currency: Currency) => formatAmount(priceOf(pack, currency), currency)

/** How many of one package fit in a single order. */
export const MAX_QTY = 100

export const clampQty = (n: number) => (Number.isFinite(n) ? Math.min(MAX_QTY, Math.max(1, Math.round(n))) : 1)

export const isQty = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 1 && (v as number) <= MAX_QTY

/** Package ids are Sanity slugs: lowercase letters, digits and dashes. */
export const isPackageId = (v: unknown): v is string => typeof v === 'string' && /^[a-z0-9][a-z0-9-]{0,59}$/.test(v)

export const isPlatform = (v: unknown): v is ComboPlatform => typeof v === 'string' && (COMBO_PLATFORMS as readonly string[]).includes(v)

export type OrderInput = {
  username: string
  name: string
  phone: string
  email: string
}

export type FieldError = 'required' | 'username' | 'youtube' | 'name' | 'phone' | 'email'

const USERNAME_RE = /^@?[A-Za-z0-9._]{1,30}$/
const YOUTUBE_RE =
  /^(?:(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/(?:@[\w.-]{3,30}|channel\/[\w-]{10,40}|c\/[\w.-]{1,60})\/?|@[\w.-]{3,30})$/i
// Facebook pages and Telegram channels are given as a username or a link.
const LINK_RE = /^(?:(?:https?:\/\/)?(?:www\.|m\.)?(?:facebook\.com|fb\.com|t\.me)\/[\w.-]{2,80}\/?|@?[\w.-]{2,60})$/i
const NAME_RE = /^[\p{L}][\p{L}'.-]*(?:\s+[\p{L}][\p{L}'.-]*)+$/u
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i

export const normalizePhone = (v: string) => v.replace(/[\s()-]/g, '')

/** `phone` is the buyer's WhatsApp number: the order updates go there. */
export function validateOrder(input: Partial<Record<keyof OrderInput, string>>, platform: ComboPlatform) {
  const errors: Partial<Record<keyof OrderInput, FieldError>> = {}
  const v = (k: keyof OrderInput) => (input[k] ?? '').trim()

  const user = v('username')
  if (!user) errors.username = 'required'
  else if (platform === 'youtube' ? !YOUTUBE_RE.test(user) : platform === 'facebook' || platform === 'telegram' ? !LINK_RE.test(user) : !USERNAME_RE.test(user))
    errors.username = platform === 'youtube' ? 'youtube' : 'username'

  if (!v('name')) errors.name = 'required'
  else if (v('name').length > 60 || !NAME_RE.test(v('name'))) errors.name = 'name'

  const phone = normalizePhone(v('phone'))
  if (!phone) errors.phone = 'required'
  else if (!/^\+?\d{10,15}$/.test(phone)) errors.phone = 'phone'

  if (!v('email')) errors.email = 'required'
  else if (!EMAIL_RE.test(v('email'))) errors.email = 'email'

  return errors
}
