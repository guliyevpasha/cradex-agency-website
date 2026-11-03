/**
 * Service catalogue. Compact on the home page, full detail (with anchors) on
 * /services.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Check, Code2, Megaphone, Search, ShieldCheck, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SectionHeading } from './SectionHeading'

const ICONS = { web: Code2, mobile: Smartphone, seo: Search, ads: Megaphone, support: ShieldCheck }
const POINTS: Record<string, string[]> = {
  web: ['p1', 'p2', 'p3', 'p4'],
  mobile: ['p1', 'p2'],
  seo: ['p1', 'p2'],
  ads: ['p1', 'p2', 'p3', 'p4'],
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((p) => (
        <li key={p} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-primary px-3 py-1.5 text-[13px] font-medium text-text-secondary">
          <Check size={13} className="text-accent-primary" aria-hidden="true" />
          {p}
        </li>
      ))}
    </ul>
  )
}

export function ServicesGrid({ detailed = false, headingAs = 'h2' }: { detailed?: boolean; headingAs?: 'h1' | 'h2' }) {
  const t = useTranslations('site.services')
  const tCta = useTranslations('site.cta')
  const locale = useLocale()
  const Card = detailed ? 'article' : 'div'

  const cardCls = 'relative scroll-mt-28 rounded-3xl border border-line bg-bg-secondary p-7 sm:p-8'

  const head = (id: keyof typeof ICONS) => {
    const Icon = ICONS[id]
    return (
      <>
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', id === 'web' ? 'bg-brand text-ink' : 'bg-accent-primary/10 text-accent-ink')}>
          <Icon size={22} aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-2xl font-bold tracking-tight text-text-primary">{t(`${id}.title`)}</h3>
        <p className="mt-2 max-w-xl leading-relaxed text-text-secondary">{t(`${id}.text`)}</p>
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

        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          <Card id="web" className={cn(cardCls, 'lg:col-span-6 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-10 lg:p-10')}>
            <div>
              <span className="mb-5 inline-flex rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-semibold text-accent-ink">{t('featured')}</span>
              {head('web')}
            </div>
            <Points items={POINTS.web.map((p) => t(`web.${p}`))} />
          </Card>

          {(['mobile', 'seo', 'ads'] as const).map((id) => (
            <Card key={id} id={id} className={cn(cardCls, 'lg:col-span-2')}>
              {head(id)}
              <Points items={POINTS[id].map((p) => t(`${id}.${p}`))} />
            </Card>
          ))}

          <Card id="support" className={cn(cardCls, 'lg:col-span-6')}>
            <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-10">
              <div>{head('support')}</div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:mt-0">
                {(
                  [
                    ['webTitle', ['w1', 'w2', 'w3', 'w4']],
                    ['socialTitle', ['s1', 's2', 's3', 's4', 's5', 's6']],
                  ] as const
                ).map(([title, keys]) => (
                  <div key={title} className="rounded-2xl border border-line bg-bg-primary p-5">
                    <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-text-primary">{t(`support.${title}`)}</h4>
                    <ul className="mt-3 space-y-2">
                      {(detailed ? keys : keys.slice(0, 3)).map((k) => (
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
        </div>
      </div>
    </section>
  )
}
