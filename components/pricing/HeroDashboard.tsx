/**
 * Pricing hero visual: a small website dashboard that comes alive (numbers
 * count up, the traffic line draws itself, a new lead pops in). CSS only,
 * so it costs no JavaScript. Styles: ".hd-*" in app/globals.css.
 * The figures are an illustration, not client data.
 * @author Paşa Quliyev — Cradex Agency
 */
import { getTranslations } from 'next-intl/server'
import { BarChart3, Bell, Globe, LayoutDashboard, Settings, Users } from 'lucide-react'
import { Tilt } from '@/components/ui/Tilt'

const KPIS = [
  { key: 'visitors', value: 12480, trend: '+18%' },
  { key: 'leads', value: 342, trend: '+24%' },
  { key: 'speed', value: 98, trend: '/100' },
] as const

const SOURCES = [
  { key: 'google', share: 54 },
  { key: 'social', share: 31 },
  { key: 'direct', share: 15 },
] as const

// 30-day visits, hand-drawn to look like real traffic (dips at weekends).
const LINE = 'M0 92 C20 88 30 70 50 74 S80 60 100 64 S130 40 150 48 S180 58 200 44 S230 22 250 30 S280 18 300 12'

export async function HeroDashboard({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'site.pricingPage.dash' })

  return (
    <Tilt max={8}>
      <div className="hd relative" aria-hidden="true">
        <div className="hd-window tilt-z1 overflow-hidden rounded-[28px] border border-line bg-bg-primary shadow-float">
          {/* browser bar */}
          <div className="flex items-center gap-3 border-b border-line bg-bg-secondary px-4 py-3">
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-bg-primary px-3 py-1 text-[12px] text-text-muted">
              <Globe size={12} />
              <span className="truncate">{t('site')}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 pr-1 text-[11px] font-bold text-[#16A34A] dark:text-[#4ADE80]">
              <i className="hd-live h-2 w-2 rounded-full bg-[#22C55E]" />
              {t('live')}
            </span>
          </div>

          <div className="flex">
            {/* side menu */}
            <div className="flex flex-col items-center gap-3 border-r border-line px-3 py-4">
              {[LayoutDashboard, BarChart3, Users, Settings].map((Icon, i) => (
                <span
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${i === 0 ? 'bg-brand-strong text-snow' : 'text-text-muted'}`}
                >
                  <Icon size={15} />
                </span>
              ))}
            </div>

            <div className="min-w-0 flex-1 p-4">
              <p className="text-[13px] font-bold text-text-primary">{t('title')}</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {KPIS.map((k, i) => (
                  <div key={k.key} className="rounded-2xl border border-line bg-bg-secondary p-2.5">
                    <p className="truncate text-[10px] text-text-muted">{t(k.key)}</p>
                    <p className="mt-0.5 text-[17px] font-extrabold leading-tight text-text-primary tabular-nums">
                      <span className="hd-count" style={{ '--to': k.value, animationDelay: `${i * 150}ms` } as React.CSSProperties} />
                    </p>
                    <p className="text-[10px] font-bold text-[#16A34A]">{k.trend}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl border border-line bg-bg-secondary p-3">
                <p className="text-[10px] font-semibold text-text-muted">{t('chart')}</p>
                <svg viewBox="0 0 300 100" className="mt-1 h-20 w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hd-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#24A0FF" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#24A0FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[25, 50, 75].map((y) => (
                    <line key={y} x1="0" x2="300" y1={y} y2={y} className="stroke-line" strokeWidth="1" strokeDasharray="3 5" />
                  ))}
                  <path className="hd-area" d={`${LINE} L300 100 L0 100 Z`} fill="url(#hd-fill)" />
                  <path className="hd-line" d={LINE} fill="none" stroke="#24A0FF" strokeWidth="3" strokeLinecap="round" pathLength={1} />
                  <circle className="hd-dot" cx="300" cy="12" r="5" fill="#0A74CC" />
                </svg>
              </div>

              <div className="mt-3 rounded-2xl border border-line bg-bg-secondary p-3">
                <p className="text-[10px] font-semibold text-text-muted">{t('sources')}</p>
                <div className="mt-2 space-y-1.5">
                  {SOURCES.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-2 text-[10px]">
                      <span className="w-16 shrink-0 truncate text-text-secondary">{t(s.key)}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                        <i
                          className="hd-bar block h-full rounded-full bg-brand-strong"
                          style={{ width: `${s.share}%`, animationDelay: `${600 + i * 150}ms` }}
                        />
                      </span>
                      <span className="w-7 text-right font-bold text-text-primary tabular-nums">{s.share}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* new lead notification floating above the window */}
        <div className="hd-toast tilt-z3 absolute -right-3 top-[42%] flex w-56 items-center gap-3 rounded-2xl bg-ink p-3 text-snow shadow-float sm:-right-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-strong">
            <Bell size={16} />
          </span>
          <span className="min-w-0">
            <span className="block text-[12px] font-bold">{t('toastTitle')}</span>
            <span className="block truncate text-[11px] text-snow/70">{t('toastText')}</span>
          </span>
        </div>

        <div className="hd-chip tilt-z2 absolute -bottom-4 left-6 flex items-center gap-2 rounded-full border border-line bg-bg-primary px-3.5 py-2 text-[12px] font-bold text-text-primary shadow-card">
          <i className="hd-live h-2 w-2 rounded-full bg-[#22C55E]" />
          {t('uptime')} · 99.9%
        </div>
      </div>
    </Tilt>
  )
}
