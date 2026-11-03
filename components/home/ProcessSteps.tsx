'use client'
/**
 * "Your site in 3 steps". Each card carries a small isometric 3D scene drawn
 * with CSS transforms (no WebGL), and tilts towards the pointer on desktop.
 * Styles live in app/globals.css under "Process 3D".
 * @author Paşa Quliyev — Cradex Agency
 */
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

function ChatScene() {
  return (
    <div className="p3d-iso">
      <div className="p3d-plate p3d-phone">
        <span className="p3d-notch" />
      </div>
      <span className="p3d-bubble p3d-b1" />
      <span className="p3d-bubble p3d-b2 p3d-brand" />
      <span className="p3d-bubble p3d-b3" />
    </div>
  )
}

function LayersScene() {
  return (
    <div className="p3d-iso">
      <div className="p3d-plate p3d-layer p3d-l1" />
      <div className="p3d-plate p3d-layer p3d-l2">
        <span className="p3d-blob" />
      </div>
      <div className="p3d-plate p3d-layer p3d-l3">
        <span className="p3d-line w-[60%]" />
        <span className="p3d-line w-[85%]" />
        <span className="p3d-line w-[40%] p3d-brandline" />
      </div>
    </div>
  )
}

function LaunchScene() {
  return (
    <div className="p3d-iso">
      <div className="p3d-plate p3d-base">
        <span className="p3d-ring" />
        <span className="p3d-ring p3d-ring2" />
      </div>
      <div className="p3d-coin">
        <span className="p3d-face">
          <Check size={30} strokeWidth={3} aria-hidden="true" />
        </span>
        <span className="p3d-face p3d-back">
          <Check size={30} strokeWidth={3} aria-hidden="true" />
        </span>
      </div>
    </div>
  )
}

const SCENES = [ChatScene, LayersScene, LaunchScene]

function StepCard({ n, title, text }: { n: number; title: string; text: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const Scene = SCENES[n - 1]

  function onMove(e: React.PointerEvent<HTMLLIElement>) {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
    ref.current.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
  }

  function onLeave() {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <li ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="p3d-card group">
      <div className="p3d-inner rounded-3xl border border-line bg-bg-secondary p-6 sm:p-7">
        <div className="p3d-scene" aria-hidden="true">
          <Scene />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-text-primary text-sm font-bold text-bg-primary">
            {n}
          </span>
          <h3 className="text-xl font-bold tracking-tight text-text-primary">{title}</h3>
        </div>
        <p className="mt-3 leading-relaxed text-text-secondary">{text}</p>
      </div>
    </li>
  )
}

export function ProcessSteps() {
  const t = useTranslations('site.process')

  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <StepCard key={n} n={n} title={t(`step${n}Title`)} text={t(`step${n}Text`)} />
          ))}
        </ol>
      </div>
    </section>
  )
}
