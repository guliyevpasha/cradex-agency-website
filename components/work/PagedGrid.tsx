'use client'
/**
 * Card grid split into numbered pages (6 cards a page). Every card is still
 * in the HTML, the other pages are only hidden, so search engines see them all.
 * The pager is shared with the website portfolio (WebWorksBrowser).
 * @author Paşa Quliyev — Cradex Agency
 */
import { useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { WORKS_PER_PAGE } from '@/lib/site/webCategories'

// pages: one aria label per page number ("Page 1", "Page 2", …)
type Labels = { nav: string; pages: string[]; prev: string; next: string }

const btn = 'inline-flex h-10 min-w-10 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors'
const arrow = cn(btn, 'border-line text-text-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-40')

/** Scroll back up to `el` when a shorter page replaces a longer one. */
export function keepInView(el: HTMLElement | null, offset = 150) {
  const y = (el?.getBoundingClientRect().top ?? 0) + window.scrollY - offset
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (window.scrollY > y) window.scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' })
}

export function Pager({ page, pages, onChange, labels, className }: { page: number; pages: number; onChange: (page: number) => void; labels: Labels; className?: string }) {
  if (pages < 2) return null
  return (
    <nav aria-label={labels.nav} className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 0} aria-label={labels.prev} className={arrow}>
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      {Array.from({ length: pages }, (_, p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          aria-label={labels.pages[p]}
          className={cn(
            btn,
            'px-3',
            p === page
              ? 'border-brand-strong bg-brand-strong text-snow shadow-brand'
              : 'border-line text-text-secondary hover:border-accent-primary/50 hover:text-text-primary'
          )}
        >
          {p + 1}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pages - 1} aria-label={labels.next} className={arrow}>
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  )
}

export function PagedGrid({ items, labels, className }: { items: ReactNode[]; labels: Labels; className?: string }) {
  const [page, setPage] = useState(0)
  const top = useRef<HTMLDivElement>(null)

  const go = (p: number) => {
    setPage(p)
    keepInView(top.current)
  }

  return (
    <div ref={top}>
      <ul className={className}>
        {items.map((item, i) => (
          <li key={i} hidden={Math.floor(i / WORKS_PER_PAGE) !== page}>
            {item}
          </li>
        ))}
      </ul>
      <Pager className="mt-8" page={page} pages={Math.ceil(items.length / WORKS_PER_PAGE)} onChange={go} labels={labels} />
    </div>
  )
}
