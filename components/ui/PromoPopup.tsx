'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, TrendingUp, Clock, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'cradex_popup_dismissed'
const DELAY_MS = 4000
const RESHOW_DAYS = 3

export function PromoPopup() {
  const t = useTranslations('popup')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      const daysPassed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
      if (daysPassed < RESHOW_DAYS) return
    }
    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
    setVisible(false)
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t('whatsappText'))}`

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md"
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            initial={{ opacity: 0, scale: 0.85, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-[420px] pointer-events-auto">

              {/* Glow effect behind card */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-60 blur-xl pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.4), rgba(0,212,255,0.3))' }}
              />

              {/* Card */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, #0f0f1e 0%, #13132a 100%)',
                  border: '1px solid rgba(108,99,255,0.3)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05) inset',
                }}
              >
                {/* Top gradient bar */}
                <div className="h-1 w-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />

                {/* Close button */}
                <button
                  onClick={dismiss}
                  aria-label="Bağla"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                >
                  <X size={14} className="text-white/70" />
                </button>

                {/* Content */}
                <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7">

                  {/* Icon + urgency badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                        boxShadow: '0 0 28px rgba(108,99,255,0.5)',
                      }}
                    >
                      <TrendingUp size={26} className="text-white" />
                    </div>
                    {/* Urgency pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-red-400 text-xs font-semibold">Məhdud təklif</span>
                    </div>
                  </div>

                  {/* Heading */}
                  <h2
                    id="popup-title"
                    className="text-white font-display font-bold text-xl sm:text-2xl leading-tight mb-3"
                  >
                    {t('title')}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-white/55 text-sm leading-relaxed mb-6">
                    {t('subtitle')}
                  </p>

                  {/* Trust badges */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-accent-secondary shrink-0" />
                      <span className="text-white/50 text-xs">15 dəqiqədə cavab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield size={13} className="text-accent-secondary shrink-0" />
                      <span className="text-white/50 text-xs">Pulsuz məsləhət</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-400 text-xs">★★★★★</span>
                      <span className="text-white/50 text-xs">5.0</span>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dismiss}
                    className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-white font-bold text-sm sm:text-base transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #25D366, #20bd5a)',
                      boxShadow: '0 0 24px rgba(37,211,102,0.4), 0 4px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    <MessageCircle size={20} />
                    {t('cta')}
                  </a>

                  {/* Social proof */}
                  <div className="flex items-center justify-center gap-2 mt-4 mb-1">
                    <div className="flex -space-x-2">
                      {['#6C63FF', '#00D4FF', '#FF6B6B', '#22C55E'].map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-[#13132a] flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {['E', 'L', 'R', 'N'][i]}
                        </div>
                      ))}
                    </div>
                    <span className="text-white/40 text-xs">100+ müştəri bizi seçdi</span>
                  </div>

                  {/* Dismiss */}
                  <div className="text-center mt-3">
                    <button
                      onClick={dismiss}
                      className="text-white/25 hover:text-white/50 text-xs transition-colors"
                    >
                      {t('dismiss')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
