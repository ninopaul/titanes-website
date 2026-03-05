'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

// Gold particles canvas
function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; life: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create initial particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.5 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random() * 200,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.y += p.speedY
        p.x += p.speedX
        p.life += 1

        // Fade based on life cycle
        const fadeFactor = Math.sin((p.life / 200) * Math.PI)
        const currentOpacity = p.opacity * fadeFactor

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 168, 83, ${currentOpacity})`
        ctx.fill()

        // Add glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 168, 83, ${currentOpacity * 0.15})`
        ctx.fill()

        // Reset particle if off screen or life ended
        if (p.y < -10 || p.life > 400) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            size: Math.random() * 2 + 0.5,
            speedY: -(Math.random() * 0.5 + 0.1),
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.1,
            life: 0,
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  )
}

// Animated letter-by-letter text
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')

  return (
    <div className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.3em]">
          {word.split('').map((letter, li) => (
            <motion.span
              key={`${wi}-${li}`}
              initial={{ opacity: 0, y: 60, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: (wi * word.length + li) * 0.04 + 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="inline-block"
              style={{ transformOrigin: 'bottom' }}
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

  const videoY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 0.85])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Video Background with parallax */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 -top-20"
      >
        {/* Placeholder gradient until video is added */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0B] via-[#141416] to-[#0A0A0B]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-bg" />
        {/* Diagonal lines */}
        <div className="absolute inset-0 diagonal-lines" />
      </motion.div>

      {/* Dark overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-[#0A0A0B] z-[1]"
      />

      {/* Gold particles */}
      <GoldParticles />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-[#D4A853]/30 to-transparent z-10" />
      <div className="absolute top-1/3 right-8 w-px h-48 bg-gradient-to-b from-transparent via-[#D4A853]/20 to-transparent z-10" />

      {/* Corner decorations */}
      <div className="absolute top-24 left-8 z-10">
        <div className="w-12 h-px bg-[#D4A853]/30" />
        <div className="w-px h-12 bg-[#D4A853]/30" />
      </div>
      <div className="absolute top-24 right-8 z-10">
        <div className="w-12 h-px bg-[#D4A853]/30 ml-auto" />
        <div className="w-px h-12 bg-[#D4A853]/30 ml-auto" />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
      >
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-8 h-px bg-[#D4A853]" />
          <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
            Producción Gráfica Industrial
          </span>
          <span className="w-8 h-px bg-[#D4A853]" />
        </motion.div>

        {/* Main Title */}
        <AnimatedTitle
          text={COMPANY.tagline}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9]"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-8 text-[#8A8A8A] text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          {COMPANY.description}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#contacto"
            className="group relative px-8 py-4 bg-[#D4A853] text-[#0A0A0B] font-bold text-lg rounded-full pulse-glow hover:bg-[#E8C776] transition-colors duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Cotiza tu Proyecto
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
          <a
            href="#servicios"
            className="px-8 py-4 border border-white/10 text-[#FAFAFA] font-medium rounded-full hover:border-[#D4A853]/40 hover:bg-white/5 transition-all duration-300"
          >
            Explorar Servicios
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[#8A8A8A] text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-[#D4A853] rounded-full" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0B] to-transparent z-20 pointer-events-none" />
    </section>
  )
}
