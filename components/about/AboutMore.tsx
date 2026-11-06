/**
 * About page blocks: mission, the common problem vs our answer, three
 * principles, the platform behind the agency (with a dashboard mockup) and
 * the long-term goal. Copy: site.aboutPage.more.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { Bell, Layers, MessagesSquare, ReceiptText, Users } from 'lucide-react'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { ScrollFillText } from '@/components/ui/ScrollFillText'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { cn } from '@/lib/utils/cn'

type Item = { t: string; d: string }

const HEADING = 'text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl'
const PLATFORM_ICONS = [Users, ReceiptText, MessagesSquare, Bell, Layers]

/** Decorative client dashboard: sidebar, three stat tiles and a bar chart. */
function PlatformMock() {
  const bars = [46, 70, 58, 100, 62, 80, 54]
  return (
    <div className="grid grid-cols-[30%_1fr] overflow-hidden rounded-[26px] border border-line bg-bg-primary shadow-float" aria-hidden="true">
      <div className="space-y-2.5 border-r border-line bg-bg-secondary p-4">
        <span className="block h-6 w-6 rounded-lg bg-brand-strong" />
        {[90, 70, 80, 55].map((w, i) => (
          <span key={i} className={cn('block h-2 rounded', i === 0 ? 'bg-accent-primary/50' : 'bg-text-primary/15')} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((k) => (
            <span key={k} className="ads-rise rounded-xl border border-line bg-bg-secondary p-2.5" style={{ animationDelay: `${k * 120}ms` }}>
              <span className="block h-1.5 w-2/3 rounded bg-text-primary/15" />
              <span className={cn('mt-2 block h-3 w-1/2 rounded', k === 0 ? 'bg-brand-strong' : 'bg-text-primary/25')} />
            </span>
          ))}
        </div>
        <div className="flex h-32 items-end gap-2 rounded-xl border border-line bg-bg-secondary p-3">
          {bars.map((h, i) => (
            <span key={i} className={cn('ads-bar flex-1 rounded-t-md', h === 100 ? 'bg-brand-strong' : 'bg-accent-primary/30')} style={{ ['--h' as string]: `${h}%`, animationDelay: `${300 + i * 90}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function AboutMore() {
  const t = useTranslations('site.aboutPage.more')
  const principles = t.raw('principles') as Item[]
  const platform = t.raw('platform') as Item[]
  const tags = t.raw('goalTags') as string[]

  return (
    <>
      {/* Mission */}
      <section className="container-x py-16 lg:py-24">
        <Reveal className="rv-3d">
          <div className="relative overflow-hidden rounded-[36px] bg-ink px-7 py-14 text-snow shadow-float sm:px-14 sm:py-20">
            <span aria-hidden="true" className="hm-float absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-strong/40 blur-3xl" />
            <span aria-hidden="true" className="hm-float-slow absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#24A0FF]/20 blur-3xl" />
            <div className="relative max-w-4xl">
              <AnimatedHeading className="text-[2.2rem] font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-6xl" text={t('missionTitle')} />
              <ScrollFillText className="mt-8 text-xl leading-relaxed text-snow sm:text-2xl" segments={[{ text: t('missionText') }]} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Problem vs answer */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-5 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal className="rv-3d h-full">
          <Tilt max={5} className="h-full" innerClassName="h-full">
            <article className="relative h-full rounded-[28px] border border-line bg-bg-secondary p-7 sm:p-10">
              <span className="tilt-glare" />
              <p className="tilt-z1 text-xs font-bold uppercase tracking-[0.14em] text-text-muted">{t('problemLabel')}</p>
              <h3 className="tilt-z2 mt-5 text-2xl font-extrabold leading-snug tracking-[-0.02em] text-text-secondary sm:text-3xl">{t('problemTitle')}</h3>
              <p className="tilt-z1 mt-5 leading-relaxed text-text-muted">{t('problemText')}</p>
            </article>
          </Tilt>
        </Reveal>
        <Reveal className="rv-3d h-full" delay={120}>
          <Tilt max={5} className="h-full" innerClassName="h-full">
            <article className="relative h-full overflow-hidden rounded-[28px] bg-brand-strong p-7 text-snow shadow-brand sm:p-10">
              <span className="tilt-glare" />
              <span aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-snow/15" />
              <p className="tilt-z1 relative text-xs font-bold uppercase tracking-[0.14em] text-snow/80">{t('solutionLabel')}</p>
              <h3 className="tilt-z2 relative mt-5 text-2xl font-extrabold leading-snug tracking-[-0.02em] sm:text-3xl">{t('solutionTitle')}</h3>
              <p className="tilt-z1 relative mt-5 leading-relaxed text-snow/85">{t('solutionText')}</p>
            </article>
          </Tilt>
        </Reveal>
      </section>

      {/* Principles */}
      <section className="container-x py-16 lg:py-24">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
          {principles.map((p, i) => (
            <li key={p.t}>
              <Reveal className="rv-3d h-full" delay={i * 110}>
                <Tilt max={7} className="h-full" innerClassName="h-full">
                  <article className="svc relative h-full rounded-[28px] border border-line bg-bg-secondary p-7 shadow-card sm:p-8">
                    <span className="tilt-glare" />
                    <span className="tilt-z3 block bg-gradient-to-b from-accent-primary to-accent-primary/10 bg-clip-text text-6xl font-extrabold tracking-[-0.05em] text-transparent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="tilt-z1 mt-5 text-2xl font-bold text-text-primary">{p.t}</h3>
                    <p className="tilt-z1 mt-3 leading-relaxed text-text-secondary">{p.d}</p>
                  </article>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Platform */}
      <section className="container-x py-16 lg:py-24">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
          <div>
            <AnimatedHeading className={HEADING} text={t('platformTitle')} />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">{t('platformText')}</p>
          </div>
          <Reveal className="rv-3d">
            <Tilt max={6}>
              <PlatformMock />
            </Tilt>
          </Reveal>
        </div>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {platform.map((p, i) => {
            const Icon = PLATFORM_ICONS[i % PLATFORM_ICONS.length]
            return (
              <li key={p.t}>
                <Reveal className="rv-3d" delay={i * 60}>
                  <div className="group grid grid-cols-[minmax(0,1fr)] gap-3 py-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center sm:gap-8">
                    <p className="flex items-center gap-4 text-lg font-bold text-text-primary">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-bg-secondary text-accent-ink transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-strong group-hover:text-snow group-hover:shadow-brand">
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      {p.t}
                    </p>
                    <p className="leading-relaxed text-text-secondary">{p.d}</p>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Goal */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <AnimatedHeading className={HEADING} text={t('goalTitle')} />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">{t('goalText')}</p>
        </div>
        <ul className="flex flex-wrap gap-2.5">
          {tags.map((tag, i) => (
            <li key={tag}>
              <Reveal className="rv-3d" delay={i * 80}>
                <span
                  className="hm-float inline-flex rounded-full border border-line bg-bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-text-primary shadow-card"
                  style={{ animationDelay: `${i * 400}ms` }}
                >
                  {tag}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
