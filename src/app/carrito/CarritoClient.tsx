'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/components/store/CartProvider'
import storeApi from '@/lib/store-api'

export default function CarritoClient() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = getTotal()
  const shipping: number = 0 // Free for now
  const total = subtotal - discount + shipping

  const [couponLoading, setCouponLoading] = useState(false)

  const handleApplyCoupon = async () => {
    setCouponError('')
    if (!couponCode.trim()) {
      setCouponError('Ingresa un codigo de cupon')
      return
    }
    setCouponLoading(true)
    try {
      const response = await storeApi.validarCupon(couponCode) as any
      const data = response?.data !== undefined ? response.data : response
      if (data?.valido || data?.valid) {
        const pct = data.porcentaje || data.descuento || 10
        setDiscount(subtotal * (pct / 100))
        setCouponApplied(true)
      } else {
        setCouponError(data?.mensaje || data?.message || 'Cupon invalido o expirado')
        setDiscount(0)
        setCouponApplied(false)
      }
    } catch {
      // Fallback: check demo coupon
      if (couponCode.toUpperCase() === 'TITANES10') {
        setDiscount(subtotal * 0.10)
        setCouponApplied(true)
      } else {
        setCouponError('Cupon invalido o expirado')
        setDiscount(0)
        setCouponApplied(false)
      }
    } finally {
      setCouponLoading(false)
    }
  }

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

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-12 h-px bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
              Tu Carrito
            </span>
            <span className="w-12 h-px bg-[#D4A853]" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-[#FAFAFA] tracking-tight"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            Carrito de <span className="text-gradient-gold">Compras</span>
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#8A8A8A]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-[#8A8A8A] text-lg mb-2">Tu carrito esta vacio</p>
            <p className="text-[#6A6A6A] text-sm mb-8">Agrega productos desde nuestra tienda</p>
            <Link href="/tienda">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.3)]"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                Explorar Tienda
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 sm:gap-6 p-4 sm:p-5 bg-[#111113] rounded-xl border border-white/5 group hover:border-white/10 transition-colors duration-300"
                >
                  {/* Image */}
                  <Link href={`/tienda/${item.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#1A1A1D] overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center diagonal-lines">
                          <span className="text-white/10 text-2xl font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/tienda/${item.slug}`}>
                      <h3 className="text-[#FAFAFA] font-semibold text-sm sm:text-base hover:text-[#D4A853] transition-colors truncate">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-[#D4A853] font-bold text-lg mt-1 font-mono">${item.price.toFixed(2)}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-0 bg-white/5 rounded-lg border border-white/5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#FAFAFA] text-sm transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-[#FAFAFA] font-mono text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#FAFAFA] text-sm transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal + Remove */}
                      <div className="flex items-center gap-4">
                        <span className="text-[#FAFAFA] font-bold font-mono text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-[#6A6A6A] hover:text-red-400 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear cart */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="text-[#6A6A6A] text-xs hover:text-red-400 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 bg-[#111113] rounded-xl border border-white/5 p-6 space-y-5">
                <h3 className="text-[#FAFAFA] font-bold text-lg" style={{ fontFamily: 'var(--font-clash-display)' }}>
                  Resumen del Pedido
                </h3>

                {/* Coupon */}
                <div>
                  <label className="text-[#8A8A8A] text-xs mb-2 block">Cupon de Descuento</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError('') }}
                      placeholder="Codigo"
                      disabled={couponApplied}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 disabled:opacity-50"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || couponLoading}
                      className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-[#8A8A8A] hover:bg-white/10 hover:text-[#FAFAFA] transition-colors disabled:opacity-50 min-w-[80px] flex items-center justify-center"
                    >
                      {couponLoading ? (
                        <div className="w-4 h-4 border-2 border-[#8A8A8A] border-t-transparent rounded-full animate-spin" />
                      ) : couponApplied ? 'Aplicado' : 'Aplicar'}
                    </button>
                  </div>
                  {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                  {couponApplied && <p className="text-green-400 text-xs mt-1">Cupon aplicado: -10%</p>}
                </div>

                <div className="w-full h-px bg-white/5" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A8A8A] text-sm">Subtotal</span>
                    <span className="text-[#FAFAFA] font-mono text-sm">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-sm">Descuento</span>
                      <span className="text-green-400 font-mono text-sm">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A8A8A] text-sm">Envio</span>
                    <span className="text-[#8A8A8A] font-mono text-sm">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  <div className="flex items-center justify-between">
                    <span className="text-[#FAFAFA] font-bold">Total</span>
                    <span className="text-[#D4A853] font-black text-xl font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.3)]"
                    style={{ fontFamily: 'var(--font-clash-display)' }}
                  >
                    Proceder al Checkout
                  </motion.button>
                </Link>

                <Link href="/tienda" className="block text-center text-[#8A8A8A] text-sm hover:text-[#D4A853] transition-colors">
                  Seguir Comprando
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}
