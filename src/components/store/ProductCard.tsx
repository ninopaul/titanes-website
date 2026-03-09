'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from './CartProvider'
import { formatBs } from '@/hooks/useTasaBcv'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'

interface ProductCardProps {
  product: {
    id: number
    slug: string
    nombre: string
    precio: number | null
    imagen: string | null
    categoria_nombre?: string
    cotizable?: boolean
    opciones?: { nombre: string; valores: string[] }[]
  }
  index?: number
  tasa_bcv?: number
  isFavorite?: boolean
  onFavoriteToggle?: (productId: number, isFav: boolean) => void
}

export default function ProductCard({ product, index = 0, tasa_bcv, isFavorite = false, onFavoriteToggle }: ProductCardProps) {
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isFav, setIsFav] = useState(isFavorite)
  const [favLoading, setFavLoading] = useState(false)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated || favLoading) return
    setFavLoading(true)
    try {
      if (isFav) {
        await storeApi.removeFavorito(product.id)
        setIsFav(false)
        onFavoriteToggle?.(product.id, false)
      } else {
        await storeApi.addFavorito(product.id)
        setIsFav(true)
        onFavoriteToggle?.(product.id, true)
      }
    } catch {
      // Silently fail
    } finally {
      setFavLoading(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.cotizable || !product.precio) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.nombre,
      price: product.precio,
      image: product.imagen || '',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/tienda/${product.slug}`} className="block group">
        <div className="relative bg-[#111113] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1D]">
            {product.imagen ? (
              <motion.img
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.6 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center diagonal-lines">
                <span className="text-white/5 text-6xl font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
              </div>
            )}

            {/* Overlay on hover */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-transparent"
            />

            {/* Category Badge */}
            {product.categoria_nombre && (
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-[#0A0A0B]/60 backdrop-blur-sm text-[#D4A853] text-[10px] font-semibold tracking-wider uppercase rounded-full border border-[#D4A853]/20">
                  {product.categoria_nombre}
                </span>
              </div>
            )}

            {/* Favorite Heart */}
            {isAuthenticated && (
              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0A0A0B]/60 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-red-400/30 transition-all duration-300 z-10 disabled:opacity-50"
              >
                <motion.svg
                  animate={isFav ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`w-4 h-4 transition-colors duration-300 ${isFav ? 'text-red-400 fill-red-400' : 'text-[#8A8A8A]'}`}
                  viewBox="0 0 24 24"
                  fill={isFav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </motion.svg>
              </button>
            )}

            {/* Quick add button */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-3 right-3"
            >
              {product.cotizable || !product.precio ? (
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-[#FAFAFA] text-xs font-medium rounded-full border border-white/10">
                  Cotizar
                </span>
              ) : product.opciones && product.opciones.length > 0 ? (
                <span className="px-4 py-2 bg-[#D4A853] text-[#0A0A0B] text-xs font-bold rounded-full shadow-[0_0_15px_rgba(212,168,83,0.3)] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Ver Opciones
                </span>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="px-4 py-2 bg-[#D4A853] text-[#0A0A0B] text-xs font-bold rounded-full hover:bg-[#E8C776] transition-colors duration-200 shadow-[0_0_15px_rgba(212,168,83,0.3)] flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar
                </button>
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-[#FAFAFA] font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[#D4A853] transition-colors duration-300" style={{ fontFamily: 'var(--font-clash-display)' }}>
              {product.nombre}
            </h3>
            <div className="flex items-center justify-between">
              {product.cotizable || !product.precio ? (
                <span className="px-3 py-1 bg-[#D4A853]/10 text-[#D4A853] text-xs font-semibold rounded-full border border-[#D4A853]/20">
                  Solicitar Cotizacion
                </span>
              ) : (
                <div>
                  <span className="text-[#D4A853] font-bold text-lg font-mono">
                    ${Number(product.precio).toFixed(2)}
                  </span>
                  {product.precio && (tasa_bcv ?? 0) > 0 && (
                    <span className="text-[#8A8A8A] text-xs block mt-0.5">
                      {formatBs(product.precio, tasa_bcv!)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Gold bottom line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.div>
  )
}
