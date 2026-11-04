'use client'
/**
 * Primary call to action: opens WhatsApp with the demo request pre-filled.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
    </svg>
  )
}

type Props = {
  label?: string
  /** Pre-filled WhatsApp text; defaults to the demo request. */
  message?: string
  size?: 'md' | 'lg'
  variant?: 'primary' | 'dark' | 'light'
  className?: string
}

export function WhatsAppButton({ label, message, size = 'lg', variant = 'primary', className }: Props) {
  const t = useTranslations('site.cta')

  return (
    <a
      href={whatsappUrl(message ?? t('whatsappMessage'))}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-all duration-200',
        'hover:-translate-y-0.5 active:translate-y-0',
        size === 'lg' ? 'px-7 py-4 text-[15px]' : 'px-5 py-2.5 text-sm',
        variant === 'primary'
          ? 'bg-brand-strong text-snow shadow-brand hover:bg-[#0967B5]'
          : variant === 'light'
            ? 'bg-snow text-[#0A74CC] shadow-card hover:bg-snow/90'
            : 'bg-text-primary text-bg-primary hover:opacity-90',
        className
      )}
    >
      <WhatsAppIcon className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
      <span>{label ?? t('discuss')}</span>
    </a>
  )
}
