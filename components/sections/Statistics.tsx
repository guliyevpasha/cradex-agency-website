'use client'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

// ─── Stat icons ───────────────────────────────────────────────────────────────
const STAT_ICONS = ['📅', '😊', '⚡', '🛠️', '⭐', '🌐']

// ─── Card accent colours (cycles through) ────────────────────────────────────
const CARD_ACCENTS = [
  'from-accent-primary/20 to-accent-secondary/10',
  'from-accent-secondary/20 to-accent-primary/10',
  'from-purple-500/20 to-accent-primary/10',
  'from-accent-primary/20 to-purple-500/10',
  'from-yellow-500/20 to-accent-primary/10',
  'from-accent-secondary/20 to-purple-500/10',
]

export function Statistics() {
  const t = useTranslations('home.statistics')
  const prefersReduced = useReducedMotion()

  // Trigger counter when section enters viewport
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  // Stats come from i18n — typed as array of objects
  const stats = t.raw('stats') as Array<{
    value: number
    suffix: string
    label: string
  }>

  // Stagger variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* ── Grid texture background ── */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(108,99,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,99,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      {/* Radial glow centre */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(108,99,255,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          {/* Section label */}
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            {t('sectionLabel')}
          </p>

          {/* Main heading */}
          <h2 className="text-display-lg font-display font-bold text-text-primary leading-tight">
            {t('heading')}{' '}
            <span className="relative inline-block">
              <span className="gradient-text">{t('headingAccent')}</span>
              {/* Hand-drawn underline SVG */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 C40 4, 80 10, 120 6 C160 2, 180 9, 198 7"
                  stroke="url(#underline-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
        </motion.div>

        {/* ── Bento grid ── */}
        <motion.div
          variants={prefersReduced ? undefined : containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={prefersReduced ? undefined : cardVariants}
              className={`
                relative rounded-3xl p-8 overflow-hidden
                border border-white/10
                bg-white/[0.04] backdrop-blur-md
                hover:border-accent-primary/30
                hover:shadow-[0_0_30px_rgba(108,99,255,0.12)]
                transition-all duration-300
                group
              `}
            >
              {/* Card gradient accent */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${CARD_ACCENTS[index % CARD_ACCENTS.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                aria-hidden="true"
              />

              {/* Icon */}
              <div className="relative z-10 text-3xl mb-4" aria-hidden="true">
                {STAT_ICONS[index % STAT_ICONS.length]}
              </div>

              {/* Counter */}
              <div className="relative z-10 flex items-end gap-1 mb-2">
                <span
                  className="text-5xl font-display font-bold gradient-text leading-none"
                  aria-live="polite"
                >
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={prefersReduced ? 0 : 2}
                      useEasing
                      enableScrollSpy={false}
                    />
                  ) : (
                    '0'
                  )}
                </span>
                <span className="text-2xl font-display font-bold text-accent-secondary pb-1">
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <p className="relative z-10 text-text-secondary text-sm font-medium">
                {stat.label}
              </p>

              {/* Corner glow dot */}
              <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-primary opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(108,99,255,0.8)] transition-all duration-300"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
