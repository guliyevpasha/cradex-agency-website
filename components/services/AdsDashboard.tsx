/**
 * Hero visual for the digital ads page: a desktop monitor showing the
 * campaign dashboard with the five platforms, budget bars, an A/B test and a
 * weekly chart. Pure CSS motion ("ads-*" in app/globals.css) that follows the
 * theme tokens, so it reads in day and night.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { siFacebook, siGoogleads, siInstagram, siLinkedin, siTiktok, type SimpleIcon } from 'simple-icons'
import { cn } from '@/lib/utils/cn'

const PLATFORMS: { icon: SimpleIcon; name: string }[] = [
  { icon: siInstagram, name: 'Instagram' },
  { icon: siFacebook, name: 'Facebook' },
  { icon: siGoogleads, name: 'Google Ads' },
  { icon: siTiktok, name: 'TikTok Ads' },
  { icon: siLinkedin, name: 'LinkedIn Ads' },
]

// Platforms each campaign runs on (indexes into PLATFORMS).
const CAMPAIGN_PLATFORMS = [[0, 1], [2, 3], [0, 1, 4]]
const BUDGET = [58, 30, 18]

// Sample week: 1 000 leads at $0.60 each, so $600 spent (ad platforms bill in dollars).
const LEADS = 1000
const CPL_USD = 0.6
const BARS = [38, 52, 46, 64, 58, 74, 100]

function Icon({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={icon.path} />
    </svg>
  )
}

export function AdsDashboard() {
  const t = useTranslations('site.servicePage.ads.dash')
  const tabs = t.raw('tabs') as string[]
  const campaigns = t.raw('campaigns') as { t: string; s: string }[]

  return (
    <div className="ads-monitor relative mx-auto w-full max-w-[680px]" aria-hidden="true">
      {/* screen */}
      <div className="rounded-[22px] border-[8px] border-ink bg-ink shadow-float sm:rounded-[28px] sm:border-[12px]">
        <div className="overflow-hidden rounded-[12px] bg-bg-primary sm:rounded-[16px]">
          {/* window bar and tabs */}
          <div className="flex items-center gap-3 border-b border-line px-3 py-2.5 sm:px-4">
            <span className="flex gap-1.5">
              {[0, 1, 2].map((d) => (
                <i key={d} className="h-2 w-2 rounded-full bg-line" />
              ))}
            </span>
            <span className="ml-auto hidden gap-1 rounded-full bg-bg-secondary p-1 text-[11px] font-semibold text-text-muted md:flex">
              {tabs.map((tab, i) => (
                <span key={tab} className={cn('rounded-full px-3 py-1', i === 0 && 'bg-text-primary text-bg-primary')}>
                  {tab}
                </span>
              ))}
            </span>
            <span className="ml-auto rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold text-text-muted md:ml-0">{t('period')}</span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-[150px_minmax(0,1fr)]">
            {/* platform sidebar (desktop) */}
            <ul className="hidden flex-col gap-2 md:flex">
              {PLATFORMS.map((p) => (
                <li key={p.name} className="flex items-center gap-2 rounded-xl border border-line bg-bg-secondary px-2.5 py-2">
                  <Icon icon={p.icon} className="h-3.5 w-3.5 shrink-0 text-text-primary" />
                  <span className="truncate text-[11px] font-semibold text-text-secondary">{p.name}</span>
                </li>
              ))}
            </ul>

            <div className="min-w-0 space-y-3 sm:space-y-4">
              {/* metrics */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: t('leads'), value: String(LEADS).replace(/\B(?=(\d{3})+(?!\d))/g, ' '), w: 72, tone: 'bg-brand-strong' },
                  { label: t('cpl'), value: `$${CPL_USD.toFixed(2)}`, w: 46, tone: 'bg-accent-primary/60' },
                  { label: t('spent'), value: `$${String(Math.round(LEADS * CPL_USD)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`, w: 64, tone: 'bg-text-primary/70' },
                ].map((m, i) => (
                  <div key={m.label} className="ads-rise min-w-0 rounded-xl border border-line bg-bg-secondary p-2.5 sm:rounded-2xl sm:p-3" style={{ animationDelay: `${i * 120}ms` }}>
                    <p className="truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted sm:text-[10px] sm:tracking-[0.08em]">{m.label}</p>
                    <p className="mt-1 truncate text-sm font-extrabold tabular-nums text-text-primary sm:text-lg">{m.value}</p>
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
                      <span className={cn('ads-grow block h-full rounded-full', m.tone)} style={{ ['--w' as string]: `${m.w}%` }} />
                    </span>
                  </div>
                ))}
              </div>

              {/* campaigns */}
              <ul className="divide-y divide-line rounded-xl border border-line bg-bg-secondary sm:rounded-2xl">
                {campaigns.map((c, i) => (
                  <li key={c.t} className="ads-rise flex items-center gap-2 px-2.5 py-2.5 sm:gap-3 sm:px-3 sm:py-3" style={{ animationDelay: `${300 + i * 110}ms` }}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-text-primary sm:text-sm">{c.t}</p>
                      <p className="truncate text-[10px] text-text-muted sm:text-[11px]">{c.s}</p>
                    </div>
                    <span className="flex shrink-0 gap-1.5 text-text-primary">
                      {CAMPAIGN_PLATFORMS[i].map((p) => (
                        <Icon key={p} icon={PLATFORMS[p].icon} className="h-3.5 w-3.5" />
                      ))}
                    </span>
                    <span className="hidden h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-line sm:block">
                      <span className="ads-grow block h-full rounded-full bg-brand-strong" style={{ ['--w' as string]: `${BUDGET[i]}%` }} />
                    </span>
                    <span className="shrink-0 rounded-full bg-accent-primary/10 px-2 py-0.5 text-[10px] font-bold text-accent-ink">{t('active')}</span>
                  </li>
                ))}
              </ul>

              {/* platforms strip (mobile and tablet, where the sidebar is hidden) */}
              <div className="grid grid-cols-5 gap-1.5 md:hidden">
                {PLATFORMS.map((p) => (
                  <span key={p.name} className="flex min-w-0 flex-col items-center gap-1 rounded-lg border border-line bg-bg-secondary py-2">
                    <Icon icon={p.icon} className="h-3.5 w-3.5 text-text-primary" />
                    <span className="max-w-full truncate text-[8px] font-semibold text-text-muted">{p.name}</span>
                  </span>
                ))}
              </div>

              {/* A/B test and weekly chart */}
              <div className="grid grid-cols-[1fr_1.4fr] gap-2 sm:gap-3">
                <div className="rounded-xl border border-line bg-bg-secondary p-2.5 sm:rounded-2xl sm:p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted sm:text-[10px]">{t('abTest')}</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {['A', 'B'].map((v, i) => (
                      <span key={v} className={cn('rounded-lg border p-1.5', i === 1 ? 'border-brand-strong' : 'border-line')}>
                        <span className="block h-5 rounded bg-line" />
                        <span className="mt-1.5 flex items-center justify-between text-[9px] font-bold text-text-muted">
                          {v}
                          {i === 1 && <span className="text-accent-ink">{t('winner')}</span>}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-bg-secondary p-2.5 sm:rounded-2xl sm:p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted sm:text-[10px]">{t('weekly')}</p>
                  <div className="mt-2 flex h-12 items-end gap-1 sm:h-16 sm:gap-1.5">
                    {BARS.map((h, i) => (
                      <span
                        key={i}
                        className={cn('ads-bar flex-1 rounded-t-md', i === BARS.length - 1 ? 'bg-brand-strong' : 'bg-accent-primary/35')}
                        style={{ ['--h' as string]: `${h}%`, animationDelay: `${500 + i * 90}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* stand */}
      <div className="mx-auto h-3 w-[28%] rounded-b-md bg-ink" />
      <div className="mx-auto h-1.5 w-[44%] rounded-full bg-ink/80" />
    </div>
  )
}
