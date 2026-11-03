/**
 * Website project shown on a laptop and a phone, the way the work is
 * presented in a studio case: soft backdrop, devices, tags, then the
 * client name and a one-line summary.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

type Props = {
  href: string
  image: string
  client: string
  summary?: string
  tags: string[]
  className?: string
  priority?: boolean
}

export function DeviceMockup({ image, alt, priority }: { image: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#EEF1F8] via-[#E6EBF6] to-[#D6DEF0] [container-type:inline-size] dark:from-[#171C25] dark:via-[#12161D] dark:to-[#0C0F14]">
      <span aria-hidden="true" className="absolute -right-[10%] -top-[25%] h-[70%] w-[55%] rounded-full bg-snow/60 blur-2xl dark:bg-brand/10" />
      <span aria-hidden="true" className="absolute bottom-[9%] left-[10%] right-[10%] h-[6%] rounded-[50%] bg-ink/25 blur-xl dark:bg-black/60" />

      {/* Laptop */}
      <div className="absolute left-[9%] top-[10%] w-[66%] transition-transform duration-700 ease-out group-hover:-translate-y-[1.2cqw]">
        <div className="rounded-[1.6cqw] bg-[#1B1E24] p-[0.9cqw] shadow-[0_2.4cqw_4cqw_-1.6cqw_rgba(11,13,16,0.55)] ring-1 ring-black/40">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[0.6cqw] bg-snow">
            <Image
              src={image}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-top transition-[object-position] duration-[3000ms] ease-in-out group-hover:object-bottom"
            />
          </div>
        </div>
        <div className="relative mx-[-7%] h-[2.2cqw] rounded-b-[1.6cqw] bg-gradient-to-b from-[#D9DEE6] to-[#A9B1BD] dark:from-[#3A404A] dark:to-[#20242B]">
          <span className="absolute left-1/2 top-0 h-[0.7cqw] w-[14%] -translate-x-1/2 rounded-b-[0.8cqw] bg-[#9AA3AF] dark:bg-[#15181D]" />
        </div>
      </div>

      {/* Phone */}
      <div className="absolute bottom-[11%] right-[10%] w-[17%] transition-transform delay-75 duration-700 ease-out group-hover:-translate-y-[2cqw]">
        <div className="rounded-[2.6cqw] bg-[#1B1E24] p-[0.6cqw] shadow-[0_2.4cqw_4cqw_-1.4cqw_rgba(11,13,16,0.6)] ring-1 ring-black/40">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[2cqw] bg-snow">
            <Image src={image} alt="" fill sizes="15vw" className="object-cover object-left-top" />
            <span className="absolute left-1/2 top-[2.5%] h-[3.5%] w-[34%] -translate-x-1/2 rounded-full bg-[#1B1E24]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function WebProjectCard({ href, image, client, summary, tags, className, priority }: Props) {
  return (
    <Link href={href} className={cn('group block', className)}>
      <div className="relative">
        <DeviceMockup image={image} alt={client} priority={priority} />
        <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-7 sm:left-7">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full bg-snow/95 px-3.5 py-1.5 text-[13px] font-medium text-ink shadow-sm">
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <h3 className="mt-5 px-2 text-xl leading-snug text-text-secondary sm:text-2xl">
        <span className="font-bold text-text-primary transition-colors group-hover:text-accent-ink">{client}</span>
        {summary ? <> {summary}</> : null}
      </h3>
    </Link>
  )
}
