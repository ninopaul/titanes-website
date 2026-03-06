'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MACHINES } from '@/lib/constants'

function MachineCard({ machine, index }: { machine: typeof MACHINES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.5) }}
      className="flex-shrink-0 w-[280px] md:w-[320px] group"
    >
      <div className="relative h-full bg-[#141416]/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4A853]/20 transition-all duration-500">
        {/* Machine image placeholder */}
        <div className="relative h-44 bg-gradient-to-br from-[#1A1A1E] to-[#0A0A0B] overflow-hidden">
          <div className="absolute inset-0 grid-bg" />

          {/* Animated scan line within card */}
          <motion.div
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            className="absolute left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.2) 50%, transparent 100%)',
            }}
          />

          {/* Decorative machine silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              ⚙️
            </div>
          </div>

          {/* Number badge */}
          <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#D4A853]/10 border border-[#D4A853]/30 flex items-center justify-center">
            <span className="text-[#D4A853] text-[10px] font-bold font-mono">
              {(index + 1).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Corner geometric accent */}
          <svg className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 80 80">
            <path d="M80,0 L80,30 L50,30" fill="none" stroke="#D4A853" strokeWidth="0.5" opacity="0.3" />
            <path d="M80,0 L80,15 L65,15" fill="none" stroke="#D4A853" strokeWidth="0.5" opacity="0.5" />
          </svg>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#141416] to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#D4A853] text-[9px] font-semibold tracking-[0.2em] uppercase font-mono">
              {machine.type}
            </span>
          </div>

          <h3
            className="text-[#FAFAFA] font-bold text-lg mb-2 group-hover:text-[#D4A853] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            {machine.name}
          </h3>

          <p className="text-[#8A8A8A] text-xs leading-relaxed mb-3 line-clamp-2">
            {machine.description}
          </p>

          {/* Specs in mono */}
          <div className="px-2.5 py-1.5 bg-[#0A0A0B] rounded-lg border border-white/5 group-hover:border-[#D4A853]/10 transition-colors duration-500">
            <span className="text-[#D4A853] text-[10px] font-mono leading-tight">
              {machine.spec}
            </span>
          </div>
        </div>

        {/* Bottom gold line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}

export default function Machinery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [scrollSpeed, setScrollSpeed] = useState(0)
  const animFrameRef = useRef<number>(0)

  // Parallax for the background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80])

  // ═══ Mouse-proximity auto-scroll ═══
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const containerWidth = rect.width

    // Edge zones: 15% from each edge
    const edgeZone = containerWidth * 0.15
    const maxSpeed = 8

    if (mouseX < edgeZone) {
      // Near left edge → scroll left (negative speed)
      const intensity = 1 - (mouseX / edgeZone)
      setScrollSpeed(-maxSpeed * intensity * intensity) // Quadratic easing
    } else if (mouseX > containerWidth - edgeZone) {
      // Near right edge → scroll right (positive speed)
      const intensity = 1 - ((containerWidth - mouseX) / edgeZone)
      setScrollSpeed(maxSpeed * intensity * intensity)
    } else {
      setScrollSpeed(0)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setScrollSpeed(0)
  }, [])

  // Animation loop for smooth scrolling
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let lastTime = 0

    const tick = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp
      const delta = Math.min(timestamp - lastTime, 32) // Cap delta to ~30fps minimum
      lastTime = timestamp

      if (scrollSpeed !== 0) {
        container.scrollLeft += scrollSpeed * (delta / 16)
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [scrollSpeed])

  return (
    <section id="maquinaria" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[#141416]/90" />
        <div className="absolute inset-0 diagonal-lines opacity-50" />
      </motion.div>

      {/* Floating decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blueprint-style technical drawing - left */}
        <motion.svg
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 -left-10 w-[300px] h-[300px]"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="50" fill="none" stroke="#D4A853" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#D4A853" strokeWidth="0.2" strokeDasharray="2 4" />
          <line x1="100" y1="30" x2="100" y2="170" stroke="#D4A853" strokeWidth="0.2" />
          <line x1="30" y1="100" x2="170" y2="100" stroke="#D4A853" strokeWidth="0.2" />
          <line x1="40" y1="40" x2="160" y2="160" stroke="#D4A853" strokeWidth="0.15" />
          <line x1="160" y1="40" x2="40" y2="160" stroke="#D4A853" strokeWidth="0.15" />
          {/* Tick marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180
            const x1 = 100 + 48 * Math.cos(angle)
            const y1 = 100 + 48 * Math.sin(angle)
            const x2 = 100 + 52 * Math.cos(angle)
            const y2 = 100 + 52 * Math.sin(angle)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A853" strokeWidth="0.3" />
          })}
        </motion.svg>

        {/* Rotating triangle - bottom right */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-10 -right-10 w-[200px] h-[200px] opacity-[0.04]"
          viewBox="0 0 100 100"
        >
          <polygon points="50,10 90,80 10,80" fill="none" stroke="#D4A853" strokeWidth="0.4" />
          <polygon points="50,25 75,70 25,70" fill="none" stroke="#D4A853" strokeWidth="0.3" />
        </motion.svg>

        {/* Gradient glow */}
        <motion.div
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(212,168,83,0.08) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
              Tecnología
            </span>
            <span className="w-8 h-px bg-[#D4A853]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#FAFAFA] tracking-tight"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            Maquinaria{' '}
            <span className="text-gradient-gold">de Precisión</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[#8A8A8A] text-lg max-w-2xl mx-auto"
          >
            Más de {MACHINES.length} máquinas de última generación para producción de alta calidad
          </motion.p>
        </div>

        {/* Horizontal Scroll with mouse-proximity auto-scroll */}
        <div className="relative">
          {/* Left fade edge indicator */}
          <div className="absolute left-0 top-0 bottom-8 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#141416] to-transparent" />

          {/* Right fade edge indicator */}
          <div className="absolute right-0 top-0 bottom-8 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#141416] to-transparent" />

          {/* Left arrow hint */}
          <motion.div
            animate={{
              opacity: scrollSpeed < 0 ? [0.6, 1, 0.6] : [0.15, 0.3, 0.15],
              x: scrollSpeed < 0 ? [-3, 0, -3] : [0, 0, 0],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <svg className="w-8 h-8 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.div>

          {/* Right arrow hint */}
          <motion.div
            animate={{
              opacity: scrollSpeed > 0 ? [0.6, 1, 0.6] : [0.15, 0.3, 0.15],
              x: scrollSpeed > 0 ? [3, 0, 3] : [0, 0, 0],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <svg className="w-8 h-8 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>

          <div
            ref={scrollRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex gap-4 overflow-x-auto pb-8 px-12 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'auto',
              cursor: scrollSpeed !== 0
                ? scrollSpeed < 0 ? 'w-resize' : 'e-resize'
                : 'default',
            }}
          >
            {/* Left spacer */}
            <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-1280px)/2)]" />

            {MACHINES.map((machine, i) => (
              <MachineCard key={machine.name} machine={machine} index={i} />
            ))}

            {/* Right spacer */}
            <div className="flex-shrink-0 w-12" />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-4">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 justify-center text-[#8A8A8A]/60 text-xs"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>Acerca el cursor a los bordes para explorar</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
