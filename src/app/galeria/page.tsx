'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import AnimatedBackground from '@/components/AnimatedBackground'
import storeApi from '@/lib/store-api'

// ═══ Types ═══
interface PortafolioItem {
  id: number
  titulo: string
  imagen: string
  imagen_url: string
  categoria: string
  descripcion: string
  visible: boolean
  orden: number
  destacado: boolean
  mostrar_en_inicio: boolean
  created_at: string
}

function GalleryCard({ item, index }: { item: PortafolioItem; index: number }) {
  // Visual variety: alternate aspect ratios based on position
  const aspects = ['wide', 'tall', 'square', 'wide', 'tall', 'square', 'tall', 'wide', 'square', 'wide', 'square', 'tall']
  const aspect = aspects[index % aspects.length]
  const height = aspect === 'tall' ? 'h-80' : aspect === 'wide' ? 'h-52' : 'h-64'
  const imgSrc = item.imagen_url || item.imagen || ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.3) }}
      className={`break-inside-avoid relative ${height} rounded-xl overflow-hidden group cursor-pointer`}
    >
      {/* Real image or placeholder */}
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={item.titulo}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-[#1a2332] transition-transform duration-700 group-hover:scale-110">
          <div className="absolute inset-0 diagonal-lines opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/10 text-5xl font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>
              {(index + 1).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Gold line at bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        {item.categoria && (
          <span className="inline-block px-2.5 py-1 bg-[#D4A853]/20 text-[#D4A853] text-[9px] font-semibold tracking-wider uppercase rounded-full border border-[#D4A853]/30 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 mb-1.5">
            {item.categoria}
          </span>
        )}
        <h3 className="text-[#FAFAFA] font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150" style={{ fontFamily: 'var(--font-clash-display)' }}>
          {item.titulo}
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
  const [items, setItems] = useState<PortafolioItem[]>([])
  const [categories, setCategories] = useState<string[]>(['Todos'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await storeApi.getPortafolio() as { success: boolean; data: PortafolioItem[] }
        if (res.success && Array.isArray(res.data)) {
          const sorted = [...res.data].sort((a, b) => a.orden - b.orden)
          setItems(sorted)

          // Extract unique categories from real data
          const cats = ['Todos', ...new Set(sorted.map(i => i.categoria).filter(Boolean))]
          setCategories(cats)
        }
      } catch (err) {
        console.error('Error fetching galeria:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const filtered = activeFilter === 'Todos'
    ? items
    : items.filter(item => item.categoria === activeFilter)

  const getCategoryCount = (cat: string) => {
    if (cat === 'Todos') return items.length
    return items.filter(item => item.categoria === cat).length
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
            <span className="text-[#FAFAFA] text-3xl font-black font-mono">{categories.length - 1}</span>
            <span className="text-[#8A8A8A] text-sm ml-2">categorías</span>
          </div>
        </motion.div>
      </div>

      {/* Sticky Filters */}
      {categories.length > 1 && (
        <div className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {categories.map((cat) => {
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
      )}

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <motion.p
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#8A8A8A]/60 text-sm"
        >
          {loading ? (
            'Cargando proyectos...'
          ) : (
            <>
              Mostrando <span className="text-[#D4A853] font-mono font-bold">{filtered.length}</span> {filtered.length === 1 ? 'proyecto' : 'proyectos'}
              {activeFilter !== 'Todos' && (
                <> en <span className="text-[#FAFAFA]">{activeFilter}</span></>
              )}
            </>
          )}
        </motion.p>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#D4A853]/30 border-t-[#D4A853] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#D4A853]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#D4A853]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-[#FAFAFA] text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Próximamente
            </h3>
            <p className="text-[#8A8A8A] text-sm max-w-md mx-auto">
              Estamos preparando nuestra galería de proyectos. Pronto podrás ver más de 200 trabajos realizados.
            </p>
          </div>
        ) : (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <GalleryCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom CTA */}
        {!loading && items.length > 0 && (
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
        )}
      </div>
    </main>
  )
}
