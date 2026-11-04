/**
 * Site footer.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { LEGAL_PAGES, NAV_ITEMS, SERVICE_IDS, serviceHref } from '@/lib/site/navigation'

// Maps always gets the Azerbaijani address; it geocodes reliably.
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Rəşid Behbudov küçəsi 55, Bakı, Azərbaycan')

const SOCIAL = [
  { href: 'https://instagram.com/cradexagency', icon: Instagram, label: 'Instagram' },
  { href: 'https://facebook.com/cradexagency', icon: Facebook, label: 'Facebook' },
  { href: 'https://linkedin.com/company/cradexagency', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com/@cradexagency', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  const locale = useLocale()
  const t = useTranslations('site.footer')
  const tNav = useTranslations('site.nav')
  const tS = useTranslations('site.services')
  const tOld = useTranslations('footer')
  const tLegal = useTranslations('site.legal')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-bg-secondary pb-28 md:pb-0">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
        <div className="space-y-5">
          <Link href={`/${locale}`} aria-label={tNav('home')} className="inline-block">
            <Logo className="h-9" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-text-secondary">{t('tagline')}</p>
          <ul className="flex gap-2">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-secondary transition-colors hover:border-accent-primary/50 hover:text-text-primary"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-text-primary">{t('company')}</h2>
          <ul className="space-y-0.5 text-sm">
            {NAV_ITEMS.filter((i) => i.key !== 'services' && i.key !== 'home').map((i) => (
              <li key={i.key}>
                <Link href={`/${locale}${i.href}`} className="inline-flex min-h-9 items-center text-text-secondary transition-colors hover:text-text-primary">
                  {tNav(i.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-text-primary">{t('services')}</h2>
          <ul className="space-y-0.5 text-sm">
            {SERVICE_IDS.map((s) => (
              <li key={s}>
                <Link href={serviceHref(locale, s)} className="inline-flex min-h-9 items-center text-text-secondary transition-colors hover:text-text-primary">
                  {tS(`${s}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <h2 className="text-sm font-semibold text-text-primary">{t('contact')}</h2>
          <ul className="space-y-1 text-sm text-text-secondary">
            <li>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-9 items-start gap-2.5 py-1.5 hover:text-text-primary">
                <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {tOld('location')}
              </a>
            </li>
            <li>
              <a href="tel:+994507786887" className="flex min-h-9 items-center gap-2.5 hover:text-text-primary">
                <Phone size={16} className="shrink-0" aria-hidden="true" />
                +994 50 778 68 87
              </a>
            </li>
            <li>
              <a href="mailto:info@cradexagency.com" className="flex min-h-9 items-center gap-2.5 hover:text-text-primary">
                <Mail size={16} className="shrink-0" aria-hidden="true" />
                info@cradexagency.com
              </a>
            </li>
          </ul>
          <WhatsAppButton size="md" />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Cradex Agency. {t('rights')}
            <span className="mx-2 hidden md:inline">·</span>
            <br className="md:hidden" />
            {tLegal('taxId')}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_PAGES.map((p) => (
              <li key={p}>
                <Link href={`/${locale}/${p}`} className="inline-flex min-h-9 items-center transition-colors hover:text-text-primary">
                  {tLegal(`${p}.nav`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
