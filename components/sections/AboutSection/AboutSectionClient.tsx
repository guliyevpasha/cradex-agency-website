'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useParams } from 'next/navigation'
import { aboutStagger, aboutFadeIn } from '@/lib/animations/variants'
import { SubsectionCard } from './SubsectionCard'
import { StatsCounter } from './StatsCounter'
import { AboutCTA } from './AboutCTA'
import { cn } from '@/lib/utils'

interface ValueItem {
  id: string
  title: string
  description: string
  icon: string
}

interface Subsection {
  id: string
  title: string
  content: string
  icon?: string
  values?: ValueItem[]
}

interface Stat {
  value: number
  suffix: string
  label: string
  ariaLabel: string
}

interface AboutContent {
  sectionTitle: string
  subsections: Subsection[]
  stats: Stat[]
  ctas: {
    primary: string
    secondary: string
  }
}

interface AboutSectionClientProps {
  content: AboutContent
  className?: string
}

export function AboutSectionClient({
  content,
  className,
}: AboutSectionClientProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'az'

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const trackScrollDepth = (depth: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', `about_section_${depth}_scroll`, {
        event_category: 'engagement',
        event_label: `About section ${depth}% scrolled`,
      })
    }
  }

  const trackCTAClick = (ctaName: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', ctaName, {
        event_category: 'cta',
        event_label: `About section CTA clicked: ${ctaName}`,
      })
    }
  }

  return (
    <section
      ref={ref}
      id="about"
      className={cn(
        'relative py-32 lg:py-40 overflow-hidden',
        className
      )}
    >
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(108,99,255,0.2) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 20% 80%, rgba(0,212,255,0.15) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          variants={aboutFadeIn}
          className="text-center mb-24 lg:mb-32"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
            {content.sectionTitle}
          </h2>
        </motion.div>

        {/* Stats Counter */}
        <StatsCounter stats={content.stats} inView={inView} />

        {/* Subsections Grid */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          variants={aboutStagger}
          className="space-y-20 lg:space-y-24 mt-24 lg:mt-32"
        >
          {content.subsections.map((subsection, index) => (
            <SubsectionCard
              key={subsection.id}
              subsection={subsection}
              index={index}
            />
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <AboutCTA
          primaryText={content.ctas.primary}
          secondaryText={content.ctas.secondary}
          onPrimaryClick={() =>
            trackCTAClick('about_cta_start_collaboration_clicked')
          }
          onSecondaryClick={() =>
            trackCTAClick('about_cta_get_consultation_clicked')
          }
          locale={locale}
        />
      </div>
    </section>
  )
}
