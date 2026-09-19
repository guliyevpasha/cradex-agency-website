'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
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
  ArrowRight,
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
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
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
  ctaLabel,
  locale,
}: AboutServicesProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #0d0d14 0%, #111120 60%, #0d0d14 100%)',
      }}
    >
      {/* Background glow blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 15% 50%, rgba(108,99,255,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 70% 40% at 85% 50%, rgba(0,212,255,0.05) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-accent-primary text-sm font-mono tracking-widest">
              {number}
            </span>
            <span className="w-px h-4 bg-border/30" />
            <span className="text-text-muted text-xs uppercase tracking-widest">
              {subtitle}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            <span className="text-text-primary">{title} </span>
            <span className="text-transparent bg-gradient-to-r from-accent-primary to-cyan-400 bg-clip-text">
              {titleAccent}
            </span>
            {titleEnd && (
              <span className="text-text-primary"> {titleEnd}</span>
            )}
          </h2>

          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
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
                  'group relative flex flex-col gap-5 p-7 rounded-2xl',
                  'bg-white/[0.03] border border-white/[0.07]',
                  'hover:border-accent-primary/30 hover:bg-white/[0.05]',
                  'transition-all duration-400 cursor-default'
                )}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,99,255,0.08) 0%, transparent 70%)',
                  }}
                />

                {/* Icon */}
                <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-accent-primary/10 border border-accent-primary/20 group-hover:border-accent-primary/40 group-hover:scale-110 transition-all duration-400 shrink-0">
                  <Icon className="w-5 h-5 text-accent-primary" strokeWidth={1.6} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-base font-display font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary/80 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="self-start">
                  <ArrowRight
                    size={15}
                    className="text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href={`/${locale}/services`}
            className={cn(
              'group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl',
              'border border-accent-primary/30 text-accent-primary',
              'hover:bg-accent-primary hover:text-white hover:border-accent-primary',
              'text-sm font-semibold transition-all duration-300'
            )}
          >
            {ctaLabel}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
