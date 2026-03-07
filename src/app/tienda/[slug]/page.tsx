'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import storeApi from '@/lib/store-api'
import { useCart } from '@/components/store/CartProvider'
import ProductCard from '@/components/store/ProductCard'
import { COMPANY } from '@/lib/constants'

interface ProductOption {
  nombre: string
  valores: string[]
  afecta_precio?: boolean
}

interface Product {
  id: number
  slug: string
  nombre: string
  descripcion: string
  precio: number | null
  imagen: string | null
  imagenes?: string[]
  categoria_nombre?: string
  cotizable?: boolean
  requiere_archivo?: boolean
  precio_bs?: number | null
  opciones?: ProductOption[]
  unidad_medida?: string
}

const DEMO_PRODUCT: Product = {
  id: 1,
  slug: 'banner-13oz',
  nombre: 'Banner 13oz por Metro',
  descripcion: 'Banner de alta calidad para exteriores e interiores. Material resistente a la intemperie, ideal para publicidad, eventos y senalizacion. Impresion en alta resolucion con tintas ecosolventes Mimaki que garantizan colores vibrantes y durabilidad.',
  precio: 12.50,
  imagen: null,
  imagenes: [],
  categoria_nombre: 'Banners y Lonas',
  cotizable: false,
  requiere_archivo: true,
}

const DEMO_RELATED = [
  { id: 2, slug: 'lona-frontlit', nombre: 'Lona Frontlit Iluminada', precio: 18.00, imagen: null, categoria_nombre: 'Banners y Lonas', cotizable: false },
  { id: 4, slug: 'vinil-adhesivo-m2', nombre: 'Vinil Adhesivo por M2', precio: 15.00, imagen: null, categoria_nombre: 'Banners y Lonas', cotizable: false },
  { id: 9, slug: 'microperforado-vitrina', nombre: 'Microperforado para Vitrina', precio: 22.00, imagen: null, categoria_nombre: 'Banners y Lonas', cotizable: false },
]

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState(DEMO_RELATED)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      try {
        const response = await storeApi.getProducto(slug) as any
        const data = response?.data !== undefined ? response.data : response
        // Map API fields to Product interface
        const precioRaw = data.precio_usd ? parseFloat(data.precio_usd) : data.precio ?? null
        setProduct({
          id: data.id,
          slug: data.slug,
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          precio: precioRaw && precioRaw > 0 ? precioRaw : null,
          imagen: data.imagen_principal_url || data.imagen || null,
          imagenes: data.galeria || data.imagenes || [],
          categoria_nombre: data.categoria_nombre,
          cotizable: data.cotizable ?? false,
          requiere_archivo: data.requiere_archivo ?? false,
          precio_bs: data.precio_bs ? parseFloat(data.precio_bs) : null,
          opciones: data.opciones || [],
          unidad_medida: data.unidad_medida || '',
        })
      } catch {
        // Use demo data
        setProduct({ ...DEMO_PRODUCT, slug })
      } finally {
        setIsLoading(false)
        setSelectedOptions({})
      }
    }
    if (slug) fetchProduct()
  }, [slug])

  // Check if all required options are selected
  const allOptionsSelected = !product?.opciones?.length ||
    product.opciones.every(opt => selectedOptions[opt.nombre])

  const handleAddToCart = () => {
    if (!product || product.cotizable || !product.precio) return
    if (!allOptionsSelected) return
    const hasOptions = product.opciones && product.opciones.length > 0
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.nombre,
      price: product.precio,
      image: product.imagen || '',
      ...(hasOptions ? { options: { ...selectedOptions } } : {}),
    }, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const telegramUrl = `https://t.me/${COMPANY.telegram}?text=${encodeURIComponent(
    `Hola! Me interesa cotizar: ${product?.nombre || slug}. ¿Me pueden dar mas informacion?`
  )}`

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-white/5 rounded-2xl" />
            <div className="space-y-4 py-8">
              <div className="h-4 bg-white/5 rounded w-1/4" />
              <div className="h-8 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
              <div className="h-10 bg-white/5 rounded w-1/3 mt-8" />
              <div className="h-12 bg-white/5 rounded-full w-1/2 mt-4" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) return null

  const images = product.imagenes && product.imagenes.length > 0
    ? product.imagenes
    : [product.imagen].filter(Boolean) as string[]

  return (
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Back Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/tienda">
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
            <span className="text-sm font-medium">Tienda</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-[#8A8A8A] mb-8"
        >
          <Link href="/tienda" className="hover:text-[#D4A853] transition-colors">Tienda</Link>
          <span className="text-[#6A6A6A]">/</span>
          {product.categoria_nombre && (
            <>
              <span className="text-[#8A8A8A]">{product.categoria_nombre}</span>
              <span className="text-[#6A6A6A]">/</span>
            </>
          )}
          <span className="text-[#FAFAFA]">{product.nombre}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#111113] border border-white/5">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center diagonal-lines">
                  <span className="text-white/5 text-[120px] font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
                </div>
              )}
              {product.cotizable && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-[#D4A853]/90 backdrop-blur-sm text-[#0A0A0B] text-xs font-bold rounded-full">
                  Cotizable
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? 'border-[#D4A853] shadow-[0_0_10px_rgba(212,168,83,0.3)]'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="py-4"
          >
            {/* Category */}
            {product.categoria_nombre && (
              <span className="inline-block px-3 py-1 bg-[#D4A853]/10 text-[#D4A853] text-[10px] font-semibold tracking-wider uppercase rounded-full border border-[#D4A853]/20 mb-4">
                {product.categoria_nombre}
              </span>
            )}

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl font-black text-[#FAFAFA] tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-clash-display)' }}
            >
              {product.nombre}
            </h1>

            {/* Description */}
            <p className="text-[#8A8A8A] leading-relaxed mb-6">
              {product.descripcion}
            </p>

            {/* Product Options */}
            {product.opciones && product.opciones.length > 0 && (
              <div className="space-y-4 mb-6">
                {product.opciones.map((opt) => (
                  <div key={opt.nombre}>
                    <label className="block text-[#8A8A8A] text-sm mb-2">
                      {opt.nombre}
                      {!selectedOptions[opt.nombre] && (
                        <span className="text-[#D4A853] text-xs ml-2">* Selecciona una opción</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.valores.map((valor) => (
                        <button
                          key={valor}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.nombre]: valor }))}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                            selectedOptions[opt.nombre] === valor
                              ? 'bg-[#D4A853]/20 border-[#D4A853] text-[#D4A853] shadow-[0_0_10px_rgba(212,168,83,0.15)]'
                              : 'bg-white/5 border-white/10 text-[#8A8A8A] hover:border-white/20 hover:text-[#FAFAFA]'
                          }`}
                        >
                          {valor}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            {product.cotizable || !product.precio ? (
              <div className="p-4 bg-[#D4A853]/5 border border-[#D4A853]/20 rounded-xl mb-6">
                <p className="text-[#D4A853] font-bold text-sm mb-1">Producto Cotizable</p>
                <p className="text-[#8A8A8A] text-xs">El precio depende de las especificaciones. Contactanos para una cotizacion personalizada.</p>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-[#D4A853] text-3xl font-black font-mono">${product.precio.toFixed(2)}</span>
                  <span className="text-[#8A8A8A] text-sm">USD</span>
                </div>
                {product.precio_bs && (
                  <p className="text-[#8A8A8A] text-sm mt-1">
                    Ref. Bs. {product.precio_bs.toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            {!product.cotizable && product.precio && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-[#8A8A8A] text-sm">Cantidad:</span>
                  <div className="flex items-center gap-0 bg-white/5 rounded-xl border border-white/5">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-[#FAFAFA] font-mono text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={allOptionsSelected ? { scale: 1.02 } : {}}
                  whileTap={allOptionsSelected ? { scale: 0.98 } : {}}
                  onClick={handleAddToCart}
                  disabled={!allOptionsSelected}
                  className={`w-full py-4 font-bold text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                    !allOptionsSelected
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : addedToCart
                        ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                        : 'bg-[#D4A853] text-[#0A0A0B] hover:bg-[#E8C776] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                  }`}
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  {!allOptionsSelected ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Selecciona las opciones
                    </>
                  ) : addedToCart ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Agregado al Carrito
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Agregar al Carrito
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Cotizar button */}
            {product.cotizable && (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[#0088cc] text-white font-bold text-sm rounded-full hover:bg-[#0099dd] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,136,204,0.2)]"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Solicitar Cotización por Telegram
                </motion.button>
              </a>
            )}

            {/* File upload notice */}
            {product.requiere_archivo && (
              <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p className="text-blue-400 font-medium text-sm">Archivo Requerido</p>
                    <p className="text-[#8A8A8A] text-xs mt-0.5">
                      Este producto requiere que subas tu archivo de diseno. Podras adjuntarlo durante el checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#D4A853]" />
              <h2 className="text-xl font-bold text-[#FAFAFA]" style={{ fontFamily: 'var(--font-clash-display)' }}>
                Productos Relacionados
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
