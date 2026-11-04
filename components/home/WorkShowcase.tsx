/**
 * "Selected projects" on the home page: website work only, two staggered
 * full-width columns of 3D device mockups.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowUpRight } from 'lucide-react'
import { getAllPortfolio } from '@/lib/data/portfolio'
import { clientName, cleanSlug, domainOf, isWebsite, shortSummary, shotsFor } from '@/lib/site/portfolio'
import { WebProjectCard } from '@/components/portfolio/WebProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { ScrollFillText } from '@/components/ui/ScrollFillText'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'

const LIMIT = 6

export async function WorkShowcase() {
  const locale = await getLocale()
  const t = await getTranslations('site.work')
  const websites = (await getAllPortfolio(locale)).filter(isWebsite)
  // Projects with live captures first: they look best on the devices.
  const items = [...websites]
    .sort((a, b) => Number(Boolean(shotsFor(b).mobile)) - Number(Boolean(shotsFor(a).mobile)))
    .slice(0, LIMIT)
  if (items.length === 0) return null

  const cards = items.map((item, i) => {
    const domain = domainOf(item.projectUrl)
    return (
      <Reveal key={item.id} className="rv-3d" delay={(i % 2) * 140}>
        <WebProjectCard
          href={`/${locale}/portfolio/${cleanSlug(item.slug)}`}
          shots={shotsFor(item)}
          client={clientName(item, locale)}
          summary={shortSummary(item, locale)}
          tags={domain ? [t('chip'), domain] : [t('chip')]}
          priority={i < 2}
        />
      </Reveal>
    )
  })

  const left = cards.filter((_, i) => i % 2 === 1)
  const right = cards.filter((_, i) => i % 2 === 0)

  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1680px] gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-x-14 lg:px-12">
        <div className="flex flex-col gap-14 lg:gap-24">
          <Reveal className="lg:pt-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
            <AnimatedHeading
              className="mt-3 text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-text-primary sm:text-6xl xl:text-[4.4rem] 2xl:text-[5.25rem]"
              text={t('title')}
            />
            <ScrollFillText
              className="mt-6 max-w-lg text-xl leading-relaxed text-text-primary sm:text-2xl"
              segments={[{ text: t('subtitle') }]}
            />
            <Link
              href={`/${locale}/portfolio`}
              className="mt-10 inline-flex items-center gap-3 rounded-full border-2 border-text-primary px-7 py-3.5 text-[17px] font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
            >
              {t('cta')}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </Reveal>
          {left}
        </div>
        <div className="flex flex-col gap-14 lg:gap-24">{right}</div>
      </div>
    </section>
  )
}
