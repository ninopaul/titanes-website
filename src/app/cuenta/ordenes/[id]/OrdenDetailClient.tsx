'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'
import OrderTracker from '@/components/store/OrderTracker'
import Navbar from '@/components/Navbar'

// Refresco silencioso del estatus (mismo intervalo que el pedido web)
const POLL_INTERVAL_MS = 15 * 60 * 1000

interface OrdenItem {
  descripcion: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface OrdenDetalle {
  id: number
  numero_orden: string
  estado_cliente: string
  estado_display: string
  estado_pago: string
  estado_pago_display: string
  fecha: string
  fecha_entrega: string
  total: number
  descripcion: string
  nota_envio: string
  items: OrdenItem[]
}

export default function OrdenDetailClient() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const ordenId = params?.id
  const [orden, setOrden] = useState<OrdenDetalle | null>(null)
  const [ordenLoading, setOrdenLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=/cuenta/ordenes/${ordenId ?? ''}`)
    }
  }, [isAuthenticated, isLoading, router, ordenId])

  const fetchOrden = useCallback(async (showLoading = true) => {
    if (!isAuthenticated || !ordenId) return
    if (showLoading) setOrdenLoading(true)
    try {
      const response = await storeApi.getMiOrden(Number(ordenId)) as any
      const data = response?.data
      if (data && data.id) {
        setOrden({
          id: data.id,
          numero_orden: data.numero_orden,
          estado_cliente: data.estado_cliente,
          estado_display: data.estado_display,
          estado_pago: data.estado_pago,
          estado_pago_display: data.estado_pago_display,
          fecha: data.created_at ? new Date(data.created_at).toLocaleDateString('es-VE') : '',
          fecha_entrega: data.fecha_entrega ? new Date(data.fecha_entrega).toLocaleDateString('es-VE') : '',
          total: Number(data.total || 0),
          descripcion: data.descripcion || '',
          nota_envio: data.nota_envio || '',
          items: (data.items || []).map((item: any) => ({
            descripcion: item.descripcion || 'Item',
            cantidad: Number(item.cantidad || 0),
            precio_unitario: Number(item.precio_unitario || 0),
            subtotal: Number(item.subtotal || 0),
          })),
        })
        setNotFound(false)
      }
    } catch {
      setNotFound(true)
    } finally {
      if (showLoading) setOrdenLoading(false)
    }
  }, [isAuthenticated, ordenId])

  useEffect(() => {
    fetchOrden()
    const timer = setInterval(() => fetchOrden(false), POLL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [fetchOrden])

  if (isLoading || (ordenLoading && !orden)) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (notFound && !orden) {
    return (
      <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#8A8A8A] text-sm mb-3">No encontramos esta orden en tu cuenta.</p>
          <Link href="/cuenta/pedidos" className="text-[#D4A853] text-sm hover:text-[#E8C776] transition-colors">
            Volver a mis ordenes
          </Link>
        </div>
      </main>
      </>
    )
  }

  if (!orden) return null

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
            <span className="text-sm font-medium">Mis Ordenes</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-[#FAFAFA] font-mono">{orden.numero_orden}</h1>
            <span className="px-3 py-1 bg-[#D4A853]/10 text-[#D4A853] text-xs font-semibold rounded-full">
              {orden.estado_display}
            </span>
          </div>
          <p className="text-[#8A8A8A] text-sm mt-1">
            Creada el {orden.fecha}
            {orden.fecha_entrega && <> &middot; Entrega estimada: {orden.fecha_entrega}</>}
          </p>
        </motion.div>

        {/* Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111113] rounded-2xl border border-white/5 px-6 py-2 mb-6"
        >
          <OrderTracker currentStatus={orden.estado_cliente} />
        </motion.div>

        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111113] rounded-2xl border border-white/5 p-6 mb-6"
        >
          <h2 className="text-[#8A8A8A] text-xs font-semibold uppercase tracking-wider mb-4">Detalle</h2>
          {orden.descripcion && (
            <p className="text-[#FAFAFA] text-sm mb-4">{orden.descripcion}</p>
          )}
          {orden.items.length > 0 && (
            <div className="space-y-3">
              {orden.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
                  <div className="min-w-0">
                    <p className="text-[#FAFAFA] text-sm truncate">{item.descripcion}</p>
                    <p className="text-[#8A8A8A] text-xs mt-0.5">
                      {item.cantidad} x ${item.precio_unitario.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-[#FAFAFA] font-mono text-sm">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          {orden.nota_envio && (
            <div className="mt-4 p-3 bg-white/5 rounded-xl">
              <p className="text-[#8A8A8A] text-xs">Nota de envio: <span className="text-[#FAFAFA]">{orden.nota_envio}</span></p>
            </div>
          )}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
            <div>
              <span className="text-[#8A8A8A] text-sm">Total</span>
              <span className={`ml-3 px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${
                orden.estado_pago === 'pagado'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                {orden.estado_pago_display}
              </span>
            </div>
            <span className="text-[#FAFAFA] font-bold font-mono text-lg">${orden.total.toFixed(2)}</span>
          </div>
        </motion.div>

        <p className="text-[#6A6A6A] text-xs text-center">
          El estatus se actualiza automaticamente. Cualquier duda escribenos por WhatsApp.
        </p>
      </div>
    </main>
    </>
  )
}
