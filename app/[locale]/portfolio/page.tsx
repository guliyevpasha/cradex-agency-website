/**
 * Portfolio: website projects only, as 3D laptop + phone mockups in two
 * staggered columns, filtered by business field and split into pages
 * (WebWorksBrowser). Other categories are archived (archive/portfolio-all).
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPortfolio } from '@/lib/data/portfolio'
import { clientName, cleanSlug, domainOf, isShown, shortSummary, shotsFor } from '@/lib/site/portfolio'
import { WEB_FIELDS, isWebField } from '@/lib/site/webCategories'
import { WebProjectCard } from '@/components/portfolio/WebProjectCard'
import { WebWorksBrowser } from '@/components/portfolio/WebWorksBrowser'
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
  const c = await getTranslations({ locale, namespace: 'site.workPages.common' })

  // Newest first; projects without phone captures go last, they look weaker
  // on the devices.
  const items = (await getAllPortfolio(locale))
    .filter(isShown)
    .sort((a, b) => Number(Boolean(shotsFor(b).mobile)) - Number(Boolean(shotsFor(a).mobile)) || (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))

  const cards = items.map((item, i) => {
    const domain = domainOf(item.projectUrl)
    const field = isWebField(item.industry) ? item.industry : undefined
    const year = item.publishedAt ? item.publishedAt.slice(0, 4) : null
    return {
      key: item.id,
      field,
      node: (
        <Reveal className="rv-3d" delay={(i % 2) * 140}>
          <WebProjectCard
            href={`/${locale}/portfolio/${cleanSlug(item.slug)}`}
            shots={shotsFor(item)}
            client={clientName(item, locale)}
            summary={shortSummary(item, locale)}
            tags={[field ? t(`fields.${field}`) : tWork('chip'), ...(domain ? [domain] : []), ...(year ? [year] : [])]}
            priority={i < 2}
          />
        </Reveal>
      ),
    }
  })

  // Only fields that have a project get a chip.
  const fields = WEB_FIELDS.map((f) => ({ value: f.value, label: t(`fields.${f.value}`), count: cards.filter((x) => x.field === f.value).length })).filter((f) => f.count > 0)

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

      <section className="pb-14 pt-6 lg:pb-20">
        {items.length === 0 ? (
          <p className="container-x text-text-secondary">{t('empty')}</p>
        ) : (
          <WebWorksBrowser
            items={cards}
            fields={fields}
            labels={{ filter: t('filter'), all: t('all'), nav: c('pages'), page: c.raw('page'), prev: c('prev'), next: c('next') }}
          />
        )}
      </section>

      <FinalCta />
    </div>
  )
}
