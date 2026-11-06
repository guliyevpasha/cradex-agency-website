/**
 * Every client logo on its own tilting dark card. Logos sit in white until
 * hovered, then get their brand colours back; on touch screens
 * they are always in colour. Styles: ".cl-card" in globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { PartnerLogo } from '@/lib/data/partners'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { ClientLogo } from './ClientLogo'

export function ClientsGrid({ partners }: { partners: PartnerLogo[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {partners.map((p, i) => (
        <li key={p.id}>
          {/* Short stagger per row, so long lists don't trail in for seconds. */}
          <Reveal className="rv-3d h-full" delay={(i % 5) * 70}>
            <Tilt max={10} className="h-full" innerClassName="h-full">
              <figure className="cl-card group relative flex h-full flex-col items-center justify-center gap-3 rounded-[22px] border px-4 pb-4 pt-6 sm:px-5">
                <span className="tilt-glare" />
                <span className="tilt-z2 flex h-14 w-full items-center justify-center sm:h-16">
                  <ClientLogo partner={p} className="cl-card-img h-9 w-auto max-w-[78%] object-contain sm:h-11" />
                </span>
                <figcaption className="tilt-z1 truncate text-center text-[12.5px] font-semibold text-snow/60 transition-colors group-hover:text-snow">
                  {p.name}
                </figcaption>
              </figure>
            </Tilt>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
