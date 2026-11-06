/**
 * Studio buttons on a combo order: open WhatsApp to the buyer with a ready
 * message in the language they ordered in, and move the status along.
 * WhatsApp opens in a new tab; nothing is sent until the owner presses send.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useClient, type DocumentActionComponent } from 'sanity'
import { CheckmarkCircleIcon, PlayIcon } from '@sanity/icons'

type Order = {
  number?: string
  name?: string
  whatsapp?: string
  packageTitle?: string
  quantity?: number
  locale?: string
  status?: string
}

type Lang = 'az' | 'en' | 'ru' | 'tr'

const START: Record<Lang, (o: Required<Pick<Order, 'name' | 'number' | 'packageTitle'>> & { quantity: number }) => string> = {
  az: (o) => `Salam, ${o.name}! Cradex Agency-dən yazırıq. ${o.number} nömrəli sifarişiniz (${o.packageTitle}, ${o.quantity} ədəd) icraya başladı. Çatdırılma 1–7 gün ərzində tamamlanacaq. Sualınız olsa, bu nömrəyə yaza bilərsiniz.`,
  en: (o) => `Hello ${o.name}! This is Cradex Agency. Your order ${o.number} (${o.packageTitle}, ×${o.quantity}) has started. Delivery will be completed within 1–7 days. If you have any questions, just reply here.`,
  ru: (o) => `Здравствуйте, ${o.name}! Это Cradex Agency. Ваш заказ ${o.number} (${o.packageTitle}, ${o.quantity} шт.) взят в работу. Выполнение займёт от 1 до 7 дней. Если появятся вопросы, пишите в этот чат.`,
  tr: (o) => `Merhaba ${o.name}! Cradex Agency'den yazıyoruz. ${o.number} numaralı siparişiniz (${o.packageTitle}, ${o.quantity} adet) başladı. Teslimat 1–7 gün içinde tamamlanacak. Sorunuz olursa bu numaraya yazabilirsiniz.`,
}

const DONE: Record<Lang, (o: { name: string; number: string }) => string> = {
  az: (o) => `Salam, ${o.name}! ${o.number} nömrəli sifarişiniz tamamlandı. Bizi seçdiyiniz üçün təşəkkür edirik. Rəyinizi bizimlə bölüşsəniz, şad olarıq.`,
  en: (o) => `Hello ${o.name}! Your order ${o.number} is complete. Thank you for choosing Cradex Agency — we'd be glad to hear your feedback.`,
  ru: (o) => `Здравствуйте, ${o.name}! Ваш заказ ${o.number} выполнен. Спасибо, что выбрали Cradex Agency. Будем рады вашему отзыву.`,
  tr: (o) => `Merhaba ${o.name}! ${o.number} numaralı siparişiniz tamamlandı. Cradex Agency'yi tercih ettiğiniz için teşekkürler, yorumunuzu duymaktan memnuniyet duyarız.`,
}

const lang = (l?: string): Lang => (l === 'en' || l === 'ru' || l === 'tr' ? l : 'az')

/** wa.me wants digits only, with the country code. */
const waLink = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

/**
 * Writes the status straight to the published order (and to an open draft,
 * if the owner was editing a note), so no extra Publish click is needed.
 */
function useOrderStep(props: Parameters<DocumentActionComponent>[0]) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const doc = (props.draft || props.published) as Order | null
  const set = (fields: Record<string, string>) => {
    const tx = client.transaction().patch(props.id, (p) => p.set(fields))
    if (props.draft) tx.patch(`drafts.${props.id}`, (p) => p.set(fields))
    return tx.commit().catch((e) => console.error('[orders] status update failed:', e))
  }
  return { doc, set }
}

export const StartOrderAction: DocumentActionComponent = (props) => {
  const { doc, set } = useOrderStep(props)
  const phone = doc?.whatsapp?.replace(/\D/g, '') ?? ''
  return {
    label: 'WhatsApp-a yaz və başlat',
    icon: PlayIcon,
    tone: 'primary',
    disabled: !doc || phone.length < 9 || doc.status === 'in_progress' || doc.status === 'done',
    title: phone.length < 9 ? 'Sifarişdə WhatsApp nömrəsi yoxdur' : undefined,
    onHandle: () => {
      if (!doc) return
      const text = START[lang(doc.locale)]({ name: doc.name ?? '', number: doc.number ?? '', packageTitle: doc.packageTitle ?? '', quantity: doc.quantity ?? 1 })
      window.open(waLink(phone, text), '_blank', 'noopener,noreferrer')
      set({ status: 'in_progress', startedAt: new Date().toISOString() })
      props.onComplete()
    },
  }
}

export const CompleteOrderAction: DocumentActionComponent = (props) => {
  const { doc, set } = useOrderStep(props)
  const phone = doc?.whatsapp?.replace(/\D/g, '') ?? ''
  return {
    label: 'Tamamlandı, xəbər ver',
    icon: CheckmarkCircleIcon,
    tone: 'positive',
    disabled: !doc || doc.status !== 'in_progress' || phone.length < 9,
    onHandle: () => {
      if (!doc) return
      window.open(waLink(phone, DONE[lang(doc.locale)]({ name: doc.name ?? '', number: doc.number ?? '' })), '_blank', 'noopener,noreferrer')
      set({ status: 'done' })
      props.onComplete()
    },
  }
}
