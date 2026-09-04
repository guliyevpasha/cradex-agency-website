'use client'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { PartnerLogo } from '@/lib/data/partners'

/**
 * Infinite Logo Marquee — Pure CSS animation + direct DOM classList.
 * NO React state → zero re-renders → smooth animation.
 *
 * Logos in the RIGHT half are greyscale.
 * Logos that have passed the centre (LEFT half) are coloured.
 * Cycle repeats continuously.
 */
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
            className="relative flex-1 overflow-hidden"
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
              style={{ animation: 'marquee-scroll 28s linear infinite', willChange: 'transform' }}
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
        .lm-card {
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          box-shadow: none;
          transition: border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
        }
        .lm-card.lm-lit {
          border-color: rgba(108,99,255,0.4);
          background: rgba(108,99,255,0.05);
          box-shadow: 0 0 16px rgba(108,99,255,0.18);
        }
        .lm-card img {
          filter: brightness(0) invert(1) grayscale(1);
          opacity: 0.45;
          transition: filter 0.4s ease, opacity 0.4s ease;
        }
        .lm-card.lm-lit img {
          filter: none;
          opacity: 1;
        }
      `}</style>
    </section>
  )
}

function LogoCard({ partner, logo, uid }: { partner: PartnerLogo; logo: string; uid: string }) {
  const isSvg = logo.toLowerCase().endsWith('.svg')

  return (
    <div
      className="lm-card flex items-center justify-center h-14 px-5 rounded-xl shrink-0 border cursor-default"
      title={partner.name}
      data-uid={uid}
    >
      {isSvg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={partner.name} className="h-8 w-auto max-w-[120px]" />
      ) : (
        <Image
          src={logo}
          alt={partner.name}
          width={120}
          height={32}
          className="h-8 w-auto max-w-[120px] object-contain"
        />
      )}
    </div>
  )
}
