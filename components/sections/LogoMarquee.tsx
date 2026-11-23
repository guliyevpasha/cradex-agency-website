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
    <section className="py-12 border-y border-white/[0.06] dark:border-white/[0.04] overflow-hidden bg-gradient-to-b from-transparent via-white/[0.02] to-transparent dark:via-white/[0.01]">
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

      {/* Premium glassmorphism styles — pure CSS class toggle, no React state */}
      <style>{`
        /* Premium glassmorphism effect with theme-aware backdrop */
        .lm-card {
          position: relative;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.05) inset,
            0 8px 32px -8px rgba(0, 0, 0, 0.12),
            0 2px 8px -2px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Dark theme adjustments */
        .dark .lm-card {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.08);
        }
        
        /* Lit state - premium glow effect */
        .lm-card.lm-lit {
          border-color: rgba(36, 160, 255, 0.4);
          background: rgba(255, 255, 255, 0.14);
          box-shadow: 
            0 0 0 1px rgba(36, 160, 255, 0.2) inset,
            0 0 24px -4px rgba(36, 160, 255, 0.35),
            0 12px 32px -8px rgba(36, 160, 255, 0.25),
            0 4px 16px -4px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px) scale(1.02);
        }
        
        .dark .lm-card.lm-lit {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 0 0 1px rgba(36, 160, 255, 0.3) inset,
            0 0 32px -4px rgba(36, 160, 255, 0.5),
            0 16px 40px -8px rgba(36, 160, 255, 0.35),
            0 4px 16px -4px rgba(0, 0, 0, 0.3);
        }
        
        /* Logo sizing with premium spacing */
        .lm-card img {
          height: calc(2rem * min(var(--cl-s, 1), 1.45));
          width: auto;
          max-width: 140px;
          object-fit: contain;
          filter: contrast(1.05) brightness(0.98);
          transition: filter 0.3s ease;
        }
        
        .lm-card.lm-lit img {
          filter: contrast(1.1) brightness(1.02);
        }
        
        /* Smooth hover enhancement */
        .lm-card:hover:not(.lm-lit) {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }
        
        .dark .lm-card:hover:not(.lm-lit) {
          background: rgba(255, 255, 255, 0.08);
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
