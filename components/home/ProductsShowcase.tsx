/**
 * Products: Chatbot and the social media combo packages.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Bot, Instagram, Music2, Youtube } from 'lucide-react'
import { whatsappUrl } from '@/lib/site/navigation'
import { SectionHeading } from './SectionHeading'

const COMBOS = [
  { id: 'instagram', icon: Instagram, tint: 'from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
  { id: 'tiktok', icon: Music2, tint: 'from-[#25F4EE] via-[#111111] to-[#FE2C55]' },
  { id: 'youtube', icon: Youtube, tint: 'from-[#FF0000] to-[#B30000]' },
] as const

export function ProductsShowcase({ detailed = false, headingAs = 'h2' }: { detailed?: boolean; headingAs?: 'h1' | 'h2' }) {
  const t = useTranslations('site.products')
  const tCta = useTranslations('site.cta')
  const locale = useLocale()

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading as={headingAs} eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
          {!detailed && (
            <Link href={`/${locale}/products`} className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-text-primary hover:text-accent-ink">
              {tCta('details')} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <article id="chatbot" className="scroll-mt-28 rounded-3xl bg-ink p-7 text-snow ring-1 ring-transparent dark:ring-snow/10 sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-strong text-snow">
              <Bot size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-2xl font-bold tracking-tight">{t('chatbot.title')}</h3>
            <p className="mt-2 max-w-md leading-relaxed text-[#A6B0BD]">{t('chatbot.text')}</p>
            <div className="mt-8 space-y-3" aria-hidden="true">
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand-strong px-4 py-2.5 text-sm text-snow">{t('chatbot.user')}</p>
              <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-[#1C2129] px-4 py-2.5 text-sm text-[#E6EAEF]">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5CB8FF]">Cradex AI</span>
                {t('chatbot.bot')}
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-line bg-bg-secondary p-7 sm:p-9">
            <h3 className="text-2xl font-bold tracking-tight text-text-primary">{t('combo.title')}</h3>
            <p className="mt-2 max-w-lg leading-relaxed text-text-secondary">{t('combo.text')}</p>
            <ul className="mt-7 grid gap-3">
              {COMBOS.map(({ id, icon: Icon, tint }) => (
                <li key={id} id={id} className="flex scroll-mt-28 flex-wrap items-center gap-4 rounded-2xl border border-line bg-bg-primary p-4 sm:flex-nowrap">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tint} text-snow`}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-text-primary">{t(`combo.${id}Title`)}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-text-secondary">{t(`combo.${id}Text`)}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-[#16A34A]/10 px-3 py-1 text-sm font-bold text-[#15803D] dark:text-[#4ADE80]">
                      {t(`combo.${id}Price`)}
                    </span>
                    <a
                      href={whatsappUrl(t('combo.orderMessage', { package: t(`combo.${id}Title`) }))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-text-primary px-4 py-2 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-85"
                    >
                      {t('combo.order')}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
