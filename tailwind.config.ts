import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0F',
          secondary: '#111118',
          tertiary: '#1A1A24',
        },
        accent: {
          primary: '#6C63FF',
          secondary: '#00D4FF',
        },
        text: {
          primary: '#F0F0FF',
          secondary: '#A0A0B8',
          muted: '#606078',
        },
      },
      fontFamily: {
        display: ['Clash Display', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.05' }],
        'display-lg': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        // Hero orbit rings. Deliberately slow: at these speeds the movement
        // reads as drift rather than spin, and nothing competes with the copy.
        'orbit-slow': 'spin 42s linear infinite',
        'orbit-reverse': 'spin 64s linear infinite reverse',
        // The discipline pills and their counter-rotation MUST share a
        // duration — that is what keeps the labels upright while the ring turns.
        'orbit': 'spin 54s linear infinite',
        'orbit-counter': 'spin 54s linear infinite reverse',
        'ring-slow': 'spin 120s linear infinite',
        'sweep': 'spin 16s linear infinite',
        'aurora': 'aurora 22s ease-in-out infinite',
        'aurora-slow': 'aurora 30s ease-in-out infinite reverse',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Slow, low-amplitude drift for the hero's background light. Kept to
        // translate/scale so it never triggers layout or paint.
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(4%,-3%,0) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%,4%,0) scale(0.96)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(108,99,255,0.3)' },
          to: { boxShadow: '0 0 30px rgba(108,99,255,0.6)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
