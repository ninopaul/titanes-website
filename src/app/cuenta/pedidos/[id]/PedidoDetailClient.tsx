'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'
import OrderTracker from '@/components/store/OrderTracker'
import Navbar from '@/components/Navbar'

const DEMO_ORDER = {
  id: 1001,
  fecha: '2026-03-04',
  estado: 'en_produccion',
  total: 125.00,
  subtotal: 120.00,
  envio: 5.00,
  metodo_pago: 'Pago Movil',
  tipo_entrega: 'Envio a Domicilio',
  direccion: 'Av. Bolivar Norte, C.C. Hiper Jumbo, Piso 2, Valencia, Carabobo',
  fecha_estimada: '2026-03-08',
  timestamps: {
    recibido: '04/03 10:30 AM',
    confirmado: '04/03 11:15 AM',
  },
  items: [
    { id: 1, nombre: 'Banner 13oz por Metro', cantidad: 5, precio: 12.50, imagen: null },
    { id: 2, nombre: 'Vinil Adhesivo por M2', cantidad: 2, precio: 15.00, imagen: null },
    { id: 3, nombre: 'Laminado Mate', cantidad: 5, precio: 2.00, imagen: null },
  ],
}

export default function PedidoDetailClient() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const orderId = params?.id
  const [order, setOrder] = useState(DEMO_ORDER)
  const [orderLoading, setOrderLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/cuenta/pedidos')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isAuthenticated || !orderId) return
    async function fetchOrder() {
      setOrderLoading(true)
      try {
        const response = await storeApi.getMiPedido(Number(orderId)) as any
        const data = response?.data !== undefined ? response.data : response
        if (data && data.id) {
          setOrder(data)
        }
      } catch {
        // Keep demo data as fallback
      } finally {
        setOrderLoading(false)
      }
    }
    fetchOrder()
  }, [isAuthenticated, orderId])

  if (isLoading || orderLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Back Nav */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/cuenta/pedidos">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-full text-[#8A8A8A] hover:text-[#D4A853] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Pedidos</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black text-[#FAFAFA] font-mono" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Pedido #{orderId}
            </h1>
          </div>
          <p className="text-[#8A8A8A] text-sm">Creado el {order.fecha}</p>
        </motion.div>

        {/* Order Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111113] rounded-xl border border-white/5 p-6 mb-6"
        >
          <h2 className="text-[#FAFAFA] font-bold text-sm mb-4" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Estado del Pedido
          </h2>
          <OrderTracker currentStatus={order.estado} timestamps={order.timestamps} />
          {order.fecha_estimada && (
            <p className="text-[#8A8A8A] text-xs mt-4 text-center">
              Entrega estimada: <span className="text-[#D4A853] font-mono">{order.fecha_estimada}</span>
            </p>
          )}
        </motion.div>

        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111113] rounded-xl border border-white/5 p-6 mb-6"
        >
          <h2 className="text-[#FAFAFA] font-bold text-sm mb-4" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Productos
          </h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                <div className="w-14 h-14 rounded-lg bg-[#1A1A1D] overflow-hidden flex-shrink-0">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center diagonal-lines">
                      <span className="text-white/10 text-sm font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#FAFAFA] text-sm font-medium truncate">{item.nombre}</p>
                  <p className="text-[#8A8A8A] text-xs">
                    {item.cantidad} x ${Number(item.precio || 0).toFixed(2)}
                  </p>
                </div>
                <span className="text-[#FAFAFA] font-mono text-sm font-bold">
                  ${(item.cantidad * Number(item.precio || 0)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8A8A8A]">Subtotal</span>
              <span className="text-[#FAFAFA] font-mono">${Number(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8A8A8A]">Envio</span>
              <span className="text-[#FAFAFA] font-mono">{Number(order.envio || 0) === 0 ? 'Gratis' : `$${Number(order.envio).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5">
              <span className="text-[#FAFAFA]">Total</span>
              <span className="text-[#D4A853] text-lg font-mono">${Number(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment + Shipping info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#111113] rounded-xl border border-white/5 p-5"
          >
            <h3 className="text-[#FAFAFA] font-bold text-sm mb-3" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Pago
            </h3>
            <p className="text-[#8A8A8A] text-sm">Metodo: <span className="text-[#FAFAFA]">{order.metodo_pago}</span></p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#111113] rounded-xl border border-white/5 p-5"
          >
            <h3 className="text-[#FAFAFA] font-bold text-sm mb-3" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Entrega
            </h3>
            <p className="text-[#8A8A8A] text-sm">Tipo: <span className="text-[#FAFAFA]">{order.tipo_entrega}</span></p>
            {order.direccion && (
              <p className="text-[#8A8A8A] text-xs mt-1">{order.direccion}</p>
            )}
          </motion.div>
        </div>
      </div>
    </main>
    </>
  )
}
