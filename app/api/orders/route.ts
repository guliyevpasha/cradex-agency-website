/**
 * Combo package order → payment.
 * Validates the form again on the server, takes the price from the package
 * itself (Sanity or the built-in list, never the request), saves the order for
 * Studio and asks the payment adapter for the bank's 3D Secure page.
 * @author Paşa Quliyev — Cradex Agency
 */
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { countryOf, currencyFor, isPackageId, isQty, normalizePhone, priceOf, validateOrder } from '@/lib/site/orders'
import { findComboPackage } from '@/lib/data/combos'
import { orderNumber, saveOrder } from '@/lib/data/comboOrders'
import { createPayment } from '@/lib/payments'

const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 6

function limited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    // drop the quiet keys only, never everyone's history at once
    for (const [k, v] of hits) if (now - v[v.length - 1] > WINDOW_MS) hits.delete(k)
  }
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
  if (limited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })

  // Same-site requests only.
  const site = request.headers.get('sec-fetch-site')
  const origin = request.headers.get('origin')
  // Browsers always send Origin on a POST; a request without one is a script.
  let foreign = !origin || Boolean(site && site !== 'same-origin')
  if (origin) {
    try {
      foreign ||= new URL(origin).host !== request.headers.get('host')
    } catch {
      foreign = true
    }
  }
  if (foreign) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  if (!isPackageId(body.package)) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const pack = await findComboPackage(body.package)
  if (!pack) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const quantity = body.quantity ?? 1
  if (!isQty(quantity)) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const fields = {
    username: String(body.username ?? '').slice(0, 200),
    name: String(body.name ?? '').slice(0, 200),
    phone: String(body.phone ?? '').slice(0, 40),
    email: String(body.email ?? '').slice(0, 254),
  }
  const errors = validateOrder(fields, pack.platform)
  if (Object.keys(errors).length > 0) return NextResponse.json({ error: 'invalid', fields: errors }, { status: 422 })

  const locale = ['az', 'en', 'ru', 'tr'].includes(String(body.locale)) ? String(body.locale) : 'az'
  const orderId = randomUUID()
  // Currency follows the buyer's country, never the request body.
  const currency = currencyFor(countryOf(request.headers))
  // Rounded to cents: prices may have two decimals and floats drift.
  const amount = Math.round(priceOf(pack, currency) * quantity * 100) / 100
  const number = orderNumber(orderId)
  const phone = normalizePhone(fields.phone)

  const result = await createPayment({
    orderId,
    amount,
    currency,
    description: `Cradex ${pack.id} combo x${quantity}`,
    email: fields.email.trim(),
    phone,
    locale,
  })
  if (result.status === 'error') return NextResponse.json({ error: 'payment_failed' }, { status: 502 })

  // Saved either way, so the order is in Studio even if the buyer continues on WhatsApp.
  const saved = await saveOrder(
    {
      orderId,
      packageId: pack.id,
      packageTitle: pack.title,
      platform: pack.platform,
      quantity,
      amount,
      currency,
      account: fields.username.trim(),
      name: fields.name.trim(),
      whatsapp: phone,
      email: fields.email.trim(),
      locale,
      payment: result.status === 'redirect' ? 'pending' : 'whatsapp',
    },
    number
  )

  if (!saved) console.error(`[orders] ${number} was not stored in Sanity (SANITY_WRITE_TOKEN missing?)`)

  if (result.status === 'redirect') return NextResponse.json({ status: 'redirect', url: result.url, orderId, number })
  return NextResponse.json({ status: 'not_configured', orderId, number })
}
