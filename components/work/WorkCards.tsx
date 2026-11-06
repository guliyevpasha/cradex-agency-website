/**
 * Case cards for the work category pages: ad campaigns, mobile apps, SEO /
 * GEO and technical service. Bars and lines grow when the card scrolls in
 * (".wk-*" in globals.css, keyed on Reveal's "rv-in").
 * @author Paşa Quliyev — Cradex Agency
 */
import { siGoogleads, siLinkedin, siMeta, siTiktok, type SimpleIcon } from 'simple-icons'
import {
  Bell, CalendarDays, CheckCircle2, Dumbbell, Fingerprint, Gauge, Heart, KeyRound, Link2, LockOpen, MapPin, Megaphone,
  Network, ShieldCheck, ShoppingBag, Unlock, UserX, Wrench,
} from 'lucide-react'
import type { AdPlatform } from '@/lib/site/work'
import type { WorkCase } from '@/lib/data/work'
import { cn } from '@/lib/utils/cn'

export const PLATFORMS: Record<AdPlatform, { name: string; icon: SimpleIcon; color: string }> = {
  meta: { name: 'Meta Ads', icon: siMeta, color: '#0467DF' },
  tiktok: { name: 'TikTok Ads', icon: siTiktok, color: '#FE2C55' },
  google: { name: 'Google Ads', icon: siGoogleads, color: '#4285F4' },
  linkedin: { name: 'LinkedIn Ads', icon: siLinkedin, color: '#0A66C2' },
}

export function BrandIcon({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={icon.path} />
    </svg>
  )
}

export function SampleBadge({ label }: { label: string }) {
  return <span className="rounded-full border border-line bg-bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{label}</span>
}

const CARD = 'svc relative h-full rounded-[28px] border border-line bg-bg-secondary p-5 shadow-card sm:p-6'

/* ---------- Ads ---------- */

export function AdCaseCard({ c, sample }: { c: WorkCase; sample: string }) {
  const p = PLATFORMS[c.platform ?? 'meta']
  const bars = c.chart
  const last = c.metrics.length - 1
  return (
    <article className={CARD}>
      <span className="tilt-glare" />
      <div className="tilt-z1 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-snow" style={{ background: p.color }}>
            <BrandIcon icon={p.icon} className="h-[17px] w-[17px]" />
          </span>
          {p.name}
        </span>
        {c.sample && <SampleBadge label={sample} />}
      </div>
      <h3 className="tilt-z1 mt-5 text-xl font-bold leading-snug text-text-primary">{c.sector}</h3>
      <p className="tilt-z1 mt-1 text-sm text-text-muted">
        {[c.goal, c.period].filter(Boolean).join(' · ')}
      </p>

      <div className="tilt-z2 mt-5 rounded-2xl border border-line bg-bg-primary p-4 shadow-card">
        <dl className="grid grid-cols-3 gap-2">
          {c.metrics.map((m, i) => (
            <div key={i} className={cn('rounded-xl px-2.5 py-2', i === last ? 'bg-brand-strong text-snow' : 'bg-bg-secondary')}>
              <dt className={cn('line-clamp-2 min-h-[2.5em] text-[11px] font-semibold leading-tight', i === last ? 'text-snow/80' : 'text-text-muted')}>{m.label}</dt>
              <dd className={cn('mt-0.5 text-[17px] font-extrabold tracking-tight tabular-nums', i !== last && 'text-text-primary')}>{m.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex h-20 items-end gap-1.5" aria-hidden="true">
          {bars.map((h, i) => (
            <span
              key={i}
              className="wk-bar flex-1 rounded-t-md"
              style={{
                ['--h' as string]: `${h}%`,
                transitionDelay: `${200 + i * 70}ms`,
                background: i === bars.length - 1 ? p.color : 'rgb(var(--accent-primary) / 0.28)',
              }}
            />
          ))}
        </div>
      </div>
      <p className="tilt-z1 mt-4 text-[15px] leading-relaxed text-text-secondary">{c.text}</p>
    </article>
  )
}

/* ---------- Mobile apps ---------- */

function AppScreen({ kind }: { kind?: string }) {
  if (kind === 'delivery') {
    return (
      <span className="relative block h-full w-full overflow-hidden bg-[#E8F2FC] dark:bg-[#132233]">
        <svg viewBox="0 0 100 170" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path d="M0 40 H100 M0 95 H100 M30 0 V170 M72 0 V170" stroke="rgb(36 160 255 / 0.18)" strokeWidth="6" />
          <path className="wk-route" d="M18 140 C 30 110, 60 120, 66 92 S 80 50, 84 30" fill="none" stroke="#24A0FF" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <MapPin className="absolute right-[10%] top-[12%] h-5 w-5 text-[#0A74CC]" />
        <span className="wk-courier absolute h-3 w-3 rounded-full border-2 border-snow bg-[#0A74CC] shadow" />
        <span className="absolute inset-x-2 bottom-2 rounded-xl bg-bg-primary p-2 shadow-card">
          <i className="block h-1.5 w-2/3 rounded bg-text-primary/60" />
          <i className="mt-1.5 block h-1.5 w-1/3 rounded bg-text-primary/20" />
        </span>
      </span>
    )
  }
  if (kind === 'booking') {
    return (
      <span className="block h-full w-full bg-bg-primary p-2.5">
        <span className="flex items-center gap-1.5 text-accent-ink">
          <CalendarDays className="h-3.5 w-3.5" />
          <i className="h-1.5 w-12 rounded bg-text-primary/40" />
        </span>
        <span className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 21 }).map((_, i) => (
            <i key={i} className={cn('aspect-square rounded-[4px]', i === 10 ? 'bg-brand-strong' : 'bg-bg-secondary')} />
          ))}
        </span>
        <span className="mt-2.5 grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((k) => (
            <i key={k} className={cn('h-5 rounded-md border', k === 1 ? 'border-transparent bg-brand-strong' : 'border-line')} />
          ))}
        </span>
        <span className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-bg-secondary p-1.5">
          <Bell className="h-3 w-3 text-accent-ink" />
          <i className="h-1.5 w-14 rounded bg-text-primary/30" />
        </span>
      </span>
    )
  }
  if (kind === 'shop') {
    return (
      <span className="block h-full w-full bg-bg-primary p-2.5">
        <span className="flex items-center justify-between">
          <i className="h-1.5 w-12 rounded bg-text-primary/50" />
          <span className="relative text-accent-ink">
            <ShoppingBag className="h-4 w-4" />
            <b className="absolute -right-1.5 -top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#FE2C55] text-[7px] text-snow">2</b>
          </span>
        </span>
        <span className="mt-2 grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="rounded-lg bg-bg-secondary p-1">
              <i className={cn('block aspect-square rounded-md', k % 3 === 0 ? 'bg-accent-primary/35' : 'bg-accent-primary/15')} />
              <span className="mt-1 flex items-center justify-between">
                <i className="h-1 w-6 rounded bg-text-primary/30" />
                <Heart className={cn('h-2.5 w-2.5', k === 0 ? 'fill-[#FE2C55] text-[#FE2C55]' : 'text-text-muted')} />
              </span>
            </span>
          ))}
        </span>
      </span>
    )
  }
  return (
    <span className="flex h-full w-full flex-col items-center bg-bg-primary p-2.5">
      <span className="flex w-full items-center gap-1.5 text-accent-ink">
        <Dumbbell className="h-3.5 w-3.5" />
        <i className="h-1.5 w-12 rounded bg-text-primary/40" />
      </span>
      <span className="hm-ring mt-3 flex h-16 w-16 items-center justify-center rounded-full" style={{ ['--p' as string]: 72 }}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-primary text-[11px] font-extrabold text-text-primary">72%</span>
      </span>
      <span className="mt-3 flex h-10 w-full items-end gap-1">
        {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
          <i key={i} className="wk-bar flex-1 rounded-t-sm bg-brand-strong/70" style={{ ['--h' as string]: `${h}%`, transitionDelay: `${300 + i * 60}ms` }} />
        ))}
      </span>
    </span>
  )
}

export function MobileCaseCard({ c, sample }: { c: WorkCase; sample: string }) {
  return (
    <article className={cn(CARD, 'grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 sm:gap-7')}>
      <span className="tilt-glare" />
      <span className="wk-phone tilt-z3 block w-[118px] sm:w-[140px]" aria-hidden="true">
        <span className="block aspect-[9/19] overflow-hidden rounded-[26px] border-[5px] border-ink bg-ink shadow-float dark:border-[#2A303A]">
          <span className="relative block h-full w-full overflow-hidden rounded-[20px]">
            <span className="absolute left-1/2 top-1 z-10 h-2.5 w-10 -translate-x-1/2 rounded-full bg-ink" />
            <AppScreen kind={c.kind} />
          </span>
        </span>
      </span>
      <div className="tilt-z1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent-ink">{c.sector}</span>
          {c.sample && <SampleBadge label={sample} />}
        </div>
        <h3 className="mt-2 text-xl font-bold leading-snug text-text-primary sm:text-2xl">{c.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{c.text}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {c.features.map((f) => (
            <li key={f} className="rounded-full bg-bg-primary px-3 py-1.5 text-[12px] font-semibold text-text-primary">{f}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/* ---------- SEO / GEO ---------- */

export function SeoCaseCard({ c, sample, id }: { c: WorkCase; sample: string; id: string }) {
  const line = c.chart
  // 300×100 box, line kept 8px clear of the edges so the end dot never clips
  const y = (v: number) => 92 - v * 0.84
  const pts = line.map((v, i) => `${(i / (line.length - 1)) * 292 + 4},${y(v)}`)
  const path = `M${pts.join(' L')}`
  return (
    <article className={CARD}>
      <span className="tilt-glare" />
      <div className="tilt-z1 flex items-start justify-between gap-3">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent-ink">{c.goal}</span>
          <h3 className="mt-1.5 text-xl font-bold leading-snug text-text-primary">{c.sector}</h3>
          <p className="mt-1 text-sm text-text-muted">{c.period}</p>
        </div>
        {c.sample && <SampleBadge label={sample} />}
      </div>
      <div className="tilt-z2 mt-5 rounded-2xl border border-line bg-bg-primary p-4 shadow-card">
        <svg viewBox="0 0 300 100" className="block h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`wk-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#24A0FF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#24A0FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((gy) => (
            <line key={gy} x1="0" x2="300" y1={gy} y2={gy} style={{ stroke: 'rgb(var(--contrast) / 0.08)' }} />
          ))}
          <path className="wk-area" d={`${path} L296,100 L4,100 Z`} fill={`url(#wk-fill-${id})`} />
          <path className="wk-line" d={path} fill="none" stroke="#24A0FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
          <circle className="wk-dot" cx="296" cy={y(line[line.length - 1])} r="5" fill="#0A74CC" stroke="#fff" strokeWidth="2" />
        </svg>
        <dl className="mt-3 grid grid-cols-3 gap-2">
          {c.metrics.map((m, i) => (
            <div key={i} className="min-w-0">
              <dt className="line-clamp-2 min-h-[2.5em] text-[11px] font-semibold leading-tight text-text-muted">{m.label}</dt>
              <dd className={cn('mt-0.5 text-[17px] font-extrabold tracking-tight tabular-nums', i === 0 ? 'text-accent-ink' : 'text-text-primary')}>{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="tilt-z1 mt-4 text-[15px] leading-relaxed text-text-secondary">{c.text}</p>
    </article>
  )
}

/* ---------- Technical service ---------- */

// One icon per case, in the order of site.workPages.support.cases.
const SUPPORT_ICONS = [Gauge, ShieldCheck, Link2, Network, Wrench, Unlock, KeyRound, UserX, Megaphone, LockOpen, Fingerprint]

export function SupportCaseCard({ c, index, labels, sample }: { c: WorkCase; index: number; labels: { problem: string; solution: string }; sample: string }) {
  const Icon = SUPPORT_ICONS[index % SUPPORT_ICONS.length]
  return (
    <article className={CARD}>
      <span className="tilt-glare" />
      <div className="tilt-z1 flex items-center justify-between gap-3">
        <span className="svc-icon tilt-z3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-strong text-snow shadow-brand">
          <Icon size={21} aria-hidden="true" />
        </span>
        {c.sample && <SampleBadge label={sample} />}
      </div>
      <h3 className="tilt-z1 mt-5 text-lg font-bold leading-snug text-text-primary">{c.title}</h3>
      <dl className="tilt-z1 mt-4 space-y-3 text-[14.5px] leading-relaxed">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">{labels.problem}</dt>
          <dd className="mt-0.5 text-text-secondary">{c.problem}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">{labels.solution}</dt>
          <dd className="mt-0.5 text-text-secondary">{c.solution}</dd>
        </div>
      </dl>
      <p className="tilt-z2 mt-5 inline-flex items-center gap-2 rounded-full bg-[#16A34A]/12 px-3.5 py-2 text-[13.5px] font-bold text-[#15803D] dark:text-[#4ADE80]">
        <CheckCircle2 size={16} aria-hidden="true" />
        {c.result}
      </p>
    </article>
  )
}

