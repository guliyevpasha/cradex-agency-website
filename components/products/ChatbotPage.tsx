/**
 * Chatbot / AI assistant product page: hero with a live chat on a phone,
 * who it is for, what is included, how we work, price and timing, FAQ and
 * the enquiry form. Copy: site.chatbotPage.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowDown, Bot, Check, ChevronDown, ChevronRight, Globe, Instagram, Mail, Send } from 'lucide-react'
import { whatsappUrl } from '@/lib/site/navigation'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppButton, WhatsAppIcon } from '@/components/ui/WhatsAppButton'
import { CONTACT_EMAIL, ChatbotForm } from './ChatbotForm'
import { ServiceProof } from '@/components/services/ServiceProof'

const PHONE = '+994 50 778 68 87'

type Step = { t: string; d: string }
type Faq = { q: string; a: string }

export async function ChatbotPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'site.chatbotPage' })
  const tP = await getTranslations({ locale, namespace: 'site.products.chatbot' })
  const chips = t.raw('chips') as string[]
  const forItems = t.raw('forItems') as string[]
  const includes = t.raw('includes') as string[]
  const steps = t.raw('steps') as Step[]
  const priceItems = t.raw('priceItems') as { n: string; l: string }[]
  const priceText = t.raw('priceText') as string[]
  const faq = t.raw('faq') as Faq[]

  const chat = [
    ['me', 'user'],
    ['bot', 'bot'],
    ['me', 'user2'],
    ['bot', 'bot2'],
    ['me', 'user3'],
  ] as const

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-14 pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pb-20">
        <div>
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
            <Link href={`/${locale}`} className="inline-flex min-h-9 items-center hover:text-text-primary">{t('home')}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href={`/${locale}/products`} className="inline-flex min-h-9 items-center hover:text-text-primary">{t('products')}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-text-secondary">{t('title')}</span>
          </nav>
          <AnimatedHeading
            as="h1"
            className="mt-6 text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-text-primary sm:text-6xl"
            text={t('title')}
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">{t('text')}</p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <li
                key={c}
                className={`rounded-full border px-4 py-2 text-[14px] font-bold ${i === 0 ? 'border-transparent bg-brand-strong text-snow' : 'border-line bg-bg-secondary text-text-primary'}`}
              >
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <WhatsAppButton label={t('ask')} message={t('askMessage')} />
            <a
              href="#muraciet"
              className="inline-flex items-center gap-2 rounded-full border-2 border-text-primary px-7 py-[14px] text-[15px] font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
            >
              {t('apply')}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* phone with the assistant talking, channel badges around it */}
        <Reveal className="rv-3d mx-auto w-full max-w-[440px] px-6">
          <Tilt max={9}>
            <div className="cb-stage relative" aria-hidden="true">
              <div className="cb-phone tilt-z1 relative mx-auto w-[78%] rounded-[44px] border-[10px] border-ink bg-ink shadow-float dark:border-[#232934]">
                <i className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink dark:bg-[#232934]" />
                <div className="overflow-hidden rounded-[34px] bg-bg-primary">
                  <div className="flex items-center gap-3 border-b border-line bg-bg-secondary px-4 pb-3 pt-9">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-strong text-snow">
                      <Bot size={17} />
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold text-text-primary">{t('demoTitle')}</span>
                      <span className="flex items-center gap-1 text-[11px] text-[#16A34A] dark:text-[#4ADE80]">
                        <i className="hv-live h-1.5 w-1.5 rounded-full bg-[#22C55E]" /> {t('demoOnline')}
                      </span>
                    </span>
                  </div>
                  <div className="chat-demo rv-in flex min-h-[340px] flex-col gap-2.5 p-4">
                    {chat.map(([from, key], i) =>
                      from === 'me' ? (
                        <p
                          key={key}
                          className="chat-pop ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand-strong px-3.5 py-2 text-[13px] text-snow"
                          style={{ '--d': `${0.4 + i * 0.7}s` } as React.CSSProperties}
                        >
                          {tP(key)}
                        </p>
                      ) : (
                        <p
                          key={key}
                          className="chat-pop w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-bg-secondary px-3.5 py-2 text-[13px] text-text-primary"
                          style={{ '--d': `${0.4 + i * 0.7}s` } as React.CSSProperties}
                        >
                          {tP(key)}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
              <span className="cb-badge cb-b1 tilt-z3 bg-[#25D366]"><WhatsAppIcon className="h-6 w-6" /></span>
              <span className="cb-badge cb-b2 tilt-z3 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]"><Instagram size={22} /></span>
              <span className="cb-badge cb-b3 tilt-z3 bg-[#229ED9]"><Send size={20} /></span>
              <span className="cb-badge cb-b4 tilt-z3 bg-brand-strong"><Globe size={20} /></span>
            </div>
          </Tilt>
        </Reveal>
      </section>

      {/* Who it is for / what is included */}
      <section className="container-x grid gap-5 py-10 md:grid-cols-2">
        <Reveal className="rv-3d h-full">
          <div className="h-full rounded-[32px] border border-line bg-bg-secondary p-7 sm:p-9">
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">{t('forTitle')}</h2>
            <ul className="mt-6 space-y-3">
              {forItems.map((x) => (
                <li key={x} className="flex gap-3 leading-relaxed text-text-secondary">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal className="rv-3d h-full" delay={120}>
          <div className="h-full rounded-[32px] bg-ink p-7 text-snow sm:p-9 dark:ring-1 dark:ring-snow/10">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t('includesTitle')}</h2>
            <ul className="mt-6 space-y-3">
              {includes.map((x) => (
                <li key={x} className="flex gap-3 leading-relaxed text-snow/85">
                  <Check size={17} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* How we work */}
      <section className="container-x py-14 lg:py-20">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('stepsTitle')} />
        <ol className="cb-steps mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.t} className="relative pt-7">
              <span className={`cb-dot absolute left-0 top-0 h-3.5 w-3.5 rounded-full ${i === steps.length - 1 ? 'bg-brand' : 'bg-text-primary'}`} aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-1 text-lg font-bold text-text-primary">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Price and timing */}
      <section className="container-x py-6">
        <Reveal className="rv-3d">
          <div className="rounded-[36px] border border-line bg-bg-secondary p-7 sm:p-10 lg:p-12">
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-4xl">{t('priceTitle')}</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {priceItems.map((p, i) => (
                <li key={p.l}>
                  <Tilt max={8} className="h-full" innerClassName="h-full">
                    <div className={`relative h-full rounded-3xl p-6 shadow-card ${i === 0 ? 'bg-brand-strong text-snow' : 'bg-bg-primary text-text-primary'}`}>
                      <span className="tilt-glare" />
                      <span className="tilt-z2 block text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{p.n}</span>
                      <span className={`tilt-z1 mt-1 block text-sm ${i === 0 ? 'text-snow/85' : 'text-text-secondary'}`}>{p.l}</span>
                    </div>
                  </Tilt>
                </li>
              ))}
            </ul>
            <div className="mt-8 max-w-3xl space-y-3 leading-relaxed text-text-secondary">
              {priceText.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12 lg:py-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('faqTitle')} />
          <div className="mt-8">
            <WhatsAppButton label={t('ask')} message={t('askMessage')} size="md" />
          </div>
        </div>
        <div className="space-y-3">
          {faq.map((f, i) => (
            <details key={f.q} open={i === 0} className="group rounded-3xl border border-line bg-bg-secondary px-5 py-4 open:shadow-card sm:px-6 sm:py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-4 text-lg font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                <span className="w-7 shrink-0 text-sm font-bold text-accent-ink tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">{f.q}</span>
                <ChevronDown size={20} className="shrink-0 text-accent-ink transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 pl-11 leading-relaxed text-text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <ServiceProof service="chatbot" locale={locale} />

      {/* Enquiry */}
      <section id="muraciet" className="container-x scroll-mt-24 pb-24">
        <div className="pr-panel relative grid grid-cols-[minmax(0,1fr)] gap-10 overflow-hidden rounded-[40px] bg-ink p-7 text-snow sm:p-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-14 dark:ring-1 dark:ring-snow/10">
          <div>
            <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">{t('formTitle')}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-snow/75">{t('formText')}</p>
            <ul className="mt-8 space-y-3 text-[15px] font-semibold">
              <li>
                <a href={whatsappUrl(t('askMessage'))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-brand hover:underline">
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp {PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 items-center gap-3 text-brand hover:underline">
                  <Mail size={20} aria-hidden="true" /> {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
          <ChatbotForm />
        </div>
      </section>
    </div>
  )
}
