'use client'
/**
 * About hero card: four short stories that play like Instagram stories.
 * The progress bar's own CSS animation drives the timing (onAnimationEnd
 * moves on), so hover pauses everything with one play-state rule and no
 * timers leak. The 3D tiles pick out the active story with a design-tool
 * style selection frame. Styles: ".ab-story" / ".ab-tile" in globals.css.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Code2, FileSignature, Tag, Users } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Story = { tag: string; text: string }

const ICONS = [Users, Code2, Tag, FileSignature]

export function AboutStory() {
  const t = useTranslations('site.aboutPage.hero')
  const stories = t.raw('stories') as Story[]
  const [active, setActive] = useState(0)

  return (
    <div className="ab-story relative overflow-hidden rounded-[32px] p-6 text-snow sm:p-8">
      <span className="relative z-10 inline-flex rounded-full border border-snow/70 px-4 py-1.5 text-[13px] font-semibold">{t('badge')}</span>

      <div className="ab-tiles" aria-hidden="true">
        {stories.map((s, i) => {
          const Icon = ICONS[i % ICONS.length]
          return (
            <span key={s.tag} className={cn('ab-tile', `ab-tile-${i}`, i === active && 'is-active')}>
              <span className="ab-tile-face">
                <Icon size={30} strokeWidth={1.6} />
              </span>
              <span className="ab-select">
                <span className="ab-chip">{s.tag}</span>
                <i /><i /><i /><i />
              </span>
            </span>
          )
        })}
      </div>

      <div className="ab-story-body relative z-10">
        <div className="flex gap-2">
          {stories.map((s, i) => (
            <button
              key={s.tag}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t('storyLabel', { n: i + 1, total: stories.length })}
              aria-current={i === active ? 'step' : undefined}
              className="group flex h-6 flex-1 items-center"
            >
              <span className="ab-bar block h-[3px] w-full overflow-hidden rounded-full bg-snow/25 transition-colors group-hover:bg-snow/40">
                <span
                  // Remount on change so the fill restarts from zero.
                  key={i === active ? `on-${active}` : 'off'}
                  className={cn('ab-fill block h-full rounded-full bg-snow', i < active && 'is-done', i === active && 'is-running')}
                  onAnimationEnd={i === active ? () => setActive((a) => (a + 1) % stories.length) : undefined}
                />
              </span>
            </button>
          ))}
        </div>
        <p key={active} className="ab-caption mt-4 min-h-[56px] text-[17px] font-semibold leading-snug sm:text-lg">
          {stories[active].text}
        </p>
      </div>
    </div>
  )
}
