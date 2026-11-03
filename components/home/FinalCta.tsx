/**
 * Closing call to action.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export function FinalCta() {
  const t = useTranslations('site.final')
  const tHero = useTranslations('site.hero')

  return (
    <section className="pb-20 lg:pb-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[32px] bg-brand px-7 py-14 text-ink sm:px-14 sm:py-20">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-snow/20" />
          <div aria-hidden="true" className="absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-ink/10" />
          <div className="relative max-w-2xl">
            <h2 className="text-display-lg font-extrabold tracking-[-0.035em]">{t('title')}</h2>
            <p className="mt-4 text-lg text-ink/80">{t('text')}</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <WhatsAppButton variant="dark" className="bg-ink text-snow hover:bg-ink/90" />
              <span className="text-sm text-ink/75">{tHero('fine')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
