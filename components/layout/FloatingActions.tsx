'use client'
/**
 * Floating helpers in the bottom-right corner:
 *  - back-to-top button with a scroll-progress ring
 *  - 3D robot assistant with a "Got a question?" teaser and quick answers
 * Styles: ".fab-*" and ".bot-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUp, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

const TEASER_KEY = 'cradex-bot-teaser'
const QUICK = ['1', '2', '3', '4'] as const
type Msg = { from: 'bot' | 'me'; text: string }

function RobotHead({ small }: { small?: boolean }) {
  return (
    <span className={cn('bot-head', small && 'bot-head-sm')} aria-hidden="true">
      <span className="bot-antenna" />
      <span className="bot-face">
        <span className="bot-eye" />
        <span className="bot-eye" />
      </span>
      <span className="bot-ear bot-ear-l" />
      <span className="bot-ear bot-ear-r" />
    </span>
  )
}

function BackToTop({ label }: { label: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const visible = progress > 0.08
  const C = 2 * Math.PI * 25

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      className={cn('fab-top', visible ? 'fab-in' : 'fab-out')}
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r="25" className="fab-track" />
        <circle cx="28" cy="28" r="25" className="fab-progress" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
      </svg>
      <span className="fab-cap">
        <ArrowUp size={20} strokeWidth={2.6} aria-hidden="true" />
      </span>
    </button>
  )
}

export function FloatingActions() {
  const t = useTranslations('site.bot')
  const tTop = useTranslations('site.top')
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [typing, setTyping] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  // Show the teaser once per visit, a few seconds after landing.
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === '1'
    } catch {}
    if (seen) return
    const id = setTimeout(() => setTeaser(true), 4000)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function dismissTeaser() {
    setTeaser(false)
    try {
      sessionStorage.setItem(TEASER_KEY, '1')
    } catch {}
  }

  function toggle() {
    dismissTeaser()
    setOpen((v) => !v)
    if (msgs.length === 0) setMsgs([{ from: 'bot', text: t('hello') }])
  }

  function ask(n: (typeof QUICK)[number]) {
    if (typing) return
    setMsgs((m) => [...m, { from: 'me', text: t(`q${n}`) }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', text: t(`a${n}`) }])
    }, 900)
  }

  return (
    <div className="fab-stack">
      <BackToTop label={tTop('label')} />

      {/* chat panel */}
      <div
        role="dialog"
        aria-label={t('name')}
        aria-hidden={!open}
        inert={!open}
        className={cn('bot-panel', open ? 'bot-panel-in' : 'bot-panel-out')}
      >
        <div className="flex items-center gap-3 border-b border-line bg-ink px-5 py-4 text-snow">
          <RobotHead small />
          <span className="min-w-0 flex-1">
            <span className="block font-bold">{t('name')}</span>
            <span className="flex items-center gap-1.5 text-xs text-[#9AA4B2]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              {t('status')}
            </span>
          </span>
          <button type="button" onClick={() => setOpen(false)} aria-label={t('close')} className="rounded-full p-2 text-[#9AA4B2] hover:bg-snow/10 hover:text-snow">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div ref={listRef} className="flex h-[300px] flex-col gap-3 overflow-y-auto bg-bg-secondary px-4 py-5" aria-live="polite">
          {msgs.map((m, i) => (
            <p
              key={i}
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed',
                m.from === 'bot'
                  ? 'self-start rounded-bl-md border border-line bg-bg-primary text-text-primary'
                  : 'self-end rounded-br-md bg-brand-strong text-snow'
              )}
            >
              {m.text}
            </p>
          ))}
          {typing && (
            <span className="bot-typing self-start" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </div>

        <div className="space-y-3 border-t border-line bg-bg-primary p-4">
          <div className="flex flex-wrap gap-2">
            {QUICK.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => ask(n)}
                disabled={typing}
                className="rounded-full border border-accent-primary/40 bg-accent-primary/10 px-3 py-1.5 text-[13px] font-semibold text-accent-ink transition-colors hover:bg-accent-primary/20 disabled:opacity-50"
              >
                {t(`q${n}`)}
              </button>
            ))}
          </div>
          <a
            href={whatsappUrl(t('humanMessage'))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-brand-strong px-4 py-3 text-sm font-semibold text-snow hover:bg-[#0967B5]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t('human')}
            <Send size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* teaser */}
      <div className={cn('bot-teaser', teaser && !open ? 'bot-teaser-in' : 'bot-teaser-out')} aria-hidden={!teaser || open}>
        <button type="button" onClick={toggle} className="text-left text-sm font-semibold text-text-primary">
          {t('teaser')}
        </button>
        <button type="button" onClick={dismissTeaser} aria-label={t('close')} className="ml-2 text-text-muted hover:text-text-primary">
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      {/* launcher */}
      <button type="button" onClick={toggle} aria-label={open ? t('close') : t('open')} aria-expanded={open} className="bot-launcher">
        {open ? <X size={24} className="text-snow" aria-hidden="true" /> : <RobotHead />}
        {!open && teaser && <span className="bot-badge">1</span>}
      </button>
    </div>
  )
}
