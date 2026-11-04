'use client'
/**
 * Business email: the visitor types a name and a domain and sees the address
 * live on an inbox mock-up. Followed by the domain availability tool.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AtSign, Check, Inbox, Mail, Star } from 'lucide-react'
import { Tilt } from '@/components/ui/Tilt'
import { Reveal } from '@/components/ui/Reveal'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { DomainChecker } from './DomainChecker'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'

const clean = (s: string, re: RegExp) => s.toLowerCase().replace(re, '').slice(0, 40)

export function CorporateEmail() {
  const t = useTranslations('site.email')
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')

  const address = `${name || t('name')}@${domain || t('domain')}`

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
            <AnimatedHeading className="mt-3 text-display-lg font-extrabold tracking-[-0.035em] text-text-primary" text={t('title')} />
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">{t('text')}</p>
            <ul className="mt-8 space-y-3">
              {(['p1', 'p2', 'p3'] as const).map((k) => (
                <li key={k} className="flex items-center gap-3 text-[15px] text-text-primary">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary/10 text-accent-ink">
                    <Check size={15} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {t(k)}
                </li>
              ))}
            </ul>
            <WhatsAppButton className="mt-10" label={t('cta')} message={t('message', { email: address })} />
          </Reveal>

          <Reveal className="rv-3d" delay={120}>
            <Tilt max={6}>
              <div className="relative rounded-[32px] border border-line bg-bg-secondary p-6 shadow-float sm:p-8">
                <span className="tilt-glare" />

                {/* address builder */}
                <div className="tilt-z1">
                  <p className="text-sm font-semibold text-text-secondary">{t('example')}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-bg-primary p-2">
                    <label htmlFor="mail-name" className="sr-only">
                      {t('nameLabel')}
                    </label>
                    <input
                      id="mail-name"
                      value={name}
                      onChange={(e) => setName(clean(e.target.value, /[^a-z0-9._-]/g))}
                      placeholder={t('name')}
                      autoComplete="off"
                      spellCheck={false}
                      className="h-12 w-28 min-w-0 flex-1 rounded-xl bg-bg-secondary px-4 text-[16px] font-semibold text-text-primary outline-none placeholder:text-text-muted focus:ring-2 focus:ring-accent-primary/40"
                    />
                    <span className="flex h-12 w-9 items-center justify-center text-text-muted">
                      <AtSign size={20} aria-hidden="true" />
                    </span>
                    <label htmlFor="mail-domain" className="sr-only">
                      {t('domainLabel')}
                    </label>
                    <input
                      id="mail-domain"
                      value={domain}
                      onChange={(e) => setDomain(clean(e.target.value, /[^a-z0-9.-]/g))}
                      placeholder={t('domain')}
                      autoComplete="off"
                      spellCheck={false}
                      className="h-12 w-44 min-w-0 flex-[2] rounded-xl bg-bg-secondary px-4 text-[16px] font-semibold text-text-primary outline-none placeholder:text-text-muted focus:ring-2 focus:ring-accent-primary/40"
                    />
                  </div>
                </div>

                {/* inbox mock-up */}
                <div className="tilt-z2 mt-6 overflow-hidden rounded-2xl border border-line bg-bg-primary shadow-card" aria-hidden="true">
                  <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-strong text-snow">
                      <Inbox size={18} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-text-primary">{address}</span>
                    <span className="rounded-full bg-brand-strong px-2 py-0.5 text-xs font-bold text-snow">3</span>
                  </div>
                  {(['', '2', '3'] as const).map((n, i) => (
                    <div key={i} className="flex items-start gap-3 border-b border-line px-5 py-4 last:border-0">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-bold text-text-primary">{t(`inbox${n}From`)}</span>
                          <span className="shrink-0 text-xs text-text-muted">{['09:41', '09:12', '08:30'][i]}</span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-text-secondary">
                          {i === 0 ? (
                            <Star size={13} className="shrink-0 fill-[#F5B301] text-[#F5B301]" />
                          ) : (
                            <Mail size={13} className="shrink-0 text-accent-ink" />
                          )}
                          <span className="shrink-0 font-medium">{t(`inbox${n}Subject`)}</span>
                          <span className="truncate text-text-muted">— {t(`inbox${n}Preview`)}</span>
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Tilt>
          </Reveal>
        </div>

        <DomainChecker />
      </div>
    </section>
  )
}
