/**
 * Small CSS-only 3D scene for each service (".sc-*" in app/globals.css).
 * Used on the home cards and, scaled up, on the service pages.
 * @author Paşa Quliyev — Cradex Agency
 */
import { Megaphone, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ServiceId } from '@/lib/site/navigation'

/** Decorative 3D scene for each service. Pure CSS, hidden from screen readers. */
export function ServiceScene({ id, className }: { id: ServiceId; className?: string }) {
  if (id === 'web')
    return (
      <div className={cn('sc sc-lg', className)} aria-hidden="true">
        <div className="sc-iso">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn('sc-pane', i === 2 ? 'border-transparent bg-brand-strong' : 'border-line bg-bg-primary')}>
              <span className="flex gap-1 p-2">
                {[0, 1, 2].map((d) => (
                  <i key={d} className={cn('h-1.5 w-1.5 rounded-full', i === 2 ? 'bg-snow/70' : 'bg-line')} />
                ))}
              </span>
              <span className={cn('mx-2 block h-2 w-3/5 rounded', i === 2 ? 'bg-snow/90' : 'bg-text-primary/15')} />
              <span className={cn('mx-2 mt-1.5 block h-1.5 w-2/5 rounded', i === 2 ? 'bg-snow/50' : 'bg-text-primary/10')} />
              <span className={cn('mx-2 mt-2 block h-5 w-1/3 rounded-md', i === 2 ? 'bg-snow' : 'bg-accent-primary/30')} />
            </div>
          ))}
        </div>
      </div>
    )

  if (id === 'mobile')
    return (
      <div className={cn('sc', className)} aria-hidden="true">
        <div className="sc-phone border-[3px] border-ink bg-bg-primary dark:border-snow/80">
          <span className="mx-auto mt-1 block h-1 w-5 rounded-full bg-ink/60 dark:bg-snow/50" />
          <span className="grid grid-cols-2 gap-1 p-1.5">
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <i key={k} className={cn('sc-app h-4 rounded', k === 0 ? 'bg-brand-strong' : 'bg-accent-primary/25')} />
            ))}
          </span>
        </div>
        <span className="sc-note bg-brand-strong text-snow">
          <i className="h-1.5 w-1.5 rounded-full bg-snow" />
          <i className="h-1 w-6 rounded bg-snow/80" />
        </span>
      </div>
    )

  if (id === 'seo')
    return (
      <div className={cn('sc', className)} aria-hidden="true">
        <div className="sc-chart border-line bg-bg-primary">
          {[38, 55, 72, 92].map((h, k) => (
            <i key={k} className={cn('sc-bar rounded-t', k === 3 ? 'bg-brand-strong' : 'bg-accent-primary/35')} style={{ height: `${h}%` }} />
          ))}
        </div>
        <span className="sc-lens border-[3px] border-brand-strong bg-bg-primary/60">
          <i className="sc-lens-handle bg-brand-strong" />
        </span>
      </div>
    )

  if (id === 'ads')
    return (
      <div className={cn('sc', className)} aria-hidden="true">
        <div className="sc-ground">
          {[0, 1, 2].map((k) => (
            <i key={k} className="sc-ripple border-2 border-accent-primary/60" />
          ))}
        </div>
        <span className="sc-core bg-brand-strong text-snow">
          <Megaphone size={18} />
        </span>
        {['M', 'G', 'in', 'T'].map((c, k) => (
          <span key={c} className={cn('sc-chip border border-line bg-bg-primary text-text-primary', `sc-chip-${k}`)}>
            {c}
          </span>
        ))}
      </div>
    )

  return (
    <div className={cn('sc', className)} aria-hidden="true">
      <i className="sc-orbit sc-orbit-a border-2 border-dashed border-accent-primary/60" />
      <i className="sc-orbit sc-orbit-b border border-accent-primary/40">
        <b className="sc-dot bg-brand-strong" />
      </i>
      <span className="sc-shield bg-brand-strong text-snow">
        <ShieldCheck size={26} />
      </span>
    </div>
  )
}
