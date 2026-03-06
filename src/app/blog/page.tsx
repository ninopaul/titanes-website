'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const BLOG_CATEGORIES = ['Todos', 'Produccion Grafica', 'Diseno', 'Materiales', 'Casos de Exito', 'Noticias']

const DEMO_POSTS = [
  {
    id: 1,
    slug: 'guia-completa-impresion-gran-formato',
    titulo: 'Guia Completa de Impresion Gran Formato: Todo lo que Necesitas Saber',
    excerpt: 'Descubre los diferentes tipos de materiales, resoluciones y acabados disponibles para impresion gran formato. Desde banners hasta vallas publicitarias.',
    imagen: null,
    categoria: 'Produccion Grafica',
    fecha: '2026-03-04',
    autor: 'Titanes Graficos',
    color: '#1a2332',
  },
  {
    id: 2,
    slug: 'tendencias-diseno-publicitario-2026',
    titulo: 'Tendencias de Diseno Publicitario para 2026',
    excerpt: 'Las ultimas tendencias en diseno grafico aplicado a publicidad exterior e interior. Colores, tipografias y estilos que dominaran este ano.',
    imagen: null,
    categoria: 'Diseno',
    fecha: '2026-03-01',
    autor: 'Titanes Graficos',
    color: '#2a1a1a',
  },
  {
    id: 3,
    slug: 'diferencias-vinil-polimerico-vs-cast',
    titulo: 'Vinil Polimerico vs Cast: Diferencias y Cuando Usar Cada Uno',
    excerpt: 'Aprende las diferencias clave entre vinil polimerico y vinil cast para tomar la mejor decision en tu proximo proyecto de rotulado.',
    imagen: null,
    categoria: 'Materiales',
    fecha: '2026-02-25',
    autor: 'Titanes Graficos',
    color: '#1a1a2a',
  },
  {
    id: 4,
    slug: 'caso-exito-fachada-centro-comercial',
    titulo: 'Caso de Exito: Fachada Completa para Centro Comercial Metromar',
    excerpt: 'Conoce como transformamos la fachada de uno de los centros comerciales mas importantes de Valencia con un proyecto integral de 200m2.',
    imagen: null,
    categoria: 'Casos de Exito',
    fecha: '2026-02-20',
    autor: 'Titanes Graficos',
    color: '#221a2a',
  },
  {
    id: 5,
    slug: 'sublimacion-textil-industrial',
    titulo: 'Sublimacion Textil Industrial: Del Diseno a la Produccion',
    excerpt: 'Todo sobre el proceso de sublimacion industrial con calandra neumatica. Materiales compatibles, temperaturas y tips para resultados perfectos.',
    imagen: null,
    categoria: 'Produccion Grafica',
    fecha: '2026-02-15',
    autor: 'Titanes Graficos',
    color: '#2a221a',
  },
  {
    id: 6,
    slug: 'nueva-maquina-mimaki-ujf7151',
    titulo: 'Nueva Adquisicion: Mimaki UJF-7151 Plus II para Impresion UV',
    excerpt: 'Incorporamos la impresora UV de cama plana mas avanzada de Mimaki a nuestro arsenal. Conoce sus capacidades y lo que significa para nuestros clientes.',
    imagen: null,
    categoria: 'Noticias',
    fecha: '2026-02-10',
    autor: 'Titanes Graficos',
    color: '#1a2a22',
  },
]

export default function BlogPage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true })
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filtered = activeCategory === 'Todos'
    ? DEMO_POSTS
    : DEMO_POSTS.filter(p => p.categoria === activeCategory)

  return (
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Back */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-full text-[#8A8A8A] hover:text-[#D4A853] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Inicio</span>
          </motion.button>
        </Link>
      </div>

      {/* Header */}
      <div ref={headerRef} className="relative pt-32 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <span className="w-12 h-px bg-[#D4A853]" />
          <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">Blog</span>
          <span className="w-12 h-px bg-[#D4A853]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-[#FAFAFA] tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-clash-display)' }}
        >
          Nuestro <span className="text-gradient-gold">Blog</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#8A8A8A] text-lg max-w-2xl mx-auto px-6"
        >
          Articulos, guias y noticias sobre produccion grafica, diseno y materiales
        </motion.p>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide justify-center">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#D4A853] text-[#0A0A0B]'
                    : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8A8A8A] text-sm">No hay articulos en esta categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="bg-[#111113] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {post.imagen ? (
                        <img src={post.imagen} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center diagonal-lines group-hover:scale-105 transition-transform duration-700"
                          style={{ backgroundColor: post.color }}
                        >
                          <span className="text-white/5 text-6xl font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>
                            {post.id.toString().padStart(2, '0')}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-[#0A0A0B]/60 backdrop-blur-sm text-[#D4A853] text-[10px] font-semibold tracking-wider uppercase rounded-full border border-[#D4A853]/20">
                          {post.categoria}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-[#8A8A8A] text-xs mb-2">{post.fecha} &middot; {post.autor}</p>
                      <h3
                        className="text-[#FAFAFA] font-bold text-base mb-2 line-clamp-2 group-hover:text-[#D4A853] transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-clash-display)' }}
                      >
                        {post.titulo}
                      </h3>
                      <p className="text-[#8A8A8A] text-sm line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Bottom line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
