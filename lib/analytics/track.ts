/**
 * Lead events sent to GA4. The Studio dashboard counts these names, so
 * renaming one here means renaming it in app/api/analytics too.
 * @author Paşa Quliyev — Cradex Agency
 */

export const LEAD_EVENTS = ['whatsapp_click', 'phone_click', 'email_click', 'form_submit'] as const
export type LeadEvent = (typeof LEAD_EVENTS)[number]

type Gtag = (cmd: 'event', name: string, params?: Record<string, string>) => void

export function track(name: LeadEvent, params?: Record<string, string>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  gtag?.('event', name, params)
}

/** Which lead event a link stands for, if any. */
export function ctaEvent(href: string): LeadEvent | null {
  if (href.startsWith('tel:')) return 'phone_click'
  if (href.startsWith('mailto:')) return 'email_click'
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|(www\.)?whatsapp\.com)\//i.test(href)) return 'whatsapp_click'
  return null
}
