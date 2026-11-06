/**
 * FAQ cards with an icon each (clients page, combo packages). Cards sit
 * in CSS columns, so opening one only pushes its own column down. Native
 * <details>, so it works without JS and with the keyboard.
 * @author Paşa Quliyev — Cradex Agency
 */
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

type Faq = { q: string; a: string }

/** The icons go with the questions in order and repeat if there are fewer. */
export function FaqCards({ items, icons }: { items: Faq[]; icons: LucideIcon[] }) {
  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
      {items.map((f, i) => {
        const Icon = icons[i % icons.length]
        return (
          <Reveal key={f.q} className="rv-3d mb-4 break-inside-avoid" delay={(i % 3) * 80}>
            <details className="faq-card group rounded-[22px] border border-line bg-bg-secondary transition-[border-color,box-shadow] duration-300 open:border-accent-primary/40 open:shadow-card hover:border-accent-primary/30">
              <summary className="flex min-h-[76px] cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-bg-primary text-accent-ink transition-colors duration-300 group-open:border-transparent group-open:bg-brand-strong group-open:text-snow">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-[16px] font-semibold leading-snug text-text-primary">{f.q}</span>
                <ChevronDown size={19} className="shrink-0 text-text-muted transition-transform duration-300 group-open:rotate-180 group-open:text-accent-ink" aria-hidden="true" />
              </summary>
              <p className="faq-body px-5 pb-5 pl-[84px] leading-relaxed text-text-secondary max-sm:pl-5">{f.a}</p>
            </details>
          </Reveal>
        )
      })}
    </div>
  )
}
