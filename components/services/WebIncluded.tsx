/**
 * "Included in every package" for the website service: six 3D cards, each
 * with its bullet points, and a link to the packages on the pricing page.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowUpRight, Check } from 'lucide-react'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'

type Item = { t: string; d: string; points: string[] }

export async function WebIncluded() {
  const locale = await getLocale()
  const t = await getTranslations('site.servicePage.web.included')
  const items = t.raw('items') as Item[]

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('title')} />
        <p className="max-w-xl text-lg leading-relaxed text-text-secondary lg:justify-self-end">{t('text')}</p>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.t}>
            <Reveal className="rv-3d h-full" delay={(i % 3) * 90}>
              <Tilt max={6} className="h-full" innerClassName="h-full">
                <article className="svc relative flex h-full flex-col rounded-3xl border border-line bg-bg-secondary p-7 shadow-card">
                  <span className="tilt-glare" />
                  <span className="tilt-z3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-strong text-sm font-extrabold text-snow svc-icon">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="tilt-z1 mt-5 text-xl font-bold tracking-tight text-text-primary">{item.t}</h3>
                  <p className="tilt-z1 mt-2 leading-relaxed text-text-secondary">{item.d}</p>
                  <ul className="tilt-z1 mt-5 space-y-2 border-t border-line pt-5">
                    {item.points.map((p) => (
                      <li key={p} className="flex gap-2 text-[15px] leading-snug text-text-secondary">
                        <Check size={16} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Tilt>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link
          href={`/${locale}/pricing`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-text-primary px-6 py-3 text-[15px] font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
        >
          {t('cta')}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
