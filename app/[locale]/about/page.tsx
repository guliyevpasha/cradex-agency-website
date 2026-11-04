/**
 * About: a technology agency for websites, AI assistants / chatbots and CRM.
 * Numbers are real only: the project count comes from the portfolio.
 * The previous about page lives on in components/sections/AboutSection.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Bot, Code2, Layers, Workflow } from 'lucide-react'
import { getAllPortfolio } from '@/lib/data/portfolio'
import { isShown } from '@/lib/site/portfolio'
import { LOCALES } from '@/lib/site/navigation'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { ScrollFillText } from '@/components/ui/ScrollFillText'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

type Item = { t: string; d: string }

const PILLAR_ICONS = [Code2, Bot, Workflow, Layers]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.aboutPage' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

/** Website, chatbot and CRM pipeline floating in one 3D stack. */
function AboutScene() {
  return (
    <div className="ab-scene" aria-hidden="true">
      <div className="ab-card ab-site border border-line bg-bg-primary">
        <span className="flex gap-1.5 border-b border-line px-4 py-3">
          <i className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="block p-5">
          <i className="block h-3.5 w-2/3 rounded bg-text-primary/80" />
          <i className="mt-2.5 block h-2.5 w-1/2 rounded bg-text-primary/20" />
          <i className="mt-5 block h-8 w-28 rounded-full bg-brand-strong" />
          <span className="mt-5 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((k) => (
              <i key={k} className="h-12 rounded-xl bg-accent-primary/15" />
            ))}
          </span>
        </span>
      </div>

      <div className="ab-card ab-chat border border-line bg-bg-primary p-4">
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-strong text-snow">
            <Bot size={15} />
          </span>
          <i className="h-2 w-16 rounded bg-text-primary/30" />
        </span>
        <i className="mt-3 block h-7 w-4/5 rounded-2xl rounded-tl-sm bg-bg-secondary" />
        <i className="ml-auto mt-2 block h-7 w-3/5 rounded-2xl rounded-tr-sm bg-brand-strong" />
        <span className="ab-typing mt-2 flex w-14 gap-1 rounded-2xl bg-bg-secondary px-3 py-2.5">
          <i /><i /><i />
        </span>
      </div>

      <div className="ab-card ab-crm border border-line bg-bg-primary p-4">
        <span className="grid grid-cols-3 gap-2">
          {[3, 2, 1].map((rows, c) => (
            <span key={c} className="space-y-1.5">
              <i className="block h-1.5 w-8 rounded bg-text-primary/30" />
              {Array.from({ length: rows }).map((_, r) => (
                <i key={r} className={`block h-5 rounded-md ${c === 2 ? 'bg-brand-strong' : 'bg-accent-primary/20'}`} />
              ))}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'site.aboutPage' })
  const story = t.raw('story') as string[]
  const pillars = t.raw('pillars') as Item[]
  const values = t.raw('values') as Item[]
  const projects = (await getAllPortfolio(locale)).filter(isShown).length

  const stats = [
    ...(projects > 0 ? [{ n: `${projects}`, label: t('statProjects') }] : []),
    { n: '2', label: t('statDemo') },
    { n: `${LOCALES.length}`, label: t('statLanguages') },
  ]

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="container-x grid items-center gap-14 pb-16 pt-8 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
          <AnimatedHeading
            as="h1"
            className="mt-4 text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-text-primary sm:text-6xl"
            text={t('title')}
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">{t('text')}</p>
        </div>
        <Reveal className="rv-3d">
          <Tilt max={9}>
            <div className="svc-stage relative aspect-[5/4] rounded-[36px] border border-line bg-bg-secondary shadow-card">
              <span className="tilt-glare" />
              <span className="svc-stage-grid" aria-hidden="true" />
              <AboutScene />
            </div>
          </Tilt>
        </Reveal>
      </section>

      {/* Story */}
      <section className="container-x grid gap-8 py-16 lg:grid-cols-[1fr_2fr] lg:py-24">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('storyTitle')} />
        <div className="space-y-6">
          <ScrollFillText className="text-2xl leading-relaxed text-text-primary sm:text-3xl" segments={[{ text: story[0] }]} />
          {story.slice(1).map((p) => (
            <p key={p} className="text-lg leading-relaxed text-text-secondary">{p}</p>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="container-x py-16 lg:py-24">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('pillarsTitle')} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length]
            return (
              <li key={p.t}>
                <Reveal className="rv-3d h-full" delay={i * 90}>
                  <Tilt max={8} className="h-full" innerClassName="h-full">
                    <article className="svc relative h-full rounded-3xl border border-line bg-bg-secondary p-7 shadow-card">
                      <span className="tilt-glare" />
                      <span className={`svc-icon tilt-z3 flex h-14 w-14 items-center justify-center rounded-2xl ${i === 0 ? 'bg-brand-strong text-snow' : 'bg-bg-primary text-accent-ink'}`}>
                        <Icon size={24} aria-hidden="true" />
                      </span>
                      <h3 className="tilt-z1 mt-6 text-xl font-bold tracking-tight text-text-primary">{p.t}</h3>
                      <p className="tilt-z1 mt-2 leading-relaxed text-text-secondary">{p.d}</p>
                    </article>
                  </Tilt>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Numbers */}
      <section className="container-x py-12">
        <Reveal className="rv-3d">
          <div className="ab-stats relative overflow-hidden rounded-[36px] bg-ink px-8 py-12 text-snow sm:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-snow/60">{t('statsTitle')}</p>
            <ul className="mt-8 grid gap-10 sm:grid-cols-3">
              {stats.map((s) => (
                <li key={s.label}>
                  <span className="block text-6xl font-extrabold tracking-[-0.04em] text-brand sm:text-7xl">{s.n}</span>
                  <span className="mt-2 block text-lg text-snow/80">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* How we work */}
      <section className="container-x py-16 lg:py-24">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('valuesTitle')} />
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {values.map((v, i) => (
            <li key={v.t}>
              <Reveal className="rv-3d h-full" delay={(i % 2) * 110}>
                <Tilt max={5} className="h-full" innerClassName="h-full">
                  <div className="relative flex h-full gap-5 rounded-3xl border border-line bg-bg-primary p-7 shadow-card">
                    <span className="tilt-glare" />
                    <span className="step-orb tilt-z3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-strong text-lg font-extrabold text-snow">
                      {i + 1}
                    </span>
                    <span className="tilt-z1">
                      <h3 className="text-xl font-bold text-text-primary">{v.t}</h3>
                      <p className="mt-2 leading-relaxed text-text-secondary">{v.d}</p>
                    </span>
                  </div>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Founder */}
      <section className="container-x py-16 lg:py-24">
        <Reveal className="rv-3d">
          <Tilt max={4}>
            <div className="svc relative grid items-center gap-8 rounded-[36px] border border-line bg-bg-secondary p-8 shadow-card sm:grid-cols-[auto_1fr] sm:p-12">
              <span className="tilt-glare" />
              {/* Photo comes later; initials until then. */}
              <span className="tilt-z3 flex h-32 w-32 items-center justify-center rounded-[28px] bg-gradient-to-br from-brand-strong to-ink text-4xl font-extrabold text-snow shadow-float">
                PQ
              </span>
              <div className="tilt-z1">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('founderTitle')}</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary">{t('founderName')}</h2>
                <p className="text-text-muted">{t('founderRole')}</p>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">“{t('founderText')}”</p>
              </div>
            </div>
          </Tilt>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-x pb-24 pt-8">
        <div className="relative overflow-hidden rounded-[36px] bg-brand-strong px-8 py-14 text-center text-snow sm:px-12">
          <h2 className="text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-snow/85">{t('ctaText')}</p>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton label={t('cta')} variant="light" />
          </div>
        </div>
      </section>
    </div>
  )
}
