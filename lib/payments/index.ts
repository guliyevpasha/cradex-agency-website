/**
 * Payment gateway adapter.
 *
 * Every Azerbaijani acquiring bank (Kapital/Birbank, ABB, PASHA, Unibank) and
 * aggregator (Payriff, Epoint) works the same way: the server creates an
 * order with the amount, the bank returns a URL to its own hosted page, the
 * customer pays there with 3D Secure, and the bank calls back with the
 * result. Card data never touches this site.
 *
 * Until a merchant agreement is signed, `createPayment` reports
 * "not_configured" and the order form falls back to WhatsApp. To go live:
 *   1. set PAYMENT_PROVIDER and the provider's credentials in the env
 *   2. implement that provider's `create` below from its API documentation
 *   3. add its result/callback route
 *
 * @author Paşa Quliyev — Cradex Agency
 */

export type PaymentRequest = {
  orderId: string
  amount: number // AZN
  description: string
  email: string
  phone: string
  locale: string
}

export type PaymentResult = { status: 'redirect'; url: string } | { status: 'not_configured' } | { status: 'error' }

type Provider = (req: PaymentRequest) => Promise<PaymentResult>

// Filled in per bank once its API documentation and test credentials arrive.
const providers: Record<string, Provider> = {}

export async function createPayment(req: PaymentRequest): Promise<PaymentResult> {
  const name = process.env.PAYMENT_PROVIDER
  const provider = name ? providers[name] : undefined
  if (!provider) return { status: 'not_configured' }
  try {
    return await provider(req)
  } catch (err) {
    console.error('[payments] create failed:', err instanceof Error ? err.message : err)
    return { status: 'error' }
  }
}
