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
                        restaurantwebsite.az
                      </div>
                    </div>
                    {/* Restaurant Website Content Preview */}
                    <div className="absolute top-10 left-0 right-0 bottom-0 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                      <motion.div
                        animate={{ y: [0, -50, 0] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {/* Header with Logo */}
                        <div className="h-16 bg-gradient-to-r from-amber-600 to-orange-600 flex items-center px-6 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                              <div className="text-amber-600 font-bold text-lg">R</div>
                            </div>
                            <div className="text-white font-bold text-xl">Restaurant Elite</div>
                          </div>
                          <div className="ml-auto flex gap-4 text-sm text-white">
                            <div className="px-3 py-1">Menu</div>
                            <div className="px-3 py-1">About</div>
                            <div className="px-3 py-1">Contact</div>
                          </div>
                        </div>
                        {/* Hero Image Section */}
                        <div className="relative h-48 bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                          <div className="text-center px-6">
                            <div className="text-3xl font-bold text-gray-800 mb-2">Premium Dining Experience</div>
                            <div className="text-gray-600">Reserve your table today</div>
                            <div className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-sm font-semibold">
                              Book Now
                            </div>
                          </div>
                        </div>
                        {/* Featured Dishes */}
                        <div className="p-6 grid grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <div className="h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <div className="h-24 bg-gradient-to-br from-red-200 to-orange-200 rounded-lg mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <div className="h-24 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-lg mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
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
                  {/* Real Website Screenshot - Tablet (Clinic Website) */}
                  <div className="absolute inset-0 bg-white">
                    <motion.div
                      animate={{ y: [0, -40, 0] }}
                      transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="h-full bg-gradient-to-br from-blue-50 to-cyan-50"
                    >
                      {/* Medical Clinic Header */}
                      <div className="h-12 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center px-4 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/90 rounded flex items-center justify-center">
                            <div className="text-cyan-600 font-bold">+</div>
                          </div>
                          <div className="text-white font-semibold text-sm">Health Clinic</div>
                        </div>
                      </div>
                      {/* Appointment Banner */}
                      <div className="p-4 bg-gradient-to-r from-cyan-100 to-blue-100 border-l-4 border-cyan-600 mx-4 mt-4 rounded">
                        <div className="text-sm font-semibold text-cyan-900">Book Appointment</div>
                        <div className="text-xs text-cyan-700 mt-1">24/7 Available</div>
                      </div>
                      {/* Doctor Cards */}
                      <div className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-3 shadow-md flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-1" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-md flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-1" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                      {/* Services Grid */}
                      <div className="px-4 grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                          <div className="h-8 w-8 bg-cyan-100 rounded-full mx-auto mb-2" />
                          <div className="h-2 bg-gray-100 rounded" />
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full mx-auto mb-2" />
                          <div className="h-2 bg-gray-100 rounded" />
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
                  {/* Real Website Screenshot - Mobile (E-commerce) */}
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
                      className="pt-6 bg-gradient-to-br from-purple-50 to-pink-50 h-full"
                    >
                      {/* E-commerce Header */}
                      <div className="h-10 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center px-2 shadow-lg">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-white/90 rounded-full" />
                          <div className="text-white font-bold text-xs">Shop Online</div>
                        </div>
                        <div className="w-6 h-6 bg-white/20 rounded-full" />
                      </div>
                      {/* Search Bar */}
                      <div className="px-2 py-2">
                        <div className="h-8 bg-white rounded-full shadow-sm flex items-center px-3">
                          <div className="h-3 bg-gray-200 rounded flex-1" />
                        </div>
                      </div>
                      {/* Product Banner */}
                      <div className="px-2">
                        <div className="h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="h-4 w-20 bg-white/50 rounded mx-auto mb-1" />
                            <div className="h-3 w-16 bg-white/30 rounded mx-auto" />
                          </div>
                        </div>
                      </div>
                      {/* Product Grid */}
                      <div className="p-2 grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-2 shadow-md">
                          <div className="h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded mb-1" />
                          <div className="h-2 bg-gray-200 rounded mb-1" />
                          <div className="h-2 bg-gray-100 rounded w-2/3" />
                          <div className="h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded mt-1" />
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-md">
                          <div className="h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded mb-1" />
                          <div className="h-2 bg-gray-200 rounded mb-1" />
                          <div className="h-2 bg-gray-100 rounded w-2/3" />
                          <div className="h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded mt-1" />
                        </div>
                      </div>
                      {/* Bottom Nav */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white border-t border-gray-200 flex items-center justify-around px-2">
                        <div className="w-6 h-6 bg-purple-100 rounded" />
                        <div className="w-6 h-6 bg-gray-100 rounded" />
                        <div className="w-6 h-6 bg-gray-100 rounded" />
                        <div className="w-6 h-6 bg-gray-100 rounded" />
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