'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// Placeholder portfolio items (will be replaced with real data from API/Instagram)
const PORTFOLIO_CATEGORIES = ['Todos', 'Gran Formato', 'UV', 'Láser', 'Sublimación', 'Fachadas', 'Corpóreos']

const PORTFOLIO_ITEMS = [
  { id: 1, title: 'Fachada Centro Comercial', category: 'Fachadas', aspect: 'tall', color: '#1a2332' },
  { id: 2, title: 'Banner Evento Deportivo', category: 'Gran Formato', aspect: 'wide', color: '#2a1a1a' },
  { id: 3, title: 'Trofeos Corporativos', category: 'Láser', aspect: 'square', color: '#1a1a2a' },
  { id: 4, title: 'Uniforme Deportivo Completo', category: 'Sublimación', aspect: 'tall', color: '#1a2a1a' },
  { id: 5, title: 'Impresión Directa Acrílico', category: 'UV', aspect: 'wide', color: '#2a2a1a' },
  { id: 6, title: 'Logo 3D Oficina', category: 'Corpóreos', aspect: 'square', color: '#1a2a2a' },
  { id: 7, title: 'Valla Publicitaria 12m', category: 'Gran Formato', aspect: 'wide', color: '#221a2a' },
  { id: 8, title: 'Caja de Luz Doble Cara', category: 'Fachadas', aspect: 'tall', color: '#2a1a22' },
  { id: 9, title: 'Grabado Placas Industriales', category: 'Láser', aspect: 'square', color: '#1a221a' },
  { id: 10, title: 'Set Deportivo Completo', category: 'Sublimación', aspect: 'wide', color: '#221a1a' },
  { id: 11, title: 'Señalética Hospital', category: 'UV', aspect: 'tall', color: '#1a1a22' },
  { id: 12, title: 'Letras MDF Iluminadas', category: 'Corpóreos', aspect: 'square', color: '#222a1a' },
]

export default function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filtered = activeFilter === 'Todos'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(item => item.category === activeFilter)

  return (
    <section id="portafolio" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0B]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
              Nuestro Trabajo
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
            Portafolio de{' '}
            <span className="text-gradient-gold">Proyectos</span>
          </motion.h2>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-[#D4A853] text-[#0A0A0B]'
                  : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10 hover:text-[#FAFAFA] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const height = item.aspect === 'tall' ? 'h-80' : item.aspect === 'wide' ? 'h-52' : 'h-64'
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={`break-inside-avoid relative ${height} rounded-xl overflow-hidden group cursor-pointer`}
                >
                  {/* Placeholder background — will be replaced with real images */}
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundColor: item.color }}
                  >
                    {/* Placeholder pattern */}
                    <div className="absolute inset-0 diagonal-lines opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/10 text-6xl font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>
                        {item.id.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-2.5 py-1 bg-[#D4A853]/20 text-[#D4A853] text-[10px] font-semibold tracking-wider uppercase rounded-full border border-[#D4A853]/30 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-[#FAFAFA] font-bold text-base opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150" style={{ fontFamily: 'var(--font-clash-display)' }}>
                      {item.title}
                    </h3>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                    <svg className="w-4 h-4 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
