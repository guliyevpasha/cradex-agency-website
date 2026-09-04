'use client'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

const CARD_ACCENTS = [
  { bg: 'rgba(108,99,255,0.13)', border: 'rgba(108,99,255,0.4)', shadow: 'rgba(108,99,255,0.25)' },
  { bg: 'rgba(0,212,255,0.11)',  border: 'rgba(0,212,255,0.35)',  shadow: 'rgba(0,212,255,0.2)'  },
  { bg: 'rgba(139,92,246,0.13)', border: 'rgba(139,92,246,0.4)', shadow: 'rgba(139,92,246,0.25)' },
  { bg: 'rgba(0,212,255,0.13)',  border: 'rgba(0,212,255,0.4)',  shadow: 'rgba(0,212,255,0.25)' },
  { bg: 'rgba(108,99,255,0.11)', border: 'rgba(108,99,255,0.35)', shadow: 'rgba(108,99,255,0.2)' },
  { bg: 'rgba(34,197,94,0.11)',  border: 'rgba(34,197,94,0.35)',  shadow: 'rgba(34,197,94,0.2)'  },
]

// Three copies of the list. The track shifts left by exactly one third, which
// is one whole copy, so the cards never visibly reset. Three rather than two
// because a single copy of six cards is narrower than a wide desktop viewport.
const COPIES = [0, 1, 2]

// Seconds for one copy to pass. Card widths change between breakpoints but the
// shift is a percentage of the track, so the loop stays exact either way; only
// the apparent speed differs slightly, which reads fine.
const DURATION_S = 46

export function AdvantagesSlider() {
  const t = useTranslations('home.advantages')
  const items = t.raw('items') as Array<{ emoji: string; title: string; desc: string }>

  const { ref: sectionRef, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-14">
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

      {/* Marquee. `group` drives the hover pause defined in globals.css. */}
      <div
        className="marquee-viewport group relative overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <ul
          // No horizontal padding here: it would be added to the track width
          // and the one-third shift would no longer equal one copy, putting a
          // small jump in every loop. The edge mask already softens the ends.
          className="marquee-track flex w-max items-stretch"
          style={{
            animation: `marquee-scroll-third ${DURATION_S}s linear infinite`,
            willChange: 'transform',
          }}
        >
          {COPIES.map((copy) =>
            items.map((item, i) => {
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length]
              return (
                <li
                  key={`${copy}-${i}`}
                  // Only the first copy is real content; the rest are visual
                  // repeats and would otherwise be read out three times over.
                  aria-hidden={copy > 0}
                  className="shrink-0 w-[248px] sm:w-[288px] mr-4 sm:mr-5 rounded-2xl p-6 flex flex-col gap-3"
                  style={{
                    background: accent.bg,
                    border: `1px solid ${accent.border}`,
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    boxShadow: `0 8px 32px ${accent.shadow}`,
                  }}
                >
                  <span className="text-4xl leading-none" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <h3 className="text-text-primary font-display font-bold text-lg leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </section>
  )
}
