'use client'
/**
 * App-style bottom bar on phones. The centre button starts a demo request on
 * WhatsApp; "Menu" opens the same burger menu as the header.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Briefcase, Home, LayoutGrid, Menu } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { isActive, whatsappUrl } from '@/lib/site/navigation'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

export const OPEN_MENU_EVENT = 'cradex:open-menu'

export function MobileBottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const t = useTranslations('site.mobileNav')
  const tNav = useTranslations('site.nav')
  const tCta = useTranslations('site.cta')

  const links = [
    { href: '', label: t('home'), icon: Home, exact: true },
    { href: '/services', label: t('services'), icon: LayoutGrid },
  ]
  const linksRight = [{ href: '/portfolio', label: t('work'), icon: Briefcase }]

  const item = (l: { href: string; label: string; icon: typeof Home; exact?: boolean }) => {
    const active = isActive(pathname, locale, l.href, l.exact)
    const Icon = l.icon
    return (
      <Link
        key={l.href}
        href={`/${locale}${l.href}`}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex min-w-[58px] flex-col items-center gap-1 py-1.5 text-[11px] font-semibold transition-colors',
          active ? 'text-snow' : 'text-[#8E98A6]'
        )}
      >
        <Icon size={21} strokeWidth={2} aria-hidden="true" />
        <span>{l.label}</span>
      </Link>
    )
  }

  return (
    <nav aria-label={tNav('mobileNav')} className="fixed inset-x-0 bottom-0 z-30 px-3 pb-safe md:hidden">
      <div className="mb-3 grid grid-cols-5 items-center rounded-[26px] bg-ink/95 px-2 py-1.5 shadow-float backdrop-blur-xl ring-1 ring-snow/10">
        {links.map(item)}
        <a
          href={whatsappUrl(tCta('whatsappMessage'))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-snow"
        >
          <span className="-mt-7 flex h-14 w-14 items-center justify-center rounded-[20px] bg-brand-strong text-snow shadow-brand ring-4 ring-bg-primary">
            <WhatsAppIcon className="h-6 w-6" />
          </span>
          <span>{t('demo')}</span>
        </a>
        {linksRight.map(item)}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}
          className="flex min-w-[58px] flex-col items-center gap-1 py-1.5 text-[11px] font-semibold text-[#8E98A6] transition-colors hover:text-snow"
        >
          <Menu size={21} aria-hidden="true" />
          <span>{t('menu')}</span>
        </button>
      </div>
    </nav>
  )
}
