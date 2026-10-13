'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <section className="relative min-h-[90vh] bg-gradient-to-br from-[#0A1628] via-[#111E35] to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
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
                href="https://wa.me/994502211161"
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

          {/* Right - Website Previews */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] hidden lg:block"
          >
            {/* Main Desktop Preview - Center */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden z-20"
            >
              <div className="w-full h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="relative w-full h-[calc(100%-32px)] bg-white overflow-hidden">
                {/* Baku Global Education - Desktop Preview */}
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 flex items-center justify-between">
                    <div className="font-bold text-lg">Baku Global Education</div>
                    <div className="flex gap-4 text-sm">
                      <span>Haqqımızda</span>
                      <span>Xidmətlər</span>
                      <span>Əlaqə</span>
                    </div>
                  </div>
                  {/* Hero Section */}
                  <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex items-center">
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold text-gray-800">
                        Xaricdə Təhsil<br />Xəyalınız Gerçək Olsun
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Dünya universitetlərinə qəbul, viza dəstəyi
                      </p>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block text-sm">
                        Müraciət et
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tablet Preview - Top Right */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute top-8 right-0 w-[280px] h-[380px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden z-10"
            >
              <div className="w-full h-6 bg-gray-800 border-b border-gray-700" />
              <div className="relative w-full h-[calc(100%-24px)] bg-white overflow-hidden">
                {/* Ciao Stellina - Tablet Preview */}
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 px-4 text-center">
                    <div className="font-bold">Ciao Stellina</div>
                    <div className="text-xs">Resto Pub</div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 p-4 overflow-auto">
                    <div className="space-y-3">
                      <div className="text-xl font-bold text-gray-800 text-center">
                        Menyu
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded p-2 text-center shadow-sm">
                          <div className="text-xs font-semibold">Pizza</div>
                          <div className="text-xs text-gray-500">12 AZN</div>
                        </div>
                        <div className="bg-white rounded p-2 text-center shadow-sm">
                          <div className="text-xs font-semibold">Pasta</div>
                          <div className="text-xs text-gray-500">15 AZN</div>
                        </div>
                        <div className="bg-white rounded p-2 text-center shadow-sm">
                          <div className="text-xs font-semibold">Salad</div>
                          <div className="text-xs text-gray-500">8 AZN</div>
                        </div>
                        <div className="bg-white rounded p-2 text-center shadow-sm">
                          <div className="text-xs font-semibold">Drinks</div>
                          <div className="text-xs text-gray-500">5 AZN</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Preview - Left */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute bottom-12 left-0 w-[200px] h-[420px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-xl border-4 border-gray-700 overflow-hidden z-30"
            >
              <div className="w-full h-8 bg-gray-800 flex items-center justify-center">
                <div className="w-16 h-4 bg-gray-700 rounded-full" />
              </div>
              <div className="relative w-full h-[calc(100%-64px)] bg-white overflow-auto">
                {/* Alo Təmizlik - Mobile Preview */}
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 text-center">
                    <div className="font-bold text-sm">Alo Təmizlik</div>
                    <div className="text-xs opacity-90">Təmizlik Xidmətləri</div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                    <div className="space-y-3">
                      <div className="text-center space-y-2">
                        <div className="text-lg font-bold text-gray-800">
                          Ev Təmizliyi
                        </div>
                        <div className="text-xs text-gray-600">
                          Peşəkar komanda ilə<br />dərin təmizlik
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs font-semibold text-emerald-700">
                            ✓ Sürətli Xidmət
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs font-semibold text-emerald-700">
                            ✓ Təhlükəsiz Məhsullar
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs font-semibold text-emerald-700">
                            ✓ Zəmanət
                          </div>
                        </div>
                      </div>
                      <div className="bg-emerald-600 text-white py-2 px-4 rounded-lg text-center text-xs font-semibold">
                        Sifariş et
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-8 bg-gray-800 flex items-center justify-center">
                <div className="w-12 h-1 bg-gray-700 rounded-full" />
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </section>
  );
}
