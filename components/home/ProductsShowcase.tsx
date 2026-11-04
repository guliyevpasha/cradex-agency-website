/**
 * Products: Chatbot and the social media combo packages.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Bot, Check, Instagram, Music2, Youtube } from 'lucide-react'
import { Tilt } from '@/components/ui/Tilt'
import { Reveal } from '@/components/ui/Reveal'
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

        {/* Chatbot */}
        <article
          id="chatbot"
          className="mt-12 grid scroll-mt-28 gap-8 rounded-[32px] bg-ink p-7 text-snow ring-1 ring-transparent dark:ring-snow/10 sm:p-10 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-strong text-snow">
              <Bot size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-3xl font-bold tracking-tight">{t('chatbot.title')}</h3>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-[#A6B0BD]">{t('chatbot.text')}</p>
          </div>
          {/* Bubbles appear one after another once the card scrolls into view. */}
          <Reveal className="chat-demo flex flex-col gap-3 rounded-3xl bg-[#13171D] p-5 sm:p-6">
            {(
              [
                ['me', 'user'],
                ['bot', 'bot'],
                ['me', 'user2'],
                ['bot', 'bot2'],
                ['me', 'user3'],
              ] as const
            ).map(([from, key], i) =>
              from === 'me' ? (
                <p
                  key={key}
                  className="chat-pop ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand-strong px-4 py-2.5 text-sm text-snow"
                  style={{ '--d': `${i * 0.7}s` } as React.CSSProperties}
                >
                  {t(`chatbot.${key}`)}
                </p>
              ) : (
                <p
                  key={key}
                  className="chat-pop w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-[#1C2129] px-4 py-2.5 text-sm text-[#E6EAEF]"
                  style={{ '--d': `${i * 0.7}s` } as React.CSSProperties}
                >
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5CB8FF]">{t('chatbot.label')}</span>
                  {t(`chatbot.${key}`)}
                </p>
              )
            )}
          </Reveal>
        </article>

        {/* Social media combo packages */}
        <div className="mt-16">
          <h3 className="text-center text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">{t('combo.title')}</h3>
          <p className="mt-3 text-center text-lg text-text-secondary">{t('combo.text')}</p>

          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {COMBOS.map(({ id, icon: Icon, tint }) => {
              const title = t(`combo.${id}Title`)
              const price = t(`combo.${id}Price`)
              const features = t.raw(`combo.${id}Features`) as string[]
              return (
                <li key={id} id={id} className="scroll-mt-28">
                  <Tilt max={5} className="h-full" innerClassName="h-full">
                    <article className="relative flex h-full flex-col rounded-[28px] border border-line bg-bg-primary p-7 shadow-card">
                      <span className="tilt-glare" />
                      <div className="tilt-z1 flex items-center gap-4">
                        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tint} text-snow shadow-card`}>
                          <Icon size={26} aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-lg font-bold text-text-primary">{title}</span>
                          <span className="mt-1 inline-flex rounded-full bg-[#16A34A]/10 px-2.5 py-0.5 text-sm font-bold text-[#15803D] dark:text-[#4ADE80]">
                            {t('combo.included')} · {price}
                          </span>
                        </span>
                      </div>
                      <ul className="tilt-z1 mt-7 grid flex-1 grid-cols-2 gap-x-4 gap-y-3">
                        {features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-[14px] text-text-secondary">
                            <Check size={15} className="shrink-0 text-accent-primary" aria-hidden="true" />
                            <span className="min-w-0">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={whatsappUrl(t('combo.orderMessage', { package: title }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tilt-z2 mt-8 inline-flex items-center justify-center rounded-full bg-text-primary px-5 py-3.5 text-[15px] font-semibold text-bg-primary transition-opacity hover:opacity-85"
                      >
                        {t('combo.order')} · {price}
                      </a>
                    </article>
                  </Tilt>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
