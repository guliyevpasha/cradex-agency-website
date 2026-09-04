'use client'
import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Star, Quote } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules'
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Testimonial } from '@/lib/data/testimonials'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import type { Locale } from '@/i18n'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

// ─── Animation variants ───────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
}

const starsVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
}

const starItem = {
  hidden: { opacity: 0, scale: 0, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
}

const textVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.3 } },
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const locale = useLocale() as Locale
  const t = useTranslations('home.testimonials')
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReduced = useReducedMotion()

  return (
    <section className="py-24 overflow-hidden relative">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(108,99,255,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <p className="text-accent-primary text-sm font-medium tracking-widest mb-3">
            {t('subtitle')}
          </p>
          <h2 className="text-display-lg font-display font-bold text-text-primary">
            <span className="gradient-text">{t('title')}</span>
          </h2>
        </ScrollReveal>

        {/* Swiper */}
        <Swiper
          modules={[EffectCoverflow, Autoplay, Pagination]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop={testimonials.length >= 3}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 140,
            modifier: 2.2,
            slideShadows: false,
          }}
          pagination={{
            clickable: true,
            el: '.testimonials-pagination',
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="!pb-4 !overflow-visible"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide
              key={item.id}
              style={{ width: 'clamp(280px, 85vw, 400px)' }}
            >
              <TestimonialCard
                testimonial={item}
                locale={locale}
                isActive={index === activeIndex}
                prefersReduced={prefersReduced}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination dots */}
        <div className="testimonials-pagination flex justify-center gap-2 mt-8" />
      </div>
    </section>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function TestimonialCard({
  testimonial,
  locale,
  isActive,
  prefersReduced,
}: {
  testimonial: Testimonial
  locale: Locale
  isActive: boolean
  prefersReduced: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()
  const prevActive = useRef(false)

  // Initial reveal animation
  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [inView, controls])

  // Spin when card becomes active
  useEffect(() => {
    if (prefersReduced) return
    if (isActive && !prevActive.current) {
      controls.start({
        rotateY: [0, 180, 360],
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      })
    }
    prevActive.current = isActive
  }, [isActive, prefersReduced, controls])

  const text = testimonial.text[locale] ?? testimonial.text.az
  const name = testimonial.name[locale] ?? testimonial.name.az
  const role = testimonial.role[locale] ?? testimonial.role.az

  return (
    <motion.div
      ref={ref}
      variants={prefersReduced ? undefined : cardVariants}
      initial="hidden"
      animate={controls}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isActive
          ? '0 0 40px rgba(108,99,255,0.22), 0 8px 32px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(0,0,0,0.2)',
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={[
        'relative rounded-2xl p-7 flex flex-col gap-5 border',
        'transition-colors duration-500 select-none cursor-grab active:cursor-grabbing',
        isActive
          ? 'bg-white/[0.07] border-accent-primary/40'
          : 'bg-white/[0.03] border-white/10',
      ].join(' ')}
    >
      {/* Top glow line — active only */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="glow-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent-primary/70 to-transparent origin-center"
          />
        )}
      </AnimatePresence>

      {/* Floating quote icon */}
      <motion.div
        variants={prefersReduced ? undefined : {
          hidden: { opacity: 0, x: 10 },
          visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.4 } },
        }}
        className="absolute top-5 right-5"
      >
        <Quote size={20} className="text-accent-primary/20" />
      </motion.div>

      {/* Avatar + name + role + stars */}
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Avatar with animated ring on active */}
        <div className="relative">
          <motion.div
            variants={prefersReduced ? undefined : avatarVariants}
            className={[
              'w-20 h-20 rounded-full overflow-hidden',
              'border-2 transition-colors duration-500 shrink-0',
              isActive
                ? 'border-accent-primary/60'
                : 'border-white/10',
            ].join(' ')}
            style={
              isActive
                ? { boxShadow: '0 0 20px rgba(108,99,255,0.35)' }
                : {}
            }
          >
            {/* Anything that looks like an image is one; the field doubles as an
                emoji fallback for entries without a photo. Testing only for a
                leading "/" sent Sanity's https://cdn.sanity.io URLs down the
                emoji branch, which printed the raw URL as text. */}
            {/^(\/|https?:\/\/)/.test(testimonial.photo) ? (
              /* Real photo */
              <Image
                src={testimonial.photo}
                alt={name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Emoji fallback */
              <div
                className={[
                  'w-full h-full flex items-center justify-center text-4xl',
                  isActive ? 'bg-accent-primary/10' : 'bg-bg-tertiary',
                ].join(' ')}
                aria-hidden="true"
              >
                {testimonial.photo}
              </div>
            )}
          </motion.div>

          {/* Animated pulse ring — active only */}
          <AnimatePresence>
            {isActive && !prefersReduced && (
              <motion.div
                key="pulse-ring"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.35, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-accent-primary/50 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Name & role */}
        <motion.div variants={prefersReduced ? undefined : textVariants}>
          <p className="text-text-primary font-semibold">{name}</p>
          <p className="text-text-muted text-sm mt-0.5">
            {role}
            {testimonial.company && (
              <span className="text-accent-primary"> · {testimonial.company}</span>
            )}
          </p>
        </motion.div>

        {/* Stars — staggered */}
        <motion.div
          variants={prefersReduced ? undefined : starsVariants}
          className="flex items-center gap-1"
          aria-label={`${testimonial.rating} ulduz`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              variants={prefersReduced ? undefined : starItem}
            >
              <Star
                size={14}
                className={
                  i < testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-white/20'
                }
              />
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        variants={prefersReduced ? undefined : {
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 1, transition: { delay: 0.35, duration: 0.4 } },
        }}
        className="h-px bg-white/10 origin-left"
      />

      {/* Quote text */}
      <motion.div
        variants={prefersReduced ? undefined : {
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.45 } },
        }}
        className="relative flex-1"
      >
        <span
          className="absolute -top-1 -left-1 text-5xl text-accent-primary/20 font-serif leading-none select-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>
        <p className="text-text-secondary text-sm leading-relaxed pt-4 px-3">
          {text}
        </p>
      </motion.div>
    </motion.div>
  )
}
