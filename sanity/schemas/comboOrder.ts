/**
 * Combo package orders, written by /api/orders. What the buyer typed is kept
 * read-only; the owner only moves the status and adds notes. Orders get a
 * private id ("order.<uuid>"), so they never show up in public API reads.
 * @author Paşa Quliyev — Cradex Agency
 */
import { defineField, defineType } from 'sanity'
import { ShoppingBag } from 'lucide-react'

export const ORDER_STATUSES = [
  { title: 'Yeni', value: 'new' },
  { title: 'İcrada', value: 'in_progress' },
  { title: 'Tamamlanıb', value: 'done' },
  { title: 'Ləğv edilib', value: 'cancelled' },
]

const PAYMENTS = [
  { title: 'Gözləyir', value: 'pending' },
  { title: 'Ödənilib', value: 'paid' },
  { title: 'WhatsApp ilə razılaşdırılır', value: 'whatsapp' },
]

const ro = { readOnly: true }

export default defineType({
  name: 'comboOrder',
  title: 'Kombo sifarişi',
  type: 'document',
  icon: ShoppingBag,
  groups: [
    { name: 'order', title: 'Sifariş', default: true },
    { name: 'buyer', title: 'Müştəri' },
    { name: 'work', title: 'İcra' },
  ],
  fields: [
    defineField({ name: 'number', title: 'Sifariş nömrəsi', type: 'string', group: 'order', ...ro }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: ['order', 'work'],
      options: { list: ORDER_STATUSES, layout: 'radio', direction: 'horizontal' },
      initialValue: 'new',
    }),
    defineField({ name: 'payment', title: 'Ödəniş', type: 'string', group: ['order', 'work'], options: { list: PAYMENTS, layout: 'radio', direction: 'horizontal' } }),
    defineField({ name: 'packageId', title: 'Paketin kodu', type: 'string', group: 'order', ...ro }),
    defineField({ name: 'packageTitle', title: 'Paket', type: 'string', group: 'order', ...ro }),
    defineField({ name: 'platform', title: 'Platforma', type: 'string', group: 'order', ...ro }),
    defineField({ name: 'quantity', title: 'Say', type: 'number', group: 'order', ...ro }),
    defineField({ name: 'amount', title: 'Məbləğ', type: 'number', group: 'order', ...ro }),
    defineField({ name: 'currency', title: 'Valyuta', type: 'string', group: 'order', ...ro }),
    defineField({ name: 'account', title: 'Hesab / link', description: 'Paketin çatdırılacağı hesab.', type: 'string', group: ['order', 'buyer'], ...ro }),
    defineField({ name: 'name', title: 'Ad, soyad', type: 'string', group: 'buyer', ...ro }),
    defineField({ name: 'whatsapp', title: 'WhatsApp nömrəsi', type: 'string', group: 'buyer', ...ro }),
    defineField({ name: 'email', title: 'E-poçt', type: 'string', group: 'buyer', ...ro }),
    defineField({ name: 'locale', title: 'Saytın dili', type: 'string', group: 'buyer', ...ro }),
    defineField({ name: 'createdAt', title: 'Sifariş vaxtı', type: 'datetime', group: 'order', ...ro }),
    defineField({ name: 'startedAt', title: 'İcraya başlanıb', type: 'datetime', group: 'work', ...ro }),
    defineField({ name: 'note', title: 'Daxili qeyd', description: 'Yalnız sizə görünür.', type: 'text', rows: 3, group: 'work' }),
  ],
  orderings: [{ title: 'Ən yeni', name: 'createdDesc', by: [{ field: 'createdAt', direction: 'desc' }] }],
  preview: {
    select: { number: 'number', title: 'packageTitle', quantity: 'quantity', amount: 'amount', currency: 'currency', account: 'account', status: 'status' },
    prepare({ number, title, quantity, amount, currency, account, status }) {
      const st = ORDER_STATUSES.find((s) => s.value === status)?.title ?? 'Yeni'
      const sum = amount ? (currency === 'USD' ? `$${amount}` : `${amount} ₼`) : ''
      return { title: `${number ?? ''} · ${title ?? ''}${quantity > 1 ? ` × ${quantity}` : ''}`, subtitle: [st, sum, account].filter(Boolean).join(' · ') }
    },
  },
})
