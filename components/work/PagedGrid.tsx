'use client'
/**
 * Card grid split into numbered pages (5 cards a page). Every card is still
 * in the HTML, the other pages are only hidden, so search engines see them all.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const PER_PAGE = 5

// pages: one aria label per page number ("Page 1", "Page 2", …)
type Labels = { nav: string; pages: string[]; prev: string; next: string }

export function PagedGrid({ items, labels, className }: { items: ReactNode[]; labels: Labels; className?: string }) {
  const [page, setPage] = useState(0)
  const top = useRef<HTMLDivElement>(null)
  const pages = Math.ceil(items.length / PER_PAGE)

  const go = (p: number) => {
    setPage(p)
    // keep the grid in view when a short page replaces a long one
    const y = (top.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 150
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const btn = 'inline-flex h-10 min-w-10 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors'

  return (
    <div ref={top}>
      <ul className={className}>
        {items.map((item, i) => (
          <li key={i} hidden={Math.floor(i / PER_PAGE) !== page}>
            {item}
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <nav aria-label={labels.nav} className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label={labels.prev}
            className={cn(btn, 'border-line text-text-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-40')}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          {Array.from({ length: pages }, (_, p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
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
          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={page === pages - 1}
            aria-label={labels.next}
            className={cn(btn, 'border-line text-text-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-40')}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  )
}
