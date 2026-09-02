import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ContactContent />
}

function ContactContent() {
  const t = useTranslations('contact')
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'

  const contactInfo = [
    { icon: MapPin, label: t('info.address'), value: 'Bakı, Azərbaycan' },
    { icon: Phone, label: t('info.phone'), value: '+994 50 778 68 87', href: 'tel:+994507786887' },
    { icon: Mail, label: t('info.email'), value: 'info@cradexagency.com', href: 'mailto:info@cradexagency.com' },
    { icon: Clock, label: t('info.workingHours'), value: t('info.workingHoursValue') },
  ]

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <h1 className="text-display-lg font-display font-bold text-text-primary mb-4">
            {t('title')}
          </h1>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact form — 3 columns */}
          <div className="lg:col-span-3">
            <ScrollReveal animation="fadeInLeft">
              <GlassCard className="p-8">
                <ContactForm />
              </GlassCard>
            </ScrollReveal>
          </div>

          {/* Contact info — 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal animation="fadeInRight">
              <GlassCard className="p-6">
                <h2 className="text-text-primary font-semibold text-lg mb-5">
                  {t('info.title')}
                </h2>
                <ul className="space-y-4">
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={16} className="text-accent-primary" />
                      </div>
                      <div>
                        <p className="text-text-muted text-xs mb-0.5">{label}</p>
                        {href ? (
                          <a href={href} className="text-text-primary text-sm hover:text-accent-primary transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-text-primary text-sm">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </ScrollReveal>

            {/* WhatsApp CTA */}
            <ScrollReveal animation="fadeInRight" delay={100}>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold">WhatsApp</p>
                  <p className="text-text-muted text-sm">+994 50 778 68 87</p>
                </div>
                <div className="ml-auto text-[#25D366] group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </a>
            </ScrollReveal>

            {/* Social links — Instagram DM, Facebook Messenger, Gmail */}
            <ScrollReveal animation="fadeInRight" delay={200}>
              <GlassCard className="p-5">
                <p className="text-text-muted text-xs mb-4 uppercase tracking-wider">Sosial Media</p>
                <div className="flex flex-wrap gap-2">
                  {/* Instagram DM */}
                  <a
                    href="https://ig.me/m/cradexagency"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram DM"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-bg-tertiary hover:border-pink-500/40 hover:bg-pink-500/10 transition-all duration-200 group"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f09433"/>
                          <stop offset="50%" stopColor="#dc2743"/>
                          <stop offset="100%" stopColor="#bc1888"/>
                        </linearGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2" fill="none"/>
                      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-grad)"/>
                    </svg>
                    <span className="text-text-secondary text-xs group-hover:text-pink-400 transition-colors">Instagram</span>
                  </a>

                  {/* Facebook Messenger */}
                  <a
                    href="https://m.me/cradexagency"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Messenger"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-bg-tertiary hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200 group"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.378 5.504 3.538 7.24V22l3.226-1.773C9.8 20.4 10.88 20.6 12 20.6c5.523 0 10-4.145 10-9.357C22 6.145 17.523 2 12 2z" fill="#0084FF"/>
                      <path d="M13.5 14.5l-2.5-2.7-4.9 2.7 5.4-5.7 2.5 2.7 4.9-2.7-5.4 5.7z" fill="white"/>
                    </svg>
                    <span className="text-text-secondary text-xs group-hover:text-blue-400 transition-colors">Messenger</span>
                  </a>

                  {/* Gmail */}
                  <a
                    href="mailto:info@cradexagency.com"
                    aria-label="Gmail"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-bg-tertiary hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-200 group"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#EA4335" strokeWidth="1.5" fill="none"/>
                      <path d="M2 7l10 7 10-7" stroke="#EA4335" strokeWidth="1.5" fill="none"/>
                    </svg>
                    <span className="text-text-secondary text-xs group-hover:text-red-400 transition-colors">Gmail</span>
                  </a>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
