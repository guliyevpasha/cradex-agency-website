/**
 * One partner logo. SVGs from /public go through a plain <img> (no optimizer
 * pass needed), CMS images through next/image.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import type { PartnerLogo } from '@/lib/data/partners'

export function ClientLogo({ partner, className, decorative = false }: { partner: PartnerLogo; className?: string; decorative?: boolean }) {
  const alt = decorative ? '' : partner.name
  if (partner.logo.toLowerCase().endsWith('.svg')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={partner.logo} alt={alt} loading="lazy" decoding="async" className={className} />
  }
  return <Image quality={85} src={partner.logo} alt={alt} width={160} height={48} sizes="160px" className={className} />
}
