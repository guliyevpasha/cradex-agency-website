'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Star, CheckCircle } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'


// ─── Canvas particle animation ────────────────────────────────────────────────
function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    // Resize handler
    function resize() {
      if (!canvas) return
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Nodes (connection points) ──
    const NODE_COUNT = 60
    interface Node { x: number; y: number; vx: number; vy: number }
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    // ── Droplets (flowing along edges) ──
    interface Droplet {
      fromIdx: number
      toIdx: number
      t: number       // 0→1 progress along edge
      speed: number
      alpha: number
    }
    const droplets: Droplet[] = []

    function spawnDroplet() {
      const fromIdx = Math.floor(Math.random() * NODE_COUNT)
      const toIdx = Math.floor(Math.random() * NODE_COUNT)
      if (fromIdx === toIdx) return
      const dx = nodes[toIdx].x - nodes[fromIdx].x
      const dy = nodes[toIdx].y - nodes[fromIdx].y
      if (Math.sqrt(dx * dx + dy * dy) > 220) return
      droplets.push({ fromIdx, toIdx, t: 0, speed: 0.004 + Math.random() * 0.006, alpha: 0.8 })
    }

    let frame = 0

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, W, H)

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }

      // Draw edges
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 180) continue
          const alpha = (1 - dist / 180) * 0.18
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.strokeStyle = `rgba(108,99,255,${alpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(108,99,255,0.35)'
        ctx.fill()
      }

      // Spawn droplets periodically
      if (frame % 8 === 0) spawnDroplet()
      frame++

      // Move & draw droplets
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i]
        d.t += d.speed
        if (d.t >= 1) { droplets.splice(i, 1); continue }

        const from = nodes[d.fromIdx]
        const to = nodes[d.toIdx]
        const dx = to.x - from.x
        const dy = to.y - from.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 220) { droplets.splice(i, 1); continue }

        const x = from.x + dx * d.t
        const y = from.y + dy * d.t

        // Glow droplet
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 5)
        grad.addColorStop(0, `rgba(0,212,255,${d.alpha})`)
        grad.addColorStop(0.4, `rgba(108,99,255,${d.alpha * 0.6})`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Tail
        const tailX = from.x + dx * Math.max(0, d.t - 0.08)
        const tailY = from.y + dy * Math.max(0, d.t - 0.08)
        const tailGrad = ctx.createLinearGradient(tailX, tailY, x, y)
        tailGrad.addColorStop(0, 'rgba(0,212,255,0)')
        tailGrad.addColorStop(1, `rgba(0,212,255,${d.alpha * 0.5})`)
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = tailGrad
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const t = useTranslations('home.hero')
  const prefersReduced = useReducedMotion()

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t('whatsappText'))}`

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10 bg-bg-primary">
        {/* Base gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#07071a] via-[#0a0a1f] to-[#050510]" />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 70% 90% at 80% 50%,
            rgba(0,212,255,0.12) 0%, rgba(108,99,255,0.10) 45%, transparent 70%)`,
        }} />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 40% 50% at 95% 85%,
            rgba(108,99,255,0.12) 0%, transparent 60%)`,
        }} />

        {/* Canvas animation */}
        {!prefersReduced && <TechBackground />}
      </div>

      {/* ── Content ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            variants={prefersReduced ? undefined : staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl"
          >
            {/* Trust badges */}
            <motion.div
              variants={prefersReduced ? undefined : fadeInUp}
              className="flex flex-wrap items-center gap-2 mb-5"
            >
              {/* Google rating */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary/80 border border-white/10 backdrop-blur-sm">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-blue-600">G</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-white text-xs font-bold leading-none">5.0</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={9} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-muted text-[9px] uppercase tracking-wider leading-none">
                    {t('googleReviews')}
                  </p>
                </div>
              </div>

              {/* Verified partner */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary/80 border border-white/10 backdrop-blur-sm">
                <CheckCircle size={14} className="text-accent-secondary shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-white text-xs font-bold leading-none">{t('verifiedPartner')}</p>
                  <p className="text-text-muted text-[9px] uppercase tracking-wider leading-none mt-0.5">
                    {t('googleVerified')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={prefersReduced ? undefined : fadeInUp}
              className="font-display font-bold text-text-primary leading-[1.1] mb-3
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {t('title')}
            </motion.h1>

            {/* Subtitle — rəqəmsal marketinq CTA */}
            <motion.p
              variants={prefersReduced ? undefined : fadeInUp}
              className="text-text-secondary leading-relaxed mb-8 italic
                text-base sm:text-lg md:text-xl"
            >
              {t('subtitleAccent')}
            </motion.p>

            {/* CTA button */}
            <motion.div variants={prefersReduced ? undefined : fadeInUp}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl
                  bg-gradient-to-r from-accent-primary to-accent-secondary
                  text-white font-semibold text-sm sm:text-base
                  hover:opacity-90 transition-all duration-300
                  shadow-[0_0_24px_rgba(108,99,255,0.5)]"
              >
                {t('cta')}
                <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Empty Space */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:flex justify-center items-center"
          >
            {/* Empty space where robot was - can be used for future content */}
            <div className="w-80 h-80 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Social proof — desktop only */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-12 left-6 lg:left-12 hidden lg:block text-left max-w-xs"
        >
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            {t('socialProof')}<br />
            <span className="text-text-muted text-xs">
              {t('socialProofSub')}
            </span>
          </p>
          <div className="flex items-center justify-start">
            {['#6C63FF', '#00D4FF', '#FF6B6B', '#22C55E'].map((color, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-bg-primary flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: color, marginLeft: i > 0 ? '-8px' : '0' }}
              >
                {['E', 'L', 'R', 'N'][i]}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      {/* Bottom fade — seamless transition to StatsSection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom,
            transparent 0%,
            rgba(7,7,26,0.6) 60%,
            rgba(8,8,30,1) 100%)`,
        }}
        aria-hidden="true"
      />
    </section>
  )
}
