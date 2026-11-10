'use client'
/**
 * Website Screenshots Component - Desktop & Mobile Mockups
 * Displays website screenshots in professional device frames (laptop + phone)
 * @author Paşa Quliyev — Cradex Agency
 */
import Image from 'next/image'
import { Monitor, Smartphone } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

interface WebsiteScreenshotsProps {
  desktop?: string
  mobile?: string
  projectName: string
  locale: 'az' | 'en' | 'ru' | 'tr'
}

const translations = {
  az: {
    title: 'Veb Sayt Görünüşü',
    subtitle: 'Kompüter və mobil cihazlarda responsiv dizayn',
    desktop: 'Desktop Versiya',
    mobile: 'Mobil Versiya',
  },
  en: {
    title: 'Website Preview',
    subtitle: 'Responsive design on desktop and mobile devices',
    desktop: 'Desktop Version',
    mobile: 'Mobile Version',
  },
  ru: {
    title: 'Предварительный просмотр сайта',
    subtitle: 'Адаптивный дизайн на настольных и мобильных устройствах',
    desktop: 'Десктопная версия',
    mobile: 'Мобильная версия',
  },
  tr: {
    title: 'Web Sitesi Önizlemesi',
    subtitle: 'Masaüstü ve mobil cihazlarda responsive tasarım',
    desktop: 'Masaüstü Sürümü',
    mobile: 'Mobil Sürüm',
  },
}

export function WebsiteScreenshots({ desktop, mobile, projectName, locale }: WebsiteScreenshotsProps) {
  // Don't render if no screenshots provided
  if (!desktop && !mobile) {
    return null
  }

  const t = translations[locale]

  return (
    <section className="py-20 bg-bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
            {t.title}
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Desktop Screenshot - Laptop Mockup */}
          {desktop && (
            <ScrollReveal animation="fadeInLeft" className="order-2 lg:order-1">
              <div className="relative group">
                {/* Label */}
                <div className="flex items-center gap-2 mb-4 text-text-muted">
                  <Monitor className="w-5 h-5 text-accent-primary" />
                  <span className="text-sm font-medium">{t.desktop}</span>
                </div>

                {/* Laptop Frame with 3D effect */}
                <div className="relative transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1">
                  {/* Laptop screen bezel */}
                  <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl p-3 shadow-2xl border border-white/10">
                    {/* Webcam notch */}
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-950 rounded-full border border-gray-700" />
                    
                    {/* Screen with glow effect */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-bg-tertiary shadow-inner">
                      {/* Glow effect behind screen */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-accent-primary/30 via-accent-secondary/30 to-accent-primary/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Screenshot */}
                      <div className="relative w-full h-full">
                        <Image
                          src={desktop}
                          alt={`${projectName} - ${t.desktop}`}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          quality={90}
                        />
                      </div>

                      {/* Screen glare overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Laptop base/keyboard */}
                  <div className="relative h-4 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-2xl shadow-xl">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                    {/* Trackpad indicator */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-900 rounded-full" />
                  </div>

                  {/* Shadow beneath laptop */}
                  <div className="absolute -bottom-6 inset-x-0 h-6 bg-gradient-to-b from-black/20 to-transparent blur-xl" />
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-accent-primary to-accent-secondary text-snow px-4 py-2 rounded-full text-xs font-bold shadow-xl animate-pulse">
                  ✨ Responsive
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Mobile Screenshot - Phone Mockup */}
          {mobile && (
            <ScrollReveal animation="fadeInRight" className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative group max-w-xs w-full">
                {/* Label */}
                <div className="flex items-center gap-2 mb-4 text-text-muted">
                  <Smartphone className="w-5 h-5 text-accent-primary" />
                  <span className="text-sm font-medium">{t.mobile}</span>
                </div>

                {/* Phone Frame with 3D tilt */}
                <div className="relative transform transition-all duration-500 hover:scale-105 hover:rotate-2">
                  {/* Phone bezel */}
                  <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-3xl z-10 border-x-4 border-b-4 border-gray-800" />
                    
                    {/* Screen with glow */}
                    <div className="relative aspect-[9/19.5] rounded-[2rem] overflow-hidden bg-bg-tertiary shadow-inner">
                      {/* Glow effect behind screen */}
                      <div className="absolute -inset-6 bg-gradient-to-b from-accent-primary/40 via-accent-secondary/40 to-accent-primary/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Screenshot */}
                      <div className="relative w-full h-full">
                        <Image
                          src={mobile}
                          alt={`${projectName} - ${t.mobile}`}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 100vw, 400px"
                          quality={90}
                        />
                      </div>

                      {/* Screen glare overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Home indicator (modern iOS style) */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                  </div>

                  {/* Volume buttons */}
                  <div className="absolute left-0 top-24 w-1 h-12 bg-gray-700 rounded-l-lg -translate-x-3" />
                  <div className="absolute left-0 top-40 w-1 h-8 bg-gray-700 rounded-l-lg -translate-x-3" />
                  
                  {/* Power button */}
                  <div className="absolute right-0 top-32 w-1 h-12 bg-gray-700 rounded-r-lg translate-x-3" />

                  {/* Shadow beneath phone */}
                  <div className="absolute -bottom-8 inset-x-0 h-8 bg-gradient-to-b from-black/30 to-transparent blur-2xl" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-accent-secondary to-accent-primary text-snow px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                  📱 Mobile-First
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Bottom decorative gradient */}
        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
      </div>
    </section>
  )
}
