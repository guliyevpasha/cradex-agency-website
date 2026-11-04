'use client'
/**
 * Site header: logo, main menu with Services / Products dropdowns, language,
 * theme switch and the WhatsApp call to action. Below xl it collapses to a
 * burger that opens <MobileMenu>.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, ChevronDown, Menu } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { NAV_ITEMS, PRODUCT_LINKS, SERVICE_IDS, serviceHref, isActive } from '@/lib/site/navigation'
import { LangDropdown } from './LangDropdown'
import { MobileMenu } from './MobileMenu'
import { OPEN_MENU_EVENT } from '@/components/navigation/MobileBottomNav'

type MenuId = 'services' | 'products'

function Dropdown({ id, onClose }: { id: MenuId; onClose: () => void }) {
  const locale = useLocale()
  const tNav = useTranslations('site.nav')
  const tS = useTranslations('site.services')
  const tP = useTranslations('site.products')

  const items =
    id === 'services'
      ? SERVICE_IDS.map((s) => ({ href: serviceHref(locale, s), title: tS(`${s}.title`), text: tS(`${s}.text`) }))
      : PRODUCT_LINKS.map((p) => ({
          href: `/${locale}/products#${p.id}`,
          title: tP(p.key),
          text:
            p.id === 'chatbot'
              ? tP('chatbot.text')
              : (tP.raw(`combo.${p.id}Features`) as string[]).slice(0, 4).join(' · '),
        }))

  return (
    <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3">
      <div className="rounded-3xl border border-line bg-bg-primary p-3 shadow-float">
        <ul className="grid grid-cols-2 gap-1">
          {items.map((it, i) => (
            <li key={it.href} className={cn(id === 'services' && i === 0 && 'col-span-2')}>
              <Link
                href={it.href}
                onClick={onClose}
                className="group flex h-full flex-col gap-1 rounded-2xl p-4 transition-colors hover:bg-bg-secondary"
              >
                <span className="flex items-center gap-2 text-[15px] font-semibold text-text-primary">
                  {it.title}
                  {id === 'services' && i === 0 && (
                    <span className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
                      {tS('featured')}
                    </span>
                  )}
                </span>
                <span className="line-clamp-2 text-[13px] leading-relaxed text-text-muted">{it.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/${id}`}
          onClick={onClose}
          className="mt-1 flex items-center justify-between rounded-2xl bg-bg-secondary px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:text-accent-ink"
        >
          {id === 'services' ? tNav('allServices') : tNav('allProducts')}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('site.nav')
  const tCta = useTranslations('site.cta')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menu, setMenu] = useState<MenuId | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenu(null)
    setMobileOpen(false)
  }, [pathname])

  // The phone bottom bar opens this same menu.
  useEffect(() => {
    const openMenu = () => setMobileOpen(true)
    window.addEventListener(OPEN_MENU_EVENT, openMenu)
    return () => window.removeEventListener(OPEN_MENU_EVENT, openMenu)
  }, [])

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null)
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [menu])

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const open = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMenu(id)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 140)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled || mobileOpen
            ? 'border-b border-line bg-bg-primary/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-bg-primary/0'
        )}
      >
        <div className="container-x flex h-[72px] items-center gap-4 xl:max-w-[1440px]">
          <Link href={`/${locale}`} aria-label={t('home')} className="shrink-0">
            <Logo className="h-8 sm:h-9" />
          </Link>

          <nav ref={navRef} aria-label={t('mainNav')} className="hidden flex-1 justify-center xl:flex">
            <ul className="flex items-center gap-0.5 2xl:gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, locale, item.href, 'exact' in item && item.exact)
                const href = `/${locale}${item.href}`
                const linkCls = cn(
                  'relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[14px] font-medium transition-colors 2xl:px-3',
                  active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                )

                if ('menu' in item) {
                  const id = item.menu as MenuId
                  return (
                    <li key={item.key} className="relative" onMouseEnter={() => open(id)} onMouseLeave={scheduleClose}>
                      <button
                        type="button"
                        className={linkCls}
                        aria-expanded={menu === id}
                        aria-haspopup="true"
                        onClick={() => (menu === id ? setMenu(null) : open(id))}
                      >
                        {t(item.key)}
                        <ChevronDown size={13} aria-hidden="true" className={cn('transition-transform', menu === id && 'rotate-180')} />
                        {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-primary" />}
                      </button>
                      {menu === id && <Dropdown id={id} onClose={() => setMenu(null)} />}
                    </li>
                  )
                }

                return (
                  <li key={item.key}>
                    <Link href={href} className={linkCls} aria-current={active ? 'page' : undefined}>
                      {t(item.key)}
                      {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-primary" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto hidden items-center gap-2 xl:flex">
            <LangDropdown />
            <ThemeToggle />
            <WhatsAppButton size="md" label={tCta('consult')} message={tCta('consultMessage')} className="ml-1 whitespace-nowrap" />
          </div>

          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <LangDropdown />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t('openMenu')}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-text-primary text-bg-primary transition-opacity hover:opacity-85"
            >
              <Menu size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={closeMobile} />
    </>
  )
}
