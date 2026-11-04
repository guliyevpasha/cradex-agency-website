/**
 * One page per service: hero with a large 3D scene, what is included, how we
 * work, FAQ, the other services and the closing CTA. Copy: site.servicePage.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowUpRight, ChevronDown, ChevronRight } from 'lucide-react'
import { LOCALES, SERVICE_IDS, SERVICE_SLUGS, serviceHref, serviceIdBySlug, type ServiceId } from '@/lib/site/navigation'
import { ServiceScene } from '@/components/home/ServiceScene'
import { WorkShowcase } from '@/components/home/WorkShowcase'
import { FinalCta } from '@/components/home/FinalCta'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { cn } from '@/lib/utils/cn'

type Params = Promise<{ locale: string; slug: string }>
type Item = { t: string; d: string }
type Group = { h?: string; items: Item[] }
type Faq = { q: string; a: string }

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.flatMap(({ code }) => SERVICE_IDS.map((id) => ({ locale: code, slug: SERVICE_SLUGS[id] })))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const id = serviceIdBySlug(slug)
  if (!id) return {}
  const t = await getTranslations({ locale, namespace: `site.servicePage.${id}` })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: `/${locale}/services/${slug}` },
  }
}

export default async function ServicePage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const id = serviceIdBySlug(slug)
  if (!id) notFound()
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'site.servicePage' })
  const tS = await getTranslations({ locale, namespace: 'site.services' })
  const groups = t.raw(`${id}.includes`) as Group[]
  const steps = t.raw(`${id}.steps`) as Item[]
  const faq = t.raw(`${id}.faq`) as Faq[]
  const others = SERVICE_IDS.filter((s) => s !== id)
  let n = 0

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="container-x grid items-center gap-12 pb-16 pt-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
        <div>
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
            <Link href={`/${locale}`} className="inline-flex min-h-9 items-center hover:text-text-primary">{t('home')}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href={`/${locale}/services`} className="inline-flex min-h-9 items-center hover:text-text-primary">{t('services')}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-text-secondary">{tS(`${id}.title`)}</span>
          </nav>
          <p className="mt-8 inline-flex rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-semibold text-accent-ink">{t(`${id}.eyebrow`)}</p>
          <AnimatedHeading
            as="h1"
            className="mt-5 text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-text-primary sm:text-6xl"
            text={t(`${id}.title`)}
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">{t(`${id}.text`)}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <WhatsAppButton label={t('cta')} message={t(`${id}.message`)} />
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-text-primary px-6 py-3 text-[15px] font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
            >
              {t('pricing')}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <Reveal className="rv-3d">
          <Tilt max={10}>
            <div className="svc-stage relative flex aspect-[5/4] items-center justify-center rounded-[36px] border border-line bg-bg-secondary shadow-card">
              <span className="tilt-glare" />
              <span className="svc-stage-grid" aria-hidden="true" />
              <div className="tilt-z2">
                <ServiceScene id={id} className="sc-xl" />
              </div>
            </div>
          </Tilt>
        </Reveal>
      </section>

      {/* What is included */}
      <section className="container-x py-16 lg:py-24">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('includesTitle')} />
        {groups.map((g, gi) => (
          <div key={gi} className={cn(g.h ? 'mt-12' : 'mt-10')}>
            {g.h && <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-accent-ink">{g.h}</h3>}
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item, i) => {
                n += 1
                return (
                  <li key={item.t}>
                    <Reveal className="rv-3d h-full" delay={(i % 3) * 90}>
                      <Tilt max={7} className="h-full" innerClassName="h-full">
                        <article className="svc relative h-full rounded-3xl border border-line bg-bg-secondary p-7 shadow-card">
                          <span className="tilt-glare" />
                          <span className="tilt-z3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-strong text-sm font-extrabold text-snow svc-icon">
                            {String(n).padStart(2, '0')}
                          </span>
                          <h4 className="tilt-z1 mt-5 text-xl font-bold tracking-tight text-text-primary">{item.t}</h4>
                          <p className="tilt-z1 mt-2 leading-relaxed text-text-secondary">{item.d}</p>
                        </article>
                      </Tilt>
                    </Reveal>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>

      {id === 'web' && <WorkShowcase />}

      {/* How we work */}
      <section className="container-x py-16 lg:py-24">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('processTitle')} />
        <ol className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <span className="absolute left-0 right-0 top-[38px] hidden h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent lg:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <li key={s.t}>
              <Reveal className="rv-3d h-full" delay={i * 110}>
                <Tilt max={8} className="h-full" innerClassName="h-full">
                  <div className="relative h-full rounded-3xl border border-line bg-bg-primary p-7 shadow-card">
                    <span className="tilt-glare" />
                    <span className="step-orb tilt-z3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-strong text-lg font-extrabold text-snow">
                      {i + 1}
                    </span>
                    <p className="tilt-z1 mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                      {t('step')} {i + 1}
                    </p>
                    <h3 className="tilt-z1 mt-1 text-xl font-bold text-text-primary">{s.t}</h3>
                    <p className="tilt-z1 mt-2 leading-relaxed text-text-secondary">{s.d}</p>
                  </div>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr] lg:py-24">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('faqTitle')} />
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="group rounded-3xl border border-line bg-bg-secondary px-6 py-5 open:shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown size={20} className="shrink-0 text-accent-ink transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 leading-relaxed text-text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Other services */}
      <section className="container-x py-16 lg:py-24">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('otherTitle')} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o: ServiceId, i) => (
            <li key={o}>
              <Reveal className="rv-3d h-full" delay={i * 80}>
                <Link href={serviceHref(locale, o)} className="group block h-full">
                  <Tilt max={8} className="h-full" innerClassName="h-full">
                    <div className="svc relative flex h-full flex-col rounded-3xl border border-line bg-bg-secondary p-6 shadow-card">
                      <span className="tilt-glare" />
                      <div className="tilt-z2 -mt-2 self-end">
                        <ServiceScene id={o} />
                      </div>
                      <h3 className="tilt-z1 mt-2 text-lg font-bold text-text-primary group-hover:text-accent-ink">{tS(`${o}.title`)}</h3>
                      <span className="tilt-z1 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-ink">
                        {t('more')} <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </Tilt>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta />
    </div>
  )
}
