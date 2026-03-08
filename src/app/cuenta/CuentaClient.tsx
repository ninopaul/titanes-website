'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'
import Navbar from '@/components/Navbar'

const DEMO_ORDERS = [
  { id: 1001, fecha: '2026-03-04', estado: 'en_produccion', total: 125.00, items: 3 },
  { id: 1002, fecha: '2026-03-01', estado: 'entregado', total: 45.50, items: 1 },
  { id: 1003, fecha: '2026-02-28', estado: 'entregado', total: 230.00, items: 5 },
]

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pendiente: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendiente' },
  confirmado: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Confirmado' },
  en_produccion: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'En Produccion' },
  listo: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Listo' },
  entregado: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Entregado' },
  cancelado: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Cancelado' },
}

export default function CuentaClient() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [orders, setOrders] = useState(DEMO_ORDERS)
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/cuenta')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isAuthenticated) return
    async function fetchOrders() {
      setOrdersLoading(true)
      try {
        const response = await storeApi.getMisPedidos() as any
        const data = response?.data !== undefined ? response.data : response
        const items = Array.isArray(data) ? data : (data?.results || [])
        if (items.length > 0 || data !== undefined) {
          const mapped = items.map((o: any) => ({
            ...o,
            total: Number(o.total_usd || o.total || 0),
            fecha: o.created_at ? new Date(o.created_at).toLocaleDateString('es-VE') : (o.fecha || ''),
            items_count: o.items_count ?? o.items?.length ?? 0,
          }))
          setOrders(mapped)
        }
      } catch {
        // Keep demo data as fallback
      } finally {
        setOrdersLoading(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const activeOrders = orders.filter(o => !['entregado', 'cancelado'].includes(o.estado)).length
  const lastOrder = orders[0]

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Back Nav */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-full text-[#8A8A8A] hover:text-[#D4A853] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Inicio</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-black text-[#FAFAFA] mb-2" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Hola, <span className="text-gradient-gold">{user?.nombre || 'Cliente'}</span>
          </h1>
          <p className="text-[#8A8A8A] text-sm">Bienvenido a tu panel de cliente</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Pedidos', value: orders.length, icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            )},
            { label: 'Pedidos Activos', value: activeOrders, icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )},
            { label: 'Ultimo Pedido', value: `#${lastOrder?.id || '-'}`, icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )},
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111113] rounded-xl border border-white/5 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#D4A853]/10 flex items-center justify-center text-[#D4A853]">
                  {stat.icon}
                </div>
                <span className="text-[#8A8A8A] text-xs">{stat.label}</span>
              </div>
              <p className="text-[#FAFAFA] text-2xl font-black font-mono" style={{ fontFamily: 'var(--font-clash-display)' }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/cuenta/pedidos">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#111113] rounded-xl border border-white/5 p-5 hover:border-[#D4A853]/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A853]/10 flex items-center justify-center text-[#D4A853]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#FAFAFA] font-semibold text-sm">Mis Pedidos</p>
                    <p className="text-[#8A8A8A] text-xs">Ver historial y rastrear</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[#8A8A8A] group-hover:text-[#D4A853] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </Link>
          <Link href="/cuenta/perfil">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#111113] rounded-xl border border-white/5 p-5 hover:border-[#D4A853]/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A853]/10 flex items-center justify-center text-[#D4A853]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#FAFAFA] font-semibold text-sm">Mi Perfil</p>
                    <p className="text-[#8A8A8A] text-xs">Editar datos personales</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[#8A8A8A] group-hover:text-[#D4A853] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#FAFAFA] font-bold text-lg" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Pedidos Recientes
            </h2>
            <Link href="/cuenta/pedidos" className="text-[#D4A853] text-xs hover:text-[#E8C776] transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order, i) => {
              const style = STATUS_STYLES[order.estado] || STATUS_STYLES.pendiente
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link href={`/cuenta/pedidos/${order.id}`}>
                    <div className="bg-[#111113] rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all duration-200 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-[#FAFAFA] font-mono font-bold text-sm">#{order.id}</span>
                          <span className="text-[#8A8A8A] text-xs">{order.fecha}</span>
                          <span className={`px-2.5 py-0.5 ${style.bg} ${style.text} text-[10px] font-semibold rounded-full`}>
                            {style.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[#FAFAFA] font-mono text-sm">${Number(order.total || 0).toFixed(2)}</span>
                          <svg className="w-4 h-4 text-[#6A6A6A] group-hover:text-[#D4A853] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => { logout(); router.push('/') }}
            className="text-[#6A6A6A] text-xs hover:text-red-400 transition-colors"
          >
            Cerrar Sesion
          </button>
        </div>
      </div>
    </main>
    </>
  )
}
