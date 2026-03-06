'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import storeApi from '@/lib/store-api'
import ProductCard from '@/components/store/ProductCard'

// Fallback demo data for when API is not available
const DEMO_CATEGORIES = [
  { id: 1, nombre: 'Banners y Lonas', slug: 'banners-lonas' },
  { id: 2, nombre: 'Impresion UV', slug: 'impresion-uv' },
  { id: 3, nombre: 'Corte Laser', slug: 'corte-laser' },
  { id: 4, nombre: 'Sublimacion', slug: 'sublimacion' },
  { id: 5, nombre: 'Senaletica', slug: 'senaletica' },
  { id: 6, nombre: 'Corporeos', slug: 'corporeos' },
]

const DEMO_PRODUCTS = [
  { id: 1, slug: 'banner-13oz', nombre: 'Banner 13oz por Metro', precio: 12.50, imagen: null, categoria_nombre: 'Banners y Lonas', cotizable: false },
  { id: 2, slug: 'lona-frontlit', nombre: 'Lona Frontlit Iluminada', precio: 18.00, imagen: null, categoria_nombre: 'Banners y Lonas', cotizable: false },
  { id: 3, slug: 'impresion-acrilico-uv', nombre: 'Impresion Directa en Acrilico UV', precio: null, imagen: null, categoria_nombre: 'Impresion UV', cotizable: true },
  { id: 4, slug: 'vinil-adhesivo-m2', nombre: 'Vinil Adhesivo por M2', precio: 15.00, imagen: null, categoria_nombre: 'Banners y Lonas', cotizable: false },
  { id: 5, slug: 'corte-acrilico-laser', nombre: 'Corte Acrilico Laser Personalizado', precio: null, imagen: null, categoria_nombre: 'Corte Laser', cotizable: true },
  { id: 6, slug: 'camiseta-sublimada', nombre: 'Camiseta Sublimada Full Print', precio: 8.50, imagen: null, categoria_nombre: 'Sublimacion', cotizable: false },
  { id: 7, slug: 'letras-corporeas-pvc', nombre: 'Letras Corporeas PVC Espumado', precio: null, imagen: null, categoria_nombre: 'Corporeos', cotizable: true },
  { id: 8, slug: 'senaletica-acrilico', nombre: 'Senaletica en Acrilico UV', precio: 25.00, imagen: null, categoria_nombre: 'Senaletica', cotizable: false },
  { id: 9, slug: 'microperforado-vitrina', nombre: 'Microperforado para Vitrina', precio: 22.00, imagen: null, categoria_nombre: 'Banners y Lonas', cotizable: false },
  { id: 10, slug: 'grabado-trofeo-laser', nombre: 'Grabado Trofeo Laser', precio: 15.00, imagen: null, categoria_nombre: 'Corte Laser', cotizable: false },
  { id: 11, slug: 'uniforme-deportivo', nombre: 'Uniforme Deportivo Completo', precio: 12.00, imagen: null, categoria_nombre: 'Sublimacion', cotizable: false },
  { id: 12, slug: 'logo-3d-acrilico-led', nombre: 'Logo 3D Acrilico con LED', precio: null, imagen: null, categoria_nombre: 'Corporeos', cotizable: true },
]

const SORT_OPTIONS = [
  { value: '', label: 'Relevancia' },
  { value: 'precio', label: 'Precio: Menor a Mayor' },
  { value: '-precio', label: 'Precio: Mayor a Menor' },
  { value: '-created_at', label: 'Mas Nuevo' },
]

export default function TiendaPage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true })

  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [categories, setCategories] = useState(DEMO_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(false)

  // Try to fetch from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await storeApi.getCategorias() as { results?: Array<{ id: number; nombre: string; slug: string }> }
        const items = Array.isArray(data) ? data : (data.results || [])
        if (items.length > 0) {
          setCategories(items)
          setApiAvailable(true)
        }
      } catch {
        // API not available, use demo data
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      if (!apiAvailable) {
        // Filter demo data locally
        let filtered = [...DEMO_PRODUCTS]
        if (activeCategory) {
          filtered = filtered.filter(p => p.categoria_nombre === activeCategory)
        }
        if (search) {
          const s = search.toLowerCase()
          filtered = filtered.filter(p => p.nombre.toLowerCase().includes(s))
        }
        if (ordering === 'precio') {
          filtered.sort((a, b) => (a.precio || 999) - (b.precio || 999))
        } else if (ordering === '-precio') {
          filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0))
        }
        setProducts(filtered)
        setTotalPages(1)
        return
      }

      setIsLoading(true)
      try {
        const data = await storeApi.getProductos({
          page,
          categoria: activeCategory,
          search,
          ordering,
        }) as { results?: typeof DEMO_PRODUCTS; count?: number }
        const items = Array.isArray(data) ? data : (data.results || [])
        setProducts(items)
        const count = (data as { count?: number }).count || items.length
        setTotalPages(Math.ceil(count / 12))
      } catch {
        // Fallback to demo
        setProducts(DEMO_PRODUCTS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [activeCategory, search, ordering, page, apiAvailable])

  return (
    <main className="relative min-h-screen bg-[#0A0A0B]">
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
            <span className="text-sm font-medium">Inicio</span>
          </motion.button>
        </Link>
      </div>

      {/* Hero Header */}
      <div ref={headerRef} className="relative pt-32 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <span className="w-12 h-px bg-[#D4A853]" />
          <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
            Catalogo de Productos
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
          Nuestra{' '}
          <span className="text-gradient-gold">Tienda</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#8A8A8A] text-lg max-w-2xl mx-auto px-6"
        >
          Encuentra todo lo que necesitas para tu proyecto. Productos listos para comprar y opciones personalizadas bajo cotizacion.
        </motion.p>
      </div>

      {/* Filters Section */}
      <div className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide mb-3">
            <button
              onClick={() => { setActiveCategory(''); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeCategory === ''
                  ? 'bg-[#D4A853] text-[#0A0A0B] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                  : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10 hover:text-[#FAFAFA] border border-white/5'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.nombre); setPage(1) }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.nombre
                    ? 'bg-[#D4A853] text-[#0A0A0B] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                    : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10 hover:text-[#FAFAFA] border border-white/5'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 focus:bg-white/[0.07] transition-all duration-300"
              />
            </div>
            <select
              value={ordering}
              onChange={(e) => { setOrdering(e.target.value); setPage(1) }}
              className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm text-[#8A8A8A] focus:outline-none focus:border-[#D4A853]/30 appearance-none cursor-pointer min-w-[170px]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#111113]">{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <p className="text-[#8A8A8A]/60 text-sm">
          Mostrando <span className="text-[#D4A853] font-mono font-bold">{products.length}</span>{' '}
          {products.length === 1 ? 'producto' : 'productos'}
          {activeCategory && (
            <> en <span className="text-[#FAFAFA]">{activeCategory}</span></>
          )}
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#111113] rounded-xl border border-white/5 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-5 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#8A8A8A]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[#8A8A8A] text-sm mb-1">No se encontraron productos</p>
            <p className="text-[#6A6A6A] text-xs">Intenta con otros filtros o terminos de busqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-[#8A8A8A] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                  page === i + 1
                    ? 'bg-[#D4A853] text-[#0A0A0B]'
                    : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-[#8A8A8A] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
