'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'
import Navbar from '@/components/Navbar'

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pendiente: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendiente' },
  pendiente_pago: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendiente de Pago' },
  verificando: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Verificando Pago' },
  confirmado: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Confirmado' },
  en_produccion: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'En Produccion' },
  listo: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Listo' },
  entregado: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Entregado' },
  cancelado: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Cancelado' },
}

interface OrdenERP {
  id: number
  numero_orden: string
  estado_cliente: string
  estado_display: string
  fecha: string
  total: number
  items_count: number
  items_resumen: string[]
}

interface PedidoWeb {
  id: number
  numero_pedido: string
  estado: string
  fecha: string
  total: number
  items_count: number
}

function OrderCardShell({ children, href, delay }: { children: React.ReactNode; href: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link href={href}>
        <div className="bg-[#111113] rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all duration-200 group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {children}
            <svg className="hidden sm:block w-4 h-4 text-[#6A6A6A] group-hover:text-[#D4A853] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function BoxIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-[#8A8A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-[#111113] rounded-xl border border-white/5 p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-3 bg-white/5 rounded w-1/4" />
            </div>
            <div className="h-4 bg-white/5 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PedidosClient() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [ordenes, setOrdenes] = useState<OrdenERP[]>([])
  const [pedidosWeb, setPedidosWeb] = useState<PedidoWeb[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/cuenta/pedidos')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isAuthenticated) return
    async function fetchAll() {
      setOrdersLoading(true)
      setLoadError(false)
      // Ordenes ERP (todas: mostrador, WhatsApp y web convertidas)
      const pOrdenes = storeApi.getMisOrdenes()
        .then((r: any) => {
          const data = Array.isArray(r?.data) ? r.data : []
          setOrdenes(data.map((o: any) => ({
            id: o.id,
            numero_orden: o.numero_orden,
            estado_cliente: o.estado_cliente,
            estado_display: o.estado_display,
            fecha: o.created_at ? new Date(o.created_at).toLocaleDateString('es-VE') : '',
            total: Number(o.total || 0),
            items_count: o.items_count ?? 0,
            items_resumen: o.items_resumen || [],
          })))
        })
        .catch(() => setLoadError(true))
      // Pedidos nacidos en la tienda web (aun no convertidos en orden)
      const pPedidos = storeApi.getMisPedidos()
        .then((r: any) => {
          const data = r?.data !== undefined ? r.data : r
          const items = Array.isArray(data) ? data : (data?.results || [])
          setPedidosWeb(items.map((o: any) => ({
            id: o.id,
            numero_pedido: o.numero_pedido || `#${o.id}`,
            estado: o.estado,
            fecha: o.created_at ? new Date(o.created_at).toLocaleDateString('es-VE') : '',
            total: Number(o.total_usd || o.total || 0),
            items_count: o.items_count ?? o.items?.length ?? 0,
          })))
        })
        .catch(() => { /* seccion opcional: sin pedidos web no es error fatal */ })
      await Promise.allSettled([pOrdenes, pPedidos])
      setOrdersLoading(false)
    }
    fetchAll()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const isEmpty = ordenes.length === 0 && pedidosWeb.length === 0

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Back Nav */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/cuenta">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-full text-[#8A8A8A] hover:text-[#D4A853] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Mi Cuenta</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-[#FAFAFA]" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Mis <span className="text-gradient-gold">Ordenes</span>
          </h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Estatus de todas tus ordenes y pedidos</p>
        </motion.div>

        {ordersLoading ? (
          <LoadingSkeleton />
        ) : loadError && isEmpty ? (
          <div className="text-center py-20">
            <p className="text-[#8A8A8A] text-sm mb-1">No pudimos cargar tus ordenes en este momento.</p>
            <p className="text-[#6A6A6A] text-xs">Intenta de nuevo en unos minutos o contactanos por WhatsApp.</p>
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#8A8A8A]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[#8A8A8A] text-sm mb-1">No encontramos ordenes asociadas a tu cuenta</p>
            <Link href="/tienda" className="text-[#D4A853] text-sm hover:text-[#E8C776] transition-colors">
              Explorar Tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Ordenes ERP */}
            {ordenes.length > 0 && (
              <section>
                <h2 className="text-[#8A8A8A] text-xs font-semibold uppercase tracking-wider mb-3">
                  Ordenes de Produccion
                </h2>
                <div className="space-y-3">
                  {ordenes.map((orden, i) => {
                    const style = STATUS_STYLES[orden.estado_cliente] || STATUS_STYLES.confirmado
                    return (
                      <OrderCardShell key={`o-${orden.id}`} href={`/cuenta/ordenes/${orden.id}`} delay={i * 0.05}>
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <BoxIcon />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[#FAFAFA] font-mono font-bold text-sm">{orden.numero_orden}</span>
                              <span className={`px-2.5 py-0.5 ${style.bg} ${style.text} text-[10px] font-semibold rounded-full`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-[#8A8A8A] text-xs mt-0.5 truncate">
                              {orden.fecha} &middot; {orden.items_count} {orden.items_count === 1 ? 'item' : 'items'}
                              {orden.items_resumen.length > 0 && <> &middot; {orden.items_resumen[0]}</>}
                            </p>
                          </div>
                        </div>
                        <span className="text-[#FAFAFA] font-bold font-mono sm:ml-auto sm:mr-3">${orden.total.toFixed(2)}</span>
                      </OrderCardShell>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Pedidos tienda web */}
            {pedidosWeb.length > 0 && (
              <section>
                <h2 className="text-[#8A8A8A] text-xs font-semibold uppercase tracking-wider mb-3">
                  Pedidos de la Tienda Web
                </h2>
                <div className="space-y-3">
                  {pedidosWeb.map((pedido, i) => {
                    const style = STATUS_STYLES[pedido.estado] || STATUS_STYLES.pendiente
                    return (
                      <OrderCardShell key={`p-${pedido.id}`} href={`/cuenta/pedidos/${pedido.id}`} delay={i * 0.05}>
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <BoxIcon />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[#FAFAFA] font-mono font-bold text-sm">{pedido.numero_pedido}</span>
                              <span className={`px-2.5 py-0.5 ${style.bg} ${style.text} text-[10px] font-semibold rounded-full`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-[#8A8A8A] text-xs mt-0.5">
                              {pedido.fecha} &middot; {pedido.items_count} {pedido.items_count === 1 ? 'producto' : 'productos'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[#FAFAFA] font-bold font-mono sm:ml-auto sm:mr-3">${pedido.total.toFixed(2)}</span>
                      </OrderCardShell>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
    </>
  )
}
