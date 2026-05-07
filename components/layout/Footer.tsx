import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Instagram, Facebook, Linkedin, Youtube, MessageCircle } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('common.nav')
  const tServices = useTranslations('services')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/about`, label: tNav('about') },
    { href: `/${locale}/journal`, label: tNav('journal') },
    { href: `/${locale}/calculator`, label: tNav('calculator') },
    { href: `/${locale}/portfolio`, label: tNav('portfolio') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ]

  const serviceLinks = [
    { href: `/${locale}/services/digital-marketing`, label: tServices('digitalMarketing.name') },
    { href: `/${locale}/services/smm`, label: tServices('smm.name') },
    { href: `/${locale}/services/branding`, label: tServices('branding.name') },
    { href: `/${locale}/services/graphic-motion-design`, label: tServices('graphicMotionDesign.name') },
    { href: `/${locale}/services/web-mobile-dev`, label: tServices('webMobileDev.name') },
  ]

  const socialLinks = [
    { href: 'https://instagram.com/cradexagency', icon: Instagram, label: 'Instagram' },
    { href: 'https://facebook.com/cradexagency', icon: Facebook, label: 'Facebook' },
    { href: 'https://linkedin.com/company/cradexagency', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://youtube.com/@cradexagency', icon: Youtube, label: 'YouTube' },
  ]

  return (
    <footer className="border-t border-white/10 bg-bg-secondary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center mb-4">
              <img src="/logo.svg" alt="Cradex Agency" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">{t('description')}</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('navigation')}
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('services')}
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('contact')}
            </h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li>📍 Bakı, Azərbaycan</li>
              <li>
                <a href="tel:+994507786887" className="hover:text-text-primary transition-colors">
                  📞 +994 50 778 68 87
                </a>
              </li>
              <li>
                <a href="mailto:info@cradexagency.com" className="hover:text-text-primary transition-colors">
                  📧 info@cradexagency.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/994507786887"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-[#20bd5a] transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {currentYear} Cradex Agency. {t('rights')}.</p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-text-primary transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-text-primary transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
