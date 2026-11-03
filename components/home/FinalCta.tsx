/**
 * Closing call to action: "Let's talk about your project", with the
 * founder's photo, an online dot and a WhatsApp link.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { whatsappUrl } from '@/lib/site/navigation'
import { DeviceMockup } from '@/components/portfolio/WebProjectCard'
import { Tilt } from '@/components/ui/Tilt'
import { WhatsAppIcon } from '@/components/ui/WhatsAppButton'

export function FinalCta() {
  const t = useTranslations('site.talk')

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[40px] bg-ink px-7 py-14 text-snow ring-1 ring-transparent dark:ring-snow/10 sm:px-12 lg:px-16 lg:py-20">
          <span aria-hidden="true" className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
          <span aria-hidden="true" className="absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-brand-strong/20 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="flex flex-wrap items-center gap-4 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-6xl xl:text-7xl">
                <span aria-hidden="true" className="relative inline-block h-[0.8em] w-[0.8em]">
                  <span className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 rounded-[0.1em] bg-gradient-to-b from-snow to-[#9AA4B2]" />
                  <span className="absolute left-0 top-1/2 h-[34%] w-full -translate-y-1/2 rounded-[0.1em] bg-gradient-to-r from-brand to-brand-strong" />
                </span>
                {t('title')}
              </h2>

              <a
                href={whatsappUrl(t('message'))}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-brand-strong px-8 py-5 text-lg font-semibold text-snow shadow-brand transition-all hover:-translate-y-0.5 hover:bg-[#0967B5]"
              >
                <WhatsAppIcon className="h-6 w-6" />
                {t('button')}
                <ArrowUpRight size={22} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="flex items-center gap-6 sm:gap-8">
              <figure className="shrink-0 text-center">
                <span className="relative block h-28 w-28 sm:h-36 sm:w-36">
                  <span className="absolute inset-0 overflow-hidden rounded-full ring-4 ring-snow/10">
                    <Image
                      src="/images/testimonials/pasha.jpg"
                      alt={t('person')}
                      fill
                      sizes="144px"
                      className="origin-[50%_41%] scale-[1.9] object-cover object-[50%_32%]"
                    />
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink sm:bottom-2.5 sm:right-2.5">
                    <span className="absolute h-4 w-4 animate-ping rounded-full bg-[#22C55E]/60" />
                    <span className="relative h-4 w-4 rounded-full bg-[#22C55E]" />
                  </span>
                </span>
                <figcaption className="mt-3">
                  <span className="block text-sm font-bold">{t('person')}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4ADE80]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    {t('online')}
                  </span>
                </figcaption>
              </figure>

              <Tilt max={7} className="hidden min-w-0 flex-1 sm:block">
                <DeviceMockup
                  shots={{
                    desktop: '/images/work/executive-baku-resto-pub-desktop.jpg',
                    mobile: '/images/work/executive-baku-resto-pub-mobile.jpg',
                  }}
                  alt=""
                />
              </Tilt>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
