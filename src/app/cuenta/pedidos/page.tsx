'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const DEMO_ORDERS = [
  { id: 1001, fecha: '2026-03-04', estado: 'en_produccion', total: 125.00, items_count: 3 },
  { id: 1002, fecha: '2026-03-01', estado: 'entregado', total: 45.50, items_count: 1 },
  { id: 1003, fecha: '2026-02-28', estado: 'entregado', total: 230.00, items_count: 5 },
  { id: 1004, fecha: '2026-02-20', estado: 'cancelado', total: 15.00, items_count: 1 },
  { id: 1005, fecha: '2026-02-15', estado: 'entregado', total: 89.00, items_count: 2 },
]

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pendiente: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendiente' },
  confirmado: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Confirmado' },
  en_produccion: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'En Produccion' },
  listo: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Listo' },
  entregado: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Entregado' },
  cancelado: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Cancelado' },
}

export default function PedidosPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/cuenta/pedidos')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
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
            Mis <span className="text-gradient-gold">Pedidos</span>
          </h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Historial completo de tus pedidos</p>
        </motion.div>

        {DEMO_ORDERS.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#8A8A8A]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[#8A8A8A] text-sm mb-1">No tienes pedidos aun</p>
            <Link href="/tienda" className="text-[#D4A853] text-sm hover:text-[#E8C776] transition-colors">
              Explorar Tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {DEMO_ORDERS.map((order, i) => {
              const style = STATUS_STYLES[order.estado] || STATUS_STYLES.pendiente
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/cuenta/pedidos/${order.id}`}>
                    <div className="bg-[#111113] rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all duration-200 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#8A8A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#FAFAFA] font-mono font-bold text-sm">#{order.id}</span>
                              <span className={`px-2.5 py-0.5 ${style.bg} ${style.text} text-[10px] font-semibold rounded-full`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-[#8A8A8A] text-xs mt-0.5">
                              {order.fecha} &middot; {order.items_count} {order.items_count === 1 ? 'producto' : 'productos'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:ml-auto">
                          <span className="text-[#FAFAFA] font-bold font-mono">${order.total.toFixed(2)}</span>
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
        )}
      </div>
    </main>
  )
}
