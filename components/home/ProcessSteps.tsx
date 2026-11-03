/**
 * "How it works" — the three steps of the demo offer.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { SectionHeading } from './SectionHeading'

export function ProcessSteps() {
  const t = useTranslations('site.process')
  const steps = [1, 2, 3] as const

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((n) => (
            <li key={n} className="relative rounded-3xl border border-line bg-bg-secondary p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-text-primary text-[15px] font-bold text-bg-primary">
                {n}
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-text-primary">{t(`step${n}Title`)}</h3>
              <p className="mt-2 leading-relaxed text-text-secondary">{t(`step${n}Text`)}</p>
              {n < 3 && (
                <span aria-hidden="true" className="absolute -right-3 top-1/2 hidden h-px w-6 bg-line md:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
