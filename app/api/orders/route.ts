/**
 * Combo package order → payment.
 * Validates the form again on the server, takes the price from our own table
 * and asks the payment adapter for the bank's 3D Secure page.
 * @author Paşa Quliyev — Cradex Agency
 */
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { countryOf, currencyFor, isPackage, isQty, normalizePhone, priceOf, validateOrder } from '@/lib/site/orders'
import { createPayment } from '@/lib/payments'

const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 6

function limited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
  if (limited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })

  // Same-site requests only.
  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const pkg = body.package
  if (!isPackage(pkg)) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const quantity = body.quantity ?? 1
  if (!isQty(quantity)) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const fields = {
    username: String(body.username ?? '').slice(0, 200),
    name: String(body.name ?? '').slice(0, 200),
    phone: String(body.phone ?? '').slice(0, 40),
    email: String(body.email ?? '').slice(0, 254),
  }
  const errors = validateOrder(fields, pkg)
  if (Object.keys(errors).length > 0) return NextResponse.json({ error: 'invalid', fields: errors }, { status: 422 })

  const locale = ['az', 'en', 'ru', 'tr'].includes(String(body.locale)) ? String(body.locale) : 'az'
  const orderId = randomUUID()
  // Currency follows the buyer's country, never the request body.
  const currency = currencyFor(countryOf(request.headers))

  const result = await createPayment({
    orderId,
    amount: priceOf(pkg, currency) * quantity,
    currency,
    description: `Cradex ${pkg} combo x${quantity}`,
    email: fields.email.trim(),
    phone: normalizePhone(fields.phone),
    locale,
  })

  if (result.status === 'redirect') return NextResponse.json({ status: 'redirect', url: result.url, orderId })
  if (result.status === 'not_configured') return NextResponse.json({ status: 'not_configured', orderId })
  return NextResponse.json({ error: 'payment_failed' }, { status: 502 })
}
