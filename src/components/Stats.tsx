'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { STATS } from '@/lib/constants'

// Animated counter
function Counter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easedProgress * value))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-[#141416]/90" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Animated gradient streaks */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        className="absolute top-1/2 left-0 w-1/3 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)',
        }}
      />
      <motion.div
        animate={{ x: ['200%', '-100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
        className="absolute top-1/3 left-0 w-1/4 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)',
        }}
      />

      {/* Floating hexagons in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.svg
          animate={{ rotate: -360, y: [-10, 10, -10] }}
          transition={{ rotate: { duration: 60, repeat: Infinity, ease: 'linear' }, y: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute -left-10 top-1/4 w-[120px] h-[120px] opacity-[0.04]"
          viewBox="0 0 100 100"
        >
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#D4A853" strokeWidth="0.5" />
        </motion.svg>
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-16 bottom-1/4 w-[160px] h-[160px] opacity-[0.03]"
          viewBox="0 0 100 100"
        >
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#D4A853" strokeWidth="0.4" />
          <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" fill="none" stroke="#D4A853" strokeWidth="0.3" />
        </motion.svg>
      </div>

      {/* Gold line at top */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center relative"
            >
              {/* Vertical divider between items */}
              {i > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              )}

              {/* Subtle glow behind number */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#D4A853]/3 rounded-full blur-3xl" />

              <div
                className="relative text-5xl md:text-6xl lg:text-7xl font-black text-gradient-gold mb-2"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[#8A8A8A] text-sm uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gold line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
