'use client'

/**
 * The graphic that fills the right half of the hero.
 *
 * Built around the Cradex mark rather than a generic 3D object: the logo file
 * is a solid silhouette, so it is used as a CSS mask and filled with the brand
 * gradient. That keeps the shape exact without shipping a recoloured copy.
 *
 * Pure SVG and CSS — no canvas, no 3D library, nothing to load. Everything
 * animated here is transform or opacity, so it stays on the compositor.
 */
const CHIPS = [
  { label: 'SEO', className: 'top-[6%] left-[2%]', delay: '0s' },
  { label: 'SMM', className: 'top-[34%] right-[-4%]', delay: '1.2s' },
  { label: 'WEB · DEV', className: 'bottom-[12%] left-[-2%]', delay: '2.4s' },
]

export function HeroVisual() {
  return (
    <div
      className="relative w-[min(30vw,420px)] aspect-square shrink-0"
      aria-hidden="true"
    >
      {/* Ambient glow behind everything */}
      <div
        className="absolute inset-[-18%] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(108,99,255,0.30) 0%, rgba(0,212,255,0.14) 42%, transparent 70%)',
        }}
      />

      {/* Orbit rings. Two tilted ellipses turning at different rates, which
          reads as depth without any actual 3D. */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="hv-ring-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hv-ring-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#6C63FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="origin-center animate-orbit-slow motion-reduce:animate-none">
          <ellipse
            cx="200"
            cy="200"
            rx="188"
            ry="188"
            fill="none"
            stroke="url(#hv-ring-a)"
            strokeWidth="1.25"
          />
          {/* A node riding the ring — the only fast-moving thing in the frame,
              and small enough not to pull the eye off the headline. */}
          <circle cx="388" cy="200" r="4" fill="#00D4FF" />
        </g>

        <g className="origin-center animate-orbit-reverse motion-reduce:animate-none">
          <ellipse
            cx="200"
            cy="200"
            rx="188"
            ry="118"
            fill="none"
            stroke="url(#hv-ring-b)"
            strokeWidth="1.25"
            transform="rotate(-18 200 200)"
          />
          <circle cx="14" cy="235" r="3" fill="#6C63FF" />
        </g>

        <ellipse
          cx="200"
          cy="200"
          rx="140"
          ry="140"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      </svg>

      {/* Core: a glass disc carrying the brand mark */}
      <div className="absolute inset-[26%] rounded-full flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border border-white/10"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.10) 0%, rgba(108,99,255,0.16) 45%, rgba(10,10,15,0.86) 100%)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow:
              '0 0 60px rgba(108,99,255,0.28), inset 0 0 40px rgba(0,212,255,0.10)',
          }}
        />
        {/* The logo file is a black silhouette, so it masks a gradient instead
            of being drawn directly. */}
        <div
          className="relative w-[58%] h-[58%] animate-float motion-reduce:animate-none"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #B9B4FF 45%, #00D4FF 100%)',
            maskImage: 'url(/logos/cradex.svg)',
            WebkitMaskImage: 'url(/logos/cradex.svg)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      </div>

      {/* Floating service chips, styled after the badges already used in the
          hero so the piece belongs to the page rather than sitting on top of it. */}
      {CHIPS.map((chip) => (
        <div
          key={chip.label}
          className={`absolute ${chip.className} animate-float motion-reduce:animate-none`}
          style={{ animationDelay: chip.delay }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-secondary/80 border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
            <span className="text-[11px] font-semibold tracking-[0.14em] text-text-secondary">
              {chip.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
