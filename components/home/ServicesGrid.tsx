/**
 * Service catalogue. Compact on the home page, full detail (with anchors) on
 * /services. Every card tilts in 3D and carries its own small CSS scene
 * (".svc" / ".sc-*" in app/globals.css).
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, ArrowUpRight, Check, Code2, Megaphone, Search, ShieldCheck, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { serviceHref, type ServiceId } from '@/lib/site/navigation'
import { SectionHeading } from './SectionHeading'
import { ServiceScene } from './ServiceScene'

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

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="tilt-z2 mt-6 inline-flex items-center gap-2 rounded-full bg-brand-strong px-5 py-2.5 text-sm font-semibold text-snow shadow-card transition-transform hover:-translate-y-0.5"
    >
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  )
}

export function ServicesGrid({ detailed = false, headingAs = 'h2' }: { detailed?: boolean; headingAs?: 'h1' | 'h2' }) {
  const t = useTranslations('site.services')
  const tCta = useTranslations('site.cta')
  const tPage = useTranslations('site.servicePage')
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
            <ServiceScene id={id} />
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
                <div>
                  <Points items={POINTS.web.map((p) => t(`web.${p}`))} />
                  <MoreLink href={serviceHref(locale, 'web')} label={tPage('more')} />
                </div>
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
                  <MoreLink href={serviceHref(locale, id)} label={tPage('more')} />
                </Card>
              </Tilt>
            </Reveal>
          ))}

          <Reveal className="rv-3d lg:col-span-6">
            <Tilt max={3} className="h-full" innerClassName="h-full">
              <Card id="support" className={cardCls}>
                <span className="tilt-glare" />
                <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-10">
                  <div>
                    {head('support')}
                    <MoreLink href={serviceHref(locale, 'support')} label={tPage('more')} />
                  </div>
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
