/**
 * Website project on a laptop and a phone over a slowly moving stage (aurora,
 * orbit ring, perspective floor). The card tilts in 3D towards the pointer; laptop and phone sit at different depths, so they separate as it
 * turns. Desktop and mobile screenshots are real captures of the live site
 * (public/images/work); the CMS cover is the fallback.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Tilt } from '@/components/ui/Tilt'
import { ScrollFillText } from '@/components/ui/ScrollFillText'

type Shots = { desktop: string; mobile?: string }

type Props = {
  href: string
  shots: Shots
  client: string
  summary?: string
  tags: string[]
  className?: string
  priority?: boolean
}

export function DeviceMockup({ shots, alt, priority }: { shots: Shots; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[16/11] w-full [container-type:inline-size]">
      {/* backdrop */}
      <div className="dm-stage absolute inset-0 overflow-hidden rounded-[32px] ring-1 ring-line">
        <span aria-hidden="true" className="dm-aurora" />
        <span aria-hidden="true" className="dm-floor" />
        <span aria-hidden="true" className="dm-ring" />
        <span aria-hidden="true" className="absolute bottom-[11%] left-[12%] right-[14%] h-[5%] rounded-[50%] bg-ink/30 blur-xl dark:bg-black/70" />
        <span className="tilt-glare" />
      </div>

      {/* laptop */}
      <div className="tilt-z1 absolute left-[8%] top-[9%] w-[68%]">
        <div className="rounded-[1.6cqw] bg-[#1B1E24] p-[0.85cqw] shadow-[0_2.6cqw_4.4cqw_-1.6cqw_rgba(11,13,16,0.55)] ring-1 ring-black/40">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[0.5cqw] bg-snow">
            <Image
              quality={85}
              src={shots.desktop}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="object-cover object-top"
            />
            <span aria-hidden="true" className="dm-sheen" />
          </div>
        </div>
        <div className="relative mx-[-7%] h-[2.2cqw] rounded-b-[1.6cqw] bg-gradient-to-b from-[#DDE2EA] to-[#A9B1BD] dark:from-[#3A404A] dark:to-[#1C2026]">
          <span className="absolute left-1/2 top-0 h-[0.7cqw] w-[14%] -translate-x-1/2 rounded-b-[0.8cqw] bg-[#9AA3AF] dark:bg-[#121418]" />
        </div>
      </div>

      {/* phone */}
      <div className="tilt-z3 absolute bottom-[9%] right-[9%] w-[19%]">
        <div className="device-float rounded-[2.8cqw] bg-[#1B1E24] p-[0.6cqw] shadow-[0_3cqw_5cqw_-1.6cqw_rgba(11,13,16,0.65)] ring-1 ring-black/40">
          <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.2cqw] bg-snow">
            <Image
              quality={85}
              src={shots.mobile ?? shots.desktop}
              alt=""
              fill
              sizes="(min-width: 1024px) 12vw, 25vw"
              className={cn('object-cover', shots.mobile ? 'object-top' : 'object-left-top')}
            />
            <span className="absolute left-1/2 top-[1.6%] h-[3%] w-[30%] -translate-x-1/2 rounded-full bg-[#0B0D10]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function WebProjectCard({ href, shots, client, summary, tags, className, priority }: Props) {
  return (
    <Link href={href} className={cn('group block', className)}>
      <Tilt max={6}>
        <DeviceMockup shots={shots} alt={client} priority={priority} />
        <ul className="tilt-z2 absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 sm:bottom-7 sm:left-7 sm:right-7 sm:gap-2">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full bg-snow/95 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm sm:px-3.5 sm:py-1.5 sm:text-[13px]">
              {tag}
            </li>
          ))}
        </ul>
      </Tilt>
      <ScrollFillText
        as="h3"
        className="mt-6 px-2 text-xl leading-snug text-text-primary sm:text-[1.6rem] sm:leading-[1.3]"
        segments={[{ text: client, className: 'font-bold' }, ...(summary ? [{ text: summary }] : [])]}
      />
    </Link>
  )
}
