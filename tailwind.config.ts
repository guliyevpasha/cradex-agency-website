/**
 * Cradex design tokens.
 * Colours are CSS variables (see app/globals.css) so every utility follows
 * the light/dark theme without dark: variants on each element.
 * @author Paşa Quliyev — Cradex Agency
 */
import type { Config } from 'tailwindcss'

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: v('bg-primary'),
          secondary: v('bg-secondary'),
          tertiary: v('bg-tertiary'),
        },
        accent: {
          primary: v('accent-primary'),
          secondary: v('accent-secondary'),
          ink: v('accent-ink'),
        },
        text: {
          primary: v('text-primary'),
          secondary: v('text-secondary'),
          muted: v('text-muted'),
        },
        line: v('line'),
        // `white` follows the theme: white on dark, ink on light. Older
        // components use white/10 borders and text-white headings; this keeps
        // them readable in both themes. Use `snow` for a white that never flips.
        white: v('contrast'),
        snow: '#FFFFFF',
        ink: '#0B0D10',
        brand: '#24A0FF',
        // Filled buttons: white text on this blue passes WCAG AA (4.8:1).
        'brand-strong': '#0A74CC',
      },
      fontFamily: {
        display: ['var(--font-onest)', 'system-ui', 'sans-serif'],
        body: ['var(--font-onest)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.045em' }],
        'display-lg': ['clamp(2rem, 4.4vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgb(11 13 16 / 0.05), 0 18px 40px -22px rgb(11 13 16 / 0.35)',
        float: '0 2px 4px rgb(11 13 16 / 0.06), 0 30px 60px -28px rgb(11 13 16 / 0.45)',
        brand: '0 12px 28px -12px rgb(36 160 255 / 0.9)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
        marquee: { to: { transform: 'translate3d(-50%,0,0)' } },
        'marquee-y': { to: { transform: 'translate3d(0,-50%,0)' } },
        pulse2: { '50%': { opacity: '0.35' } },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-y': 'marquee-y 40s linear infinite',
        pulse2: 'pulse2 1.2s ease-in-out infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
