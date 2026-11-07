/**
 * "Put your business on the map": Google Maps and Yandex Maps listing so the
 * address also shows up in taxi apps (Bolt, Yango …). Text and points on one
 * side, a tilted 3D city map with a bouncing pin and floating cards on the
 * other. Styles: ".mp-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useTranslations } from 'next-intl'
import { Car, Check, MapPin, Navigation, Star } from 'lucide-react'
import { whatsappUrl } from '@/lib/site/navigation'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

const POINTS = ['p1', 'p2', 'p3', 'p4'] as const

export function MapsListing() {
  const t = useTranslations('site.maps')

  return (
    <section className="py-16 lg:py-24">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
          <AnimatedHeading className="mt-3 text-display-lg font-extrabold tracking-[-0.035em] text-text-primary" text={t('title')} />
          <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">{t('text')}</p>
          <ul className="mt-7 grid gap-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-text-primary sm:text-base">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-strong text-snow">
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                </span>
                {t(p)}
              </li>
            ))}
          </ul>
          <a
            href={whatsappUrl(t('message'))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-brand-strong px-6 py-3.5 text-[15px] font-semibold text-snow shadow-brand transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t('cta')}
          </a>
        </Reveal>

        <Reveal className="rv-3d">
          <Tilt max={8}>
            <div className="mp-stage relative aspect-[5/4] w-full overflow-hidden rounded-[32px] [container-type:inline-size]" aria-hidden="true">
              <div className="mp-map">
                <span className="mp-river" />
                <span className="mp-park" />
                <svg className="mp-route" viewBox="0 0 400 400" preserveAspectRatio="none">
                  <path d="M40 360 L40 250 L160 250 L160 140 L250 140 L250 200" />
                </svg>
              </div>
              <span className="mp-pulse" />
              <span className="mp-pin">
                <MapPin className="mp-pin-icon" strokeWidth={2.4} />
              </span>
              <span className="tilt-glare" />

              <div className="tilt-z3 mp-card left-[5%] top-[7%]">
                <span className="mp-dot" style={{ background: 'conic-gradient(#4285F4 0 25%, #34A853 0 50%, #FBBC05 0 75%, #EA4335 0)' }} />
                <span className="min-w-0">
                  <b>Google Maps</b>
                  <span className="mp-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-[1.6cqw] w-[1.6cqw] fill-[#F5B301] text-[#F5B301]" />
                    ))}
                  </span>
                </span>
              </div>
              <div className="tilt-z2 mp-card right-[5%] top-[30%]">
                <span className="mp-dot" style={{ background: 'linear-gradient(135deg,#FC3F1D,#FFCC00)' }} />
                <span className="min-w-0">
                  <b>{t('yandex')}</b>
                  <small>{t('verified')}</small>
                </span>
              </div>
              <div className="tilt-z3 mp-card bottom-[7%] left-[8%]">
                <span className="mp-dot grid place-items-center bg-[#16A34A] text-snow">
                  <Car className="h-[2.4cqw] w-[2.4cqw]" />
                </span>
                <span className="min-w-0">
                  <b>Bolt · Yango</b>
                  <small className="flex items-center gap-1">
                    <Navigation className="h-[1.6cqw] w-[1.6cqw]" /> {t('found')}
                  </small>
                </span>
              </div>
            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  )
}
