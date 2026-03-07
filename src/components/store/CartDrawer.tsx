'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCart } from './CartProvider'

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, getTotal, getItemCount } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeCart()
      }
    }
    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isCartOpen, closeCart])

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [closeCart])

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-[#111113] border-l border-white/5 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4A853]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-[#FAFAFA] font-bold text-lg" style={{ fontFamily: 'var(--font-clash-display)' }}>
                  Tu Carrito
                </h2>
                {getItemCount() > 0 && (
                  <span className="px-2.5 py-0.5 bg-[#D4A853]/20 text-[#D4A853] text-xs font-bold rounded-full">
                    {getItemCount()}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-[#8A8A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-[#8A8A8A]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-[#8A8A8A] text-sm mb-1">Tu carrito esta vacio</p>
                  <p className="text-[#6A6A6A] text-xs mb-6">Agrega productos para comenzar</p>
                  <button
                    onClick={closeCart}
                    className="text-[#D4A853] text-sm font-medium hover:text-[#E8C776] transition-colors"
                  >
                    Explorar Tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const itemKey = item.options && Object.keys(item.options).length > 0
                      ? `${item.productId}:${JSON.stringify(item.options)}`
                      : `${item.productId}`
                    return (
                      <motion.div
                        key={itemKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-3 bg-white/[0.02] rounded-xl border border-white/5 group hover:border-white/10 transition-colors duration-200"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-lg bg-[#1A1A1D] overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center diagonal-lines">
                              <span className="text-white/10 text-lg font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#FAFAFA] text-sm font-medium truncate">{item.name}</h3>

                          {/* Selected options */}
                          {item.options && Object.keys(item.options).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(item.options).map(([key, val]) => (
                                <span key={key} className="px-2 py-0.5 bg-white/5 text-[#8A8A8A] text-[10px] rounded-md border border-white/5">
                                  {key}: {val}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-[#D4A853] text-sm font-bold mt-1">${item.price.toFixed(2)}</p>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.options)}
                              className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8A8A8A] text-xs transition-colors"
                            >
                              -
                            </button>
                            <span className="text-[#FAFAFA] text-xs font-mono w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.options)}
                              className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8A8A8A] text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productId, item.options)}
                          className="self-start p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8A8A] text-sm">Subtotal</span>
                  <span className="text-[#FAFAFA] text-lg font-bold font-mono">${getTotal().toFixed(2)}</span>
                </div>
                <Link href="/checkout" onClick={closeCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.3)]"
                    style={{ fontFamily: 'var(--font-clash-display)' }}
                  >
                    Ir al Checkout
                  </motion.button>
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-[#8A8A8A] text-sm hover:text-[#D4A853] transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
