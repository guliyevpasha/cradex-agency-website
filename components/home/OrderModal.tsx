'use client'
/**
 * Combo package order dialog: step 1 collects the account and contact
 * details (nothing moves on until every field is valid), step 2 shows the
 * summary and hands off to the bank's 3D Secure page. Every step has a back
 * button. Styles: ".om-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, AtSign, Bell, Lock, Mail, Minus, Phone, Plus, ShieldCheck, User, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'
import { track } from '@/lib/analytics/track'
import { MAX_QTY, clampQty, formatAmount, formatPrice, priceOf, validateOrder, type ComboPackage, type FieldError } from '@/lib/site/orders'
import { useCurrency } from '@/lib/site/useCurrency'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

type Fields = { username: string; name: string; phone: string; email: string }
const EMPTY: Fields = { username: '', name: '', phone: '', email: '' }

const ERR_KEY: Record<FieldError, string> = {
  required: 'errRequired',
  username: 'errUsername',
  youtube: 'errYoutube',
  name: 'errName',
  phone: 'errPhone',
  email: 'errEmail',
}

const USERNAME_KEYS = { instagram: 'usernameInstagram', tiktok: 'usernameTiktok', youtube: 'usernameYoutube', facebook: 'usernameFacebook', telegram: 'usernameTelegram' } as const

type Props = { pack: ComboPackage; title: string; label: string; icon: React.ReactNode; tint: string }

export function OrderButton({ pack, title, label, icon, tint }: Props) {
  const pkg = pack.id
  const t = useTranslations('site.order')
  const currency = useCurrency()
  const price = formatPrice(pack, currency)
  const [qty, setQty] = useState(1)
  // While the field is being typed in, its raw text wins over the number.
  const [qtyDraft, setQtyDraft] = useState<string | null>(null)
  const total = formatAmount(Math.round(priceOf(pack, currency) * qty * 100) / 100, currency)
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, FieldError>>>({})
  const [busy, setBusy] = useState(false)
  const [state, setState] = useState<'idle' | 'unavailable' | 'error'>('idle')
  // Order number from the server, quoted in the WhatsApp message.
  const [number, setNumber] = useState('')
  const firstRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  // The card around the button is transformed (3D tilt), which would trap a
  // fixed-position dialog inside it, so the dialog renders into <body>.
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const id = setTimeout(() => firstRef.current?.focus(), 250)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(id)
    }
  }, [open])

  function close() {
    setOpen(false)
    setTimeout(() => {
      setStep(1)
      setState('idle')
      setErrors({})
      changeQty(1)
      setNumber('')
    }, 300)
  }

  function set(k: keyof Fields, v: string) {
    setFields((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function changeQty(n: number) {
    setQty(clampQty(n))
    setQtyDraft(null)
  }

  function stepQty(d: number) {
    setQtyDraft(null)
    setQty((q) => clampQty(q + d))
  }

  function next(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateOrder(fields, pack.platform)
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep(2)
  }

  async function pay() {
    setBusy(true)
    setState('idle')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: pkg, quantity: qty, locale, ...fields }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) track('form_submit', { form_name: 'combo_order' })
      if (res.ok && data.status === 'redirect' && typeof data.url === 'string') {
        window.location.assign(data.url)
        return
      }
      if (typeof data.number === 'string') setNumber(data.number)
      if (res.ok && data.status === 'not_configured') setState('unavailable')
      else if (res.status === 422 && data.fields) {
        setErrors(data.fields)
        setStep(1)
      } else setState('error')
    } catch {
      setState('error')
    } finally {
      setBusy(false)
    }
  }

  const usernameLabel = t(USERNAME_KEYS[pack.platform])
  const inputs: { k: keyof Fields; label: string; icon: React.ReactNode; type: string; auto: string }[] = [
    { k: 'username', label: usernameLabel, icon: <AtSign size={18} />, type: 'text', auto: 'off' },
    { k: 'name', label: t('name'), icon: <User size={18} />, type: 'text', auto: 'name' },
    { k: 'phone', label: t('phone'), icon: <Phone size={18} />, type: 'tel', auto: 'tel' },
    { k: 'email', label: t('email'), icon: <Mail size={18} />, type: 'email', auto: 'email' },
  ]

  const waText = t('whatsappMessage', {
    number: number || '—',
    package: title,
    quantity: qty,
    total,
    username: fields.username,
    name: fields.name,
    phone: fields.phone,
    email: fields.email,
  })

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tilt-z2 mt-8 inline-flex items-center justify-center rounded-full bg-text-primary px-5 py-3.5 text-[15px] font-semibold text-bg-primary transition-opacity hover:opacity-85"
      >
        {label} · {price}
      </button>

      {mounted &&
        createPortal(
          <>
            <div className={cn('om-overlay', open ? 'om-overlay-in' : 'om-overlay-out')} onClick={close} aria-hidden="true" />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t('title')}
              aria-hidden={!open}
              inert={!open}
              className={cn('om-wrap', open ? 'om-in' : 'om-out')}
            >
              <div className="om-card w-full max-w-[560px] overflow-hidden rounded-[32px] bg-bg-primary shadow-float ring-1 ring-line">
                {/* header */}
                <div className="flex items-center gap-4 border-b border-line px-6 py-5">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tint} text-snow shadow-card`}
                  >
                    {icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-text-primary">{title}</span>
                    <span className="text-sm text-text-secondary">
                      {t('amount')}: <b className="text-accent-ink">{total}</b>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label={t('close')}
                    className="rounded-full border border-line p-2 text-text-secondary hover:text-text-primary"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>

                {/* steps */}
                <ol className="flex gap-2 px-6 pt-5 text-xs font-semibold">
                  {[t('stepDetails'), t('stepPayment')].map((s, i) => (
                    <li
                      key={s}
                      className={cn(
                        'flex flex-1 items-center gap-2 rounded-full px-3 py-2',
                        step === i + 1 ? 'bg-brand-strong text-snow' : 'bg-bg-secondary text-text-muted',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full',
                          step === i + 1 ? 'bg-snow/20' : 'bg-bg-tertiary',
                        )}
                      >
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>

                <div className="om-stage">
                  {/* step 1 */}
                  <form
                    onSubmit={next}
                    noValidate
                    className={cn('om-face space-y-3 p-6', step === 1 ? 'om-face-in' : 'om-face-out')}
                    aria-hidden={step !== 1}
                  >
                    <p className="flex items-start gap-3 rounded-2xl bg-accent-primary/10 px-4 py-3 text-sm text-text-primary">
                      <Bell size={18} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                      {t('notice')}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg-secondary px-4 py-3">
                      <span className="min-w-0">
                        <label htmlFor={`om-${pkg}-qty`} className="block text-sm font-semibold text-text-primary">
                          {t('quantity')}
                        </label>
                        <span className="block text-xs text-text-muted">
                          {price} × {qty} = <b className="text-accent-ink">{total}</b>
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => stepQty(-1)}
                          disabled={qty <= 1}
                          aria-label={t('less')}
                          className="om-step flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg-primary text-text-primary disabled:opacity-40"
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                        <input
                          id={`om-${pkg}-qty`}
                          role="spinbutton"
                          aria-valuemin={1}
                          aria-valuemax={MAX_QTY}
                          aria-valuenow={qty}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={qtyDraft ?? String(qty)}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 3)
                            if (Number(v) > MAX_QTY) v = String(MAX_QTY)
                            setQtyDraft(v)
                            if (v) setQty(clampQty(Number(v)))
                          }}
                          onBlur={() => changeQty(qtyDraft ? Number(qtyDraft) : qty)}
                          aria-describedby={`om-${pkg}-qty-max`}
                          className="h-12 w-12 rounded-full bg-brand-strong text-center text-lg font-extrabold text-snow outline-none focus:ring-2 focus:ring-accent-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => stepQty(1)}
                          disabled={qty >= MAX_QTY}
                          aria-label={t('more')}
                          className="om-step flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg-primary text-text-primary disabled:opacity-40"
                        >
                          <Plus size={16} aria-hidden="true" />
                        </button>
                      </span>
                      <span id={`om-${pkg}-qty-max`} className="sr-only">
                        {t('quantityHint', { max: MAX_QTY })}
                      </span>
                    </div>

                    {inputs.map(({ k, label: l, icon: ic, type, auto }, i) => (
                      <div key={k}>
                        <label htmlFor={`om-${pkg}-${k}`} className="sr-only">
                          {l}
                        </label>
                        <div
                          className={cn(
                            'flex items-center gap-3 rounded-2xl border bg-bg-secondary px-4 transition-colors focus-within:border-accent-primary',
                            errors[k] ? 'border-[#DC2626]' : 'border-line',
                          )}
                        >
                          <span className="text-text-muted" aria-hidden="true">
                            {ic}
                          </span>
                          <input
                            ref={i === 0 ? firstRef : undefined}
                            id={`om-${pkg}-${k}`}
                            type={type}
                            autoComplete={auto}
                            inputMode={k === 'phone' ? 'tel' : undefined}
                            value={fields[k]}
                            onChange={(e) => set(k, e.target.value)}
                            placeholder={l}
                            required
                            maxLength={k === 'email' ? 254 : 120}
                            aria-invalid={Boolean(errors[k])}
                            aria-describedby={errors[k] ? `om-${pkg}-${k}-err` : undefined}
                            tabIndex={step === 1 ? 0 : -1}
                            className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-muted"
                          />
                        </div>
                        {errors[k] && (
                          <p id={`om-${pkg}-${k}-err`} className="mt-1.5 px-2 text-xs font-medium text-[#DC2626] dark:text-[#F87171]">
                            {t(ERR_KEY[errors[k] as FieldError])}
                          </p>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={close}
                        tabIndex={step === 1 ? 0 : -1}
                        className="inline-flex items-center gap-2 rounded-2xl border border-line px-5 py-4 text-sm font-semibold text-text-primary hover:bg-bg-secondary"
                      >
                        <ArrowLeft size={16} aria-hidden="true" />
                        {t('back')}
                      </button>
                      <button
                        type="submit"
                        tabIndex={step === 1 ? 0 : -1}
                        className="flex-1 rounded-2xl bg-brand-strong px-5 py-4 text-[15px] font-semibold text-snow shadow-brand hover:bg-[#0967B5]"
                      >
                        {t('continue')}
                      </button>
                    </div>
                  </form>

                  {/* step 2 */}
                  <div
                    className={cn('om-face space-y-4 p-6', step === 2 ? 'om-face-in' : 'om-face-out om-face-next')}
                    aria-hidden={step !== 2}
                  >
                    <div className="rounded-2xl border border-line bg-bg-secondary p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{t('summary')}</p>
                      <dl className="mt-3 space-y-2 text-sm">
                        {[
                          [t('quantity'), `${qty} × ${price}`],
                          [t('account'), fields.username],
                          [t('name'), fields.name],
                          [t('phone'), fields.phone],
                          [t('email'), fields.email],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4">
                            <dt className="text-text-secondary">{k}</dt>
                            <dd className="truncate font-semibold text-text-primary">{v}</dd>
                          </div>
                        ))}
                        <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
                          <dt className="font-semibold text-text-primary">{t('amount')}</dt>
                          <dd className="font-extrabold text-accent-ink">{total}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="om-secure flex items-start gap-4 rounded-2xl p-5 text-snow">
                      <span className="om-shield flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-snow/15">
                        <ShieldCheck size={24} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-bold">{t('payTitle')}</span>
                        <span className="mt-1 block text-sm text-snow/85">{t('payText')}</span>
                        <span className="mt-3 flex items-center gap-3 text-[11px] font-bold tracking-wide text-snow/90">
                          <Lock size={12} aria-hidden="true" /> {t('secure')} · VISA · Mastercard
                        </span>
                      </span>
                    </div>

                    {state === 'unavailable' && (
                      <div
                        className="space-y-3 rounded-2xl border border-accent-primary/40 bg-accent-primary/10 p-4 text-sm text-text-primary"
                        role="status"
                      >
                        <p>{t('unavailable')}</p>
                        <a
                          href={whatsappUrl(waText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-4 py-3 font-semibold text-snow hover:bg-[#15803D]"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                          {t('whatsapp')}
                        </a>
                      </div>
                    )}
                    {state === 'error' && (
                      <p role="alert" className="text-sm font-medium text-[#DC2626] dark:text-[#F87171]">
                        {t('error')}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        tabIndex={step === 2 ? 0 : -1}
                        className="inline-flex items-center gap-2 rounded-2xl border border-line px-5 py-4 text-sm font-semibold text-text-primary hover:bg-bg-secondary"
                      >
                        <ArrowLeft size={16} aria-hidden="true" />
                        {t('back')}
                      </button>
                      <button
                        type="button"
                        onClick={pay}
                        disabled={busy}
                        tabIndex={step === 2 ? 0 : -1}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-[15px] font-semibold text-snow ring-1 ring-snow/10 hover:bg-[#1B1E24] disabled:opacity-60 dark:bg-brand-strong dark:hover:bg-[#0967B5]"
                      >
                        <Lock size={16} aria-hidden="true" />
                        {busy ? t('paying') : `${t('pay')} · ${total}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}
