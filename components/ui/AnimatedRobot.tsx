'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface FloatingStatProps {
  value: string
  label: string
  delay: number
  position: { x: number; y: number }
}

function FloatingStat({ value, label, delay, position }: FloatingStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        y: [20, -60, -80, -100],
        scale: [0.8, 1, 1, 0.9]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeOut"
      }}
      className="absolute pointer-events-none"
      style={{ left: position.x, top: position.y }}
    >
      <div className="bg-bg-secondary/90 backdrop-blur-sm border border-accent-primary/30 rounded-lg px-3 py-2 shadow-lg">
        <div className="text-accent-primary font-bold text-sm">{value}</div>
        <div className="text-text-muted text-xs">{label}</div>
      </div>
    </motion.div>
  )
}

// Modern 3D Robot Component - CleanBot Style
function ModernRobot({ isHandOpen }: { isHandOpen: boolean }) {
  return (
    <motion.div
      className="relative w-64 h-80"
      animate={{ y: [-3, 3, -3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Robot Container */}
      <div className="relative w-full h-full">
        
        {/* Head - Large rounded screen */}
        <motion.div
          className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-24 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 2px 8px rgba(255,255,255,0.8)'
          }}
          animate={{ rotateY: [-1, 1, -1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Screen Face */}
          <div
            className="absolute top-2 left-2 right-2 bottom-2 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, #1a2332 0%, #0f1419 100%)',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)'
            }}
          >
            {/* Eyes */}
            <motion.div
              className="absolute top-4 left-6 w-4 h-4 rounded-full"
              style={{
                background: 'radial-gradient(circle, #00d4ff 0%, #0099cc 100%)',
                boxShadow: '0 0 16px #00d4ff'
              }}
              animate={{ 
                opacity: [1, 0.3, 1],
                scale: [1, 0.9, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-4 right-6 w-4 h-4 rounded-full"
              style={{
                background: 'radial-gradient(circle, #00d4ff 0%, #0099cc 100%)',
                boxShadow: '0 0 16px #00d4ff'
              }}
              animate={{ 
                opacity: [1, 0.3, 1],
                scale: [1, 0.9, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
            />
            
            {/* Smile */}
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 rounded-full"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, #00d4ff 50%, #00d4ff 100%)',
                clipPath: 'ellipse(50% 100% at 50% 0%)'
              }}
              animate={{ 
                opacity: [0.8, 1, 0.8],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          {/* Head antenna/sensor */}
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full"
            style={{
              background: 'linear-gradient(145deg, #f8f9fa 0%, #dee2e6 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </motion.div>

        {/* Neck */}
        <div
          className="absolute top-32 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded-lg"
          style={{
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />

        {/* Main Body - Rounded white/light gray */}
        <motion.div
          className="absolute top-40 left-1/2 transform -translate-x-1/2 w-40 h-32 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.2), inset 0 4px 12px rgba(255,255,255,0.8)'
          }}
        >
          {/* Chest Panel Lines */}
          <div
            className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #adb5bd 50%, transparent 100%)'
            }}
          />
          <div
            className="absolute top-12 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #adb5bd 50%, transparent 100%)'
            }}
          />
          
          {/* Status Light */}
          <motion.div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, #00d4ff 0%, #0099cc 100%)',
              boxShadow: '0 0 12px #00d4ff'
            }}
            animate={{ 
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Left Arm */}
        <motion.div
          className="absolute top-48 left-2 w-8 h-20 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
          }}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Left Hand */}
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full"
            style={{
              background: 'linear-gradient(145deg, #f8f9fa 0%, #dee2e6 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          />
        </motion.div>

        {/* Right Arm */}
        <motion.div
          className="absolute top-48 right-2 w-8 h-20 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
          }}
          animate={isHandOpen ? { rotate: [-15, 15, -15] } : { rotate: [8, -8, 8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Right Hand with Light Effect */}
          <motion.div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full"
            style={{
              background: 'linear-gradient(145deg, #f8f9fa 0%, #dee2e6 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            animate={isHandOpen ? {
              boxShadow: [
                '0 4px 12px rgba(0,0,0,0.2)',
                '0 0 30px #00d4ff, 0 0 60px #00d4ff',
                '0 4px 12px rgba(0,0,0,0.2)'
              ]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Light Emission */}
            <AnimatePresence>
              {isHandOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-4 -left-4 w-18 h-18 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,212,255,0.2) 50%, transparent 70%)',
                    filter: 'blur(8px)'
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Base/Lower Body - Rounded bottom */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-36 h-24 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2), inset 0 2px 8px rgba(255,255,255,0.8)'
          }}
        />

        {/* Base Glow Effect */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-6 rounded-full opacity-60"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,212,255,0.3) 0%, transparent 70%)',
            filter: 'blur(12px)'
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}

export function AnimatedRobot() {
  const [isHandOpen, setIsHandOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const handTimer = setTimeout(() => {
      setIsHandOpen(true)
      setShowStats(true)
    }, 2000)

    const cycleTimer = setInterval(() => {
      setIsHandOpen(false)
      setShowStats(false)
      setTimeout(() => {
        setIsHandOpen(true)
        setShowStats(true)
      }, 1000)
    }, 8000)

    return () => {
      clearTimeout(handTimer)
      clearInterval(cycleTimer)
    }
  }, [prefersReduced])

  if (prefersReduced) {
    return (
      <div className="w-80 h-80 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary opacity-20" />
      </div>
    )
  }

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Floating Statistics */}
      <AnimatePresence>
        {showStats && (
          <>
            <FloatingStat
              value="+150%"
              label="ROI Artımı"
              delay={0}
              position={{ x: 20, y: 60 }}
            />
            <FloatingStat
              value="24/7"
              label="Dəstək"
              delay={0.5}
              position={{ x: 280, y: 100 }}
            />
            <FloatingStat
              value="500+"
              label="Layihə"
              delay={1}
              position={{ x: 50, y: 200 }}
            />
            <FloatingStat
              value="98%"
              label="Məmnunluq"
              delay={1.5}
              position={{ x: 250, y: 240 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Modern 3D Robot */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <ModernRobot isHandOpen={isHandOpen} />
      </motion.div>
    </div>
  )
}