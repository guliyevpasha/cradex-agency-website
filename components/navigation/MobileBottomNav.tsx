'use client'
/**
 * App-style bottom bar on phones, edge to edge. Services, products, work and
 * pricing open the burger menu with that section already expanded; the
 * centre button asks for a demo site on WhatsApp.
 * @author Paşa Quliyev — Cradex Agency
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Briefcase, Home, LayoutGrid, Menu, Package, Tag } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { isActive, whatsappUrl } from '@/lib/site/navigation'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

export const OPEN_MENU_EVENT = 'cradex:open-menu'

/** Which menu section to expand when the burger opens (none = just open). */
export type MenuSection = 'services' | 'products' | 'work' | 'pricing'

export const openMenu = (section?: MenuSection) =>
  window.dispatchEvent(new CustomEvent<MenuSection | undefined>(OPEN_MENU_EVENT, { detail: section }))

const ITEM = 'flex min-w-0 flex-col items-center gap-1 pb-1.5 pt-2 text-[10px] font-semibold leading-none transition-colors'

export function MobileBottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const t = useTranslations('site.mobileNav')
  const tNav = useTranslations('site.nav')

  const section = (id: MenuSection, href: string, label: string, Icon: typeof Home) => {
    const active = isActive(pathname, locale, href)
    return (
      <button
        key={id}
        type="button"
        onClick={() => openMenu(id)}
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        className={cn(ITEM, active ? 'text-snow' : 'text-[#8E98A6] hover:text-snow')}
      >
        <Icon size={20} strokeWidth={2} aria-hidden="true" />
        <span className="w-full truncate text-center">{label}</span>
      </button>
    )
  }

  const homeActive = isActive(pathname, locale, '', true)

  return (
    <nav aria-label={tNav('mobileNav')} className="fixed inset-x-0 bottom-0 z-30 md:hidden">
      <div className="grid grid-cols-7 items-end rounded-t-[22px] border-t border-snow/10 bg-ink/95 px-1 pb-safe shadow-float backdrop-blur-xl">
        <Link href={`/${locale}`} aria-current={homeActive ? 'page' : undefined} className={cn(ITEM, homeActive ? 'text-snow' : 'text-[#8E98A6]')}>
          <Home size={20} strokeWidth={2} aria-hidden="true" />
          <span className="w-full truncate text-center">{t('home')}</span>
        </Link>
        {section('services', '/services', t('services'), LayoutGrid)}
        {section('products', '/products', t('products'), Package)}
        <a
          href={whatsappUrl(t('demoMessage'))}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(ITEM, 'text-snow')}
        >
          <span className="-mt-6 mb-1.5 flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-brand-strong text-snow shadow-brand ring-4 ring-bg-primary">
            <WhatsAppIcon className="h-6 w-6" />
          </span>
          <span className="w-full truncate text-center">{t('demo')}</span>
        </a>
        {section('work', '/portfolio', t('work'), Briefcase)}
        {section('pricing', '/pricing', t('pricing'), Tag)}
        <button type="button" onClick={() => openMenu()} aria-haspopup="dialog" aria-controls="mobile-menu" className={cn(ITEM, 'text-[#8E98A6] hover:text-snow')}>
          <Menu size={20} aria-hidden="true" />
          <span className="w-full truncate text-center">{t('menu')}</span>
        </button>
      </div>
    </nav>
  )
}
