/**
 * Digital ads service page blocks: the managed steps, the working principle,
 * how the price is built and the closing consultation CTA. Copy in
 * site.servicePage.ads.*.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { cn } from '@/lib/utils/cn'

type Item = { t: string; d: string }

const HEADING = 'text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl'

/** Tiny CSS illustration for each of the six managed steps. */
function StepVisual({ index }: { index: number }) {
  const frame = 'flex h-24 w-full max-w-[220px] flex-col justify-center gap-2 rounded-2xl border border-line bg-bg-primary p-4'
  if (index === 0)
    return (
      <span className={frame} aria-hidden="true">
        <span className="mx-auto h-2 w-3/4 rounded bg-text-primary/15" />
        <span className="mx-auto h-2 w-1/2 rounded bg-text-primary/15" />
        <span className="mx-auto mt-1 h-3 w-1/3 rounded bg-brand-strong" />
      </span>
    )
  if (index === 1)
    return (
      <span className="relative flex h-24 w-full max-w-[220px] items-center justify-center" aria-hidden="true">
        <span className="ads-orbit h-16 w-16 rounded-full border border-line bg-bg-primary" />
        <span className="ads-orbit ads-orbit-2 -ml-6 h-16 w-16 rounded-full border border-line bg-bg-primary" />
        <span className="absolute h-2.5 w-2.5 rounded-full bg-brand-strong" />
      </span>
    )
  if (index === 2)
    return (
      <span className={frame} aria-hidden="true">
        <span className="h-2 w-full rounded bg-text-primary/20" />
        <span className="h-2 w-4/5 rounded bg-text-primary/15" />
        <span className="mt-1 h-4 w-1/3 rounded-md bg-brand-strong" />
      </span>
    )
  if (index === 3)
    return (
      <span className="flex h-24 w-full max-w-[220px] items-center gap-3" aria-hidden="true">
        {['A', 'B'].map((v, i) => (
          <span key={v} className={cn('flex-1 rounded-2xl border bg-bg-primary p-2.5', i === 1 ? 'border-brand-strong' : 'border-line')}>
            <span className="block h-8 rounded-lg bg-line" />
            <span className={cn('mt-2 block h-1.5 rounded', i === 1 ? 'w-full bg-brand-strong' : 'w-1/3 bg-text-primary/20')} />
          </span>
        ))}
      </span>
    )
  if (index === 4)
    return (
      <span className={frame} aria-hidden="true">
        {[20, 38, 88].map((w, i) => (
          <span key={w} className="block h-2 overflow-hidden rounded-full bg-line">
            <span className={cn('ads-grow block h-full rounded-full', i === 2 ? 'bg-brand-strong' : 'bg-text-primary/30')} style={{ ['--w' as string]: `${w}%` }} />
          </span>
        ))}
      </span>
    )
  return (
    <span className="flex h-24 w-full max-w-[220px] items-end gap-2 rounded-2xl border border-line bg-bg-primary px-4 pb-3" aria-hidden="true">
      {[40, 55, 45, 70, 60, 100].map((h, i) => (
        <span key={i} className={cn('ads-bar flex-1 rounded-t', i === 5 ? 'bg-brand-strong' : 'bg-text-primary/25')} style={{ ['--h' as string]: `${h}%`, animationDelay: `${i * 80}ms` }} />
      ))}
    </span>
  )
}

export function AdsManage() {
  const t = useTranslations('site.servicePage.ads.manage')
  const items = t.raw('items') as Item[]

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <AnimatedHeading className={HEADING} text={t('title')} />
        <p className="max-w-xl text-lg leading-relaxed text-text-secondary lg:justify-self-end">{t('text')}</p>
      </div>

      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.t}>
            <Reveal className="rv-3d h-full" delay={(i % 2) * 90}>
              <Tilt max={6} className="h-full" innerClassName="h-full">
                <article className="svc relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-line bg-bg-secondary p-7 shadow-card sm:flex-row sm:items-center">
                  <span className="tilt-glare" />
                  <div className="tilt-z1 min-w-0 flex-1">
                    <p className="text-sm font-bold text-accent-ink tabular-nums">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-text-primary">{item.t}</h3>
                    <p className="mt-2 leading-relaxed text-text-secondary">{item.d}</p>
                  </div>
                  <div className="tilt-z2 flex shrink-0 justify-center sm:w-[220px]">
                    <StepVisual index={i} />
                  </div>
                </article>
              </Tilt>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function AdsPrinciple() {
  const t = useTranslations('site.servicePage.ads.principle')

  return (
    <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-[1fr_1fr] lg:py-24">
      <div>
        <AnimatedHeading className={HEADING} text={t('title')} />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">{t('text')}</p>
      </div>
      <Reveal className="rv-3d">
        <Tilt max={6}>
          <figure className="relative overflow-hidden rounded-[32px] bg-ink p-8 text-snow shadow-float sm:p-12">
            <span className="tilt-glare" />
            <span aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-strong/40 blur-2xl" />
            <blockquote className="tilt-z2 relative text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-4xl">{t('quote')}</blockquote>
            <figcaption className="tilt-z1 relative mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-snow/60">{t('quoteBy')}</figcaption>
          </figure>
        </Tilt>
      </Reveal>
    </section>
  )
}

export function AdsPricing() {
  const t = useTranslations('site.servicePage.ads.pricing')
  const cards = t.raw('cards') as Item[]
  const terms = t.raw('terms') as { k: string; v: string }[]

  return (
    <section className="container-x py-16 lg:py-24">
      <AnimatedHeading className={HEADING} text={t('title')} />
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">{t('text')}</p>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="grid gap-5">
          {cards.map((c, i) => (
            <Reveal key={c.t} className="rv-3d" delay={i * 100}>
              <Tilt max={5}>
                <article className="svc relative rounded-3xl border border-line bg-bg-secondary p-7 shadow-card">
                  <span className="tilt-glare" />
                  <h3 className="tilt-z1 text-xl font-bold text-text-primary">{c.t}</h3>
                  <p className="tilt-z1 mt-2 leading-relaxed text-text-secondary">{c.d}</p>
                </article>
              </Tilt>
            </Reveal>
          ))}
          <div className="rounded-3xl border border-line bg-bg-secondary p-7">
            <p className="text-lg leading-relaxed text-text-secondary">{t('ctaText')}</p>
            <div className="mt-6">
              <WhatsAppButton label={t('cta')} message={t('ctaMessage')} size="md" />
            </div>
          </div>
        </div>

        <Reveal className="rv-3d">
          <Tilt max={4}>
            <div className="svc relative h-full rounded-[32px] border border-line bg-bg-primary p-7 shadow-card sm:p-9">
              <span className="tilt-glare" />
              <h3 className="tilt-z1 text-xl font-bold text-text-primary">{t('termsTitle')}</h3>
              <dl className="tilt-z1 mt-6 divide-y divide-line">
                {terms.map((row) => (
                  <div key={row.k} className="grid gap-1 py-4 sm:grid-cols-[0.8fr_1.2fr] sm:gap-6">
                    <dt className="flex items-start gap-2 text-sm font-semibold text-text-muted">
                      <Check size={15} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                      {row.k}
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-text-primary">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  )
}

export function AdsCta() {
  const t = useTranslations('site.servicePage.ads.cta')
  const tm = useTranslations('site.servicePage.ads')

  return (
    <section className="overflow-hidden pb-20 lg:pb-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[32px] bg-brand-strong px-7 py-14 text-snow sm:px-14 sm:py-20">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-snow/20" />
          <div aria-hidden="true" className="absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-ink/10" />
          <div className="relative max-w-2xl">
            <AnimatedHeading className="text-display-lg font-extrabold tracking-[-0.035em]" text={t('title')} />
            <p className="mt-4 text-lg text-snow/85">{t('text')}</p>
            <div className="mt-9">
              <WhatsAppButton variant="dark" message={tm('message')} className="bg-snow text-ink hover:bg-snow/90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
