/**
 * Every client logo on its own tilting light card, always in its brand
 * colours (logos made for dark pages have their white turned to ink). Styles:
 * ".cl-card" in globals.css.
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
              <figure className={`cl-card group relative flex h-full flex-col items-center justify-center gap-3 rounded-[22px] border px-3 pb-4 pt-6 sm:px-4`}>
                <span className="tilt-glare" />
                <span className="tilt-z2 flex h-[5rem] w-full items-center justify-center sm:h-24">
                  <ClientLogo partner={p} className="cl-card-img w-auto max-w-full object-contain" />
                </span>
                <figcaption className="cl-card-name tilt-z1 truncate text-center text-[12.5px] font-semibold transition-colors">
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
