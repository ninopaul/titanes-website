'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import storeApi from '@/lib/store-api'
import ProductCard from '@/components/store/ProductCard'
import { useTasaBcv } from '@/hooks/useTasaBcv'
import Navbar from '@/components/Navbar'

// Fallback demo data for when API is not available
interface Category {
  id: number
  nombre: string
  slug: string
  imagen_url?: string | null
  icono?: string
  padre?: number | null
  padre_nombre?: string | null
  hijos?: Category[]
}

const DEMO_CATEGORIES: Category[] = [
  { id: 1, nombre: 'Impresion', slug: 'impresion', imagen_url: null, hijos: [] },
  { id: 2, nombre: 'Laser', slug: 'laser', imagen_url: null, hijos: [] },
  { id: 3, nombre: 'UV', slug: 'uv', imagen_url: null, hijos: [] },
  { id: 4, nombre: 'Textil', slug: 'textil', imagen_url: null, hijos: [] },
  { id: 5, nombre: 'Productos', slug: 'productos', imagen_url: null, hijos: [] },
  { id: 6, nombre: 'Servicios', slug: 'servicios', imagen_url: null, hijos: [] },
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

export default function TiendaClient() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true })
  const { tasa_bcv, fecha, desactualizada } = useTasaBcv()

  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('')  // slug-based
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(false)
  const [selectedParent, setSelectedParent] = useState<Category | null>(null)
  const [selectedChild, setSelectedChild] = useState<string>('')

  // Try to fetch from API — check if backend is reachable
  useEffect(() => {
    async function checkApi() {
      try {
        const response = await storeApi.getCategorias() as any
        const data = response?.data !== undefined ? response.data : response
        const items = Array.isArray(data) ? data : (data?.results || [])
        if (items.length > 0) {
          const cats: Category[] = items.map((item: any) => ({
            id: item.id,
            nombre: item.nombre,
            slug: item.slug || item.nombre.toLowerCase().replace(/\s+/g, '-'),
            imagen_url: item.imagen_url || null,
            icono: item.icono || '',
            padre: item.padre || null,
            padre_nombre: item.padre_nombre || null,
            hijos: (item.hijos || []).map((h: any) => ({
              id: h.id,
              nombre: h.nombre,
              slug: h.slug,
              imagen_url: h.imagen_url || null,
              icono: h.icono || '',
            })),
          }))
          setCategories(cats)
        }
        setApiAvailable(true)
      } catch {
        // API not available, use demo data
      }
    }
    checkApi()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      if (!apiAvailable) {
        // Filter demo data locally
        let filtered = [...DEMO_PRODUCTS]
        if (activeCategory) {
          // Find the category name from slug for local filtering
          const catName = categories.find(c => c.slug === activeCategory)?.nombre
          filtered = filtered.filter(p => p.categoria_nombre === catName)
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
        const response = await storeApi.getProductos({
          page,
          categoria: activeCategory,
          search,
          ordering,
        }) as any
        const data = response?.data !== undefined ? response.data : response
        const rawItems = Array.isArray(data) ? data : (data?.results || [])
        // Map API fields to ProductCard interface
        const items = rawItems.map((item: any) => {
          const precioRaw = item.precio_usd ? parseFloat(item.precio_usd) : item.precio ?? null
          return {
            id: item.id,
            slug: item.slug,
            nombre: item.nombre,
            precio: precioRaw && precioRaw > 0 ? precioRaw : null,
            imagen: item.imagen_principal_url || item.imagen || null,
            categoria_nombre: item.categoria_nombre,
            cotizable: item.cotizable ?? false,
            opciones: item.opciones || [],
          }
        })
        setProducts(items)
        const count = data?.count || items.length
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
    <>
    <Navbar />
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

      {/* Category Navigation */}
      <AnimatePresence mode="wait">
        {!selectedParent ? (
          /* ============= STATE A: Parent Category Grid ============= */
          <motion.div
            key="parent-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-6 pb-20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
              {categories.map((cat, index) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedParent(cat); setPage(1); setActiveCategory(cat.slug); setSelectedChild(''); setSearch(''); }}
                  className="relative group h-48 rounded-2xl overflow-hidden border border-white/5 text-left"
                >
                  {cat.imagen_url ? (
                    <img src={cat.imagen_url} alt={cat.nombre} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]" />
                  )}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                    {cat.icono && (
                      <span className="text-3xl mb-3">{cat.icono}</span>
                    )}
                    <h3
                      className="text-2xl font-bold text-[#FAFAFA] mb-2 group-hover:text-[#D4A853] transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-clash-display)' }}
                    >
                      {cat.nombre}
                    </h3>
                    {cat.hijos && cat.hijos.length > 0 && (
                      <p className="text-[#8A8A8A] text-sm">
                        {cat.hijos.length} {cat.hijos.length === 1 ? 'subcategoria' : 'subcategorias'}
                      </p>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4A853] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ============= STATE B: Selected Parent — Children + Products ============= */
          <motion.div
            key="child-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Breadcrumb + Back */}
            <div className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 py-4">
              <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb Row */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedParent(null); setActiveCategory(''); setSelectedChild(''); setSearch(''); setPage(1); }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[#8A8A8A] hover:text-[#D4A853] hover:border-[#D4A853]/30 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm">Volver</span>
                  </motion.button>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#6A6A6A]">Categorias</span>
                    <svg className="w-3.5 h-3.5 text-[#6A6A6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-[#D4A853] font-medium" style={{ fontFamily: 'var(--font-clash-display)' }}>
                      {selectedParent.nombre}
                    </span>
                    {selectedChild && (
                      <>
                        <svg className="w-3.5 h-3.5 text-[#6A6A6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#FAFAFA] font-medium">
                          {selectedParent.hijos?.find(h => h.slug === selectedChild)?.nombre || selectedChild}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Children Category Pills */}
                {selectedParent.hijos && selectedParent.hijos.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide mb-3">
                    <button
                      onClick={() => { setSelectedChild(''); setActiveCategory(selectedParent.slug); setPage(1); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                        selectedChild === ''
                          ? 'bg-[#D4A853] text-[#0A0A0B] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                          : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10 hover:text-[#FAFAFA] border border-white/5'
                      }`}
                    >
                      Todos
                    </button>
                    {selectedParent.hijos.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => { setSelectedChild(child.slug); setActiveCategory(child.slug); setPage(1); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                          selectedChild === child.slug
                            ? 'bg-[#D4A853] text-[#0A0A0B] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                            : 'bg-white/5 text-[#8A8A8A] hover:bg-white/10 hover:text-[#FAFAFA] border border-white/5'
                        }`}
                      >
                        {child.icono && <span className="mr-1.5">{child.icono}</span>}
                        {child.nombre}
                      </button>
                    ))}
                  </div>
                )}

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
                {' '}en{' '}
                <span className="text-[#FAFAFA]">
                  {selectedChild
                    ? (selectedParent.hijos?.find(h => h.slug === selectedChild)?.nombre || selectedChild)
                    : selectedParent.nombre
                  }
                </span>
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
                    <ProductCard key={product.id} product={product} index={index} tasa_bcv={tasa_bcv} />
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
          </motion.div>
        )}
      </AnimatePresence>

      {tasa_bcv > 0 && (
        <div className="text-center text-xs text-[#6A6A6A] mt-8 pb-4">
          Tasa BCV: Bs. {Number(tasa_bcv).toFixed(2)} / USD
          {fecha && ` (${fecha})`}
          {desactualizada && ' - Desactualizada'}
        </div>
      )}
    </main>
    </>
  )
}
