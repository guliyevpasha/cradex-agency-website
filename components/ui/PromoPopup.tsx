'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, TrendingUp, Clock, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'cradex_popup_dismissed'
const DELAY_MS = 2000 // 2 saniyə (test üçün azaldıldı)
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">

              {/* Card with animated gradient background */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      'linear-gradient(135deg, rgba(108,99,255,0.3) 0%, rgba(0,212,255,0.3) 100%)',
                      'linear-gradient(135deg, rgba(0,212,255,0.3) 0%, rgba(108,99,255,0.3) 100%)',
                      'linear-gradient(135deg, rgba(108,99,255,0.3) 0%, rgba(0,212,255,0.3) 100%)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Close button */}
                <button
                  onClick={dismiss}
                  aria-label="Bağla"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all z-10 group"
                >
                  <X size={16} className="text-white/70 group-hover:text-white transition-colors" />
                </button>

                {/* Content */}
                <div className="relative px-8 pt-10 pb-8 text-center">

                  {/* Logo/Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                      boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
                    }}
                  >
                    <TrendingUp size={32} className="text-white" />
                  </motion.div>

                  {/* Heading */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    id="popup-title"
                    className="text-white font-display font-bold text-2xl leading-tight mb-3"
                  >
                    {t('title')}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/60 text-sm leading-relaxed mb-8"
                  >
                    {t('subtitle')}
                  </motion.p>

                  {/* WhatsApp CTA */}
                  <motion.a
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dismiss}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'linear-gradient(135deg, #25D366, #20bd5a)',
                      boxShadow: '0 8px 32px rgba(37,211,102,0.4)',
                    }}
                  >
                    <MessageCircle size={22} />
                    {t('cta')}
                  </motion.a>

                  {/* Dismiss */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-6"
                  >
                    <button
                      onClick={dismiss}
                      className="text-white/30 hover:text-white/60 text-sm transition-colors"
                    >
                      {t('dismiss')}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
