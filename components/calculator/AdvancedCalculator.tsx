'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { VideoEditingCalculator } from './VideoEditingCalculator'
import { VideoShootingCalculator } from './VideoShootingCalculator'
import { SocialMediaDesignCalculator } from './SocialMediaDesignCalculator'
import { cn } from '@/lib/utils/cn'

type ServiceTab = 'video-editing' | 'video-shooting' | 'social-media-design'

export function AdvancedCalculator() {
  const t = useTranslations('calculator')
  const [activeTab, setActiveTab] = useState<ServiceTab>('video-editing')

  const TABS: { id: ServiceTab; labelKey: string; icon: string }[] = [
    { id: 'video-editing', labelKey: 'videoEditing', icon: '✂️' },
    { id: 'video-shooting', labelKey: 'videoShooting', icon: '🎬' },
    { id: 'social-media-design', labelKey: 'socialMediaDesign', icon: '🎨' },
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
            <span>{tab.icon}</span>
            <span className="whitespace-nowrap">{t(`tabs.${tab.labelKey}`)}</span>
          </button>
        ))}
      </div>

      {/* Calculator content */}
      {activeTab === 'video-editing' && <VideoEditingCalculator />}
      {activeTab === 'video-shooting' && <VideoShootingCalculator />}
      {activeTab === 'social-media-design' && <SocialMediaDesignCalculator />}
    </div>
  )
}
