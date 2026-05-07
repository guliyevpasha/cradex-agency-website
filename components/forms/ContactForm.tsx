'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { contactSchema, type ContactFormData } from './contactSchema'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export function ContactForm() {
  const t = useTranslations('contact.form')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full px-4 py-3 rounded-xl bg-bg-tertiary border text-text-primary placeholder:text-text-muted text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary/50',
      hasError ? 'border-red-500/50' : 'border-white/10 focus:border-accent-primary/50'
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — hidden from users, visible to bots */}
      <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} aria-hidden="true" />

      {/* Full name */}
      <div>
        <label htmlFor="fullName" className="block text-text-secondary text-sm mb-1.5">
          {t('fullName')} <span className="text-red-400">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder={t('namePlaceholder')}
          {...register('fullName')}
          className={inputClass(!!errors.fullName)}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          aria-invalid={!!errors.fullName}
        />
        {errors.fullName && (
          <p id="fullName-error" role="alert" className="text-red-400 text-xs mt-1">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-text-secondary text-sm mb-1.5">
          {t('email')} <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
          className={inputClass(!!errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-red-400 text-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-text-secondary text-sm mb-1.5">
          {t('phone')}
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+994 50 000 00 00"
          {...register('phone')}
          className={inputClass(!!errors.phone)}
        />
      </div>

      {/* Service */}
      <div>
        <label htmlFor="service" className="block text-text-secondary text-sm mb-1.5">
          {t('service')}
        </label>
        <select
          id="service"
          {...register('service')}
          className={cn(inputClass(false), 'cursor-pointer')}
        >
          <option value="">{t('service')}</option>
          {([
            'digital-marketing', 'traditional-marketing', 'smm',
            'graphic-motion-design', 'photo-video', 'branding',
            'copywriting', 'web-mobile-dev', 'other',
          ] as const).map((s) => (
            <option key={s} value={s}>
              {t(`serviceOptions.${s}` as any)}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-text-secondary text-sm mb-1.5">
          {t('message')} <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder={t('messagePlaceholder')}
          {...register('message')}
          className={cn(inputClass(!!errors.message), 'resize-none')}
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-red-400 text-xs mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={status === 'loading'}
        loading={status === 'loading'}
        className="w-full"
        size="lg"
      >
        {status === 'loading' ? t('sending') : t('submit')}
      </Button>

      {/* Success message */}
      {status === 'success' && (
        <div role="alert" className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
          <CheckCircle size={18} className="shrink-0" />
          <p className="text-sm">{t('success')}</p>
        </div>
      )}

      {/* Error message */}
      {status === 'error' && (
        <div role="alert" className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-sm">{t('error')}</p>
        </div>
      )}
    </form>
  )
}
