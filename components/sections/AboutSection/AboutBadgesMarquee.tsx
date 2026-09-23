'use client'

import { useTranslations } from 'next-intl'
import { Sparkles, Target, Users, Zap, TrendingUp, Award, type LucideIcon } from 'lucide-react'

const GRADIENTS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-yellow-500 to-orange-500',
]

const ICONS: LucideIcon[] = [Sparkles, Target, Users, Zap, TrendingUp, Award]

type BadgeItem = { icon: LucideIcon; text: string; gradient: string }

export function AboutBadgesMarquee() {
  const t = useTranslations('about.hero')
  const rawBadges = t.raw('badges') as { text: string }[]

  const badges: BadgeItem[] = rawBadges.map((b, i) => ({
    icon: ICONS[i % ICONS.length],
    text: b.text,
    gradient: GRADIENTS[i % GRADIENTS.length],
  }))
  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Top Row - Right to Left */}
      <div className="mb-4 overflow-hidden">
        <div 
          className="flex gap-4 animate-marquee-right"
          style={{ 
            width: 'fit-content',
            animation: 'marquee-right 25s linear infinite'
          }}
        >
          {[...badges, ...badges].map((badge, index) => (
            <BadgeCard key={`top-${index}`} badge={badge} />
          ))}
        </div>
      </div>

      {/* Bottom Row - Left to Right */}
      <div className="overflow-hidden">
        <div 
          className="flex gap-4 animate-marquee-left"
          style={{ 
            width: 'fit-content',
            animation: 'marquee-left 25s linear infinite'
          }}
        >
          {[...badges.slice().reverse(), ...badges.slice().reverse()].map((badge, index) => (
            <BadgeCard key={`bottom-${index}`} badge={badge} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-left {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee-right:hover,
        .animate-marquee-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

function BadgeCard({ badge }: { badge: BadgeItem }) {
  const Icon = badge.icon
  
  return (
    <div className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-bg-tertiary/50 border border-border/20 hover:border-accent-primary/40 backdrop-blur-sm transition-all duration-300 hover:scale-105 whitespace-nowrap">
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${badge.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`} />
      
      {/* Icon with gradient */}
      <div className={`relative p-2 rounded-lg bg-gradient-to-br ${badge.gradient} shadow-lg`}>
        <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      
      {/* Text */}
      <span className="relative text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-300">
        {badge.text}
      </span>
    </div>
  )
}
