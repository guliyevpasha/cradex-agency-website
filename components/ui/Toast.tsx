'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ToastProps {
  show: boolean
  type: 'success' | 'error'
  title: string
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ show, type, title, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [show, duration, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-2xl shadow-2xl max-w-sm w-full',
            'border backdrop-blur-md',
            type === 'success'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          )}
          role="alert"
          aria-live="polite"
        >
          {type === 'success' ? (
            <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className={cn(
              'font-semibold text-sm',
              type === 'success' ? 'text-green-400' : 'text-red-400'
            )}>
              {title}
            </p>
            <p className="text-text-secondary text-xs mt-0.5">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors shrink-0"
            aria-label="Bağla"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
