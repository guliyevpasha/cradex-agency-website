/**
 * 3D hero visuals for the mobile app, SEO & GEO and technical service pages
 * (pricing and service pages): two phones, a search results window with an
 * AI answer, and a site health monitor. Pure CSS motion ("ads-*" / "hm-*" in
 * app/globals.css), theme tokens only, hidden from screen readers.
 * Labels: site.heroMocks.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { Bell, Check, Home, LayoutGrid, Lock, Search, ShieldCheck, ShoppingBag, Sparkles, Star, User, DatabaseBackup, Gauge } from 'lucide-react'
import { siAppstore, siGoogleplay, type SimpleIcon } from 'simple-icons'
import { cn } from '@/lib/utils/cn'

function Brand({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={icon.path} />
    </svg>
  )
}

/** Screen bezel shared by the browser and monitor mockups. */
function Monitor({ children, bar }: { children: React.ReactNode; bar?: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="rounded-[22px] border-[8px] border-ink bg-ink shadow-float sm:rounded-[28px] sm:border-[12px]">
        <div className="overflow-hidden rounded-[12px] bg-bg-primary sm:rounded-[16px]">
          <div className="flex items-center gap-3 border-b border-line px-3 py-2.5 sm:px-4">
            <span className="flex gap-1.5">
              {[0, 1, 2].map((d) => (
                <i key={d} className="h-2 w-2 rounded-full bg-line" />
              ))}
            </span>
            {bar}
          </div>
          {children}
        </div>
      </div>
      <div className="mx-auto h-3 w-[28%] rounded-b-md bg-ink" />
      <div className="mx-auto h-1.5 w-[44%] rounded-full bg-ink/80" />
    </div>
  )
}

/* ---------- Mobile app: an iOS phone in front, an Android phone behind ---------- */

export function MobileHero() {
  const t = useTranslations('site.heroMocks.mobile')
  const orders = t.raw('orders') as string[]
  const tabs = t.raw('tabs') as string[]
  const TabIcons = [Home, LayoutGrid, ShoppingBag, User]

  return (
    <div className="relative mx-auto flex h-[440px] w-full max-w-[560px] items-center justify-center sm:h-[500px]" aria-hidden="true">
      {/* back phone (Android): catalogue grid */}
      <div className="absolute left-[6%] top-[8%] w-[46%] max-w-[220px] [transform:rotate(-8deg)] sm:left-[10%]">
        <div className="hm-float-slow rounded-[30px] border-[6px] border-ink bg-bg-secondary p-2.5 shadow-float dark:border-[#2A303A]">
          <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-ink/70 dark:bg-snow/40" />
          <p className="mt-2 px-1 text-xs font-bold text-text-primary">{t('catalog')}</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <span key={k} className="ads-rise rounded-xl bg-bg-primary p-1.5" style={{ animationDelay: `${200 + k * 80}ms` }}>
                <span className={cn('block aspect-square rounded-lg', k % 3 === 0 ? 'bg-brand-strong/80' : 'bg-accent-primary/25')} />
                <span className="mt-1.5 block h-1.5 w-3/4 rounded bg-text-primary/20" />
                <span className="mt-1 block h-1.5 w-1/2 rounded bg-accent-primary/50" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* front phone (iOS): orders */}
      <div className="absolute right-[6%] top-[4%] w-[52%] max-w-[250px] [transform:rotate(5deg)] sm:right-[12%]">
        <div className="hm-float rounded-[36px] border-[7px] border-ink bg-bg-primary p-3 shadow-float dark:border-[#2A303A]">
          <span className="mx-auto block h-4 w-16 rounded-full bg-ink dark:bg-[#2A303A]" />
          <p className="mt-3 text-[13px] font-bold text-text-primary">{t('greeting')}</p>
          <div className="mt-2 rounded-2xl bg-brand-strong p-3 text-snow">
            <p className="text-[10px] font-semibold text-snow/75">{t('summary')}</p>
            <p className="mt-0.5 text-xl font-extrabold tabular-nums">128</p>
            <div className="mt-2 flex h-8 items-end gap-1">
              {[40, 55, 35, 70, 60, 85, 100].map((h, i) => (
                <span key={i} className="ads-bar flex-1 rounded-t bg-snow/70" style={{ ['--h' as string]: `${h}%`, animationDelay: `${400 + i * 80}ms` }} />
              ))}
            </div>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {orders.map((o, i) => (
              <li key={o} className="ads-rise flex items-center gap-2 rounded-xl bg-bg-secondary px-2 py-1.5" style={{ animationDelay: `${600 + i * 110}ms` }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent-primary/15 text-accent-ink">
                  <ShoppingBag size={12} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[10.5px] font-semibold text-text-primary">{o}</span>
                <span className={cn('rounded-full px-1.5 py-0.5 text-[8.5px] font-bold', i === 0 ? 'bg-accent-primary/10 text-accent-ink' : 'bg-line text-text-muted')}>
                  {i === 0 ? t('onWay') : t('delivered')}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2.5 grid grid-cols-4 border-t border-line pt-2">
            {tabs.map((tab, i) => {
              const Icon = TabIcons[i]
              return (
                <span key={tab} className={cn('flex flex-col items-center gap-0.5 text-[8px] font-semibold', i === 0 ? 'text-accent-ink' : 'text-text-muted')}>
                  <Icon size={13} />
                  {tab}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* push notification */}
      <div className="absolute left-1/2 top-[2%] w-[64%] max-w-[300px] -translate-x-1/2">
        <div className="hm-push flex items-center gap-2.5 rounded-2xl border border-line bg-bg-primary/95 p-2.5 shadow-float backdrop-blur">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-strong text-snow">
            <Bell size={15} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-bold text-text-primary">{t('push')}</span>
            <span className="block truncate text-[10px] text-text-muted">{t('pushText')}</span>
          </span>
        </div>
      </div>

      {/* store badges */}
      <div className="absolute bottom-[3%] left-1/2 flex -translate-x-1/2 gap-2">
        {[
          { icon: siAppstore, name: 'App Store' },
          { icon: siGoogleplay, name: 'Google Play' },
        ].map((s, i) => (
          <span key={s.name} className="hm-float flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-snow shadow-card dark:bg-snow dark:text-ink" style={{ animationDelay: `${i * 600}ms` }}>
            <Brand icon={s.icon} className="h-4 w-4" />
            <span className="whitespace-nowrap text-[11px] font-bold">{s.name}</span>
          </span>
        ))}
        <span className="hm-float hidden items-center gap-1 rounded-xl border border-line bg-bg-primary px-3 py-2 text-[11px] font-bold text-text-primary shadow-card sm:flex" style={{ animationDelay: '1200ms' }}>
          <Star size={13} className="fill-[#F5B301] text-[#F5B301]" />
          4.9
        </span>
      </div>
    </div>
  )
}

/* ---------- SEO & GEO: search results with an AI answer ---------- */

export function SeoHero() {
  const t = useTranslations('site.heroMocks.seo')
  const site = t('site')

  return (
    <div className="relative" aria-hidden="true">
      <Monitor
        bar={
          <span className="ml-1 flex min-w-0 flex-1 items-center gap-2 rounded-full bg-bg-secondary px-3 py-1.5 text-[11px] text-text-secondary">
            <Search size={12} className="shrink-0 text-text-muted" />
            <span className="hm-type truncate">{t('query')}</span>
          </span>
        }
      >
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 p-3 sm:p-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          {/* results */}
          <ul className="space-y-2">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className={cn('ads-rise rounded-xl border p-2.5', i === 0 ? 'border-brand-strong bg-accent-primary/5' : 'border-line bg-bg-secondary')}
                style={{ animationDelay: `${200 + i * 140}ms` }}
              >
                <span className="flex items-center gap-1.5">
                  <span className={cn('flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-extrabold', i === 0 ? 'bg-brand-strong text-snow' : 'bg-line text-text-muted')}>{i + 1}</span>
                  <span className={cn('truncate text-[10px]', i === 0 ? 'font-semibold text-accent-ink' : 'text-text-muted')}>{i === 0 ? site : '••••••.az'}</span>
                </span>
                {i === 0 ? (
                  <p className="mt-1 line-clamp-2 text-[12px] font-bold leading-snug text-text-primary">{t('resultTitle')}</p>
                ) : (
                  <span className="mt-1.5 block h-2 w-4/5 rounded bg-text-primary/15" />
                )}
                <span className="mt-1.5 block h-1.5 w-full rounded bg-text-primary/10" />
                <span className="mt-1 block h-1.5 w-2/3 rounded bg-text-primary/10" />
              </li>
            ))}
          </ul>

          {/* AI answer + metrics */}
          <div className="space-y-2">
            <div className="ads-rise rounded-xl border border-line bg-bg-secondary p-2.5" style={{ animationDelay: '500ms' }}>
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-accent-ink">
                <Sparkles size={12} />
                {t('aiLabel')}
              </p>
              <span className="mt-2 block h-1.5 w-full rounded bg-text-primary/15" />
              <span className="mt-1 block h-1.5 w-11/12 rounded bg-text-primary/15" />
              <span className="mt-1 block h-1.5 w-3/4 rounded bg-text-primary/15" />
              <span className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full bg-brand-strong px-2 py-0.5 text-[9px] font-bold text-snow">
                {t('aiSource')}: <span className="truncate">{site}</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-line bg-bg-secondary p-2.5">
                <p className="truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted">{t('position')}</p>
                <p className="mt-0.5 text-xl font-extrabold text-text-primary">#1</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-bg-secondary p-2.5">
                <span className="hm-ring relative h-9 w-9 shrink-0 rounded-full" style={{ ['--p' as string]: '96' }}>
                  <span className="absolute inset-[3px] flex items-center justify-center rounded-full bg-bg-secondary text-[10px] font-extrabold text-text-primary">96</span>
                </span>
                <p className="truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted">{t('speed')}</p>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-bg-secondary p-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted">{t('traffic')}</p>
              <div className="mt-2 flex h-12 items-end gap-1">
                {[20, 28, 26, 38, 45, 52, 64, 78, 100].map((h, i) => (
                  <span key={i} className={cn('ads-bar flex-1 rounded-t', i === 8 ? 'bg-brand-strong' : 'bg-accent-primary/35')} style={{ ['--h' as string]: `${h}%`, animationDelay: `${600 + i * 70}ms` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Monitor>
    </div>
  )
}

/* ---------- Technical service: site health monitor ---------- */

export function SupportHero() {
  const t = useTranslations('site.heroMocks.support')
  const log = t.raw('log') as string[]
  const ago = t.raw('ago') as string[]
  // 30 days of uptime; one short dip keeps it believable.
  const days = Array.from({ length: 30 }, (_, i) => (i === 17 ? 'dip' : 'ok'))

  const cards = [
    { icon: DatabaseBackup, label: t('backup'), value: t('backupValue') },
    { icon: Lock, label: t('ssl'), value: t('sslValue') },
    { icon: ShieldCheck, label: t('security'), value: t('securityValue') },
  ]

  return (
    <div className="relative" aria-hidden="true">
      <Monitor
        bar={
          <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#16A34A]/10 px-3 py-1 text-[11px] font-bold text-[#15803D] dark:text-[#4ADE80]">
            <span className="hm-pulse h-2 w-2 rounded-full bg-[#22C55E]" />
            {t('status')}
          </span>
        }
      >
        <div className="space-y-3 p-3 sm:p-4">
          {/* uptime */}
          <div className="rounded-xl border border-line bg-bg-secondary p-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-muted">{t('uptime')}</p>
              <p className="text-lg font-extrabold tabular-nums text-text-primary">99,9%</p>
            </div>
            <div className="mt-2 flex h-7 items-end gap-[3px]">
              {days.map((d, i) => (
                <span
                  key={i}
                  className={cn('ads-bar flex-1 rounded-sm', d === 'dip' ? 'bg-[#F59E0B]' : 'bg-[#22C55E]')}
                  style={{ ['--h' as string]: d === 'dip' ? '55%' : '100%', animationDelay: `${i * 25}ms` }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <ul className="space-y-2">
              {cards.map((c, i) => (
                <li key={c.label} className="ads-rise flex items-center gap-2.5 rounded-xl border border-line bg-bg-secondary p-2.5" style={{ animationDelay: `${300 + i * 120}ms` }}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10 text-accent-ink">
                    <c.icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-bold text-text-primary">{c.label}</span>
                    <span className="block truncate text-[10px] text-text-muted">{c.value}</span>
                  </span>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-snow">
                    <Check size={11} strokeWidth={3} />
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-bg-secondary p-2.5">
                <span className="hm-ring relative h-12 w-12 shrink-0 rounded-full" style={{ ['--p' as string]: '96' }}>
                  <span className="absolute inset-[4px] flex items-center justify-center rounded-full bg-bg-secondary text-[12px] font-extrabold text-text-primary">96</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                  <Gauge size={12} />
                  {t('speed')}
                </span>
              </div>
              <ul className="space-y-1.5 rounded-xl border border-line bg-bg-secondary p-2.5">
                {log.map((l, i) => (
                  <li key={l} className="ads-rise flex items-center gap-2 text-[10px]" style={{ animationDelay: `${700 + i * 120}ms` }}>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-strong" />
                    <span className="min-w-0 flex-1 truncate font-semibold text-text-primary">{l}</span>
                    <span className="shrink-0 text-text-muted">{ago[i]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Monitor>
    </div>
  )
}

export const HERO_MOCKS = { mobile: MobileHero, seo: SeoHero, support: SupportHero } as const
