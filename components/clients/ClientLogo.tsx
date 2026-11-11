/**
 * One partner logo. Files from /public (the SVGs and the small colour PNGs)
 * go through a plain <img>, so they cost no image-optimizer transformations on
 * the host; CMS images through next/image.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { PartnerLogo } from '@/lib/data/partners'

export function ClientLogo({ partner, className, decorative = false }: { partner: PartnerLogo; className?: string; decorative?: boolean }) {
  const alt = decorative ? '' : partner.name
  const style = { '--cl-s': partner.scale ?? 1 } as CSSProperties
  if (partner.logo.toLowerCase().endsWith('.svg') || partner.logo.startsWith('/logos/')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={partner.logo} alt={alt} loading="lazy" decoding="async" className={className} style={style} />
  }
  return <Image quality={85} src={partner.logo} alt={alt} width={160} height={48} sizes="160px" className={className} style={style} />
}
