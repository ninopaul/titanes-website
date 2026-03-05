'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { SERVICES } from '@/lib/constants'

// 3D Tilt Card
function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -15, y: x * 15 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group h-full"
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow border */}
        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br from-[#D4A853]/0 via-[#D4A853]/0 to-[#D4A853]/0 transition-all duration-500 ${
          isHovered ? 'from-[#D4A853]/30 via-[#D4A853]/10 to-transparent' : ''
        }`} />

        {/* Card body */}
        <div className="relative h-full bg-[#141416] border border-white/5 rounded-2xl p-6 overflow-hidden transition-colors duration-500 hover:border-[#D4A853]/20">
          {/* Background glow on hover */}
          <div className={`absolute top-0 right-0 w-40 h-40 bg-[#D4A853]/5 rounded-full blur-3xl transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Icon */}
          <div className="relative mb-4">
            <span className="text-3xl">{service.icon}</span>
          </div>

          {/* Title */}
          <h3
            className="text-[#FAFAFA] font-bold text-lg mb-2 group-hover:text-[#D4A853] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-[#8A8A8A] text-sm leading-relaxed mb-4">
            {service.shortDesc}
          </p>

          {/* Materials tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {service.materials.slice(0, 3).map((mat) => (
              <span
                key={mat}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/5 text-[#8A8A8A] border border-white/5"
              >
                {mat}
              </span>
            ))}
            {service.materials.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#D4A853]/10 text-[#D4A853] border border-[#D4A853]/20">
                +{service.materials.length - 3}
              </span>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-[#D4A853]/10">
            <svg className="w-4 h-4 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="servicios" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0B]" />

      {/* Side decoration */}
      <div className="absolute left-0 top-1/4 w-px h-64 bg-gradient-to-b from-transparent via-[#D4A853]/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
              Nuestros Servicios
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
            12 Servicios,{' '}
            <span className="text-gradient-gold">Un Solo Lugar</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[#8A8A8A] text-lg max-w-2xl mx-auto"
          >
            Todo lo que necesitas para hacer realidad tu proyecto gráfico, bajo un mismo techo.
          </motion.p>
        </div>

        {/* Services Grid — 4 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
