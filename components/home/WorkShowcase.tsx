/**
 * "Selected projects" on the home page: website work only, two staggered
 * columns of device mockups.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowUpRight } from 'lucide-react'
import { getAllPortfolio } from '@/lib/data/portfolio'
import { clientName, cleanSlug, domainOf, isWebsite, shortSummary } from '@/lib/site/portfolio'
import { WebProjectCard } from '@/components/portfolio/WebProjectCard'
import { Reveal } from '@/components/ui/Reveal'

const LIMIT = 6

export async function WorkShowcase() {
  const locale = await getLocale()
  const t = await getTranslations('site.work')
  const items = (await getAllPortfolio(locale)).filter(isWebsite).slice(0, LIMIT)
  if (items.length === 0) return null

  const cards = items.map((item, i) => {
    const domain = domainOf(item.projectUrl)
    return (
      <Reveal key={item.id} delay={(i % 2) * 120}>
        <WebProjectCard
          href={`/${locale}/portfolio/${cleanSlug(item.slug)}`}
          image={item.coverImage}
          client={clientName(item, locale)}
          summary={shortSummary(item, locale)}
          tags={domain ? [t('chip'), domain] : [t('chip')]}
        />
      </Reveal>
    )
  })

  const left = cards.filter((_, i) => i % 2 === 0)
  const right = cards.filter((_, i) => i % 2 === 1)

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-x-12">
        <div className="flex flex-col gap-14 lg:gap-20">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
            <h2 className="mt-3 text-display-xl font-extrabold tracking-[-0.045em] text-text-primary">{t('title')}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-text-secondary">{t('subtitle')}</p>
            <Link
              href={`/${locale}/portfolio`}
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-text-primary px-6 py-3 text-[15px] font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
            >
              {t('cta')}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
          {left}
        </div>
        <div className="flex flex-col gap-14 lg:gap-20">{right}</div>
      </div>
    </section>
  )
}
