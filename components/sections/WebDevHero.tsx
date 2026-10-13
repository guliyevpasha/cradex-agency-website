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
    <section className="relative pt-32 pb-20 md:pb-32 bg-gradient-to-br from-[#0A1628] via-[#111E35] to-[#0A1628] overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-20 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">
                Demo pulsuzdur
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {title}{' '}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {titleAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
              >
                {primaryButton}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://super-intellect.az"
                target="_blank"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border-2 border-white/10 text-white font-semibold rounded-lg hover:border-white/20 hover:bg-white/10 hover:shadow-lg transition-all duration-300"
              >
                {secondaryButton}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Demo Note */}
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
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
                animate={{ 
                  opacity: 1, 
                  y: [0, -10, 0],
                  rotate: 2 
                }}
                transition={{ 
                  delay: 0.4, 
                  duration: 0.8,
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute top-0 right-0 w-[85%] transform transition-transform duration-500 hover:rotate-0 hover:scale-105"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border-8 border-gray-900">
                  {/* Real Website Screenshot - Desktop */}
                  <div className="absolute inset-0 bg-white">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-gray-900 flex items-center px-4 gap-2">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 h-5 bg-gray-800 rounded text-xs text-gray-400 flex items-center px-2">
                        cradexagency.com
                      </div>
                    </div>
                    {/* Website Content Preview */}
                    <div className="absolute top-10 left-0 right-0 bottom-0 overflow-hidden">
                      <motion.div
                        animate={{ y: [0, -50, 0] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {/* Header */}
                        <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center px-4">
                          <div className="w-20 h-6 bg-white/20 rounded" />
                          <div className="ml-auto flex gap-2">
                            <div className="w-12 h-4 bg-white/20 rounded" />
                            <div className="w-12 h-4 bg-white/20 rounded" />
                            <div className="w-12 h-4 bg-white/20 rounded" />
                          </div>
                        </div>
                        {/* Hero Section */}
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                          <div className="w-3/4 h-8 bg-gray-200 rounded mb-3" />
                          <div className="w-1/2 h-6 bg-gray-100 rounded mb-4" />
                          <div className="flex gap-2">
                            <div className="w-20 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded" />
                            <div className="w-20 h-8 bg-gray-200 rounded" />
                          </div>
                        </div>
                        {/* Content Blocks */}
                        <div className="p-6 grid grid-cols-3 gap-3">
                          <div className="h-24 bg-gray-100 rounded" />
                          <div className="h-24 bg-gray-100 rounded" />
                          <div className="h-24 bg-gray-100 rounded" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tablet mockup - middle */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -8 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -15, 0],
                  rotate: -6 
                }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.8,
                  y: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute bottom-24 left-8 md:left-12 w-[45%] transform transition-transform duration-500 hover:rotate-0 hover:scale-105 z-10"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl border-6 border-gray-800">
                  {/* Real Website Screenshot - Tablet */}
                  <div className="absolute inset-0 bg-white">
                    <motion.div
                      animate={{ y: [0, -40, 0] }}
                      transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="h-full"
                    >
                      <div className="h-12 bg-gradient-to-r from-blue-500 to-blue-600" />
                      <div className="p-4 space-y-3">
                        <div className="h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-20 bg-gray-100 rounded" />
                          <div className="h-20 bg-gray-100 rounded" />
                        </div>
                        <div className="h-24 bg-gray-100 rounded" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-16 bg-gray-100 rounded" />
                          <div className="h-16 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile mockup - front */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 8 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -20, 0],
                  rotate: 6 
                }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.8,
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute bottom-0 right-12 md:right-16 w-[28%] transform transition-transform duration-500 hover:rotate-0 hover:scale-110 z-20"
              >
                <div className="relative aspect-[9/19] rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-900">
                  {/* Real Website Screenshot - Mobile */}
                  <div className="absolute inset-0 bg-white">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-3xl z-10" />
                    <motion.div
                      animate={{ y: [0, -30, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="pt-6"
                    >
                      <div className="h-10 bg-gradient-to-r from-blue-500 to-blue-600" />
                      <div className="p-2 space-y-2">
                        <div className="h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded" />
                        <div className="h-16 bg-gray-100 rounded" />
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-12 bg-gray-100 rounded" />
                          <div className="h-12 bg-gray-100 rounded" />
                        </div>
                        <div className="h-20 bg-gray-100 rounded" />
                        <div className="h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <div className="absolute top-10 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
              <div
                className="absolute bottom-20 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}