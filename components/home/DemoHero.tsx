'use client'
/**
 * Home hero. A sample site assembles itself inside a browser window while the
 * card counts the two hours down — the offer, shown rather than told.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

const BUILD_MS = 8000
const HOLD_MS = 2600
const KINDS = ['business', 'personal', 'content'] as const
const STEPS = ['structure', 'design', 'content', 'ready'] as const

type State = { left: number; step: number; done: boolean; kind: number }

function useDemoClock(onFrame: (p: number) => void) {
  const [state, setState] = useState<State>({ left: 120, step: 0, done: false, kind: 0 })
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onFrame(1)
      setState({ left: 0, step: 3, done: true, kind: 0 })
      return
    }

    let raf = 0
    let start = 0
    let visible = true
    let last = ''

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    if (rootRef.current) io.observe(rootRef.current)

    function tick(ts: number) {
      if (!start) start = ts
      const cycle = BUILD_MS + HOLD_MS
      const elapsed = ts - start
      const p = Math.min(1, (elapsed % cycle) / BUILD_MS)
      const kind = Math.floor(elapsed / cycle) % KINDS.length
      onFrame(p)

      const next: State = {
        left: Math.round(120 * (1 - p)),
        step: p >= 1 ? 3 : Math.min(2, Math.floor(p * 3)),
        done: p >= 1,
        kind,
      }
      const key = `${next.left}|${next.step}|${next.kind}`
      if (key !== last) {
        last = key
        setState(next)
      }
      raf = visible ? requestAnimationFrame(tick) : 0
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
    // onFrame only touches refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { state, rootRef }
}

/** Sample client site shown in the browser window. Fixed colours on purpose: it is a "screenshot". */
function PreviewSite() {
  const t = useTranslations('site.hero.preview')
  return (
    <div className="h-full w-full bg-snow text-ink [container-type:inline-size]">
      <div className="flex items-center gap-[3.2cqw] px-[5cqw] py-[3.4cqw] text-[2.1cqw] text-[#4A5260]">
        <span className="mr-auto flex items-center gap-[1.2cqw] text-[3.3cqw] font-extrabold tracking-tight text-ink">
          <span className="h-[3cqw] w-[3cqw] rounded-full bg-gradient-to-br from-brand to-[#7CC8FF]" />
          {t('brand')}
        </span>
        <span>{t('link1')}</span>
        <span>{t('link2')}</span>
        <span className="hidden sm:inline">{t('link3')}</span>
        <span className="rounded-full bg-ink px-[2.6cqw] py-[1.2cqw] font-semibold text-snow">{t('cta')}</span>
      </div>

      <div className="grid grid-cols-[1.05fr_1fr] items-center gap-[4cqw] px-[5cqw] pb-[4cqw] pt-[2cqw]">
        <div>
          <p className=" text-[5.4cqw] font-extrabold leading-[1.04] tracking-[-0.04em]">{t('title')}</p>
          <p className="mt-[2cqw] text-[2.15cqw] leading-relaxed text-[#5B6470]">{t('text')}</p>
          <div className="mt-[3cqw] flex items-center gap-[2cqw] text-[2.1cqw] font-semibold">
            <span className="rounded-full bg-ink px-[3cqw] py-[1.7cqw] text-snow">{t('primary')}</span>
            <span className="rounded-full border border-[#DCE2E9] px-[3cqw] py-[1.6cqw]">{t('secondary')}</span>
          </div>
        </div>

        <div className="relative aspect-[1/1.02] overflow-hidden rounded-[3cqw] bg-gradient-to-br from-[#E8F4FF] via-[#D4EBFF] to-[#B9DEFF]">
          <div className="absolute -right-[8cqw] -top-[6cqw] h-[34cqw] w-[34cqw] rounded-full bg-gradient-to-br from-brand to-[#7CC8FF]" />
          <div className="absolute -bottom-[10cqw] -left-[6cqw] h-[26cqw] w-[26cqw] rounded-full bg-[#FF8A65]/90" />
          <div className="absolute left-[12%] top-[16%] w-[62%] rounded-[2cqw] bg-snow/95 p-[2.4cqw] shadow-[0_2cqw_5cqw_-2cqw_rgba(11,13,16,.35)]">
            <div className="flex items-center gap-[1.2cqw]">
              <span className="h-[3.4cqw] w-[3.4cqw] rounded-full bg-ink" />
              <span className="h-[1.3cqw] w-[40%] rounded-full bg-[#E3E8EE]" />
            </div>
            <div className="mt-[2.2cqw] flex h-[12cqw] items-end gap-[1.4cqw]">
              {[38, 56, 44, 72, 60, 88].map((h, i) => (
                <span key={i} className={cn('flex-1 rounded-t-[0.8cqw]', i === 5 ? 'bg-brand' : 'bg-[#CFE6FB]')} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="absolute bottom-[12%] right-[8%] flex items-center gap-[1.2cqw] rounded-full bg-ink px-[2.4cqw] py-[1.4cqw] text-[1.9cqw] font-semibold text-snow">
            <span className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-[#4ADE80]" />
            {t('cta')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[2.4cqw] px-[5cqw] pb-[5cqw]">
        {[['4', t('stat1')], ['100%', t('stat2')], ['24/7', t('stat3')]].map(([v, l]) => (
          <div key={l} className="rounded-[2cqw] bg-[#F3F6F9] px-[2.6cqw] py-[2.2cqw]">
            <p className="text-[3.6cqw] font-extrabold tracking-tight">{v}</p>
            <p className="text-[1.9cqw] text-[#69727F]">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Grey wireframe laid over the preview; fades out as the "design" step runs. */
function Wireframe() {
  const bar = 'block rounded-[0.6cqw] bg-[#DCE3EA]'
  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-[3cqw] bg-[#F4F7FA] px-[5cqw] py-[3.4cqw] [container-type:inline-size]">
      <div className="flex items-center gap-[3cqw]">
        <i className={cn(bar, 'mr-auto h-[2.6cqw] w-[14%]')} />
        <i className={cn(bar, 'h-[1.6cqw] w-[9%]')} />
        <i className={cn(bar, 'h-[1.6cqw] w-[9%]')} />
        <i className={cn(bar, 'h-[3.6cqw] w-[11%] rounded-full')} />
      </div>
      <div className="grid grid-cols-[1.05fr_1fr] items-center gap-[4cqw]">
        <div className="space-y-[1.8cqw]">
          <i className={cn(bar, 'h-[1.6cqw] w-[36%]')} />
          <i className={cn(bar, 'h-[4cqw] w-full')} />
          <i className={cn(bar, 'h-[4cqw] w-[80%]')} />
          <i className={cn(bar, 'h-[1.8cqw] w-[70%]')} />
          <i className={cn(bar, 'h-[5cqw] w-[34%] rounded-full')} />
        </div>
        <i className="block aspect-[1/1.02] rounded-[3cqw] border-2 border-dashed border-[#C8D1DB] bg-[repeating-linear-gradient(45deg,#E6EBF0_0_1cqw,#EEF2F6_1cqw_2cqw)]" />
      </div>
      <div className="grid grid-cols-3 gap-[2.4cqw]">
        <i className={cn(bar, 'h-[9cqw]')} />
        <i className={cn(bar, 'h-[9cqw]')} />
        <i className={cn(bar, 'h-[9cqw]')} />
      </div>
    </div>
  )
}

export function DemoHero() {
  const locale = useLocale()
  const t = useTranslations('site.hero')
  const tCta = useTranslations('site.cta')
  const barRef = useRef<HTMLSpanElement>(null)
  const wireRef = useRef<HTMLDivElement>(null)

  const { state, rootRef } = useDemoClock((p) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    if (wireRef.current) wireRef.current.style.opacity = String(p < 0.35 ? 1 : Math.max(0, 1 - (p - 0.35) / 0.3))
  })

  const hours = Math.floor(state.left / 60)
  const minutes = state.left % 60
  const timeLabel = state.done
    ? t('card.done')
    : hours > 0
      ? t('card.hoursLeft', { hours, minutes: String(minutes).padStart(2, '0') })
      : t('card.minutesLeft', { minutes })

  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[-10%] -z-10 h-[680px] w-[680px] rounded-full bg-[radial-gradient(closest-side,rgb(36_160_255/0.16),transparent)]" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div className="max-w-[620px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-primary/10 py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-accent-ink">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_0_4px_rgb(36_160_255/0.2)]" />
            {t('eyebrow')}
          </span>

          <h1 className="mt-6 text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-text-primary sm:text-5xl xl:text-[3.6rem]">
            {t('titleStart')} <span className="whitespace-nowrap text-brand">{t('titleAccent')}</span> {t('titleEnd')}{' '}
            <span className="text-brand">{t('titleFree')}</span>
          </h1>

          <p className="mt-6 max-w-[540px] text-base leading-relaxed text-text-secondary sm:text-lg">{t('subtitle')}</p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <WhatsAppButton />
            <Link
              href={`/${locale}/portfolio`}
              className="group inline-flex items-center justify-center gap-1.5 text-[15px] font-semibold text-text-primary underline-offset-[6px] hover:underline"
            >
              {tCta('work')}
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-text-secondary">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#16A34A]/15 text-[#16A34A]">
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            {t('fine')}
          </p>
        </div>

        <div ref={rootRef} className="relative mx-auto w-full max-w-[640px] lg:max-w-none" aria-hidden="true">
          <div className="overflow-hidden rounded-[18px] border border-line bg-bg-primary shadow-float">
            <div className="flex h-9 items-center gap-1.5 border-b border-line bg-bg-secondary px-4">
              <i className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-3 flex h-6 max-w-[55%] flex-1 items-center rounded-full bg-bg-primary px-3 text-[11px] text-text-muted">
                {t('preview.url')}
              </span>
            </div>
            <div className="relative aspect-[16/11.2]">
              <PreviewSite />
              <div ref={wireRef} className="absolute inset-0 transition-opacity duration-300">
                <Wireframe />
              </div>
            </div>
          </div>

          <div
            className={cn(
              'absolute -bottom-8 left-3 w-[78%] max-w-[300px] rounded-2xl border border-line bg-bg-primary p-4 shadow-float sm:-bottom-12 sm:-left-10 sm:p-5',
              'motion-safe:animate-float'
            )}
          >
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <span className="flex items-center gap-2 font-semibold text-text-primary">
                <span className={cn('h-2 w-2 rounded-full', state.done ? 'bg-[#16A34A]' : 'animate-pulse2 bg-brand')} />
                {state.done ? t('card.ready') : t('card.building')}
              </span>
              <span className="text-text-muted">{t(`card.kinds.${KINDS[state.kind]}`)}</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tabular-nums tracking-tight text-text-primary sm:text-[1.7rem]">{timeLabel}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
              <span ref={barRef} className="block h-full origin-left scale-x-0 rounded-full bg-brand" />
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {STEPS.map((s, i) => {
                const ok = state.done || i < state.step
                const on = !state.done && i === state.step
                return (
                  <li
                    key={s}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                      ok ? 'bg-[#16A34A]/15 text-[#15803D] dark:text-[#4ADE80]' : on ? 'bg-accent-primary/10 text-accent-ink' : 'bg-bg-tertiary text-text-muted'
                    )}
                  >
                    {t(`card.steps.${s}`)}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
