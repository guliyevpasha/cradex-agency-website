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
import { ArrowRight, Bot, ChevronDown, Code2, Megaphone, Menu, Search, Share2, ShieldCheck, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { NAV_ITEMS, PRODUCT_LINKS, SERVICE_IDS, productHref, serviceHref, isActive } from '@/lib/site/navigation'
import { LangDropdown } from './LangDropdown'
import { MobileMenu } from './MobileMenu'
import { OPEN_MENU_EVENT } from '@/components/navigation/MobileBottomNav'

type MenuId = 'services' | 'products'

const SERVICE_ICONS = { web: Code2, mobile: Smartphone, seo: Search, ads: Megaphone, support: ShieldCheck }
const PRODUCT_ICONS = { chatbot: Bot, combo: Share2 }

/*
 * Mega menu. Texts are shown in full (no clamping): the panel is wide enough
 * and the featured item gets its own dark card.
 */
function Dropdown({ id, onClose }: { id: MenuId; onClose: () => void }) {
  const locale = useLocale()
  const tNav = useTranslations('site.nav')
  const tS = useTranslations('site.services')
  const tM = useTranslations('site.productMenu')

  const footer = (
    <Link
      href={`/${locale}/${id}`}
      onClick={onClose}
      className="group flex items-center justify-between rounded-2xl border border-line px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/40 hover:text-accent-ink"
    >
      {id === 'services' ? tNav('allServices') : tNav('allProducts')}
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  )

  if (id === 'products') {
    return (
      <div className="dd-panel absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3">
        <div className="rounded-[28px] border border-line bg-bg-primary p-3 shadow-float">
          <ul className="grid grid-cols-2 gap-3">
            {PRODUCT_LINKS.map((p, i) => {
              const Icon = PRODUCT_ICONS[p.id]
              return (
                <li key={p.id}>
                  <Link
                    href={productHref(locale, p.id)}
                    onClick={onClose}
                    className={cn(
                      'group flex h-full flex-col rounded-[22px] p-5 transition-transform hover:-translate-y-0.5',
                      i === 0 ? 'bg-ink text-snow dark:bg-[#151A22]' : 'bg-bg-secondary text-text-primary'
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-strong text-snow shadow-card">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className={cn('rounded-full px-2.5 py-1 text-[12px] font-bold', i === 0 ? 'bg-snow/10 text-snow' : 'bg-accent-primary/10 text-accent-ink')}>
                        {tM(`${p.id}.badge`)}
                      </span>
                    </span>
                    <span className="mt-4 text-[16px] font-bold leading-snug">{tM(`${p.id}.title`)}</span>
                    <span className={cn('mt-1.5 text-[13.5px] leading-relaxed', i === 0 ? 'text-snow/75' : 'text-text-secondary')}>{tM(`${p.id}.text`)}</span>
                    <span className={cn('mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold', i === 0 ? 'text-brand' : 'text-accent-ink')}>
                      {tM('more')} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-3">{footer}</div>
        </div>
      </div>
    )
  }

  const [first, ...rest] = SERVICE_IDS
  const FirstIcon = SERVICE_ICONS[first]
  return (
    <div className="dd-panel absolute left-0 top-full z-50 w-[840px] -translate-x-[30%] pt-3">
      <div className="grid grid-cols-[240px_1fr] gap-3 rounded-[28px] border border-line bg-bg-primary p-3 shadow-float">
        <Link
          href={serviceHref(locale, first)}
          onClick={onClose}
          className="group flex flex-col rounded-[22px] bg-ink p-5 text-snow transition-transform hover:-translate-y-0.5 dark:bg-[#151A22]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-strong shadow-card">
            <FirstIcon size={20} aria-hidden="true" />
          </span>
          <span className="mt-4 w-fit rounded-full bg-snow/10 px-2.5 py-0.5 text-[11px] font-semibold">{tS('featured')}</span>
          <span className="mt-2 text-[17px] font-bold leading-snug">{tS(`${first}.title`)}</span>
          <span className="mt-1.5 text-[13.5px] leading-relaxed text-snow/75">{tS(`${first}.text`)}</span>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-brand">
            {tM('more')} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
        <div className="flex flex-col gap-1">
          <ul className="grid grid-cols-2 gap-1">
            {rest.map((sid) => {
              const Icon = SERVICE_ICONS[sid]
              return (
                <li key={sid}>
                  <Link href={serviceHref(locale, sid)} onClick={onClose} className="group flex h-full gap-3 rounded-2xl p-3.5 transition-colors hover:bg-bg-secondary">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-ink transition-colors group-hover:bg-brand-strong group-hover:text-snow">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-semibold leading-snug text-text-primary">{tS(`${sid}.title`)}</span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-text-muted">{tS(`${sid}.text`)}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-auto">{footer}</div>
        </div>
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
