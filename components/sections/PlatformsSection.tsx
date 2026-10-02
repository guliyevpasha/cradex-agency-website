'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Search, 
  Share2, 
  PlayCircle, 
  Briefcase, 
  Globe,
  Target,
  Rocket,
  TrendingUp,
  BarChart3,
  Compass,
  Lightbulb,
  Zap
} from 'lucide-react'

interface Platform {
  name: string
  description: string
}

interface PlatformsSectionProps {
  title: string
  subtitle: string
  platforms: Platform[]
}

// Icon mapping based on platform/process step names
const platformIcons: Record<string, typeof Search> = {
  // Digital Marketing platforms
  'Google Ads': Search,
  'Meta Ads (Facebook & Instagram)': Share2,
  'TikTok Ads': PlayCircle,
  'LinkedIn Ads': Briefcase,
  'Yandex Ads': Globe,
  
  // SMM Process Steps (Azerbaijani)
  'Kəşfiyyat və Audit': Search,
  'Strategiya və Planlaşdırma': Target,
  'İcra və Optimallaşdırma': Rocket,
  'Davamlı İnkişaf': TrendingUp,
  'Ölçmə və Hesabat': BarChart3,
  
  // SMM Process Steps (English)
  'Discovery & Audit': Search,
  'Strategy & Planning': Target,
  'Execution & Optimization': Rocket,
  'Continuous Development': TrendingUp,
  'Measurement & Reporting': BarChart3,
  
  // SMM Process Steps (Russian)
  'Разведка и аудит': Search,
  'Стратегия и планирование': Target,
  'Реализация и оптимизация': Rocket,
  'Непрерывное развитие': TrendingUp,
  'Измерение и отчётность': BarChart3,
  
  // SMM Process Steps (Turkish)
  'Keşif ve Audit': Search,
  'Strateji ve Planlama': Target,
  'Uygulama ve Optimizasyon': Rocket,
  'Sürekli Gelişim': TrendingUp,
  'Ölçme ve Raporlama': BarChart3,
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
      className="py-20 lg:py-32 bg-bg-primary relative overflow-hidden scroll-mt-20"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(108,99,255,0.2) 0%, transparent 60%)
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary">
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
                <div className="flex items-start gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-bg-tertiary/50 border border-accent-primary/10 hover:border-accent-primary/30 hover:bg-bg-tertiary/70 transition-all duration-300">
                  {/* Icon only - removed number */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotateY: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex-shrink-0"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      'bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                    }`}>
                      <Icon size={28} className="text-accent-primary transition-all duration-300" strokeWidth={2.5} />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 w-full">
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 sm:mb-3 group-hover:text-accent-primary transition-colors duration-200">
                      {platform.name}
                    </h3>
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
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
