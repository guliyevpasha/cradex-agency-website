'use client'
/**
 * Floating helpers in the bottom-right corner:
 *  - back-to-top button with a scroll-progress ring
 *  - 3D robot assistant: quick answers, free questions answered from the
 *    site FAQs and Studio; unknown ones go to the owner (see app/api/chat)
 * Styles: ".fab-*" and ".bot-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUp, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

const TEASER_KEY = 'cradex-bot-teaser'
const QUICK = ['1', '2', '3', '4'] as const
const SESSION_KEY = 'cradex-chat-session'
const PENDING_KEY = 'cradex-chat-pending'
const WELCOME_SHOWN_KEY = 'cradex-welcome-shown'
type Msg = { from: 'bot' | 'me' | 'admin'; text: string }
type Pending = { id: string; question: string; at: number }

// Play notification sound
function playNotificationSound() {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (error) {
    console.log('Audio notification not available')
  }
}

function RobotHead({ small }: { small?: boolean }) {
  return (
    <span className={cn('rb', small && 'rb-sm')} aria-hidden="true">
      <span className="rb-antenna" />
      <span className="rb-ear rb-ear-l" />
      <span className="rb-ear rb-ear-r" />
      <span className="rb-helmet">
        <span className="rb-visor">
          <span className="rb-eyes">
            <i />
            <i />
          </span>
          <span className="rb-mouth" />
        </span>
      </span>
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
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [typing, setTyping] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState<Pending[]>([])
  // the question waiting for a contact (only the latest forwarded one)
  const [contactFor, setContactFor] = useState<string | null>(null)
  const [contact, setContact] = useState('')
  const [unread, setUnread] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const session = useRef('')

  // One anonymous id per browser ties the owner's reply to this chat.
  useEffect(() => {
    try {
      session.current = localStorage.getItem(SESSION_KEY) || crypto.randomUUID()
      localStorage.setItem(SESSION_KEY, session.current)
      const saved = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]') as Pending[]
      // Older than a week: the owner has answered by WhatsApp or e-mail by then.
      setPending(saved.filter((p) => Date.now() - p.at < 7 * 86_400_000))
    } catch {
      session.current = crypto.randomUUID()
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    } catch {}
  }, [pending])

  // Show the teaser once per visit, a few seconds after landing.
  useEffect(() => {
    // Always show teaser after 7 seconds
    const teaserTimer = setTimeout(() => setTeaser(true), 7000)
    
    // Play notification sound after 15 seconds
    const soundTimer = setTimeout(() => {
      playNotificationSound()
    }, 15000)
    
    return () => {
      clearTimeout(teaserTimer)
      clearTimeout(soundTimer)
    }
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, contactFor])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Ask for the owner's replies every 10 s while the tab is visible.
  useEffect(() => {
    if (pending.length === 0) return
    let stop = false
    const check = async () => {
      if (document.hidden) return
      for (const p of pending) {
        try {
          const res = await fetch(`/api/chat?id=${encodeURIComponent(p.id)}`, { headers: { 'x-chat-session': session.current } })
          if (!res.ok) continue
          const data = (await res.json()) as { answer?: string | null }
          if (stop || !data.answer) continue
          setMsgs((m) => [...m, { from: 'me', text: p.question }, { from: 'admin', text: data.answer! }])
          setPending((list) => list.filter((x) => x.id !== p.id))
          setUnread(true)
          // Play sound when reply arrives
          if (!open) {
            playNotificationSound()
          }
        } catch {}
      }
    }
    check()
    const timer = setInterval(check, 10_000)
    return () => {
      stop = true
      clearInterval(timer)
    }
  }, [pending, open])

  function dismissTeaser() {
    // Don't dismiss teaser anymore - keep it visible
    // setTeaser(false)
    // try {
    //   sessionStorage.setItem(TEASER_KEY, '1')
    // } catch {}
  }

  function toggle() {
    // dismissTeaser() - keep teaser visible
    setUnread(false)
    setOpen((v) => !v)
    if (msgs.length === 0) setMsgs([{ from: 'bot', text: t('hello') }])
  }

  const say = (text: string, from: Msg['from'] = 'bot') => setMsgs((m) => [...m, { from, text }])

  function quick(n: (typeof QUICK)[number]) {
    if (typing) return
    say(t(`q${n}`), 'me')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      say(t(`a${n}`))
    }, 700)
  }

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || typing) return
    if (text.length > 500) return say(t('tooLong'))
    setDraft('')
    say(text, 'me')
    setTyping(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ask', message: text, locale, session: session.current, page: window.location.pathname }),
      })
      const data = (await res.json().catch(() => ({}))) as { type?: string; text?: string; id?: string }
      if (data.type === 'answer' && data.text) say(data.text)
      else if (data.type === 'greeting') say(t('greeting'))
      else if (data.type === 'forwarded' && data.id) {
        say(t('forwarded'))
        say(t('askContact'))
        setPending((list) => [...list, { id: data.id!, question: text, at: Date.now() }])
        setContactFor(data.id)
      } else say(t(res.ok ? 'offline' : 'error'))
    } catch {
      say(t('error'))
    } finally {
      setTyping(false)
    }
  }

  async function saveContact(e: React.FormEvent) {
    e.preventDefault()
    const value = contact.trim()
    if (!contactFor || value.length < 5) return
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'contact', id: contactFor, session: session.current, contact: value }),
      })
      if (!res.ok) throw new Error()
      say(value, 'me')
      say(t('contactThanks'))
      setContactFor(null)
      setContact('')
    } catch {
      say(t('error'))
    }
  }

  return (
    <>
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

        <div ref={listRef} className="flex h-[min(300px,calc(100dvh-520px))] min-h-[140px] flex-col gap-3 overflow-y-auto bg-bg-secondary px-4 py-5" aria-live="polite">
          {msgs.map((m, i) => (
            <p
              key={i}
              className={cn(
                'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed',
                m.from === 'me'
                  ? 'self-end rounded-br-md bg-brand-strong text-snow'
                  : m.from === 'admin'
                    ? 'self-start rounded-bl-md border-2 border-brand-strong bg-bg-primary text-text-primary'
                    : 'self-start rounded-bl-md border border-line bg-bg-primary text-text-primary'
              )}
            >
              {m.from === 'admin' && <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-accent-ink">{t('admin')}</span>}
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
          {contactFor && (
            <form onSubmit={saveContact} className="flex gap-2 self-stretch">
              <label className="sr-only" htmlFor="bot-contact">{t('askContact')}</label>
              <input
                id="bot-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value.slice(0, 120))}
                placeholder={t('contactPlaceholder')}
                autoComplete="email"
                className="min-w-0 flex-1 rounded-xl border border-line bg-bg-primary px-3 py-2 text-[16px] text-text-primary outline-none focus:border-accent-primary sm:text-sm"
              />
              <button type="submit" className="shrink-0 rounded-xl bg-brand-strong px-3 text-sm font-semibold text-snow">
                {t('contactSave')}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3 border-t border-line bg-bg-primary p-4">
          <div className="flex flex-wrap gap-2">
            {QUICK.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => quick(n)}
                disabled={typing}
                className="rounded-full border border-accent-primary/40 bg-accent-primary/10 px-3 py-1.5 text-[13px] font-semibold text-accent-ink transition-colors hover:bg-accent-primary/20 disabled:opacity-50"
              >
                {t(`q${n}`)}
              </button>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2">
            <label className="sr-only" htmlFor="bot-input">{t('placeholder')}</label>
            <input
              id="bot-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('placeholder')}
              maxLength={500}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-2xl border border-line bg-bg-secondary px-4 py-3 text-[16px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary sm:text-sm"
            />
            <button
              type="submit"
              disabled={typing || !draft.trim()}
              aria-label={t('send')}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-strong text-snow transition-opacity disabled:opacity-50"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
          <a
            href={whatsappUrl(t('humanMessage'))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-[13px] font-semibold text-accent-ink hover:underline"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t('human')}
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
        <span className="bot-ring" aria-hidden="true" />
        {!open && <span className="bot-wave" aria-hidden="true" />}
        <span className="bot-core">{open ? <X size={24} className="text-snow" aria-hidden="true" /> : <RobotHead />}</span>
        {!open && (teaser || unread) && <span className="bot-badge">1</span>}
      </button>
    </div>
    </>
  )
}
