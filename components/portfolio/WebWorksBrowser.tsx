'use client'
/**
 * Website portfolio: a rail of business-field chips and the project cards,
 * six to a page in two staggered columns. All cards stay in the HTML (the
 * rest are only hidden), so every project is still there for search engines.
 * The chosen field and page live in the address (?field=&page=), which brings
 * a visitor back to the same spot after opening a project.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BedDouble, Briefcase, Building2, Car, GraduationCap, HardHat, LayoutGrid, Layers, Newspaper, Plane, ShoppingBag, Sparkles, Stethoscope, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { WORKS_PER_PAGE, type WebField } from '@/lib/site/webCategories'
import { Pager, keepInView } from '@/components/work/PagedGrid'

const ICONS: Record<WebField, LucideIcon> = {
  construction: HardHat,
  tourism: Plane,
  education: GraduationCap,
  cleaning: Sparkles,
  health: Stethoscope,
  media: Newspaper,
  ecommerce: ShoppingBag,
  restaurant: UtensilsCrossed,
  catalog: LayoutGrid,
  hotel: BedDouble,
  auto: Car,
  consulting: Briefcase,
  realestate: Building2,
}

type Item = { key: string; field?: WebField; node: ReactNode }
type Chip = { value: WebField; label: string; count: number }
// page: "Page {n}" with the placeholder left in
type Labels = { filter: string; all: string; nav: string; page: string; prev: string; next: string }

export function WebWorksBrowser({ items, fields, labels }: { items: Item[]; fields: Chip[]; labels: Labels }) {
  const [field, setField] = useState<WebField | 'all'>('all')
  const [page, setPage] = useState(0)
  const top = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLUListElement>(null)

  const matches = items.filter((x) => field === 'all' || x.field === field)
  const pages = Math.ceil(matches.length / WORKS_PER_PAGE)
  // key → position on the visible page (decides the column)
  const shown = new Map(matches.slice(page * WORKS_PER_PAGE, (page + 1) * WORKS_PER_PAGE).map((x, n) => [x.key, n]))

  // Restore the spot from the address once the page is interactive.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const f = fields.find((x) => x.value === q.get('field'))?.value ?? 'all'
    const count = items.filter((x) => f === 'all' || x.field === f).length
    const p = Math.min(Math.max(Number(q.get('page')) || 1, 1), Math.max(Math.ceil(count / WORKS_PER_PAGE), 1)) - 1
    setField(f)
    setPage(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On a phone the rail scrolls sideways: keep the chosen chip in sight
  // (scrolling the rail itself, never the page).
  useEffect(() => {
    const el = rail.current
    const chosen = el?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!el || !chosen || el.scrollWidth <= el.clientWidth) return
    const left = chosen.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft
    el.scrollTo({ left: left - (el.clientWidth - chosen.offsetWidth) / 2, behavior: 'smooth' })
  }, [field])

  const go = (f: WebField | 'all', p: number) => {
    setField(f)
    setPage(p)
    const q = new URLSearchParams()
    if (f !== 'all') q.set('field', f)
    if (p > 0) q.set('page', String(p + 1))
    const qs = q.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`)
    keepInView(top.current, 170)
  }

  const chip = (value: WebField | 'all', label: string, count: number, Icon: LucideIcon) => (
    <li key={value} className="shrink-0">
      <button type="button" onClick={() => go(value, 0)} aria-pressed={field === value} className="wf-chip">
        <span className="wf-gem" aria-hidden="true">
          <Icon size={16} strokeWidth={2.2} />
        </span>
        {label}
        <span className="wf-count">{count}</span>
      </button>
    </li>
  )

  return (
    <div ref={top}>
      {fields.length > 1 && (
        <nav aria-label={labels.filter} className="wf-bar sticky top-[72px] z-20 lg:top-[84px]">
          <ul ref={rail} className="wf-rail mx-auto flex w-full max-w-[1680px] gap-2.5 overflow-x-auto px-4 pb-5 pt-3 [scrollbar-width:none] sm:px-6 lg:flex-wrap lg:overflow-visible lg:px-12 lg:py-3">
            {chip('all', labels.all, items.length, Layers)}
            {fields.map((f) => chip(f.value, f.label, f.count, ICONS[f.value]))}
          </ul>
        </nav>
      )}

      <ul className="mx-auto mt-10 grid w-full max-w-[1680px] grid-cols-[minmax(0,1fr)] gap-14 px-4 sm:px-6 lg:mt-14 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-24 lg:px-12 lg:pb-32">
        {items.map((x) => {
          const n = shown.get(x.key)
          return (
            <li key={x.key} hidden={n === undefined} className={cn(n !== undefined && n % 2 === 1 && 'lg:translate-y-32')}>
              {x.node}
            </li>
          )
        })}
      </ul>

      <Pager
        className="mt-12 px-4"
        page={page}
        pages={pages}
        onChange={(p) => go(field, p)}
        labels={{
          nav: labels.nav,
          pages: Array.from({ length: pages }, (_, n) => labels.page.replace('{n}', String(n + 1))),
          prev: labels.prev,
          next: labels.next,
        }}
      />
    </div>
  )
}
