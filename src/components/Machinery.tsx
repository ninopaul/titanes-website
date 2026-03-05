'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MACHINES } from '@/lib/constants'

function MachineCard({ machine, index }: { machine: typeof MACHINES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-shrink-0 w-[340px] md:w-[400px] group"
    >
      <div className="relative h-full bg-[#141416] border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4A853]/20 transition-all duration-500">
        {/* Machine image placeholder */}
        <div className="relative h-52 bg-gradient-to-br from-[#1A1A1E] to-[#0A0A0B] overflow-hidden">
          <div className="absolute inset-0 grid-bg" />
          {/* Decorative machine silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              ⚙️
            </div>
          </div>
          {/* Number badge */}
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#D4A853]/10 border border-[#D4A853]/30 flex items-center justify-center">
            <span className="text-[#D4A853] text-xs font-bold font-mono">
              {(index + 1).toString().padStart(2, '0')}
            </span>
          </div>
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#141416] to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#D4A853] text-[10px] font-semibold tracking-[0.2em] uppercase font-mono">
              {machine.type}
            </span>
          </div>

          <h3
            className="text-[#FAFAFA] font-bold text-xl mb-3 group-hover:text-[#D4A853] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            {machine.name}
          </h3>

          <p className="text-[#8A8A8A] text-sm leading-relaxed mb-4">
            {machine.description}
          </p>

          {/* Specs in mono */}
          <div className="px-3 py-2 bg-[#0A0A0B] rounded-lg border border-white/5">
            <span className="text-[#D4A853] text-xs font-mono">
              {machine.spec}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Machinery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Parallax for the background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section id="maquinaria" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[#141416]" />
        <div className="absolute inset-0 diagonal-lines opacity-50" />
      </motion.div>

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
            <span className="text-gradient-gold">Industrial</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[#8A8A8A] text-lg max-w-2xl mx-auto"
          >
            8 máquinas de última generación para producción de alta calidad
          </motion.p>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-8 px-6 lg:px-8 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Left spacer for centering on desktop */}
          <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-1280px)/2)]" />

          {MACHINES.map((machine, i) => (
            <div key={machine.name} className="snap-start">
              <MachineCard machine={machine} index={i} />
            </div>
          ))}

          {/* Right spacer */}
          <div className="flex-shrink-0 w-6" />
        </div>

        {/* Scroll hint */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-2 justify-center text-[#8A8A8A]/50 text-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>Desliza para ver más</span>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
