/**
 * Combo packages: long-form product details. Intro and a table of contents
 * stay pinned on the left on desktop; the numbered sections scroll past.
 * Copy: site.comboPage.details.
 * @author Paşa Quliyev — Cradex Agency
 */
import { getTranslations } from 'next-intl/server'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'

export async function ComboDetails({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'site.comboPage.details' })
  const sections = t.raw('sections') as { t: string; d: string }[]

  return (
    <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:py-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
        <AnimatedHeading as="h2" className="mt-3 text-4xl font-extrabold leading-[1.06] tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('title')} />
        <p className="mt-5 text-lg leading-relaxed text-text-secondary">{t('lead')}</p>
        <ol className="mt-7 hidden space-y-1 border-l border-line lg:block">
          {sections.map((s, i) => (
            <li key={s.t}>
              <a href={`#cd-${i + 1}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[15px] text-text-muted transition-colors hover:border-accent-primary hover:text-text-primary">
                {String(i + 1).padStart(2, '0')} · {s.t}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <ol className="space-y-4">
        {sections.map((s, i) => (
          <li key={s.t} id={`cd-${i + 1}`} className="scroll-mt-28">
            <Reveal className="rv-3d" delay={(i % 2) * 90}>
              <Tilt max={4}>
                <article className="svc relative rounded-[28px] border border-line bg-bg-secondary p-6 shadow-card sm:p-8">
                  <span className="tilt-glare" />
                  <span className="tilt-z3 block bg-gradient-to-b from-accent-primary to-accent-primary/10 bg-clip-text text-5xl font-extrabold tracking-[-0.05em] text-transparent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="tilt-z1 mt-3 text-2xl font-bold tracking-tight text-text-primary">{s.t}</h3>
                  <p className="tilt-z1 mt-3 text-[16px] leading-relaxed text-text-secondary">{s.d}</p>
                </article>
              </Tilt>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
