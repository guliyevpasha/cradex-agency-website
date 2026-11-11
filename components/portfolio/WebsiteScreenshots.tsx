/**
 * A website project on three devices: laptop, tablet and phone, each tilting
 * in 3D towards the pointer. Captures come from Studio (websiteScreenshots);
 * a device without a capture is simply left out.
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'

interface WebsiteScreenshotsProps {
  desktop?: string
  tablet?: string
  mobile?: string
  projectName: string
  locale: 'az' | 'en' | 'ru' | 'tr'
}

const translations = {
  az: { title: 'Sayt bütün ekranlarda', subtitle: 'Kompüter, planşet və telefonda necə göründüyü', desktop: 'Kompüter', tablet: 'Planşet', mobile: 'Telefon' },
  en: { title: 'The site on every screen', subtitle: 'How it looks on a computer, a tablet and a phone', desktop: 'Desktop', tablet: 'Tablet', mobile: 'Phone' },
  ru: { title: 'Сайт на всех экранах', subtitle: 'Как он выглядит на компьютере, планшете и телефоне', desktop: 'Компьютер', tablet: 'Планшет', mobile: 'Телефон' },
  tr: { title: 'Site tüm ekranlarda', subtitle: 'Bilgisayarda, tablette ve telefonda nasıl göründüğü', desktop: 'Bilgisayar', tablet: 'Tablet', mobile: 'Telefon' },
}

function Label({ icon: Icon, text }: { icon: typeof Monitor; text: string }) {
  return (
    <p className="mb-4 flex items-center gap-2 text-sm font-medium text-text-muted">
      <Icon className="h-5 w-5 text-accent-primary" aria-hidden="true" />
      {text}
    </p>
  )
}

export function WebsiteScreenshots({ desktop, tablet, mobile, projectName, locale }: WebsiteScreenshotsProps) {
  if (!desktop && !tablet && !mobile) return null
  const t = translations[locale]
  const handhelds = Boolean(tablet || mobile)

  return (
    <section className="overflow-hidden bg-bg-primary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-4xl">{t.title}</h2>
          <p className="mx-auto max-w-2xl text-text-muted">{t.subtitle}</p>
        </Reveal>

        <div className={cn('grid grid-cols-[minmax(0,1fr)] items-end gap-12', handhelds && desktop && 'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10')}>
          {desktop && (
            <Reveal className="rv-3d">
              <Label icon={Monitor} text={t.desktop} />
              <Tilt max={5}>
                <div className="tilt-z1 rounded-t-2xl border border-white/10 bg-gradient-to-b from-gray-800 to-gray-900 p-2.5 shadow-2xl sm:p-3">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-bg-tertiary">
                    <Image src={desktop} alt={`${projectName} — ${t.desktop}`} fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 60vw" quality={85} />
                    <span aria-hidden="true" className="dm-sheen" />
                  </div>
                </div>
                <div className="relative mx-[-3%] h-4 rounded-b-2xl bg-gradient-to-b from-gray-700 to-gray-800 shadow-xl">
                  <span className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-lg bg-gray-900" />
                </div>
              </Tilt>
            </Reveal>
          )}

          {handhelds && (
            <div className="flex items-end justify-center gap-6 sm:gap-10 lg:gap-7">
              {tablet && (
                <Reveal className="rv-3d w-[58%] max-w-[340px]" delay={120}>
                  <Label icon={Tablet} text={t.tablet} />
                  <Tilt max={7}>
                    <div className="tilt-z2 rounded-[1.6rem] border-2 border-gray-800 bg-gradient-to-b from-gray-900 to-black p-2.5 shadow-2xl">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.1rem] bg-bg-tertiary">
                        <Image src={tablet} alt={`${projectName} — ${t.tablet}`} fill className="object-cover object-top" sizes="(max-width: 1024px) 58vw, 340px" quality={85} />
                        <span aria-hidden="true" className="dm-sheen" />
                      </div>
                    </div>
                  </Tilt>
                </Reveal>
              )}

              {mobile && (
                <Reveal className={cn('rv-3d', tablet ? 'w-[32%] max-w-[190px]' : 'w-[62%] max-w-[280px]')} delay={240}>
                  <Label icon={Smartphone} text={t.mobile} />
                  <Tilt max={9}>
                    <div className="tilt-z3 relative rounded-[1.7rem] border-2 border-gray-800 bg-gradient-to-b from-gray-900 to-black p-1.5 shadow-2xl sm:rounded-[2rem] sm:p-2">
                      <span className="absolute left-1/2 top-1.5 z-10 h-3 w-[34%] -translate-x-1/2 rounded-full bg-black sm:top-2 sm:h-4" />
                      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.3rem] bg-bg-tertiary sm:rounded-[1.5rem]">
                        <Image src={mobile} alt={`${projectName} — ${t.mobile}`} fill className="object-cover object-top" sizes="(max-width: 1024px) 60vw, 280px" quality={85} />
                      </div>
                    </div>
                  </Tilt>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
