'use client'
/**
 * Chatbot enquiry form. Nothing is posted to our server: once the two
 * required fields are filled, the message opens in WhatsApp (or the mail
 * app), so no personal data is stored on the site.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'
import { track } from '@/lib/analytics/track'

export const CONTACT_EMAIL = 'info@cradexagency.com'

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i
const PHONE_RE = /^\+?[\d\s()-]{9,20}$/

export function ChatbotForm() {
  const t = useTranslations('site.chatbotPage')
  const topics = t.raw('topics') as string[]
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [topic, setTopic] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  const valid = () => name.trim().length > 1 && (EMAIL_RE.test(contact.trim()) || PHONE_RE.test(contact.trim()))

  const text = () =>
    t('formMail', { name: name.trim(), contact: contact.trim(), topic: topics[topic], message: message.trim() }).trim()

  function check() {
    const ok = valid()
    setError(!ok)
    setSent(false)
    return ok
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!check()) return
    window.open(whatsappUrl(text()), '_blank', 'noopener,noreferrer')
    track('form_submit', { form_name: 'chatbot' })
    setSent(true)
  }

  function onMail(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!check()) {
      e.preventDefault()
      return
    }
    track('form_submit', { form_name: 'chatbot' })
    e.currentTarget.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('formSubject', { name: name.trim() }))}&body=${encodeURIComponent(text())}`
  }

  const field =
    'mt-2 w-full rounded-2xl border border-snow/10 bg-snow/[0.06] px-4 py-3 text-[16px] text-snow outline-none transition-colors placeholder:text-snow/40 focus:border-brand focus:bg-snow/[0.09]'

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <label className="block">
        <span className="text-sm font-semibold text-snow/85">{t('formName')}</span>
        <input value={name} onChange={(e) => setName(e.target.value.slice(0, 60))} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-snow/85">{t('formContact')}</span>
        <input value={contact} onChange={(e) => setContact(e.target.value.slice(0, 120))} autoComplete="email" className={field} />
      </label>

      <fieldset className="min-w-0">
        <legend className="text-sm font-semibold text-snow/85">{t('formTopic')}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((label, i) => (
            <label
              key={label}
              className={cn(
                'cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand',
                i === topic ? 'border-brand-strong bg-brand-strong text-snow' : 'border-snow/20 text-snow/80 hover:border-snow/50'
              )}
            >
              <input type="radio" name="cb-topic" checked={i === topic} onChange={() => setTopic(i)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold text-snow/85">{t('formMessage')}</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 800))} rows={4} className={cn(field, 'resize-none')} />
      </label>

      <p aria-live="polite" className={cn('text-sm font-semibold', error ? 'text-[#FCA5A5]' : 'text-[#86EFAC]')}>
        {error ? t('formError') : sent ? t('formSent') : ''}
      </p>

      <button
        type="submit"
        className="w-full rounded-full bg-snow px-6 py-4 font-bold text-ink transition-transform hover:-translate-y-0.5"
      >
        {t('formSend')}
      </button>
      <p className="text-center">
        <a href={`mailto:${CONTACT_EMAIL}`} onClick={onMail} className="text-sm font-semibold text-brand underline underline-offset-4">
          {t('formEmail')}
        </a>
      </p>
    </form>
  )
}
