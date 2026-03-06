'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

// ═══ Floating SVG geometric shapes ═══
function FloatingShapes() {
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* Large rotating hexagon - top right */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.06]"
        viewBox="0 0 200 200"
      >
        <polygon points="100,10 178,50 178,150 100,190 22,150 22,50" fill="none" stroke="#D4A853" strokeWidth="0.5" />
        <polygon points="100,30 160,60 160,140 100,170 40,140 40,60" fill="none" stroke="#D4A853" strokeWidth="0.3" />
      </motion.svg>

      {/* Diamond cluster - left */}
      <motion.svg
        animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-10 w-[200px] h-[200px] opacity-[0.08]"
        viewBox="0 0 100 100"
      >
        <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" fill="none" stroke="#D4A853" strokeWidth="0.8" />
        <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" fill="none" stroke="#D4A853" strokeWidth="0.4" />
      </motion.svg>

      {/* Cross shape - bottom left */}
      <motion.svg
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/4 left-1/4 w-[60px] h-[60px] opacity-[0.1]"
        viewBox="0 0 40 40"
      >
        <path d="M15,0 L25,0 L25,15 L40,15 L40,25 L25,25 L25,40 L15,40 L15,25 L0,25 L0,15 L15,15 Z" fill="none" stroke="#D4A853" strokeWidth="0.5" />
      </motion.svg>

      {/* Circle with orbit - right center */}
      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/3 right-[15%] w-[150px] h-[150px] opacity-[0.07]"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="#D4A853" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#D4A853" strokeWidth="0.3" strokeDasharray="4 4" />
        <circle cx="50" cy="10" r="3" fill="#D4A853" opacity="0.4" />
      </motion.svg>

      {/* Triangle - bottom right */}
      <motion.svg
        animate={{ y: [10, -15, 10], x: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-[10%] w-[80px] h-[80px] opacity-[0.08]"
        viewBox="0 0 60 60"
      >
        <polygon points="30,5 55,52 5,52" fill="none" stroke="#D4A853" strokeWidth="0.6" />
      </motion.svg>

      {/* Pulsing dots */}
      {[
        { top: '20%', left: '15%', delay: 0, size: 4 },
        { top: '60%', left: '80%', delay: 1, size: 3 },
        { top: '75%', left: '25%', delay: 2, size: 5 },
        { top: '35%', left: '60%', delay: 0.5, size: 3 },
        { top: '50%', left: '40%', delay: 1.5, size: 4 },
        { top: '15%', left: '70%', delay: 2.5, size: 3 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
          className="absolute rounded-full bg-[#D4A853]"
          style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
        />
      ))}
    </div>
  )
}

// ═══ Gradient Mesh Blobs ═══
function GradientBlobs() {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, rgba(212,168,83,0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[10%] -left-[15%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232,87,42,0.06) 0%, rgba(232,87,42,0.02) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        animate={{ opacity: [0.03, 0.08, 0.03], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  )
}

// ═══ Scan line effect ═══
function ScanLine() {
  return (
    <motion.div
      animate={{ top: ['-10%', '110%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      className="absolute left-0 right-0 h-px z-[8] pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.15) 20%, rgba(212,168,83,0.3) 50%, rgba(212,168,83,0.15) 80%, transparent 100%)',
        boxShadow: '0 0 20px rgba(212,168,83,0.1), 0 0 60px rgba(212,168,83,0.05)',
      }}
    />
  )
}

// ═══ Letter-by-letter dramatic title ═══
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <div className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]">
          {word.split('').map((letter, li) => (
            <motion.span
              key={`${wi}-${li}`}
              initial={{ opacity: 0, y: 80, rotateX: -90, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.7,
                delay: (wi * word.length + li) * 0.035 + 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
              style={{ transformOrigin: 'bottom center' }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.9])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, -100])
  const contentScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.95])

  return (
    <section id="hero" ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Layer 1: Gradient blobs */}
      <GradientBlobs />
      {/* Layer 2: Grid */}
      <div className="absolute inset-0 z-[3] grid-bg" />
      {/* Layer 3: Floating SVGs */}
      <FloatingShapes />
      {/* Layer 4: Scan line */}
      <ScanLine />
      {/* Layer 5: Overlay */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-[#0A0A0B] z-[9]" />

      {/* Decorative corners */}
      <div className="absolute top-24 left-8 z-[15]">
        <motion.div initial={{ width: 0 }} animate={{ width: 40 }} transition={{ duration: 1.2, delay: 0.5 }} className="h-px bg-[#D4A853]/40" />
        <motion.div initial={{ height: 0 }} animate={{ height: 40 }} transition={{ duration: 1.2, delay: 0.7 }} className="w-px bg-[#D4A853]/40" />
      </div>
      <div className="absolute top-24 right-8 z-[15]">
        <motion.div initial={{ width: 0 }} animate={{ width: 40 }} transition={{ duration: 1.2, delay: 0.5 }} className="h-px bg-[#D4A853]/40 ml-auto" />
        <motion.div initial={{ height: 0 }} animate={{ height: 40 }} transition={{ duration: 1.2, delay: 0.7 }} className="w-px bg-[#D4A853]/40 ml-auto" />
      </div>

      {/* Side labels */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-[15] hidden xl:flex flex-col items-center gap-4"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4A853]/30 to-transparent" />
        <span className="text-[#D4A853]/40 text-[9px] tracking-[0.3em] uppercase font-mono [writing-mode:vertical-lr]">Est. 2010</span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4A853]/30 to-transparent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-[15] hidden xl:flex flex-col items-center gap-4"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4A853]/30 to-transparent" />
        <span className="text-[#D4A853]/40 text-[9px] tracking-[0.3em] uppercase font-mono [writing-mode:vertical-lr]">Valencia, VE</span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4A853]/30 to-transparent" />
      </motion.div>

      {/* ═══ MAIN CONTENT ═══ */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        className="relative z-[20] h-full flex flex-col items-center justify-center text-center px-6"
      >
        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#D4A853]" />
          <span className="text-[#D4A853] text-[11px] font-semibold tracking-[0.35em] uppercase font-mono px-4 py-1.5 border border-[#D4A853]/20 rounded-full bg-[#D4A853]/5">
            Producción Gráfica Profesional
          </span>
          <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#D4A853]" />
        </motion.div>

        {/* Title */}
        <AnimatedTitle
          text={COMPANY.tagline}
          className="text-[clamp(2.5rem,8vw,9rem)] font-black tracking-tighter leading-[0.85]"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-8 text-[#8A8A8A] text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          12 servicios especializados. 22+ máquinas industriales.
          <br className="hidden sm:block" />
          <span className="text-[#FAFAFA]/80">Un solo lugar para hacer realidad tu proyecto.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <a href="#contacto" className="group relative px-8 py-4 bg-[#D4A853] text-[#0A0A0B] font-bold text-lg rounded-full pulse-glow hover:bg-[#E8C776] transition-all duration-300 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              Cotiza tu Proyecto
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
          <a href="#servicios" className="group px-8 py-4 border border-white/10 text-[#FAFAFA] font-medium rounded-full hover:border-[#D4A853]/40 hover:bg-[#D4A853]/5 transition-all duration-300">
            <span className="flex items-center gap-2">
              Explorar Servicios
              <svg className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[20] flex flex-col items-center gap-2"
      >
        <span className="text-[#8A8A8A]/60 text-[9px] tracking-[0.3em] uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center pt-1.5"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], height: [4, 8, 4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-0.5 bg-[#D4A853] rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0B] to-transparent z-[20] pointer-events-none" />
    </section>
  )
}
