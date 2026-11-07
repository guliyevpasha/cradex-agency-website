'use client'
/**
 * Free domain availability tool (uses /api/check-domain).
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'

type Status = 'available' | 'taken' | 'unknown' | 'pending'
type Result = { domain: string; status: Status }

const LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export function DomainChecker() {
  const t = useTranslations('site.domain')
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Result[] | null>(null)
  const [checkedAt, setCheckedAt] = useState<Date | null>(null)
  const locale = useLocale()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const label = value.trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[/?#.]/)[0]
    if (!LABEL_RE.test(label)) {
      setError(t('invalid'))
      setResults(null)
      return
    }
    setBusy(true)
    setError(null)
    setCheckedAt(null)
    try {
      const res = await fetch(`/api/check-domain?stream=1&name=${encodeURIComponent(label)}`)
      if (res.status === 429) throw new Error('limited')
      if (!res.ok || !res.body) throw new Error(res.status === 400 ? 'invalid' : 'error')
      // One JSON line per domain, in the order the registries answer.
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += value
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.trim()) continue
          const msg = JSON.parse(line)
          if (Array.isArray(msg.domains)) {
            setResults(msg.domains.map((domain: string) => ({ domain, status: 'pending' as const })))
          } else if (msg.domain) {
            setResults((prev) => prev?.map((r) => (r.domain === msg.domain ? { domain: r.domain, status: msg.status } : r)) ?? null)
          }
        }
      }
      setCheckedAt(new Date())
    } catch (err) {
      const kind = err instanceof Error ? err.message : 'error'
      setError(kind === 'limited' ? t('limited') : kind === 'invalid' ? t('invalid') : t('error'))
      setResults(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative left-1/2 mt-20 w-screen max-w-[1680px] -translate-x-1/2 px-4 text-center sm:px-6 lg:px-12">
      <span className="inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-3.5 py-1.5 text-[13px] font-semibold text-accent-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {t('badge')}
      </span>
      <AnimatedHeading as="h3" className="mt-5 text-display-md font-extrabold tracking-tight text-text-primary" text={t('title')} />
      <p className="mx-auto mt-3 max-w-xl text-text-secondary">{t('text')}</p>

      <div className="mt-10 rounded-[32px] border border-line bg-bg-secondary p-6 text-left shadow-card sm:p-10 lg:p-12">
        <h4 className="text-xl font-bold text-text-primary">{t('formTitle')}</h4>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{t('formText')}</p>

        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row" noValidate>
          <label htmlFor="domain-query" className="sr-only">
            {t('label')}
          </label>
          <div className="relative flex-1">
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="domain-query"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              maxLength={253}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('placeholder')}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'domain-error' : undefined}
              className="h-14 w-full rounded-2xl border border-line bg-bg-primary pl-11 pr-4 text-[15px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="h-14 rounded-2xl bg-brand-strong px-8 text-[15px] font-semibold text-snow shadow-brand transition-colors hover:bg-[#0967B5] disabled:opacity-60"
          >
            {busy ? t('checking') : t('button')}
          </button>
        </form>

        <p aria-live="polite" className="min-h-0">
          {error && (
            <span id="domain-error" className="mt-3 block text-sm font-medium text-[#DC2626]">
              {error}
            </span>
          )}
        </p>

        {results && (
          <>
            <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-text-secondary" aria-live="polite">
              <span className={cn('h-2 w-2 rounded-full bg-[#16A34A]', busy && 'animate-pulse')} aria-hidden="true" />
              {busy || !checkedAt
                ? t('live')
                : t('checkedAt', { time: new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(checkedAt) })}
            </p>
            <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ domain, status }) => (
                <li key={domain} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-xl border border-line bg-bg-primary px-4 py-3">
                  <span className="min-w-0 break-all text-[15px] font-semibold text-text-primary">{domain}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        status === 'available' && 'bg-[#16A34A]/15 text-[#15803D] dark:text-[#4ADE80]',
                        status === 'taken' && 'bg-[#DC2626]/10 text-[#B91C1C] dark:text-[#F87171]',
                        status === 'unknown' && 'bg-bg-tertiary text-text-muted',
                        status === 'pending' && 'animate-pulse bg-bg-tertiary text-text-muted'
                      )}
                    >
                      {status === 'pending' ? t('checking') : t(status)}
                    </span>
                    {status === 'available' && (
                      <a
                        href={whatsappUrl(t('registerMessage', { domain }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-accent-ink hover:underline"
                      >
                        {t('register')}
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-text-muted">{t('note')}</p>
          </>
        )}
      </div>
    </div>
  )
}
