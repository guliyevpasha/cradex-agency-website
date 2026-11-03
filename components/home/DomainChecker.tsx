'use client'
/**
 * Free domain availability tool (uses /api/check-domain).
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/site/navigation'

type Status = 'available' | 'taken' | 'unknown'
type Result = { domain: string; status: Status }

const LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export function DomainChecker() {
  const t = useTranslations('site.domain')
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Result[] | null>(null)

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
    try {
      const res = await fetch(`/api/check-domain?name=${encodeURIComponent(label)}`)
      if (res.status === 429) throw new Error('limited')
      if (!res.ok) throw new Error(res.status === 400 ? 'invalid' : 'error')
      const data = await res.json()
      setResults(data.results)
    } catch (err) {
      const kind = err instanceof Error ? err.message : 'error'
      setError(kind === 'limited' ? t('limited') : kind === 'invalid' ? t('invalid') : t('error'))
      setResults(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-4xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#16A34A]/10 px-3.5 py-1.5 text-[13px] font-semibold text-[#15803D] dark:text-[#4ADE80]">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {t('badge')}
      </span>
      <h3 className="mt-5 text-display-md font-extrabold tracking-tight text-text-primary">{t('title')}</h3>
      <p className="mx-auto mt-3 max-w-xl text-text-secondary">{t('text')}</p>

      <div className="mt-8 rounded-3xl border border-line bg-bg-primary p-6 text-left shadow-card sm:p-8">
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
              className="h-14 w-full rounded-2xl border border-line bg-bg-secondary pl-11 pr-4 text-[15px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="h-14 rounded-2xl bg-[#15803D] px-7 text-[15px] font-semibold text-snow transition-colors hover:bg-[#166534] disabled:opacity-60"
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
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {results.map(({ domain, status }) => (
                <li key={domain} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-secondary px-4 py-3">
                  <span className="truncate text-[15px] font-semibold text-text-primary">{domain}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        status === 'available' && 'bg-[#16A34A]/15 text-[#15803D] dark:text-[#4ADE80]',
                        status === 'taken' && 'bg-[#DC2626]/10 text-[#B91C1C] dark:text-[#F87171]',
                        status === 'unknown' && 'bg-bg-tertiary text-text-muted'
                      )}
                    >
                      {t(status)}
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
