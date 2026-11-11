'use client'
/**
 * Infinite partner logo marquee; pauses on hover.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useRef, useEffect, type CSSProperties } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { PartnerLogo } from '@/lib/data/partners'

// Logos keep their own colours; the ones that have passed the centre get the
// blue glow. The lit state is toggled on the DOM directly so the scroll never
// re-renders React.
export function LogoMarquee({ partners }: { partners: PartnerLogo[] }) {
  const t = useTranslations('home.partners')
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    let raf: number

    const tick = () => {
      const cRect = container.getBoundingClientRect()
      const centre = cRect.left + cRect.width / 2

      const cards = track.querySelectorAll<HTMLElement>('.lm-card')

      // First pass: determine which partner IDs are "lit" (at least one copy in left half)
      const litIds = new Set<string>()
      cards.forEach((card) => {
        const r = card.getBoundingClientRect()
        const cardCentre = r.left + r.width / 2
        if (cardCentre < centre && r.right > cRect.left) {
          const uid = card.dataset.uid ?? ''
          // Strip a-/b- prefix to get partner id
          const partnerId = uid.replace(/^[ab]-/, '')
          litIds.add(partnerId)
        }
      })

      // Second pass: apply class based on partner id (both copies get same state)
      cards.forEach((card) => {
        const uid = card.dataset.uid ?? ''
        const partnerId = uid.replace(/^[ab]-/, '')
        if (litIds.has(partnerId)) {
          card.classList.add('lm-lit')
        } else {
          card.classList.remove('lm-lit')
        }
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="py-12 border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">

          {/* ── Left: tagline ── */}
          <div className="md:w-56 lg:w-64 shrink-0">
            <p className="text-text-secondary font-body text-sm leading-relaxed md:text-base">
              {t('tagline')}
            </p>
          </div>

          {/* ── Right: marquee track ── */}
          <div
            ref={containerRef}
            // vertical padding keeps the lifted, glowing lit card from being clipped
            className="relative -my-5 flex-1 overflow-hidden py-5"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
          >
            <div
              ref={trackRef}
              className="marquee-track flex items-center gap-6 w-max"
              style={{ animation: `marquee-scroll ${Math.max(28, partners.length * 3)}s linear infinite`, willChange: 'transform' }}
            >
              {partners.map((partner) => (
                <LogoCard key={`a-${partner.id}`} partner={partner} logo={partner.logo} uid={`a-${partner.id}`} />
              ))}
              {partners.map((partner) => (
                <LogoCard key={`b-${partner.id}`} partner={partner} logo={partner.logoB ?? partner.logo} uid={`b-${partner.id}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Colour-reveal styles — pure CSS class toggle, no React state */}
      <style>{`
        /* One light card for every logo, in both themes, so each keeps its
           own colours and stays readable. */
        .lm-card {
          border-color: rgba(255,255,255,0.5);
          background: linear-gradient(160deg, #FFFFFF, #E8EDF4);
          box-shadow: 0 10px 24px -14px rgba(11,13,16,0.55);
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
        }
        .lm-card.lm-lit {
          border-color: rgba(36,160,255,0.55);
          box-shadow: 0 0 0 1px rgba(36,160,255,0.25), 0 12px 28px -12px rgba(36,160,255,0.55);
          transform: translateY(-2px);
        }
        .lm-card img {
          height: calc(2rem * min(var(--cl-s, 1), 1.45));
          width: auto;
          max-width: 140px;
          object-fit: contain;
        }
      `}</style>
    </section>
  )
}

function LogoCard({ partner, logo, uid }: { partner: PartnerLogo; logo: string; uid: string }) {
  // files from /public are served as they are (no optimizer pass)
  const isSvg = logo.toLowerCase().endsWith('.svg') || logo.startsWith('/logos/')
  const style = { '--cl-s': partner.scale ?? 1 } as CSSProperties

  return (
    <div
      className={`lm-card flex items-center justify-center h-14 px-5 rounded-xl shrink-0 border cursor-default`}
      title={partner.name}
      data-uid={uid}
    >
      {isSvg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={partner.name} style={style} />
      ) : (
        <Image
          quality={85}
          src={logo}
          alt={partner.name}
          width={120}
          height={32}
          style={style}
        />
      )}
    </div>
  )
}
