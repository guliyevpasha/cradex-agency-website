'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, Share2, PlayCircle, Briefcase, Globe } from 'lucide-react'

interface Platform {
  name: string
  description: string
}

interface PlatformsSectionProps {
  title: string
  subtitle: string
  platforms: Platform[]
}

const platformIcons: Record<string, typeof Search> = {
  'Google Ads': Search,
  'Meta Ads (Facebook & Instagram)': Share2,
  'TikTok Ads': PlayCircle,
  'LinkedIn Ads': Briefcase,
  'Yandex Ads': Globe,
}

export function PlatformsSection({ title, subtitle, platforms }: PlatformsSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      id="platforms-section"
      ref={ref}
      className="py-20 lg:py-32 bg-bg-secondary relative overflow-hidden scroll-mt-20"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(108,99,255,0.15) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-bg-tertiary/50 border border-accent-primary/20 text-sm font-medium text-text-secondary uppercase tracking-wider mb-6">
            {subtitle}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-primary">
            {title}
          </h2>
        </motion.div>

        {/* Platforms List */}
        <div className="space-y-6">
          {platforms.map((platform, index) => {
            const Icon = platformIcons[platform.name] || Search
            
            return (
              <motion.div
                key={platform.name}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-start gap-6 p-8 rounded-2xl bg-bg-tertiary/30 border border-border/20 hover:border-accent-primary/30 transition-all duration-300">
                  {/* Number */}
                  <div className="flex-shrink-0">
                    <span className="text-6xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent-primary/40 to-accent-secondary/40 select-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-14 h-14 rounded-xl bg-bg-secondary/80 border border-accent-primary/20 flex items-center justify-center group-hover:border-accent-primary/40 group-hover:bg-accent-primary/10 transition-all duration-300">
                      <Icon size={24} className="text-accent-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors duration-200">
                      {platform.name}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {/* Separator line - except for last item */}
                {index < platforms.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent my-6" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
