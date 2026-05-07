'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { Send } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { Toast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils/cn'

// Lead form specific schema
const leadSchema = z.object({
  fullName: z.string().min(2, ''),
  email: z.string().email(''),
  phone: z.string().optional(),
  message: z.string().min(1, '').optional(),
  honeypot: z.string().max(0).optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadFormProps {
  className?: string
}

export function LeadForm({ className }: LeadFormProps) {
  const t = useTranslations('contact.leadForm')

  const services = t.raw('services') as string[]
  const budgets = t.raw('budgets') as string[]

  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState<string>('')
  const [toast, setToast] = useState<{
    show: boolean; type: 'success' | 'error'; title: string; message: string
  }>({ show: false, type: 'success', title: '', message: '' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({ resolver: zodResolver(leadSchema) })

  function toggleService(s: string) {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  async function onSubmit(data: LeadFormData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          message: `${data.message ?? ''}\n\nXidmətlər: ${selectedServices.join(', ')}\nBüdcə: ${selectedBudget}`,
          honeypot: data.honeypot,
        }),
      })
      if (!res.ok) throw new Error()
      reset()
      setSelectedServices([])
      setSelectedBudget('')
      setToast({
        show: true,
        type: 'success',
        title: t('successTitle'),
        message: t('successMessage'),
      })
    } catch {
      setToast({
        show: true,
        type: 'error',
        title: 'Xəta',
        message: t('errorMessage'),
      })
    }
  }

  const inputClass = (hasError?: boolean) => cn(
    'w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted',
    'bg-bg-tertiary border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-accent-primary/40',
    hasError
      ? 'border-red-500/50'
      : 'border-white/10 focus:border-accent-primary/50'
  )

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={cn('space-y-5', className)}
      >
        {/* Honeypot */}
        <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} aria-hidden="true" />

        {/* Name + Email — side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lf-name" className="block text-text-secondary text-xs mb-1.5">
              {t('fields.name')} <span className="text-red-400">*</span>
            </label>
            <input
              id="lf-name"
              type="text"
              autoComplete="name"
              placeholder={t('fields.namePlaceholder')}
              {...register('fullName')}
              className={inputClass(!!errors.fullName)}
              aria-invalid={!!errors.fullName}
            />
          </div>
          <div>
            <label htmlFor="lf-email" className="block text-text-secondary text-xs mb-1.5">
              {t('fields.email')} <span className="text-red-400">*</span>
            </label>
            <input
              id="lf-email"
              type="email"
              autoComplete="email"
              placeholder={t('fields.emailPlaceholder')}
              {...register('email')}
              className={inputClass(!!errors.email)}
              aria-invalid={!!errors.email}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="lf-phone" className="block text-text-secondary text-xs mb-1.5">
            {t('fields.phone')}
          </label>
          <input
            id="lf-phone"
            type="tel"
            autoComplete="tel"
            placeholder={t('fields.phonePlaceholder')}
            {...register('phone')}
            className={inputClass()}
          />
        </div>

        {/* Service chips */}
        <div>
          <p className="text-text-secondary text-xs mb-2.5">{t('fields.serviceLabel')}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('fields.serviceLabel')}>
            {services.map((s) => {
              const active = selectedServices.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  aria-pressed={active}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 min-h-[32px]',
                    active
                      ? 'bg-accent-primary text-white shadow-[0_0_12px_rgba(108,99,255,0.4)]'
                      : 'bg-bg-tertiary text-text-secondary border border-white/10 hover:border-accent-primary/40 hover:text-text-primary'
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Budget chips */}
        <div>
          <p className="text-text-secondary text-xs mb-2.5">{t('fields.budgetLabel')}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('fields.budgetLabel')}>
            {budgets.map((b) => {
              const active = selectedBudget === b
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBudget(active ? '' : b)}
                  aria-pressed={active}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 min-h-[32px]',
                    active
                      ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-[0_0_12px_rgba(108,99,255,0.4)]'
                      : 'bg-bg-tertiary text-text-secondary border border-white/10 hover:border-accent-primary/40 hover:text-text-primary'
                  )}
                >
                  {b}
                </button>
              )
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="lf-message" className="sr-only">{t('fields.message')}</label>
          <textarea
            id="lf-message"
            rows={4}
            placeholder={t('fields.message')}
            {...register('message')}
            className={cn(inputClass(), 'resize-none')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_24px_rgba(108,99,255,0.35)] hover:shadow-[0_0_36px_rgba(108,99,255,0.55)] min-h-[52px]"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              {t('submitting')}
            </>
          ) : (
            <>
              <Send size={16} />
              {t('submit')}
            </>
          )}
        </button>
      </form>

      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((p) => ({ ...p, show: false }))}
      />
    </>
  )
}
