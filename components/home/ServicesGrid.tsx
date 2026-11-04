/**
 * Service catalogue. Compact on the home page, full detail (with anchors) on
 * /services. Every card tilts in 3D and carries its own small CSS scene
 * (".svc" / ".sc-*" in app/globals.css).
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Check, Code2, Megaphone, Search, ShieldCheck, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { SectionHeading } from './SectionHeading'

type ServiceId = 'web' | 'mobile' | 'seo' | 'ads' | 'support'

const ICONS = { web: Code2, mobile: Smartphone, seo: Search, ads: Megaphone, support: ShieldCheck }
const POINTS: Record<string, string[]> = {
  web: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'],
  mobile: ['p1', 'p2'],
  seo: ['p1', 'p2'],
  ads: ['p1', 'p2', 'p3', 'p4'],
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="tilt-z1 mt-5 flex flex-wrap gap-2">
      {items.map((p) => (
        <li
          key={p}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-primary px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent-primary/50"
        >
          <Check size={13} className="text-accent-primary" aria-hidden="true" />
          {p}
        </li>
      ))}
    </ul>
  )
}

/** Decorative 3D scene for each service. Pure CSS, hidden from screen readers. */
function Scene({ id }: { id: ServiceId }) {
  if (id === 'web')
    return (
      <div className="sc sc-lg" aria-hidden="true">
        <div className="sc-iso">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn('sc-pane', i === 2 ? 'border-transparent bg-brand-strong' : 'border-line bg-bg-primary')}>
              <span className="flex gap-1 p-2">
                {[0, 1, 2].map((d) => (
                  <i key={d} className={cn('h-1.5 w-1.5 rounded-full', i === 2 ? 'bg-snow/70' : 'bg-line')} />
                ))}
              </span>
              <span className={cn('mx-2 block h-2 w-3/5 rounded', i === 2 ? 'bg-snow/90' : 'bg-text-primary/15')} />
              <span className={cn('mx-2 mt-1.5 block h-1.5 w-2/5 rounded', i === 2 ? 'bg-snow/50' : 'bg-text-primary/10')} />
              <span className={cn('mx-2 mt-2 block h-5 w-1/3 rounded-md', i === 2 ? 'bg-snow' : 'bg-accent-primary/30')} />
            </div>
          ))}
        </div>
      </div>
    )

  if (id === 'mobile')
    return (
      <div className="sc" aria-hidden="true">
        <div className="sc-phone border-[3px] border-ink bg-bg-primary dark:border-snow/80">
          <span className="mx-auto mt-1 block h-1 w-5 rounded-full bg-ink/60 dark:bg-snow/50" />
          <span className="grid grid-cols-2 gap-1 p-1.5">
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <i key={k} className={cn('sc-app h-4 rounded', k === 0 ? 'bg-brand-strong' : 'bg-accent-primary/25')} />
            ))}
          </span>
        </div>
        <span className="sc-note bg-brand-strong text-snow">
          <i className="h-1.5 w-1.5 rounded-full bg-snow" />
          <i className="h-1 w-6 rounded bg-snow/80" />
        </span>
      </div>
    )

  if (id === 'seo')
    return (
      <div className="sc" aria-hidden="true">
        <div className="sc-chart border-line bg-bg-primary">
          {[38, 55, 72, 92].map((h, k) => (
            <i key={k} className={cn('sc-bar rounded-t', k === 3 ? 'bg-brand-strong' : 'bg-accent-primary/35')} style={{ height: `${h}%` }} />
          ))}
        </div>
        <span className="sc-lens border-[3px] border-brand-strong bg-bg-primary/60">
          <i className="sc-lens-handle bg-brand-strong" />
        </span>
      </div>
    )

  if (id === 'ads')
    return (
      <div className="sc" aria-hidden="true">
        <div className="sc-ground">
          {[0, 1, 2].map((k) => (
            <i key={k} className="sc-ripple border-2 border-accent-primary/60" />
          ))}
        </div>
        <span className="sc-core bg-brand-strong text-snow">
          <Megaphone size={18} />
        </span>
        {['M', 'G', 'in', 'T'].map((c, k) => (
          <span key={c} className={cn('sc-chip border border-line bg-bg-primary text-text-primary', `sc-chip-${k}`)}>
            {c}
          </span>
        ))}
      </div>
    )

  return (
    <div className="sc" aria-hidden="true">
      <i className="sc-orbit sc-orbit-a border-2 border-dashed border-accent-primary/60" />
      <i className="sc-orbit sc-orbit-b border border-accent-primary/40">
        <b className="sc-dot bg-brand-strong" />
      </i>
      <span className="sc-shield bg-brand-strong text-snow">
        <ShieldCheck size={26} />
      </span>
    </div>
  )
}

export function ServicesGrid({ detailed = false, headingAs = 'h2' }: { detailed?: boolean; headingAs?: 'h1' | 'h2' }) {
  const t = useTranslations('site.services')
  const tCta = useTranslations('site.cta')
  const locale = useLocale()
  const Card = detailed ? 'article' : 'div'

  const cardCls = 'svc relative h-full scroll-mt-28 rounded-3xl border border-line bg-bg-secondary p-7 shadow-card sm:p-8'

  const head = (id: ServiceId) => {
    const Icon = ICONS[id]
    return (
      <>
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              'svc-icon tilt-z3 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
              id === 'web' ? 'bg-brand-strong text-snow' : 'bg-bg-primary text-accent-ink'
            )}
          >
            <Icon size={24} aria-hidden="true" />
          </span>
          <div className="tilt-z2 -mr-2 -mt-3">
            <Scene id={id} />
          </div>
        </div>
        <h3 className="tilt-z1 mt-4 text-2xl font-bold tracking-tight text-text-primary">{t(`${id}.title`)}</h3>
        <p className="tilt-z1 mt-2 max-w-xl leading-relaxed text-text-secondary">{t(`${id}.text`)}</p>
      </>
    )
  }

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading as={headingAs} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
          {!detailed && (
            <Link href={`/${locale}/services`} className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-text-primary hover:text-accent-ink">
              {tCta('details')} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-6">
          <Reveal className="rv-3d lg:col-span-6">
            <Tilt max={4} className="h-full" innerClassName="h-full">
              <Card id="web" className={cn(cardCls, 'lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12 lg:p-10')}>
                <span className="tilt-glare" />
                <div>
                  <span className="tilt-z1 mb-4 inline-flex rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-semibold text-accent-ink">{t('featured')}</span>
                  {head('web')}
                </div>
                <Points items={POINTS.web.map((p) => t(`web.${p}`))} />
              </Card>
            </Tilt>
          </Reveal>

          {(['mobile', 'seo', 'ads'] as const).map((id, i) => (
            <Reveal key={id} className="rv-3d lg:col-span-2" delay={(i + 1) * 90}>
              <Tilt max={7} className="h-full" innerClassName="h-full">
                <Card id={id} className={cardCls}>
                  <span className="tilt-glare" />
                  {head(id)}
                  <Points items={POINTS[id].map((p) => t(`${id}.${p}`))} />
                </Card>
              </Tilt>
            </Reveal>
          ))}

          <Reveal className="rv-3d lg:col-span-6">
            <Tilt max={3} className="h-full" innerClassName="h-full">
              <Card id="support" className={cardCls}>
                <span className="tilt-glare" />
                <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-10">
                  <div>{head('support')}</div>
                  <div className="tilt-z1 mt-6 grid gap-6 sm:grid-cols-2 lg:mt-0">
                    {(
                      [
                        ['webTitle', ['w1', 'w2', 'w3', 'w5', 'w4']],
                        ['socialTitle', ['s1', 's2', 's3', 's4', 's5', 's6']],
                      ] as const
                    ).map(([title, keys]) => (
                      <div key={title} className="rounded-2xl border border-line bg-bg-primary p-5">
                        <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-text-primary">{t(`support.${title}`)}</h4>
                        <ul className="mt-3 space-y-2">
                          {keys.map((k) => (
                            <li key={k} className="flex gap-2 text-[14px] leading-snug text-text-secondary">
                              <Check size={15} className="mt-0.5 shrink-0 text-accent-primary" aria-hidden="true" />
                              {t(`support.${k}`)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
