/**
 * Campaign results shown as ad-panel cards. Only real figures from client
 * ad accounts go in site.adsPricingPage.results; with none, the section
 * is not rendered at all.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { siGoogleads, siLinkedin, siMeta, siTiktok, type SimpleIcon } from 'simple-icons'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import type { AdsPackageId } from '@/lib/site/adsPricing'

export type AdsResult = {
  platform: AdsPackageId
  client: string
  period: string
  text: string
  metrics: { k: string; v: string }[]
}

const ICONS: Record<AdsPackageId, SimpleIcon> = { meta: siMeta, google: siGoogleads, tiktok: siTiktok, linkedin: siLinkedin }
const NAMES: Record<AdsPackageId, string> = { meta: 'Meta Ads', google: 'Google Ads', tiktok: 'TikTok Ads', linkedin: 'LinkedIn Ads' }

export function AdsResults() {
  const t = useTranslations('site.adsPricingPage')
  const results = t.raw('results') as AdsResult[]
  if (!Array.isArray(results) || results.length === 0) return null

  return (
    <section className="container-x py-14 lg:py-20">
      <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('resultsTitle')} />
      <p className="mt-3 max-w-2xl text-lg text-text-secondary">{t('resultsText')}</p>

      <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
        {results.map((r, i) => (
          <li key={`${r.platform}-${r.client}`}>
            <Reveal className="rv-3d h-full" delay={(i % 2) * 90}>
              <Tilt max={5} className="h-full" innerClassName="h-full">
                <article className="relative h-full overflow-hidden rounded-[28px] bg-ink p-6 text-snow shadow-float sm:p-8">
                  <span className="tilt-glare" />
                  <div className="tilt-z2 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-snow/10 px-3 py-1.5 text-xs font-bold">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                        <path d={ICONS[r.platform].path} />
                      </svg>
                      {NAMES[r.platform]}
                    </span>
                    <span className="text-xs text-snow/60">{r.period}</span>
                  </div>
                  <h3 className="tilt-z1 mt-5 text-2xl font-extrabold">{r.client}</h3>
                  <dl className="tilt-z2 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {r.metrics.map((m) => (
                      <div key={m.k} className="rounded-2xl bg-snow/[0.06] p-3">
                        <dt className="truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-snow/60">{m.k}</dt>
                        <dd className="mt-1 text-xl font-extrabold tabular-nums">{m.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="tilt-z1 mt-5 leading-relaxed text-snow/80">{r.text}</p>
                </article>
              </Tilt>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
