'use client'
/**
 * "Technologies we use": tabs per field, tool cards that tilt in 3D and
 * float in a slow wave. Dark backdrop so every brand colour reads well in
 * both themes. Styles: ".tech-*" in app/globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import { Tilt } from '@/components/ui/Tilt'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { TECH_GROUPS, TECH_GROUP_IDS, displayColor, type TechGroup } from '@/lib/site/tech'

export function TechStack() {
  const t = useTranslations('site.tech')
  const [group, setGroup] = useState<TechGroup>('web')
  const tools = TECH_GROUPS[group]

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-12">
        <div className="tech-panel relative overflow-hidden rounded-[40px] px-6 py-14 text-snow sm:px-12 lg:px-16 lg:py-20">
          <span aria-hidden="true" className="tech-glow tech-glow-a" />
          <span aria-hidden="true" className="tech-glow tech-glow-b" />
          <span aria-hidden="true" className="tech-grid" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#5CB8FF]">{t('eyebrow')}</p>
              <AnimatedHeading as="h2" className="mt-3 max-w-xl text-display-lg font-extrabold tracking-[-0.035em]" text={t('title')} />
            </div>
            <p className="max-w-sm text-lg leading-relaxed text-[#A6B0BD]">{t('text')}</p>
          </div>

          <div role="tablist" aria-label={t('title')} className="relative mt-10 flex flex-wrap gap-2">
            {TECH_GROUP_IDS.map((g) => (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={group === g}
                onClick={() => setGroup(g)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                  group === g ? 'bg-brand-strong text-snow shadow-brand' : 'bg-snow/5 text-[#C9D1DB] ring-1 ring-snow/10 hover:bg-snow/10'
                )}
              >
                {t(g)}
              </button>
            ))}
          </div>

          <ul key={group} className="relative mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {tools.map((tool, i) => {
              const color = tool.icon ? displayColor(tool.icon.hex) : tool.color
              return (
                <li key={tool.name} className="tech-item" style={{ '--i': i } as React.CSSProperties}>
                  <Tilt max={14} className="h-full" innerClassName="h-full">
                    <div className="tech-card relative flex h-full flex-col items-center justify-center gap-4 rounded-3xl px-4 py-8">
                      <span className="tilt-glare" />
                      <span className="tilt-z3 tech-icon">
                        {tool.icon ? (
                          <svg viewBox="0 0 24 24" className="h-11 w-11" fill={color} aria-hidden="true">
                            <path d={tool.icon.path} />
                          </svg>
                        ) : (
                          <span className="text-2xl font-extrabold tracking-tight" style={{ color }}>
                            {tool.name}
                          </span>
                        )}
                      </span>
                      <span className="tilt-z1 text-sm font-semibold text-[#E6EAEF]">{tool.name}</span>
                    </div>
                  </Tilt>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

