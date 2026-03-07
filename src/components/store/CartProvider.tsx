'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface CartItem {
  productId: number
  slug: string
  name: string
  price: number
  quantity: number
  image: string
  options?: Record<string, string>  // e.g. { "Tamaño": "Grande", "Material": "PVC" }
}

// Helper: generate unique key for a cart item (productId + options combo)
function cartItemKey(productId: number, options?: Record<string, string>): string {
  return options && Object.keys(options).length > 0
    ? `${productId}:${JSON.stringify(options)}`
    : `${productId}`
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: number, options?: Record<string, string>) => void
  updateQuantity: (productId: number, quantity: number, options?: Record<string, string>) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'titanes-cart'

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(CART_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function storeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(getStoredCart())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      storeCart(items)
    }
  }, [items, mounted])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems(prev => {
      const key = cartItemKey(item.productId, item.options)
      const existing = prev.find(i => cartItemKey(i.productId, i.options) === key)
      if (existing) {
        return prev.map(i =>
          cartItemKey(i.productId, i.options) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { ...item, quantity }]
    })
    setIsCartOpen(true)
  }, [])

  const removeItem = useCallback((productId: number, options?: Record<string, string>) => {
    const key = cartItemKey(productId, options)
    setItems(prev => prev.filter(i => cartItemKey(i.productId, i.options) !== key))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number, options?: Record<string, string>) => {
    const key = cartItemKey(productId, options)
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => cartItemKey(i.productId, i.options) !== key))
      return
    }
    setItems(prev => prev.map(i =>
      cartItemKey(i.productId, i.options) === key ? { ...i, quantity } : i
    ))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
