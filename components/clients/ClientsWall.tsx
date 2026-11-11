/**
 * Hero visual for the clients page: the logos on a tilted 3D plane, in
 * columns drifting up and down. CSS only (".cl-*" in globals.css), so it
 * costs nothing on the main thread and stops under reduced motion.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { PartnerLogo } from '@/lib/data/partners'
import { ClientLogo } from './ClientLogo'

const COLUMNS = 4

// `compact` drops the dark box and fades the edges out with a mask, so the
// wall can sit inside another coloured panel (the clients CTA).
export function ClientsWall({ partners, compact = false }: { partners: PartnerLogo[]; compact?: boolean }) {
  // Deal the logos out round-robin, then offset each column so neighbours
  // never start on the same brand.
  const cols = Array.from({ length: COLUMNS }, (_, c) => {
    const col = partners.filter((_, i) => i % COLUMNS === c)
    const list = col.length > 0 ? col : partners
    const shift = c % list.length
    return [...list.slice(shift), ...list.slice(0, shift)]
  })

  return (
    <div className={compact ? 'cl-stage cl-compact' : 'cl-stage'} aria-hidden="true">
      <div className="cl-plane">
        {cols.map((col, c) => (
          <div key={c} className={c % 2 ? 'cl-col cl-down' : 'cl-col cl-up'} style={{ animationDuration: `${26 + c * 4}s` }}>
            {/* Two copies so the loop at -50% is seamless. */}
            {[0, 1].map((copy) =>
              col.map((p, i) => (
                // Every third tile is lit; the pattern repeats per copy so the loop has no seam.
                <span key={`${copy}-${p.id}`} className={`cl-tile${(i + c) % 3 === 1 ? ' cl-lit' : ''}`}>
                  <ClientLogo partner={p} decorative className="cl-tile-img" />
                </span>
              ))
            )}
          </div>
        ))}
      </div>
      {!compact && <span className="cl-fade" />}
    </div>
  )
}
