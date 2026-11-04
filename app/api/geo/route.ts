/**
 * Which currency to show: AZN in Azerbaijan, USD elsewhere.
 * Country comes from the hosting edge (Vercel / Cloudflare headers).
 * @author Paşa Quliyev — Cradex Agency
 */
import { NextRequest, NextResponse } from 'next/server'
import { countryOf, currencyFor } from '@/lib/site/orders'

export function GET(request: NextRequest) {
  return NextResponse.json(
    { currency: currencyFor(countryOf(request.headers)) },
    { headers: { 'Cache-Control': 'private, max-age=3600' } }
  )
}
