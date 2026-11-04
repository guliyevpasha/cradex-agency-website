/**
 * Product pages: the chatbot / AI assistant and the social media combo
 * packages. Azerbaijani slugs in every language (see PRODUCT_LINKS).
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { LOCALES, PRODUCT_LINKS } from '@/lib/site/navigation'
import { ChatbotPage } from '@/components/products/ChatbotPage'
import { ComboCards } from '@/components/home/ProductsShowcase'
import { FinalCta } from '@/components/home/FinalCta'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

type Params = Promise<{ locale: string; slug: string }>

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.flatMap(({ code }) => PRODUCT_LINKS.map((p) => ({ locale: code, slug: p.slug })))
}

const productBySlug = (slug: string) => PRODUCT_LINKS.find((p) => p.slug === slug)

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const product = productBySlug(slug)
  if (!product) return {}
  const t = await getTranslations({ locale, namespace: product.id === 'chatbot' ? 'site.chatbotPage' : 'site.comboPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: `/${locale}/products/${slug}` },
  }
}

async function ComboPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'site.comboPage' })
  const chips = t.raw('chips') as string[]
  const steps = t.raw('steps') as { t: string; d: string }[]

  return (
    <div className="pt-24 lg:pt-28">
      <section className="container-x pb-10 pt-6">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
          <Link href={`/${locale}`} className="inline-flex min-h-9 items-center hover:text-text-primary">{t('home')}</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href={`/${locale}/products`} className="inline-flex min-h-9 items-center hover:text-text-primary">{t('products')}</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="text-text-secondary">{t('title')}</span>
        </nav>
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] items-end gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div>
            <AnimatedHeading
              as="h1"
              className="text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-text-primary sm:text-6xl"
              text={t('title')}
            />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">{t('text')}</p>
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
          </div>
          <div className="lg:justify-self-end">
            <WhatsAppButton label={t('ask')} message={t('askMessage')} variant="dark" />
          </div>
        </div>
      </section>

      <section className="container-x py-8">
        <ComboCards />
      </section>

      <section className="container-x py-14 lg:py-20">
        <AnimatedHeading className="text-4xl font-extrabold tracking-[-0.035em] text-text-primary sm:text-5xl" text={t('stepsTitle')} />
        <ol className="cb-steps mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.t} className="relative pt-7">
              <span className={`cb-dot absolute left-0 top-0 h-3.5 w-3.5 rounded-full ${i === steps.length - 1 ? 'bg-brand' : 'bg-text-primary'}`} aria-hidden="true" />
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">
                {String(i + 1).padStart(2, '0')}
                {i === 2 && <ShieldCheck size={14} aria-hidden="true" />}
              </p>
              <h3 className="mt-1 text-lg font-bold text-text-primary">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <FinalCta />
    </div>
  )
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const product = productBySlug(slug)
  if (!product) notFound()
  setRequestLocale(locale)
  return product.id === 'chatbot' ? <ChatbotPage locale={locale} /> : <ComboPage locale={locale} />
}
