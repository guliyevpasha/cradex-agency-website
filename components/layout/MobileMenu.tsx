'use client'
/**
 * Burger menu for phones and tablets: full menu, expandable Services and
 * Products, language and theme.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { WORK_IDS, workHref } from '@/lib/site/work'
import { ABOUT_LINKS, LOCALES, NAV_ITEMS, aboutHref, PRICING_LINKS, PRODUCT_LINKS, SERVICE_IDS, pricingHref, productHref, serviceHref, isActive, localizedPath } from '@/lib/site/navigation'

type Props = { isOpen: boolean; onClose: () => void; section?: string | null }

export function MobileMenu({ isOpen, onClose, section = null }: Props) {
  const t = useTranslations('site.nav')
  const tS = useTranslations('site.services')
  const tM = useTranslations('site.productMenu')
  const tP = useTranslations('site.pricingMenu')
  const tA = useTranslations('site.aboutMenu')
  const tW = useTranslations('site.workMenu')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Opened from the bottom bar: expand that section and bring it into view.
  useEffect(() => {
    if (!isOpen) return
    setExpanded(section)
    if (!section) return
    // after the expanded list has rendered and the panel has started sliding in
    const id = setTimeout(() => document.getElementById(`mm-${section}`)?.parentElement?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 120)
    return () => clearTimeout(id)
  }, [isOpen, section])

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  function pickLocale(code: string) {
    if (code === locale) return
    try {
      localStorage.setItem('preferred-locale', code)
    } catch {}
    router.push(localizedPath(pathname, code) + window.location.search + window.location.hash)
    onClose()
  }

  const sub = {
    services: SERVICE_IDS.map((s) => ({ href: serviceHref(locale, s), label: tS(`${s}.title`) })),
    products: PRODUCT_LINKS.map((p) => ({ href: productHref(locale, p.id), label: tM(`${p.id}.title`) })),
    work: WORK_IDS.map((w) => ({ href: workHref(locale, w), label: tW(`${w}.title`) })),
    about: ABOUT_LINKS.map((p) => ({ href: aboutHref(locale, p.id), label: tA(`${p.id}.title`) })),
    pricing: PRICING_LINKS.map((p) => ({ href: pricingHref(locale, p.id), label: tP(`${p.id}.title`) })),
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t('menu')}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col bg-bg-primary shadow-float',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        )}
      >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
              <Link href={`/${locale}`} onClick={onClose} aria-label={t('home')}>
                <Logo className="h-8" />
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t('closeMenu')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-primary"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label={t('mainNav')} className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(pathname, locale, item.href, 'exact' in item && item.exact, 'also' in item ? item.also : [])
                  const rowCls = cn(
                    'flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-semibold transition-colors',
                    active ? 'bg-bg-secondary text-text-primary' : 'text-text-primary hover:bg-bg-secondary'
                  )

                  if ('menu' in item) {
                    const id = item.menu as keyof typeof sub
                    const isExp = expanded === id
                    return (
                      <li key={item.key}>
                        <button
                          type="button"
                          className={rowCls}
                          aria-expanded={isExp}
                          aria-controls={`mm-${id}`}
                          onClick={() => setExpanded(isExp ? null : id)}
                        >
                          {t(item.key)}
                          <ChevronDown size={18} aria-hidden="true" className={cn('text-text-muted transition-transform', isExp && 'rotate-180')} />
                        </button>
                        {isExp && (
                          <ul id={`mm-${id}`} className="mb-2 ml-4 border-l border-line pl-3">
                            {sub[id].map((s) => (
                              <li key={s.href}>
                                <Link href={s.href} onClick={onClose} className="block rounded-xl px-3 py-2.5 text-[15px] text-text-secondary hover:text-text-primary">
                                  {s.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  }

                  return (
                    <li key={item.key}>
                      <Link href={`/${locale}${item.href}`} onClick={onClose} className={rowCls} aria-current={active ? 'page' : undefined}>
                        {t(item.key)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="shrink-0 space-y-4 border-t border-line px-5 py-5 pb-safe">
              <div className="flex items-center justify-between gap-3">
                <div role="group" aria-label={t('language')} className="flex rounded-full border border-line p-1">
                  {LOCALES.map(({ code, label, name }) => (
                    <button
                      key={code}
                      type="button"
                      lang={code}
                      aria-label={name}
                      aria-pressed={code === locale}
                      onClick={() => pickLocale(code)}
                      className={cn(
                        'rounded-full px-3.5 py-2 text-xs font-bold transition-colors',
                        code === locale ? 'bg-text-primary text-bg-primary' : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <ThemeToggle />
              </div>
              <WhatsAppButton className="w-full" />
            </div>
      </div>
    </>
  )
}
