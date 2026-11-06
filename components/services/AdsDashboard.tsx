/**
 * Hero visual for the digital ads page: a 3D campaign panel with the five
 * platforms, budget bars and an A/B test. Pure CSS motion ("ads-*" in
 * app/globals.css), follows the theme tokens so it reads in day and night.
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

// Which platforms each campaign runs on (indexes into PLATFORMS).
const CAMPAIGN_PLATFORMS = [[0, 1], [2, 3], [0, 1, 4]]
const BARS = [38, 52, 46, 64, 58, 74, 100]
const BUDGET = [58, 30, 18]

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
    <div className="ads-panel relative w-[88%] max-w-[560px] rounded-[26px] border border-line bg-bg-primary p-4 text-left shadow-float sm:p-5" aria-hidden="true">
      {/* window chrome and tabs */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((d) => (
            <i key={d} className="h-2 w-2 rounded-full bg-line" />
          ))}
        </span>
        <span className="hidden gap-1 rounded-full bg-bg-secondary p-1 text-[11px] font-semibold text-text-muted sm:flex">
          {tabs.map((tab, i) => (
            <span key={tab} className={cn('rounded-full px-2.5 py-1', i === 0 && 'bg-text-primary text-bg-primary')}>
              {tab}
            </span>
          ))}
        </span>
        <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold text-text-muted">{t('period')}</span>
      </div>

      {/* metrics */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[
          { label: t('leads'), value: '248', w: 72, tone: 'bg-brand-strong' },
          { label: t('cpl'), value: '4,2 ₼', w: 46, tone: 'bg-accent-primary/60' },
          { label: t('spent'), value: '1 240 ₼', w: 64, tone: 'bg-text-primary/70' },
        ].map((m, i) => (
          <div key={m.label} className="ads-rise rounded-2xl border border-line bg-bg-secondary p-3" style={{ animationDelay: `${i * 120}ms` }}>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">{m.label}</p>
            <p className="mt-1 text-base font-extrabold tabular-nums text-text-primary sm:text-lg">{m.value}</p>
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
              <span className={cn('ads-grow block h-full rounded-full', m.tone)} style={{ ['--w' as string]: `${m.w}%` }} />
            </span>
          </div>
        ))}
      </div>

      {/* campaigns */}
      <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-bg-secondary">
        {campaigns.map((c, i) => (
          <li key={c.t} className="ads-rise flex items-center gap-3 px-3 py-3" style={{ animationDelay: `${300 + i * 110}ms` }}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-text-primary">{c.t}</p>
              <p className="truncate text-[11px] text-text-muted">{c.s}</p>
            </div>
            <span className="flex gap-1.5 text-text-primary">
              {CAMPAIGN_PLATFORMS[i].map((p) => (
                <Icon key={p} icon={PLATFORMS[p].icon} className="h-3.5 w-3.5" />
              ))}
            </span>
            <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-line sm:block">
              <span className="ads-grow block h-full rounded-full bg-brand-strong" style={{ ['--w' as string]: `${BUDGET[i]}%` }} />
            </span>
            <span className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-[10px] font-bold text-accent-ink">{t('active')}</span>
          </li>
        ))}
      </ul>

      {/* platforms */}
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {PLATFORMS.map((p) => (
          <span key={p.name} className="flex flex-col items-center gap-1 rounded-xl border border-line bg-bg-secondary py-2">
            <Icon icon={p.icon} className="h-4 w-4 text-text-primary" />
            <span className="max-w-full truncate text-[9px] font-semibold text-text-muted">{p.name}</span>
          </span>
        ))}
      </div>

      {/* A/B test and weekly bars */}
      <div className="mt-4 grid grid-cols-[1fr_1.3fr] gap-2.5">
        <div className="rounded-2xl border border-line bg-bg-secondary p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">{t('abTest')}</p>
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
        <div className="rounded-2xl border border-line bg-bg-secondary p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">{t('weekly')}</p>
          <div className="mt-2 flex h-14 items-end gap-1.5">
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
  )
}
