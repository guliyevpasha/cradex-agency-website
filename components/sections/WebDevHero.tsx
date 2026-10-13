'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface WebDevHeroProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  demoNote: string;
}

export default function WebDevHero({
  title,
  titleAccent,
  subtitle,
  primaryButton,
  secondaryButton,
  demoNote,
}: WebDevHeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pb-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-20 -right-40 w-96 h-96 bg-[#FF6B2C]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-40 w-96 h-96 bg-[#FF8F5C]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B2C]/10 to-[#FF8F5C]/10 border border-[#FF6B2C]/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[#FF6B2C]" />
              <span className="text-sm font-semibold text-[#FF6B2C]">
                Demo pulsuzdur
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}{' '}
              <span className="bg-gradient-to-r from-[#FF6B2C] to-[#FF8F5C] bg-clip-text text-transparent">
                {titleAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6B2C] to-[#FF8F5C] text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {primaryButton}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://super-intellect.az"
                target="_blank"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                {secondaryButton}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Demo Note */}
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {demoNote}
            </p>
          </motion.div>

          {/* Right Mockup Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              {/* Desktop mockup - back */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 3 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute top-0 right-0 w-[85%] transform transition-transform duration-500 hover:rotate-0 hover:scale-105"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border-8 border-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="absolute top-4 left-4 right-4 h-10 bg-white/90 rounded-lg flex items-center px-4 gap-2 shadow-sm">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 h-5 bg-gray-200 rounded" />
                    </div>
                    <div className="absolute top-16 left-4 right-4 bottom-4 bg-white rounded-lg p-4 flex flex-col gap-4 shadow-inner">
                      <div className="h-16 bg-gradient-to-r from-[#FF6B2C]/20 to-[#FF8F5C]/20 rounded-lg" />
                      <div className="grid grid-cols-3 gap-3 flex-1">
                        <div className="bg-gray-100 rounded-lg" />
                        <div className="bg-gray-100 rounded-lg" />
                        <div className="bg-gray-100 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tablet mockup - middle */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute bottom-24 left-8 md:left-12 w-[45%] transform transition-transform duration-500 hover:rotate-0 hover:scale-105 z-10"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl border-6 border-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="absolute top-3 left-3 right-3 bottom-3 bg-white rounded-lg flex flex-col gap-2 p-3">
                      <div className="h-10 bg-gradient-to-r from-[#FF6B2C]/20 to-[#FF8F5C]/20 rounded" />
                      <div className="flex-1 bg-gray-100 rounded" />
                      <div className="grid grid-cols-2 gap-2 h-24">
                        <div className="bg-gray-200 rounded" />
                        <div className="bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile mockup - front */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 8 }}
                animate={{ opacity: 1, y: 0, rotate: 6 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-0 right-12 md:right-16 w-[28%] transform transition-transform duration-500 hover:rotate-0 hover:scale-110 z-20"
              >
                <div className="relative aspect-[9/19] rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-3xl z-10" />
                    <div className="absolute top-8 left-2 right-2 bottom-2 bg-white rounded-2xl flex flex-col gap-2 p-2">
                      <div className="h-8 bg-gradient-to-r from-[#FF6B2C]/20 to-[#FF8F5C]/20 rounded" />
                      <div className="flex-1 bg-gray-100 rounded" />
                      <div className="h-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <div className="absolute top-10 left-0 w-20 h-20 bg-[#FF6B2C]/10 rounded-full blur-2xl animate-pulse" />
              <div
                className="absolute bottom-20 right-0 w-24 h-24 bg-[#FF8F5C]/10 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}