/**
 * Shared layout for the terms, privacy and refund pages.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils/cn'
import { LEGAL_PAGES, type LegalPageId } from '@/lib/site/navigation'

// Bump when the text changes.
const UPDATED = '2026-11-07'

type Section = { h: string; p: string[] }

export async function LegalPage({ page, locale }: { page: LegalPageId; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'site.legal' })
  const sections = t.raw(`${page}.sections`) as Section[]
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(UPDATED))

  return (
    <div className="container-x pb-20 pt-32 lg:pb-28 lg:pt-40">
      <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
        <nav aria-label={t('footerTitle')} className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('footerTitle')}</p>
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {LEGAL_PAGES.map((p) => (
              <li key={p}>
                <Link
                  href={`/${locale}/${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={cn(
                    'block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                    p === page ? 'bg-brand-strong text-snow' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                  )}
                >
                  {t(`${p}.nav`)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-text-muted">
            {t('sellerShort')}
            <br />
            {t('taxId')}
          </p>
        </nav>

        <article className="max-w-3xl">
          <h1 className="text-display-lg font-extrabold tracking-[-0.035em] text-text-primary">{t(`${page}.title`)}</h1>
          <p className="mt-3 text-sm text-text-muted">{t('updated', { date })}</p>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t(`${page}.intro`)}</p>

          <div className="mt-10 space-y-8">
            {sections.map((s) => (
              <section key={s.h} className="rounded-3xl border border-line bg-bg-secondary p-6 sm:p-8">
                <h2 className="text-xl font-bold text-text-primary">{s.h}</h2>
                <div className="mt-3 space-y-3">
                  {s.p.map((para, i) => (
                    <p key={i} className="leading-relaxed text-text-secondary">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
