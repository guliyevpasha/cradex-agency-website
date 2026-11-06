/**
 * Saves combo orders to Sanity so they show up in Studio ("Sosial media
 * kombo → Sifarişlər"). Private ids keep buyers' details out of public reads.
 * Server only.
 * @author Paşa Quliyev — Cradex Agency
 */
import { storageReady, writer } from '@/lib/server/sanityWrite'
import type { ComboPlatform, Currency } from '@/lib/site/orders'

export type NewOrder = {
  orderId: string
  packageId: string
  packageTitle: string
  platform: ComboPlatform
  quantity: number
  amount: number
  currency: Currency
  account: string
  name: string
  whatsapp: string
  email: string
  locale: string
  payment: 'pending' | 'whatsapp'
}

/** Short number to say on the phone: CX-261107-4F2A (date + part of the id). */
export const orderNumber = (orderId: string, now = new Date()) =>
  `CX-${now.toISOString().slice(2, 10).replace(/-/g, '')}-${orderId.replace(/-/g, '').slice(0, 4).toUpperCase()}`

/** Stores the order; returns false (and logs) when the CMS is not set up or refuses. */
export async function saveOrder(o: NewOrder, number: string): Promise<boolean> {
  if (!storageReady()) return false
  try {
    await writer().create({
      _id: `order.${o.orderId}`,
      _type: 'comboOrder',
      number,
      status: 'new',
      payment: o.payment,
      packageId: o.packageId,
      packageTitle: o.packageTitle,
      platform: o.platform,
      quantity: o.quantity,
      amount: o.amount,
      currency: o.currency,
      account: o.account,
      name: o.name,
      whatsapp: o.whatsapp,
      email: o.email,
      locale: o.locale,
      createdAt: new Date().toISOString(),
    })
    return true
  } catch (error) {
    console.error('[orders] could not save to Sanity:', error instanceof Error ? error.message : error)
    return false
  }
}
