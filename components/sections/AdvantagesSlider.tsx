'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

const CARD_ACCENTS = [
  { bg: 'rgba(108,99,255,0.13)', border: 'rgba(108,99,255,0.4)', shadow: 'rgba(108,99,255,0.25)' },
  { bg: 'rgba(0,212,255,0.11)',  border: 'rgba(0,212,255,0.35)',  shadow: 'rgba(0,212,255,0.2)'  },
  { bg: 'rgba(139,92,246,0.13)', border: 'rgba(139,92,246,0.4)', shadow: 'rgba(139,92,246,0.25)' },
  { bg: 'rgba(0,212,255,0.13)',  border: 'rgba(0,212,255,0.4)',  shadow: 'rgba(0,212,255,0.25)' },
  { bg: 'rgba(108,99,255,0.11)', border: 'rgba(108,99,255,0.35)', shadow: 'rgba(108,99,255,0.2)' },
  { bg: 'rgba(34,197,94,0.11)',  border: 'rgba(34,197,94,0.35)',  shadow: 'rgba(34,197,94,0.2)'  },
]

// Phase of the animation cycle
type Phase = 'stacked' | 'fanning' | 'sliding' | 'collapsing'

const STACK_PAUSE   = 1200  // ms — how long cards stay stacked before fanning
const FAN_DURATION  = 800   // ms — fan-out animation
const SLIDE_SPEED   = 1.4   // px per frame
const COLLAPSE_PAUSE = 600  // ms — pause before collapsing

export function AdvantagesSlider() {
  const t = useTranslations('home.advantages')
  const prefersReduced = useReducedMotion()
  const items = t.raw('items') as Array<{ emoji: string; title: string; desc: string }>

  const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.25 })

  const [phase, setPhase] = useState<Phase>('stacked')
  const [slideX, setSlideX] = useState(0)
  const animRef = useRef<number>()
  const phaseRef = useRef<Phase>('stacked')
  const slideXRef = useRef(0)

  const CARD_W = 280
  const GAP = 20
  const TOTAL_SLIDE = items.length * (CARD_W + GAP)

  // Keep refs in sync
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { slideXRef.current = slideX }, [slideX])

  useEffect(() => {
    if (!inView || prefersReduced) {
      cancelAnimationFrame(animRef.current!)
      return
    }

    // Start the cycle
    setPhase('stacked')
    setSlideX(0)

    const runCycle = () => {
      // 1. Show stacked for a moment
      setPhase('stacked')
      setSlideX(0)

      setTimeout(() => {
        // 2. Fan out
        setPhase('fanning')

        setTimeout(() => {
          // 3. Slide left
          setPhase('sliding')

          const slide = () => {
            slideXRef.current += SLIDE_SPEED
            setSlideX(slideXRef.current)

            if (slideXRef.current >= TOTAL_SLIDE * 0.7) {
              // 4. Collapse
              cancelAnimationFrame(animRef.current!)
              setPhase('collapsing')

              setTimeout(() => {
                slideXRef.current = 0
                runCycle() // restart
              }, COLLAPSE_PAUSE + 400)
              return
            }

            animRef.current = requestAnimationFrame(slide)
          }

          animRef.current = requestAnimationFrame(slide)
        }, FAN_DURATION + 200)
      }, STACK_PAUSE)
    }

    runCycle()

    return () => cancelAnimationFrame(animRef.current!)
  }, [inView, prefersReduced, TOTAL_SLIDE])

  const isStacked   = phase === 'stacked'
  const isFanning   = phase === 'fanning'
  const isSliding   = phase === 'sliding'
  const isCollapsing = phase === 'collapsing'

  return (
    <section ref={sectionRef} className="py-20 overflow-hidden">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-primary text-xs font-semibold tracking-[0.18em] mb-3">
            {t('sectionLabel')}
          </p>
          <h2 className="text-display-lg font-display font-bold text-text-primary leading-tight">
            {t('heading')}{' '}
            <span className="gradient-text">{t('headingAccent')}</span>
          </h2>
        </motion.div>
      </div>

      {/* Card stage */}
      <div
        className="relative h-72 sm:h-80"
        style={{ perspective: '1200px' }}
      >
        {items.map((item, i) => {
          const accent = CARD_ACCENTS[i % CARD_ACCENTS.length]
          const total = items.length

          // ── Stacked state: cards overlap with slight rotation/offset ──
          let x = 0, rotateZ = 0, scale = 1
          const opacity = 1
          let zIndex = i

          if (isStacked || isCollapsing) {
            // Stack: each card slightly offset and rotated
            const offset = (i - Math.floor(total / 2)) * 18
            x = offset
            rotateZ = (i - Math.floor(total / 2)) * 3
            scale = 1 - (total - 1 - i) * 0.03
            zIndex = i
          } else if (isFanning || isSliding) {
            // Fanned/sliding: cards spread out horizontally
            x = i * (CARD_W + GAP) - slideX
            rotateZ = 0
            scale = 1
            zIndex = i
          }

          const transition = {
            duration: isFanning ? FAN_DURATION / 1000 : isCollapsing ? 0.4 : 0,
            ease: [0.22, 1, 0.36, 1] as any,
            delay: isFanning ? i * 0.06 : isCollapsing ? (total - 1 - i) * 0.04 : 0,
          }

          return (
            <motion.div
              key={i}
              animate={{
                x: isSliding ? x : x,
                rotateZ,
                scale,
                opacity,
              }}
              transition={isSliding ? { duration: 0 } : transition}
              className="absolute top-0 left-8 sm:left-16 rounded-2xl p-6 flex flex-col gap-3 cursor-default"
              style={{
                width: `${CARD_W}px`,
                height: '100%',
                background: accent.bg,
                border: `1px solid ${accent.border}`,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: `0 8px 32px ${accent.shadow}`,
                zIndex,
                willChange: 'transform',
                transformOrigin: 'bottom center',
              }}
            >
              <span className="text-4xl" aria-hidden="true">{item.emoji}</span>
              <h3 className="text-text-primary font-display font-bold text-lg leading-snug">
                {item.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                {item.desc}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Phase indicator dots */}
      <div className="flex justify-center gap-2 mt-8">
        {(['stacked', 'fanning', 'sliding', 'collapsing'] as Phase[]).map((p) => (
          <div
            key={p}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: phase === p ? '#6C63FF' : 'rgba(255,255,255,0.2)',
              boxShadow: phase === p ? '0 0 6px rgba(108,99,255,0.8)' : 'none',
            }}
          />
        ))}
      </div>
    </section>
  )
}
