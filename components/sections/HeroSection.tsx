'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowUpRight, Star, BadgeCheck } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { HeroOrbit } from '@/components/sections/HeroOrbit'

/**
 * Hero background.
 *
 * This used to be a canvas particle network — 60 nodes with an O(n²) distance
 * check every frame, for a look that is on half the agency sites in the
 * market. Replaced with layered CSS: two drifting aurora fields, a masked
 * technical grid and a vignette. Cheaper (nothing on the main thread), and it
 * reads as depth rather than as decoration.
 */
function HeroBackdrop({ still }: { still: boolean }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#07060F]">
      {/* Base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0918] via-[#080713] to-[#06050D]" />

      {/* Aurora fields.
          No `blur()` filter on these: a 120px blur over a ~1000px square has to
          be recomputed on every frame it moves, which is what made the first
          version stutter. A multi-stop radial gradient is already soft-edged,
          costs nothing to redraw, and — with only `transform` animating and
          `will-change` set — the whole field is handed to the compositor. */}
      <div
        className={`absolute -top-1/3 right-[-10%] w-[75vw] h-[75vw] rounded-full ${
          still ? '' : 'animate-aurora'
        }`}
        style={{
          willChange: 'transform',
          background:
            'radial-gradient(circle closest-side, rgba(108,99,255,0.26) 0%, rgba(108,99,255,0.13) 32%, rgba(108,99,255,0.05) 58%, transparent 78%)',
        }}
      />
      <div
        className={`absolute bottom-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full ${
          still ? '' : 'animate-aurora-slow'
        }`}
        style={{
          willChange: 'transform',
          background:
            'radial-gradient(circle closest-side, rgba(0,212,255,0.16) 0%, rgba(0,212,255,0.08) 35%, rgba(0,212,255,0.03) 60%, transparent 80%)',
        }}
      />

      {/* Technical grid, faded out towards the edges so it never boxes the copy in */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 78%)',
        }}
      />

      {/* Top spotlight */}
      <div
        className="absolute inset-x-0 top-0 h-[45vh]"
        style={{
          background:
            'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(160,155,255,0.10) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const t = useTranslations('home.hero')
  const locale = useLocale()
  const prefersReduced = useReducedMotion()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <HeroBackdrop still={prefersReduced} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">

          {/* ── Left: copy ── */}
          <motion.div
            variants={prefersReduced ? undefined : staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl"
          >
            {/* Eyebrow — states the positioning before the headline does */}
            <motion.div variants={prefersReduced ? undefined : fadeInUp}>
              <span
                className="inline-flex items-center gap-2.5 rounded-full border border-white/10
                  bg-white/[0.03] backdrop-blur-sm px-3.5 py-1.5 mb-7"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-70 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-secondary" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  {t('eyebrow')}
                </span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={prefersReduced ? undefined : fadeInUp}
              className="font-display font-bold leading-[1.03] tracking-[-0.035em] mb-5
                text-[2.25rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
              style={{
                background:
                  'linear-gradient(120deg, #FFFFFF 0%, #FFFFFF 42%, #CFC9FF 72%, #8FD9FF 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('title')}
            </motion.h1>

            {/* Subtitle — a hairline rule instead of italics; quieter and cleaner */}
            <motion.p
              variants={prefersReduced ? undefined : fadeInUp}
              className="relative pl-4 border-l border-white/10 text-text-secondary
                leading-relaxed mb-9 text-base sm:text-lg max-w-lg"
            >
              {t('subtitleAccent')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={prefersReduced ? undefined : fadeInUp}
              className="flex flex-wrap items-center gap-3 mb-9"
            >
              {/* Primary CTA points at the work, not at the sales channel: the
                  navbar already carries the consultation button, and a visitor
                  landing here wants proof before a conversation. */}
              <Link
                href={`/${locale}/portfolio`}
                className="group relative inline-flex items-center gap-2 overflow-hidden
                  rounded-full px-6 py-3.5 font-semibold text-sm sm:text-[15px] text-white
                  bg-gradient-to-r from-accent-primary to-accent-secondary
                  shadow-[0_10px_40px_-12px_rgba(108,99,255,0.85)]
                  transition-transform duration-300 hover:-translate-y-0.5"
              >
                {/* Sheen sweep on hover */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full
                    bg-gradient-to-r from-transparent via-white/25 to-transparent
                    transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden="true"
                />
                <span className="relative">{t('workCta')}</span>
                <ArrowUpRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                href={`/${locale}/services`}
                className="group relative inline-flex items-center gap-2 overflow-hidden
                  rounded-full border border-white/25 px-6 py-3.5 text-sm sm:text-[15px] 
                  font-medium text-text-primary backdrop-blur-sm 
                  transition-all duration-300 hover:border-transparent
                  hover:bg-gradient-to-r hover:from-accent-primary hover:to-accent-secondary
                  hover:text-white hover:shadow-[0_10px_40px_-12px_rgba(108,99,255,0.85)]
                  hover:-translate-y-0.5"
              >
                {/* Sheen sweep on hover */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full
                    bg-gradient-to-r from-transparent via-white/25 to-transparent
                    transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden="true"
                />
                <span className="relative">{t('secondaryCta')}</span>
                <ArrowUpRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>

            {/* Trust strip — one hairline row rather than two boxed cards */}
            <motion.div
              variants={prefersReduced ? undefined : fadeInUp}
              className="inline-flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl
                border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
                  <span className="text-[10px] font-bold text-blue-600">G</span>
                </span>
                <span className="text-sm font-bold text-white leading-none">5.0</span>
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  {t('googleReviews')}
                </span>
              </div>

              <span className="hidden sm:block h-4 w-px bg-white/10" aria-hidden="true" />

              <div className="flex items-center gap-2">
                <BadgeCheck size={15} className="shrink-0 text-accent-secondary" />
                <span className="text-xs font-semibold text-white leading-none">
                  {t('verifiedPartner')}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  {t('googleVerified')}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: the 360° system ── */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex justify-center"
          >
            <HeroOrbit />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade — seamless transition into the next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(7,6,15,0.65) 60%, #08081E 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
