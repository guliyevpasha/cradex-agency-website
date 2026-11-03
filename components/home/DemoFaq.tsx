/**
 * FAQ. Native <details> so it works without JavaScript and with keyboards.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

export function DemoFaq() {
  const t = useTranslations('site.faq')
  const items = [1, 2, 3, 4] as const

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <div className="divide-y divide-line border-y border-line">
          {items.map((n) => (
            <details key={n} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-text-primary">
                {t(`q${n}`)}
                <Plus size={20} aria-hidden="true" className="shrink-0 text-text-muted transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">{t(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
