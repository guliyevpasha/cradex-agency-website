'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Search,
  Share2,
  Globe,
  Palette,
  Video,
  PenTool,
  Megaphone,
  Layers,
  Camera,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ElementType> = {
  Search,
  Share2,
  Globe,
  Palette,
  Video,
  PenTool,
  Megaphone,
  Layers,
  Camera,
}

interface ServiceItem {
  id: string
  icon: string
  title: string
  description: string
  href: string
}

interface AboutServicesProps {
  number: string
  subtitle: string
  title: string
  titleAccent: string
  titleEnd: string
  description: string
  items: ServiceItem[]
  ctaLabel: string
  locale: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function AboutServices({
  number,
  subtitle,
  title,
  titleAccent,
  titleEnd,
  description,
  items,
}: Omit<AboutServicesProps, 'ctaLabel' | 'locale'> & { ctaLabel?: string; locale?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #111118 50%, #0A0A0F 100%)' }}
    >
      {/* Ambient glow — marka accent-primary rəngindən */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(108,99,255,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* ── Section Header ── */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-accent-primary text-sm font-mono">{number}</span>
            <span className="text-text-muted text-xs uppercase tracking-widest">
              / {subtitle}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-text-primary">{title} </span>
            <span className="text-transparent bg-gradient-to-r from-accent-primary to-red-500 bg-clip-text">
              {titleAccent}
            </span>
            {titleEnd && <span className="text-text-primary"> {titleEnd}</span>}
          </h2>

          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* ── Services Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = ICON_MAP[item.icon] ?? Layers

            return (
              <motion.div
                key={item.id}
                custom={index}
                variants={prefersReducedMotion ? {} : cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={cn(
                  'group relative p-8 rounded-2xl',
                  'bg-gradient-to-br from-bg-secondary/40 to-bg-tertiary/40',
                  'border border-border/10',
                  'hover:border-accent-primary/30',
                  'hover:shadow-2xl hover:shadow-accent-primary/5',
                  'transition-all duration-500'
                )}
              >
                {/* Subtle hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(108,99,255,0.06) 0%, transparent 70%)',
                  }}
                />

                {/* Icon — eyni AboutValues stili */}
                <div className="mb-6">
                  <div className="inline-flex p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20 group-hover:border-accent-primary/40 group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-6 h-6 text-accent-primary" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary group-hover:bg-clip-text transition-all duration-500">
                  / {item.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary/80 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
