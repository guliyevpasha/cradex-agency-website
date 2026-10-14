'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface WebMobileDevHeroProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  buttonText: string;
  note: string;
}

export default function WebMobileDevHero({
  title,
  titleAccent,
  subtitle,
  description,
  buttonText,
  note,
}: WebMobileDevHeroProps) {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 50%, rgba(108,99,255,0.15) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 80% 50%, rgba(151,71,255,0.1) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />
      {/* Background Effects - REMOVED, using gradient overlay instead */}

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 mt-16"
          >
            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {titleAccent}
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-blue-300">
                {subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed">
              {description}
            </p>

            {/* CTA Button */}
            <div className="space-y-4">
              <Link
                href="https://wa.me/994507786887"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                {buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Note */}
              <p className="text-sm text-gray-400">{note}</p>
            </div>
          </motion.div>

          {/* Right - Website Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] hidden lg:block"
          >
            {/* Main Website Preview Image */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-0 left-0 w-full max-w-[600px] mt-16"
            >
              <div className="relative w-full h-[450px]">
                <Image
                  src="/images/web-mobile-dev-preview.jpg"
                  alt="Web və Mobil Tətbiq Nümunəsi"
                  fill
                  className="object-contain object-center"
                  quality={100}
                  priority
                />
              </div>
            </motion.div>

            {/* Conversion Rate Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-8 left-0 bg-white rounded-2xl shadow-2xl p-6 z-30"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Orta konversiya artımı
                  </p>
                  <p className="text-3xl font-bold text-gray-900">+85%</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </section>
  );
}
