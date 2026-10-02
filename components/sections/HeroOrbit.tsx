'use client'

import { useTranslations } from 'next-intl'
import { Search, Share2, Megaphone, Code2, Palette, BarChart3 } from 'lucide-react'

/**
 * The graphic that fills the right half of the hero.
 *
 * Replaces the earlier "brand mark inside a glass ball": a logo in a circle
 * says nothing about what the agency does, and every agency site in the
 * market has one. This one is an argument instead of an ornament — the six
 * disciplines we sell orbit a 360° core, so the picture states the positioning
 * before the copy gets a chance to.
 *
 * Performance is the whole design constraint here. Every moving part is its
 * own absolutely-positioned layer animating nothing but `transform`, marked
 * `will-change`, so each one is rasterised once and then moved by the
 * compositor. Two things are deliberately absent because they made the first
 * version stutter:
 *
 *   - `backdrop-filter` on the orbiting pills. A backdrop blur has to re-sample
 *     everything underneath the element on every frame; on six pills turning
 *     at once that is six full re-blurs per frame. They use an opaque-enough
 *     fill instead, which looks the same over this background.
 *   - rotating `<g>` groups inside one shared <svg>. Animating a group forces
 *     the whole SVG to re-rasterise each frame; separate layers do not.
 */

// Six disciplines, evenly spaced. Six rather than eight: at 60° apart the
// pills never collide at this radius, even at the smallest size the layout
// renders them at. Labels come from the message files so each market reads
// its own terminology.
const DISCIPLINES = [
  { key: 'seo', Icon: Search },
  { key: 'smm', Icon: Share2 },
  { key: 'ads', Icon: Megaphone },
  { key: 'web', Icon: Code2 },
  { key: 'brand', Icon: Palette },
  { key: 'data', Icon: BarChart3 },
] as const

const ORBIT_RADIUS = 44 // % of half-size, from the centre of the frame

// Protractor ticks: one every 5°, every third one long. Reads as a measuring
// instrument, which is the tone we want — 360° as coverage you can audit,
// not as a slogan.
const TICKS = Array.from({ length: 72 }, (_, i) => ({
  angle: i * 5,
  major: i % 3 === 0,
}))

const LAYER = { willChange: 'transform' } as const

export function HeroOrbit() {
  const t = useTranslations('home.hero')

  return (
    <div
      className="relative w-[min(34vw,460px)] aspect-square shrink-0"
      aria-hidden="true"
    >
      {/* Ambient light. Static, so the one blur here costs nothing per frame. */}
      <div
        className="absolute inset-[-22%] rounded-full blur-[80px]"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(108,99,255,0.28) 0%, rgba(0,212,255,0.12) 45%, transparent 72%)',
        }}
      />

      {/* Radar sweep — the "360°" made literal. The mask sits on the static
          parent and only the gradient inside it turns, so the mask is never
          recomputed. */}
      <div
        className="absolute inset-[8%] rounded-full overflow-hidden"
        style={{
          maskImage:
            'radial-gradient(circle, transparent 26%, #000 46%, #000 82%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle, transparent 26%, #000 46%, #000 82%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0 animate-sweep motion-reduce:animate-none"
          style={{
            ...LAYER,
            background:
              'conic-gradient(from 0deg, rgba(0,212,255,0.20) 0deg, rgba(108,99,255,0.06) 38deg, transparent 90deg, transparent 360deg)',
          }}
        />
      </div>

      {/* Degree ticks */}
      <div className="absolute inset-0 animate-ring-slow motion-reduce:animate-none" style={LAYER}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {TICKS.map(({ angle, major }) => (
            <line
              key={angle}
              x1="200"
              y1={major ? 20 : 24}
              x2="200"
              y2="30"
              stroke={major ? 'rgba(160,155,255,0.45)' : 'rgba(255,255,255,0.14)'}
              strokeWidth={major ? 1.4 : 1}
              strokeLinecap="round"
              transform={`rotate(${angle} 200 200)`}
            />
          ))}
        </svg>
      </div>

      {/* Gradient rim */}
      <div className="absolute inset-0 animate-orbit-reverse motion-reduce:animate-none" style={LAYER}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <linearGradient id="ho-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.75" />
              <stop offset="45%" stopColor="#00D4FF" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="158" fill="none" stroke="url(#ho-rim)" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Dashed inner guide */}
      <div className="absolute inset-0 animate-orbit-slow motion-reduce:animate-none" style={LAYER}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle
            cx="200"
            cy="200"
            r="82"
            fill="none"
            stroke="rgba(108,99,255,0.22)"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        </svg>
      </div>

      {/* Static hairline */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <circle cx="200" cy="200" r="118" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </svg>

      {/* Orbiting disciplines. Spokes live in this same layer as the pills so
          the two can never drift apart. The ring turns; each pill turns back at
          the same rate, which keeps its label upright. */}
      <div className="absolute inset-0 animate-orbit motion-reduce:animate-none" style={LAYER}>
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="ho-spoke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {DISCIPLINES.map((d, i) => (
            <line
              key={d.key}
              x1="200"
              y1="200"
              x2="200"
              y2="24"
              stroke="url(#ho-spoke)"
              strokeWidth="1"
              transform={`rotate(${i * 60} 200 200)`}
            />
          ))}
        </svg>

        {DISCIPLINES.map((d, i) => {
          const rad = ((i * 60 - 90) * Math.PI) / 180
          return (
            <div
              key={d.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${50 + ORBIT_RADIUS * Math.cos(rad)}%`,
                top: `${50 + ORBIT_RADIUS * Math.sin(rad)}%`,
              }}
            >
              <div
                className="animate-orbit-counter motion-reduce:animate-none"
                style={LAYER}
              >
                <div
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full
                    border border-white/10 px-2.5 py-1.5 bg-[#0E0E1A]/90
                    shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)]"
                >
                  <d.Icon size={12} className="text-accent-secondary shrink-0" strokeWidth={2.2} />
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-text-secondary leading-none">
                    {t(`disciplines.${d.key}`)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Core: the claim itself, set in type rather than a logo. */}
      <div className="absolute inset-[30%] rounded-full flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border border-white/10"
          style={{
            background:
              'radial-gradient(circle at 34% 26%, rgba(255,255,255,0.10) 0%, rgba(108,99,255,0.14) 44%, rgba(9,9,16,0.92) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 0 70px rgba(108,99,255,0.26), inset 0 0 46px rgba(0,212,255,0.09)',
          }}
        />
        <div
          className="relative flex flex-col items-center px-4 text-center animate-float motion-reduce:animate-none"
          style={LAYER}
        >
          <span
            className="font-display font-bold leading-none tracking-[-0.04em]
              text-[clamp(2.2rem,4.6vw,3.6rem)]"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #C9C4FF 48%, #00D4FF 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            360°
          </span>
          <span className="mt-2 text-[9px] font-semibold uppercase tracking-[0.22em] leading-tight bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
            {t('coreLabel')}
          </span>
        </div>
      </div>
    </div>
  )
}
