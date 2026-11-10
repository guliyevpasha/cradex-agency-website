/**
 * Portfolio: website projects only, as 3D laptop + phone mockups in two
 * staggered columns. Other categories are archived (archive/portfolio-all).
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPortfolio } from '@/lib/data/portfolio'
import { clientName, cleanSlug, domainOf, isShown, shortSummary, shotsFor } from '@/lib/site/portfolio'
import { WebProjectCard } from '@/components/portfolio/WebProjectCard'
import { FinalCta } from '@/components/home/FinalCta'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'

// On-demand revalidation via /api/revalidate webhook + 60 second fallback
// Pages update within ~60 seconds after publishing in Sanity
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site.portfolioPage' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'site.portfolioPage' })
  const tWork = await getTranslations({ locale, namespace: 'site.work' })

  // Projects with live captures first: they look best on the devices.
  const items = (await getAllPortfolio(locale))
    .filter(isShown)
    .sort((a, b) => Number(Boolean(shotsFor(b).mobile)) - Number(Boolean(shotsFor(a).mobile)))

  const cards = items.map((item, i) => {
    const domain = domainOf(item.projectUrl)
    return (
      <Reveal key={item.id} className="rv-3d" delay={(i % 2) * 140}>
        <WebProjectCard
          href={`/${locale}/portfolio/${cleanSlug(item.slug)}`}
          shots={shotsFor(item)}
          client={clientName(item, locale)}
          summary={shortSummary(item, locale)}
          tags={domain ? [tWork('chip'), domain] : [tWork('chip')]}
          priority={i < 2}
        />
      </Reveal>
    )
  })

  return (
    <div className="pt-24 lg:pt-28">
      <section className="mx-auto w-full max-w-[1680px] px-4 pb-6 pt-8 sm:px-6 lg:px-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <AnimatedHeading
            as="h1"
            className="text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-text-primary sm:text-6xl xl:text-[5rem]"
            text={t('title')}
          />
          {items.length > 0 && (
            <span className="rounded-full bg-brand-strong px-5 py-2 text-sm font-bold text-snow shadow-card">
              {t('count', { count: items.length })}
            </span>
          )}
        </div>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-text-secondary">{t('text')}</p>
      </section>

      <section className="overflow-hidden py-14 lg:py-20">
        {items.length === 0 ? (
          <p className="container-x text-text-secondary">{t('empty')}</p>
        ) : (
          <div className="mx-auto grid w-full max-w-[1680px] gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-x-14 lg:px-12">
            <div className="flex flex-col gap-14 lg:gap-24">{cards.filter((_, i) => i % 2 === 0)}</div>
            <div className="flex flex-col gap-14 lg:gap-24 lg:pt-40">{cards.filter((_, i) => i % 2 === 1)}</div>
          </div>
        )}
      </section>

      <FinalCta />
    </div>
  )
}
