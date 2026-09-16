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
        'relative py-24 lg:py-32 overflow-hidden',
        'bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary',
        className
      )}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%,
            rgba(108,99,255,0.15) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={inView ? 'visible' : 'hidden'}
          variants={aboutFadeIn}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
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
          className="space-y-12 lg:space-y-16 mt-16 lg:mt-20"
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
