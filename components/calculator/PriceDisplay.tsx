'use client'
import { MessageCircle, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { PriceRange } from '@/types'
import type { ExtendedCalculatorSelection } from './calculatorUtils'
import { buildWhatsAppMessage } from './calculatorUtils'
import { getAllServicesSync } from '@/lib/data/services'
import { ServiceIcon } from '@/components/ui/ServiceIcon'

interface PriceDisplayProps {
  price: PriceRange
  selections: ExtendedCalculatorSelection[]
  onGetQuote: () => void
  isValid: boolean
}

export function PriceDisplay({ price, selections, onGetQuote, isValid }: PriceDisplayProps) {
  const t = useTranslations('calculator')
  const services = getAllServicesSync()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'

  const whatsappUrl = isValid
    ? `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage(selections, price)}`
    : undefined

  return (
    <div
      className="sticky top-24 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0f1e 0%, #13132a 100%)',
        border: '1px solid rgba(108,99,255,0.25)',
        boxShadow: isValid ? '0 0 40px rgba(108,99,255,0.15)' : 'none',
      }}
    >
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />

      <div className="p-6">
        <h3 className="text-text-primary font-bold text-lg mb-4">{t('totalPrice')}</h3>

        {/* Selected services */}
        {selections.length > 0 ? (
          <div className="space-y-2 mb-5">
            {selections.map((s) => {
              const svc = services.find((sv) => sv.slug === s.serviceSlug)
              const key = s.serviceSlug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
              return (
                <div
                  key={s.serviceSlug}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <span className="text-accent-primary"><ServiceIcon name={(svc as any)?.icon ?? ''} className="w-4 h-4" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-xs font-medium truncate">
                      {s.serviceSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-text-muted text-[10px]">{s.duration}</p>
                  </div>
                  <CheckCircle size={14} className="text-accent-primary shrink-0" />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mb-5 py-6 text-center">
            <p className="text-text-muted text-sm">{t('noSelection')}</p>
            <p className="text-text-muted text-xs mt-1 opacity-60">Xidmət seçin →</p>
          </div>
        )}

        {/* Price range */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}
        >
          {isValid ? (
            <div className="text-center">
              <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Təxmini qiymət</p>
              <div className="flex items-baseline justify-center gap-1">
                <span
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {price.min.toLocaleString()} – {price.max.toLocaleString()}
                </span>
                <span className="text-text-secondary text-base font-medium">AZN</span>
              </div>
              <p className="text-text-muted text-[10px] mt-1">* Dəqiq qiymət müzakirə zamanı müəyyənləşir</p>
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center italic py-2">
              Xidmət seçdikdən sonra qiymət görünəcək
            </p>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-accent-secondary" />
            <span className="text-text-muted text-[10px]">15 dəq cavab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={12} className="text-accent-secondary" />
            <span className="text-text-muted text-[10px]">Pulsuz məsləhət</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onGetQuote}
            disabled={!isValid}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isValid
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:shadow-[0_0_30px_rgba(108,99,255,0.6)] hover:opacity-90'
                : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
            }`}
          >
            {t('getQuote')}
            <ArrowRight size={16} />
          </button>

          {isValid && whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #25D366, #20bd5a)',
                boxShadow: '0 0 16px rgba(37,211,102,0.3)',
              }}
            >
              <MessageCircle size={16} />
              WhatsApp ilə Yazın
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
