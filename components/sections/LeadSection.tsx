import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { LeadForm } from '@/components/forms/LeadForm'

export function LeadSection() {
  const t = useTranslations('contact.leadForm')
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-accent-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-accent-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left panel ── */}
          <ScrollReveal animation="fadeInLeft" className="flex flex-col gap-8">
            {/* Section label */}
            <div>
              <p className="text-accent-primary text-xs font-semibold tracking-[0.18em] mb-4">
                {t('sectionLabel')}
              </p>
              <h2 className="text-display-md font-display font-bold text-text-primary leading-tight">
                {t('heading')}{' '}
                <span className="gradient-text">{t('headingAccent')}</span>
              </h2>
            </div>

            {/* Founder card */}
            <div
              className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
            >
              {/* Logo avatar */}
              <div className="w-14 h-14 rounded-full shrink-0 shadow-[0_0_20px_rgba(108,99,255,0.4)] overflow-hidden border-2 border-accent-primary/40">
                <img
                  src="/images/testimonials/pasha.jpg"
                  alt="Paşa Quliyev"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-semibold">{t('founderName')}</p>
                <p className="text-text-muted text-sm">{t('founderRole')}</p>
                <p className="text-xs mt-1 text-green-400">{t('founderStatus')}</p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#25D366] text-white font-semibold text-base hover:bg-[#20bd5a] transition-all duration-300 shadow-[0_0_28px_rgba(37,211,102,0.4)] hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] min-h-[56px]"
              aria-label={t('whatsappCta')}
            >
              <MessageCircle size={22} />
              {t('whatsappCta')}
            </a>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: '⚡', key: 'trustBadges.response' },
                { icon: '🔒', key: 'trustBadges.confidential' },
                { icon: '🎯', key: 'trustBadges.free' },
              ].map((badge) => (
                <div
                  key={badge.key}
                  className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center"
                >
                  <span className="text-lg sm:text-xl" aria-hidden="true">{badge.icon}</span>
                  <span className="text-text-muted text-[10px] sm:text-xs leading-tight">
                    {t(badge.key as any)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* ── Right panel: form ── */}
          <ScrollReveal animation="fadeInRight">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-6 sm:p-8 shadow-[0_0_40px_rgba(108,99,255,0.08)]">
              {/* Form header */}
              <div className="mb-6">
                <h3 className="text-text-primary font-display font-bold text-xl mb-1">
                  {t('formTitle')}
                </h3>
                <p className="text-text-muted text-sm">{t('formSubtitle')}</p>
              </div>

              <LeadForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
