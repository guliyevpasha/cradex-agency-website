'use client'
/**
 * Partner logos on a 3D floor: a tilted plane of logo tiles that keeps
 * rolling toward the viewer under the heading. CSS only (".fl-*").
 * @author Paşa Quliyev — Cradex Agency
 */
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { PartnerLogo } from '@/lib/data/partners'

// 12 fits both the 4-column (phone) and 6-column grid, so every copy ends
// on a full row and the loop has no seam.
const ROW_UNIT = 12

export function LogoMarquee({ partners }: { partners: PartnerLogo[] }) {
  const t = useTranslations('home.partners')
  const padded = [...partners]
  for (let i = 0; padded.length % ROW_UNIT !== 0; i++) padded.push(partners[i % partners.length])
  const duration = `${Math.max(30, (padded.length / 6) * 5)}s`

  return (
    <section className="fl-sec relative overflow-hidden pt-14 md:pt-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="mx-auto max-w-3xl text-balance font-display text-2xl font-semibold leading-tight text-text-primary md:text-4xl">
          {t('tagline')}
        </p>
      </div>

      <div className="fl-stage group">
        <span className="fl-horizon" aria-hidden="true" />
        <div className="fl-plane">
          <div className="fl-track marquee-track" style={{ animationDuration: duration }}>
            {[0, 1].map((copy) =>
              padded.map((p, i) => (
                <Tile key={`${copy}-${i}`} partner={p} decorative={copy === 1 || i >= partners.length} />
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Tile({ partner, decorative }: { partner: PartnerLogo; decorative: boolean }) {
  // files from /public are served as they are (no optimizer pass)
  const isSvg = partner.logo.toLowerCase().endsWith('.svg') || partner.logo.startsWith('/logos/')
  const style = { '--cl-s': partner.scale ?? 1 } as CSSProperties
  const alt = decorative ? '' : partner.name

  return (
    <span className="fl-tile" title={partner.name}>
      {isSvg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partner.logo} alt={alt} style={style} loading="lazy" />
      ) : (
        <Image quality={85} src={partner.logo} alt={alt} width={140} height={40} style={style} />
      )}
    </span>
  )
}
