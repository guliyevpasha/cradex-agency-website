/**
 * Combo package orders: prices and field rules shared by the order form and
 * the API, so the server never trusts a price sent by the browser.
 * @author Paşa Quliyev — Cradex Agency
 */

export const PACKAGES = {
  instagram: { amount: 20 },
  tiktok: { amount: 20 },
  youtube: { amount: 35 },
} as const

export type PackageId = keyof typeof PACKAGES

export const isPackage = (v: unknown): v is PackageId => typeof v === 'string' && v in PACKAGES

export type OrderInput = {
  package: PackageId
  username: string
  name: string
  phone: string
  email: string
}

export type FieldError = 'required' | 'username' | 'youtube' | 'name' | 'phone' | 'email'

const USERNAME_RE = /^@?[A-Za-z0-9._]{1,30}$/
const YOUTUBE_RE =
  /^(?:(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/(?:@[\w.-]{3,30}|channel\/[\w-]{10,40}|c\/[\w.-]{1,60})\/?|@[\w.-]{3,30})$/i
const NAME_RE = /^[\p{L}][\p{L}'.-]*(?:\s+[\p{L}][\p{L}'.-]*)+$/u
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i

export const normalizePhone = (v: string) => v.replace(/[\s()-]/g, '')

export function validateOrder(input: Partial<Record<keyof OrderInput, string>>, pkg: PackageId) {
  const errors: Partial<Record<keyof OrderInput, FieldError>> = {}
  const v = (k: keyof OrderInput) => (input[k] ?? '').trim()

  if (!v('username')) errors.username = 'required'
  else if (pkg === 'youtube' ? !YOUTUBE_RE.test(v('username')) : !USERNAME_RE.test(v('username')))
    errors.username = pkg === 'youtube' ? 'youtube' : 'username'

  if (!v('name')) errors.name = 'required'
  else if (v('name').length > 60 || !NAME_RE.test(v('name'))) errors.name = 'name'

  const phone = normalizePhone(v('phone'))
  if (!phone) errors.phone = 'required'
  else if (!/^\+?\d{10,15}$/.test(phone)) errors.phone = 'phone'

  if (!v('email')) errors.email = 'required'
  else if (!EMAIL_RE.test(v('email'))) errors.email = 'email'

  return errors
}
