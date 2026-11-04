/**
 * Pricing hero visual: one website (sizinbrendiniz.az) on a desktop window,
 * a tablet and a phone, with small live stats floating around it. Everything
 * is sized in container units so the whole scene scales as one picture on
 * any screen. CSS only; styles ".hv-*" in app/globals.css.
 * The figures are an illustration, not client data.
 * @author Paşa Quliyev — Cradex Agency
 */
import { getTranslations } from 'next-intl/server'
import { Bell, Gauge, Lock, ShoppingBag, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Tilt } from '@/components/ui/Tilt'

const DOMAIN = 'sizinbrendiniz.az'

/** The same little site, drawn at three widths. */
function MiniSite({ layout }: { layout: 'desktop' | 'tablet' | 'phone' }) {
  const narrow = layout !== 'desktop'
  return (
    <div className="hv-site flex h-full flex-col bg-bg-primary">
      {/* header */}
      <div className="flex items-center justify-between border-b border-line px-[6%] py-[3.5%]">
        <span className="flex items-center gap-[0.8cqw]">
          <i className="hv-logo rounded-full bg-brand-strong" />
          <i className="h-[1cqw] w-[7cqw] rounded-full bg-text-primary/70" />
        </span>
        {narrow ? (
          <span className="flex flex-col gap-[0.5cqw]">
            <i className="h-[0.4cqw] w-[2.8cqw] rounded-full bg-text-primary/60" />
            <i className="h-[0.4cqw] w-[2.8cqw] rounded-full bg-text-primary/60" />
          </span>
        ) : (
          <span className="flex items-center gap-[1.6cqw]">
            {[0, 1, 2, 3].map((k) => (
              <i key={k} className="h-[0.7cqw] w-[4cqw] rounded-full bg-text-primary/25" />
            ))}
            <i className="h-[2.6cqw] w-[8cqw] rounded-full bg-brand-strong" />
          </span>
        )}
      </div>

      {/* hero */}
      <div className={`flex flex-1 gap-[4%] px-[6%] py-[5%] ${narrow ? 'flex-col' : 'items-center'}`}>
        <div className={narrow ? '' : 'w-[48%]'}>
          <i className="hv-chip block h-[1.6cqw] w-[38%] rounded-full bg-accent-primary/20" />
          <i className="mt-[6%] block h-[2.4cqw] w-[92%] rounded-md bg-text-primary/85" />
          <i className="mt-[4%] block h-[2.4cqw] w-[70%] rounded-md bg-text-primary/85" />
          <i className="mt-[7%] block h-[0.9cqw] w-[86%] rounded-full bg-text-primary/20" />
          <i className="mt-[3%] block h-[0.9cqw] w-[64%] rounded-full bg-text-primary/20" />
          <span className="mt-[8%] flex gap-[4%]">
            <i className="hv-cta block h-[3cqw] w-[36%] rounded-full bg-brand-strong" />
            <i className="block h-[3cqw] w-[28%] rounded-full border border-line" />
          </span>
        </div>
        <div className={`hv-photo relative overflow-hidden rounded-[1.4cqw] ${narrow ? 'mt-[6%] aspect-[16/10] w-full' : 'aspect-[4/3] flex-1'}`}>
          <i className="hv-sun absolute rounded-full" />
          <i className="hv-hill absolute inset-x-0 bottom-0" />
        </div>
      </div>

      {/* cards */}
      <div className={`grid gap-[3%] px-[6%] pb-[6%] ${narrow ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {[ShoppingBag, Sparkles, Lock].slice(0, narrow ? 2 : 3).map((Icon, k) => (
          <div key={k} className="rounded-[1cqw] border border-line bg-bg-secondary p-[6%]">
            <span className="flex h-[3cqw] w-[3cqw] items-center justify-center rounded-[0.7cqw] bg-accent-primary/15 text-accent-ink">
              <Icon className="h-[1.8cqw] w-[1.8cqw]" />
            </span>
            <i className="mt-[10%] block h-[0.8cqw] w-[80%] rounded-full bg-text-primary/45" />
            <i className="mt-[6%] block h-[0.7cqw] w-[60%] rounded-full bg-text-primary/20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export async function HeroDevices({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'site.pricingPage.dash' })

  return (
    <Tilt max={7}>
      <div className="hv" aria-hidden="true">
        {/* desktop browser window */}
        <div className="hv-desktop tilt-z1 overflow-hidden rounded-[2.2cqw] border border-line bg-bg-secondary shadow-float">
          <div className="flex items-center gap-[1.6cqw] border-b border-line px-[2.4cqw] py-[1.4cqw]">
            <span className="flex gap-[0.8cqw]">
              <i className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-[#FF5F57]" />
              <i className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-[#FEBC2E]" />
              <i className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-[#28C840]" />
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-[0.8cqw] rounded-full bg-bg-primary px-[1.6cqw] py-[0.6cqw] text-[1.9cqw] text-text-secondary">
              <Lock className="h-[1.6cqw] w-[1.6cqw] shrink-0 text-[#16A34A]" />
              <span className="truncate">{DOMAIN}</span>
            </span>
          </div>
          <div className="hv-screen">
            <MiniSite layout="desktop" />
          </div>
        </div>

        {/* tablet */}
        <div className="hv-tablet tilt-z2 overflow-hidden rounded-[2.4cqw] border-[0.9cqw] border-ink bg-ink shadow-float dark:border-[#2A303A]">
          <div className="h-full overflow-hidden rounded-[1.4cqw]">
            <MiniSite layout="tablet" />
          </div>
        </div>

        {/* phone, its page scrolls on its own */}
        <div className="hv-phone tilt-z3 overflow-hidden rounded-[3cqw] border-[0.8cqw] border-ink bg-ink shadow-float dark:border-[#2A303A]">
          <i className="absolute left-1/2 top-[1.2cqw] z-10 h-[1.1cqw] w-[6cqw] -translate-x-1/2 rounded-full bg-ink" />
          <div className="h-full overflow-hidden rounded-[2.2cqw]">
            <div className="hv-scroll">
              <MiniSite layout="phone" />
              <MiniSite layout="phone" />
            </div>
          </div>
        </div>

        {/* floating stats */}
        <div className="hv-card hv-visitors tilt-z3 rounded-[2cqw] border border-line bg-bg-primary p-[2.2cqw] shadow-float">
          <span className="flex items-center gap-[1.2cqw] text-[1.9cqw] font-semibold text-text-muted">
            <Users className="h-[2.2cqw] w-[2.2cqw] text-accent-ink" />
            {t('visitors')}
          </span>
          <span className="mt-[0.6cqw] flex items-baseline gap-[1cqw]">
            <span className="hv-count text-[3.8cqw] font-extrabold leading-none text-text-primary tabular-nums" style={{ '--to': 12480 } as React.CSSProperties} />
            <span className="text-[1.8cqw] font-bold text-[#16A34A] dark:text-[#4ADE80]">+18%</span>
          </span>
          <span className="mt-[1.4cqw] flex h-[5cqw] items-end gap-[0.8cqw]">
            {[38, 52, 44, 66, 58, 80, 100].map((h, i) => (
              <i key={i} className="hv-bar flex-1 rounded-[0.5cqw] bg-brand-strong" style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }} />
            ))}
          </span>
        </div>

        <div className="hv-card hv-speed tilt-z3 flex items-center gap-[1.6cqw] rounded-[2cqw] border border-line bg-bg-primary p-[1.8cqw] shadow-float">
          <span className="hv-ring relative flex h-[7cqw] w-[7cqw] items-center justify-center rounded-full">
            <span className="text-[2.4cqw] font-extrabold text-text-primary">98</span>
          </span>
          <span>
            <span className="flex items-center gap-[0.8cqw] text-[1.8cqw] font-semibold text-text-muted">
              <Gauge className="h-[2cqw] w-[2cqw] text-accent-ink" />
              {t('speed')}
            </span>
            <span className="mt-[0.4cqw] flex items-center gap-[0.8cqw] text-[1.8cqw] font-bold text-text-primary">
              <TrendingUp className="h-[2cqw] w-[2cqw] text-[#16A34A]" />
              {t('conversion')} {t('conversionValue')}
            </span>
          </span>
        </div>

        <div className="hv-card hv-toast tilt-z3 flex items-center gap-[1.4cqw] rounded-[2cqw] bg-ink p-[1.6cqw] text-snow shadow-float">
          <span className="flex h-[5cqw] w-[5cqw] shrink-0 items-center justify-center rounded-[1.2cqw] bg-brand-strong">
            <Bell className="h-[2.4cqw] w-[2.4cqw]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[2cqw] font-bold">{t('toastTitle')}</span>
            <span className="block truncate text-[1.7cqw] text-snow/70">{t('toastText')}</span>
          </span>
        </div>

        <div className="hv-card hv-uptime tilt-z2 flex items-center gap-[1cqw] rounded-full border border-line bg-bg-primary px-[2cqw] py-[1.2cqw] text-[1.8cqw] font-bold text-text-primary shadow-card">
          <i className="hv-live h-[1.3cqw] w-[1.3cqw] rounded-full bg-[#22C55E]" />
          {t('uptime')} · 99.9%
        </div>
      </div>
    </Tilt>
  )
}
