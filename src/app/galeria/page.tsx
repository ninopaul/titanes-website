'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'

// ═══ Gallery Categories ═══
const CATEGORIES = [
  'Todos',
  'Gran Formato',
  'Impresión UV',
  'Corte Láser',
  'Sublimación',
  'Fachadas',
  'Corpóreos',
  'Señalética',
  'Rotulado Vehicular',
  'CNC',
  'Digital',
]

// ═══ Gallery Items (muestra representativa de 200+ proyectos ejecutados) ═══
const GALLERY_ITEMS = [
  // Gran Formato (8)
  { id: 1, title: 'Valla Publicitaria 12m', category: 'Gran Formato', aspect: 'wide', color: '#1a2332' },
  { id: 2, title: 'Banner Evento Deportivo', category: 'Gran Formato', aspect: 'tall', color: '#2a1a1a' },
  { id: 3, title: 'Lona Frontlit Iluminada', category: 'Gran Formato', aspect: 'square', color: '#1a1a2a' },
  { id: 4, title: 'Microperforado Vitrina', category: 'Gran Formato', aspect: 'wide', color: '#221a2a' },
  { id: 5, title: 'Pendón Retráctil', category: 'Gran Formato', aspect: 'tall', color: '#2a221a' },
  { id: 6, title: 'Backing Corporativo', category: 'Gran Formato', aspect: 'wide', color: '#1a2a22' },
  { id: 7, title: 'Mural Decorativo 8m', category: 'Gran Formato', aspect: 'tall', color: '#222a1a' },
  { id: 8, title: 'Vinil Adhesivo Flota', category: 'Gran Formato', aspect: 'square', color: '#1a1a32' },
  // UV (6)
  { id: 9, title: 'Impresión Directa Acrílico', category: 'Impresión UV', aspect: 'square', color: '#2a2a1a' },
  { id: 10, title: 'Caja de Luz LED', category: 'Impresión UV', aspect: 'wide', color: '#1a2a2a' },
  { id: 11, title: 'Señalética Hospital', category: 'Impresión UV', aspect: 'tall', color: '#2a1a22' },
  { id: 12, title: 'Display POP Acrílico', category: 'Impresión UV', aspect: 'square', color: '#1a221a' },
  { id: 13, title: 'Panel Fotográfico PVC', category: 'Impresión UV', aspect: 'wide', color: '#221a1a' },
  { id: 14, title: 'Reloj Personalizado UV', category: 'Impresión UV', aspect: 'square', color: '#1a1a22' },
  // Láser (6)
  { id: 15, title: 'Trofeos Corporativos', category: 'Corte Láser', aspect: 'square', color: '#2a1a2a' },
  { id: 16, title: 'Grabado Placas Industriales', category: 'Corte Láser', aspect: 'wide', color: '#1a2232' },
  { id: 17, title: 'Corte Acrílico Decorativo', category: 'Corte Láser', aspect: 'tall', color: '#322a1a' },
  { id: 18, title: 'Sellos Personalizados', category: 'Corte Láser', aspect: 'square', color: '#1a322a' },
  { id: 19, title: 'Invitaciones Láser', category: 'Corte Láser', aspect: 'wide', color: '#2a1a32' },
  { id: 20, title: 'Porta Retratos MDF', category: 'Corte Láser', aspect: 'tall', color: '#321a2a' },
  // Sublimación (6)
  { id: 21, title: 'Uniforme Deportivo Completo', category: 'Sublimación', aspect: 'tall', color: '#1a2a1a' },
  { id: 22, title: 'Set Deportivo Equipo', category: 'Sublimación', aspect: 'wide', color: '#2a1a1a' },
  { id: 23, title: 'Camisetas Promocionales', category: 'Sublimación', aspect: 'square', color: '#1a1a2a' },
  { id: 24, title: 'Telas Lycra Full Print', category: 'Sublimación', aspect: 'wide', color: '#2a2a1a' },
  { id: 25, title: 'Gorras Sublimadas', category: 'Sublimación', aspect: 'square', color: '#1a2a2a' },
  { id: 26, title: 'Franelas Dry Fit', category: 'Sublimación', aspect: 'tall', color: '#2a1a2a' },
  // Fachadas (6)
  { id: 27, title: 'Fachada Centro Comercial', category: 'Fachadas', aspect: 'tall', color: '#1a2332' },
  { id: 28, title: 'Caja de Luz Doble Cara', category: 'Fachadas', aspect: 'wide', color: '#2a1a22' },
  { id: 29, title: 'Fachada Restaurante', category: 'Fachadas', aspect: 'square', color: '#221a2a' },
  { id: 30, title: 'Tótem Publicitario', category: 'Fachadas', aspect: 'tall', color: '#1a2a22' },
  { id: 31, title: 'Fachada Farmacia', category: 'Fachadas', aspect: 'wide', color: '#2a221a' },
  { id: 32, title: 'Fachada Agencia Automotriz', category: 'Fachadas', aspect: 'tall', color: '#222a1a' },
  // Corpóreos (6)
  { id: 33, title: 'Logo 3D Oficina', category: 'Corpóreos', aspect: 'square', color: '#1a1a32' },
  { id: 34, title: 'Letras MDF Iluminadas', category: 'Corpóreos', aspect: 'wide', color: '#321a1a' },
  { id: 35, title: 'Logo Acrílico LED', category: 'Corpóreos', aspect: 'tall', color: '#1a321a' },
  { id: 36, title: 'Letras PVC Espumado', category: 'Corpóreos', aspect: 'square', color: '#1a1a32' },
  { id: 37, title: 'Números Metálicos', category: 'Corpóreos', aspect: 'wide', color: '#321a2a' },
  { id: 38, title: 'Logo Acero Inoxidable', category: 'Corpóreos', aspect: 'square', color: '#2a321a' },
  // Señalética (5)
  { id: 39, title: 'Sistema Señalización Hospital', category: 'Señalética', aspect: 'wide', color: '#1a2a32' },
  { id: 40, title: 'Señalética Centro Comercial', category: 'Señalética', aspect: 'tall', color: '#322a1a' },
  { id: 41, title: 'Directorio Edificio', category: 'Señalética', aspect: 'square', color: '#1a322a' },
  { id: 42, title: 'Señales de Seguridad', category: 'Señalética', aspect: 'wide', color: '#2a1a32' },
  { id: 43, title: 'Plano Evacuación', category: 'Señalética', aspect: 'square', color: '#321a2a' },
  // Rotulado (5)
  { id: 44, title: 'Wrapping Completo Camioneta', category: 'Rotulado Vehicular', aspect: 'wide', color: '#2a2232' },
  { id: 45, title: 'Flota Delivery Rotulada', category: 'Rotulado Vehicular', aspect: 'tall', color: '#32221a' },
  { id: 46, title: 'Rotulado Lateral Autobús', category: 'Rotulado Vehicular', aspect: 'wide', color: '#1a3222' },
  { id: 47, title: 'Moto Delivery Branding', category: 'Rotulado Vehicular', aspect: 'square', color: '#22321a' },
  { id: 48, title: 'Van Corporativa Full Wrap', category: 'Rotulado Vehicular', aspect: 'wide', color: '#321a22' },
  // CNC (3)
  { id: 49, title: 'Letrero Fresado 3D', category: 'CNC', aspect: 'wide', color: '#2a1a2a' },
  { id: 50, title: 'Piezas Industriales', category: 'CNC', aspect: 'square', color: '#1a2a1a' },
  { id: 51, title: 'Exhibidor Fresado MDF', category: 'CNC', aspect: 'tall', color: '#2a2a1a' },
  // Digital (3)
  { id: 52, title: 'Catálogo Corporativo', category: 'Digital', aspect: 'tall', color: '#1a1a2a' },
  { id: 53, title: 'Tarjetas Barniz Selectivo', category: 'Digital', aspect: 'square', color: '#2a1a1a' },
  { id: 54, title: 'Folleto Tríptico Premium', category: 'Digital', aspect: 'wide', color: '#1a2a2a' },
]

function GalleryCard({ item, index }: { item: typeof GALLERY_ITEMS[0]; index: number }) {
  const height = item.aspect === 'tall' ? 'h-80' : item.aspect === 'wide' ? 'h-52' : 'h-64'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.3) }}
      className={`break-inside-avoid relative ${height} rounded-xl overflow-hidden group cursor-pointer`}
    >
      {/* Placeholder background */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundColor: item.color }}
      >
        <div className="absolute inset-0 diagonal-lines opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/10 text-5xl font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>
            {item.id.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Gold line at bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="inline-block px-2.5 py-1 bg-[#D4A853]/20 text-[#D4A853] text-[9px] font-semibold tracking-wider uppercase rounded-full border border-[#D4A853]/30 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 mb-1.5">
          {item.category}
        </span>
        <h3 className="text-[#FAFAFA] font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150" style={{ fontFamily: 'var(--font-clash-display)' }}>
          {item.title}
        </h3>
      </div>

      {/* Corner expand icon */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
        <svg className="w-3.5 h-3.5 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </div>
    </motion.div>
  )
}

export default function GaleriaPage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true })
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filtered = activeFilter === 'Todos'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter)

  const getCategoryCount = (cat: string) => {
    if (cat === 'Todos') return GALLERY_ITEMS.length
    return GALLERY_ITEMS.filter(item => item.category === cat).length
  }

  return (
    <main className="relative min-h-screen bg-[#0A0A0B]">
      <AnimatedBackground />

      {/* Back Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-full text-[#8A8A8A] hover:text-[#D4A853] hover:border-[#D4A853]/30 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Volver</span>
          </motion.button>
        </Link>
      </div>

      {/* Hero Header */}
      <div ref={headerRef} className="relative pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <span className="w-12 h-px bg-[#D4A853]" />
          <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
            Galería Completa
          </span>
          <span className="w-12 h-px bg-[#D4A853]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-[#FAFAFA] tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-clash-display)' }}
        >
          Nuestros{' '}
          <span className="text-gradient-gold">Proyectos</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#8A8A8A] text-lg max-w-2xl mx-auto px-6"
        >
          200+ proyectos ejecutados en diferentes partes del país. Producción gráfica profesional que habla por sí sola
        </motion.p>

        {/* Animated counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
          className="mt-8 inline-flex items-center gap-4"
        >
          <div className="px-6 py-3 bg-[#141416]/60 backdrop-blur-sm border border-[#D4A853]/20 rounded-2xl">
            <span className="text-[#D4A853] text-3xl font-black font-mono">200+</span>
            <span className="text-[#8A8A8A] text-sm ml-2">proyectos ejecutados</span>
          </div>
          <div className="px-6 py-3 bg-[#141416]/60 backdrop-blur-sm border border-white/5 rounded-2xl">
            <span className="text-[#FAFAFA] text-3xl font-black font-mono">{CATEGORIES.length - 1}</span>
            <span className="text-[#8A8A8A] text-sm ml-2">categorías</span>
          </div>
        </motion.div>
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat)
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    activeFilter === cat
                      ? 'bg-[#D4A853] text-[#0A0A0B] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                      : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10 hover:text-[#FAFAFA] border border-white/5'
                  }`}
                >
                  {cat}
                  <span className={`text-[10px] font-mono ${
                    activeFilter === cat ? 'text-[#0A0A0B]/60' : 'text-[#8A8A8A]/50'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <motion.p
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#8A8A8A]/60 text-sm"
        >
          Mostrando <span className="text-[#D4A853] font-mono font-bold">{filtered.length}</span> {filtered.length === 1 ? 'proyecto' : 'proyectos'}
          {activeFilter !== 'Todos' && (
            <> en <span className="text-[#FAFAFA]">{activeFilter}</span></>
          )}
        </motion.p>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent mx-auto mb-6" />
          <p className="text-[#8A8A8A] text-sm mb-4">
            ¿Tienes un proyecto en mente?
          </p>
          <Link href="/#contacto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full shadow-[0_0_30px_rgba(212,168,83,0.3)] hover:shadow-[0_0_40px_rgba(212,168,83,0.5)] transition-all duration-300"
              style={{ fontFamily: 'var(--font-clash-display)' }}
            >
              Solicitar Cotización
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
