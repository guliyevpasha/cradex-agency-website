/**
 * One template for the work pages beyond websites (ads, mobile, SEO / GEO,
 * technical service): hero with the service's 3D mockup, the case cards,
 * a note while any card is a built-in sample, and a consultation CTA.
 * Cases come from Sanity (workCase); see lib/data/work.ts. Each route file
 * is just `workPage('<id>')`.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowUpRight, ChevronRight, Info } from 'lucide-react'
import { pricingHref, serviceHref } from '@/lib/site/navigation'
import { WORK_SLUGS, type AdPlatform, type WorkCategory } from '@/lib/site/work'
import { getWorkCases, type WorkCase } from '@/lib/data/work'
import { AdsDashboard } from '@/components/services/AdsDashboard'
import { HERO_MOCKS } from '@/components/services/HeroMocks'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { AdCaseCard, BrandIcon, MobileCaseCard, PLATFORMS, SeoCaseCard, SupportCaseCard } from './WorkCards'

type Params = Promise<{ locale: string }>
type T = Awaited<ReturnType<typeof getTranslations>>

const HEADING = 'text-3xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-4xl'

function Cell({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <li>
      <Reveal className="rv-3d h-full" delay={(i % 2) * 120}>
        <Tilt max={6} className="h-full" innerClassName="h-full">
          {children}
        </Tilt>
      </Reveal>
    </li>
  )
}

function AdsCases({ cases, c }: { cases: WorkCase[]; c: T }) {
  // Only platforms that actually have cases get a tab and a section.
  const order = (['meta', 'tiktok', 'google', 'linkedin'] as AdPlatform[]).filter((p) => cases.some((x) => x.platform === p))
  return (
    <>
      {/* Platform jump links */}
      <nav aria-label={c('platforms')} className="container-x sticky top-[76px] z-20 py-3">
        <ul className="flex gap-2 overflow-x-auto rounded-full border border-line bg-bg-primary/85 p-1.5 backdrop-blur-xl [scrollbar-width:none] sm:w-fit">
          {order.map((p) => (
            <li key={p} className="shrink-0">
              <a href={`#${p}`} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary">
                <BrandIcon icon={PLATFORMS[p].icon} className="h-4 w-4" />
                {PLATFORMS[p].name}
                <span className="rounded-full bg-bg-secondary px-1.5 text-[11px] font-bold tabular-nums text-text-muted">{cases.filter((x) => x.platform === p).length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {order.map((p) => (
        <section key={p} id={p} className="container-x scroll-mt-40 py-10 lg:py-14">
          <h2 className={`${HEADING} flex items-center gap-3`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-snow" style={{ background: PLATFORMS[p].color }}>
              <BrandIcon icon={PLATFORMS[p].icon} className="h-5 w-5" />
            </span>
            {PLATFORMS[p].name}
          </h2>
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cases
              .filter((x) => x.platform === p)
              .map((x, i) => (
                <Cell key={x.id} i={i}>
                  <AdCaseCard c={x} sample={c('sample')} />
                </Cell>
              ))}
          </ul>
        </section>
      ))}
    </>
  )
}

function SupportCases({ cases, t, c }: { cases: WorkCase[]; t: T; c: T }) {
  const labels = { problem: c('problem'), solution: c('solution') }
  return (
    <>
      {(['web', 'social'] as const).map((g) => {
        const list = cases.filter((x) => x.group === g)
        if (list.length === 0) return null
        return (
          <section key={g} className="container-x py-10 lg:py-14">
            <AnimatedHeading className={HEADING} text={t(`groups.${g}`)} />
            <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-3">
              {list.map((x) => (
                <Cell key={x.id} i={cases.indexOf(x)}>
                  <SupportCaseCard c={x} index={cases.indexOf(x)} labels={labels} sample={c('sample')} />
                </Cell>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

export function workPage(id: WorkCategory) {
  async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: `site.workPages.${id}` })
    return {
      title: t('metaTitle'),
      description: t('metaDescription'),
      alternates: { canonical: `/${locale}/portfolio/${WORK_SLUGS[id]}` },
    }
  }

  async function Page({ params }: { params: Params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: `site.workPages.${id}` })
    const c = await getTranslations({ locale, namespace: 'site.workPages.common' })
    const menu = await getTranslations({ locale, namespace: 'site.workMenu' })
    const cases = await getWorkCases(id, locale)
    const hasSamples = cases.some((x) => x.sample)
    const HeroMock = id === 'ads' ? AdsDashboard : HERO_MOCKS[id]

    return (
      <div className="pt-24 lg:pt-28">
        {/* Hero */}
        <section className="container-x pb-6 pt-6">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
            <Link href={`/${locale}`} className="inline-flex min-h-9 items-center hover:text-text-primary">{c('home')}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href={`/${locale}/portfolio`} className="inline-flex min-h-9 items-center hover:text-text-primary">{c('work')}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-text-secondary">{menu(`${id}.title`)}</span>
          </nav>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] items-center gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-8">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
              <AnimatedHeading
                as="h1"
                className="mt-4 text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-text-primary sm:text-6xl xl:text-[4.2rem]"
                text={t('title')}
              />
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">{t('text')}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <WhatsAppButton label={c('cta')} message={t('message')} />
                <Link
                  href={serviceHref(locale, id)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-text-primary px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
                >
                  {c('service')}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link href={pricingHref(locale, id)} className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-accent-ink hover:underline">
                  {c('pricing')}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <Reveal className="rv-3d mx-auto w-full max-w-[680px]">
              <Tilt max={6}>
                <HeroMock />
              </Tilt>
            </Reveal>
          </div>
        </section>

        {hasSamples && (
          <p className="container-x mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
            <Info size={16} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
            {c('sampleNote')}
          </p>
        )}

        {id === 'ads' && <AdsCases cases={cases} c={c} />}

        {id === 'mobile' && (
          <section className="container-x py-10 lg:py-14">
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
              {cases.map((x, i) => (
                <Cell key={x.id} i={i}>
                  <MobileCaseCard c={x} sample={c('sample')} />
                </Cell>
              ))}
            </ul>
          </section>
        )}

        {id === 'seo' && (
          <section className="container-x py-10 lg:py-14">
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cases.map((x, i) => (
                <Cell key={x.id} i={i}>
                  <SeoCaseCard c={x} id={String(i)} sample={c('sample')} />
                </Cell>
              ))}
            </ul>
          </section>
        )}

        {id === 'support' && <SupportCases cases={cases} t={t} c={c} />}

        {/* CTA */}
        <section className="container-x pb-24 pt-10">
          <Reveal className="rv-3d">
            <div className="relative overflow-hidden rounded-[32px] bg-brand-strong px-7 py-14 text-snow sm:px-14 sm:py-16">
              <span aria-hidden="true" className="hm-float absolute -right-20 -top-24 h-80 w-80 rounded-full bg-snow/15" />
              <span aria-hidden="true" className="hm-float-slow absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-ink/15" />
              <div className="relative max-w-2xl">
                <AnimatedHeading className="text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-5xl" text={c('ctaTitle')} />
                <p className="mt-4 text-lg text-snow/85">{c('ctaText')}</p>
                <div className="mt-8">
                  <WhatsAppButton label={c('cta')} message={t('message')} variant="light" />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    )
  }

  return { Page, generateMetadata }
}
