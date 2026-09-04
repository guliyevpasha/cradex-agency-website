'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { VideoEditingCalculator } from './VideoEditingCalculator'
import { VideoShootingCalculator } from './VideoShootingCalculator'
import { SocialMediaDesignCalculator } from './SocialMediaDesignCalculator'
import DigitalAdsCalculator from './DigitalAdsCalculator'
import WebsiteCalculator from './WebsiteCalculator'
import MobileAppCalculator from './MobileAppCalculator'
import { Globe, Smartphone, Megaphone, Scissors, Clapperboard, Palette, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type ServiceTab = 'video-editing' | 'video-shooting' | 'social-media-design' | 'digital-ads' | 'website' | 'mobile-app'

export function AdvancedCalculator() {
  const t = useTranslations('calculator')
  const [activeTab, setActiveTab] = useState<ServiceTab>('website')

  const TABS: { id: ServiceTab; labelKey: string; Icon: LucideIcon }[] = [
    { id: 'website', labelKey: 'website', Icon: Globe },
    { id: 'mobile-app', labelKey: 'mobileApp', Icon: Smartphone },
    { id: 'digital-ads', labelKey: 'digitalAds', Icon: Megaphone },
    { id: 'video-editing', labelKey: 'videoEditing', Icon: Scissors },
    { id: 'video-shooting', labelKey: 'videoShooting', Icon: Clapperboard },
    { id: 'social-media-design', labelKey: 'socialMediaDesign', Icon: Palette },
  ]

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-2xl bg-bg-secondary/60 border border-white/10 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-accent-primary text-white shadow-[0_0_16px_rgba(108,99,255,0.4)]'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <tab.Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="whitespace-nowrap">{t(`tabs.${tab.labelKey}`)}</span>
          </button>
        ))}
      </div>

      {/* Calculator content */}
      {activeTab === 'website' && <WebsiteCalculator />}
      {activeTab === 'mobile-app' && <MobileAppCalculator />}
      {activeTab === 'digital-ads' && <DigitalAdsCalculator />}
      {activeTab === 'video-editing' && <VideoEditingCalculator />}
      {activeTab === 'video-shooting' && <VideoShootingCalculator />}
      {activeTab === 'social-media-design' && <SocialMediaDesignCalculator />}
    </div>
  )
}
