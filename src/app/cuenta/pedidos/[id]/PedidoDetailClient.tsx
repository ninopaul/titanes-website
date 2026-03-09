'use client'

import { useState, useEffect, useCallback } from 'react'
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
    { id: 1, nombre: 'Banner 13oz por Metro', cantidad: 5, precio: 12.50, imagen: null as string | null, unidad_medida: 'ml' as string, medidas: [] as any[], item_subtotal: 62.50 },
    { id: 2, nombre: 'Vinil Adhesivo por M2', cantidad: 2, precio: 15.00, imagen: null as string | null, unidad_medida: 'mts2' as string, medidas: [] as any[], item_subtotal: 30.00 },
    { id: 3, nombre: 'Laminado Mate', cantidad: 5, precio: 2.00, imagen: null as string | null, unidad_medida: 'unidad' as string, medidas: [] as any[], item_subtotal: 10.00 },
  ],
}

export default function PedidoDetailClient() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const orderId = params?.id
  const [order, setOrder] = useState(DEMO_ORDER)
  const [orderLoading, setOrderLoading] = useState(true)
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null)
  const [comprobanteUploading, setComprobanteUploading] = useState(false)
  const [comprobanteUploaded, setComprobanteUploaded] = useState(false)
  const [comprobanteError, setComprobanteError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/cuenta/pedidos')
    }
  }, [isAuthenticated, isLoading, router])

  const fetchOrder = useCallback(async (showLoading = true) => {
    if (!isAuthenticated || !orderId) return
    if (showLoading) setOrderLoading(true)
    try {
      const response = await storeApi.getMiPedido(Number(orderId)) as any
      const data = response?.data !== undefined ? response.data : response
      if (data && data.id) {
        // Map API field names to what the component expects
        const mapped = {
          ...data,
          total: Number(data.total_usd || data.total || 0),
          subtotal: Number(data.subtotal || 0),
          envio: Number(data.envio || 0),
          fecha: data.created_at ? new Date(data.created_at).toLocaleDateString('es-VE') : (data.fecha || ''),
          metodo_pago: data.metodo_pago_display || data.metodo_pago || '',
          tipo_entrega: data.tipo_entrega_display || data.tipo_entrega || '',
          direccion: data.direccion_envio || data.direccion || '',
          fecha_estimada: data.fecha_estimada_entrega || data.fecha_estimada || null,
          items: (data.items || []).map((item: any) => ({
            ...item,
            nombre: item.producto_nombre || item.nombre || 'Producto',
            precio: Number(item.precio_unitario || item.precio || 0),
            item_subtotal: Number(item.subtotal || 0),
            imagen: item.imagen || null,
            medidas: item.medidas || [],
            unidad_medida: item.unidad_medida || 'unidad',
          })),
        }
        setOrder(mapped)
      }
    } catch {
      // Keep demo data as fallback
    } finally {
      if (showLoading) setOrderLoading(false)
    }
  }, [isAuthenticated, orderId])

  // Initial fetch
  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  // Poll for status updates every 15 minutes
  useEffect(() => {
    if (!isAuthenticated || !orderId) return
    const interval = setInterval(() => {
      fetchOrder(false) // silent fetch, no loading spinner
    }, 15 * 60 * 1000) // 15 minutes
    return () => clearInterval(interval)
  }, [isAuthenticated, orderId, fetchOrder])

  const handleComprobanteUpload = async () => {
    if (!comprobanteFile || !orderId) return
    setComprobanteUploading(true)
    setComprobanteError('')
    try {
      const formData = new FormData()
      formData.append('comprobante', comprobanteFile)
      await storeApi.subirComprobante(Number(orderId), formData)
      setComprobanteUploaded(true)
    } catch (err) {
      setComprobanteError(err instanceof Error ? err.message : 'Error al subir el comprobante')
    } finally {
      setComprobanteUploading(false)
    }
  }

  const handleComprobanteSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setComprobanteError('Formato no permitido. Solo JPG, PNG o PDF.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setComprobanteError('El archivo no debe superar los 10MB.')
      return
    }
    setComprobanteError('')
    setComprobanteFile(file)
  }

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
                    {item.unidad_medida === 'mts2' && '/m²'}
                    {item.unidad_medida === 'ml' && '/ml'}
                  </p>
                  {item.medidas && item.medidas.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {item.medidas.map((m: any, idx: number) => (
                        <p key={idx} className="text-[#8A8A8A] text-xs">
                          {m.ancho}m × {m.alto}m = {(m.ancho * m.alto).toFixed(2)} m²
                          {m.descripcion && <span className="text-[#D4A853]/60 ml-1">({m.descripcion})</span>}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[#FAFAFA] font-mono text-sm font-bold">
                  ${(item.item_subtotal > 0 ? item.item_subtotal : item.cantidad * Number(item.precio || 0)).toFixed(2)}
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

        {/* Comprobante Upload Section */}
        {order.estado !== 'entregado' && order.estado !== 'cancelado' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#111113] rounded-xl border border-white/5 p-6 mt-4"
          >
            <h3 className="text-[#FAFAFA] font-bold text-sm mb-3" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Comprobante de Pago
            </h3>
            {comprobanteUploaded ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-400 font-medium text-sm">Comprobante enviado</p>
                  <p className="text-[#8A8A8A] text-xs mt-0.5">
                    La tasa ha sido congelada al momento de tu pago. Verificaremos tu comprobante lo antes posible.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[#8A8A8A] text-xs mb-4">
                  Adjunta tu comprobante para agilizar la verificacion. Formatos: JPG, PNG o PDF (max. 10MB).
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleComprobanteSelect}
                    className="hidden"
                    id="comprobante-detail-input"
                  />
                  {comprobanteFile ? (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-10 h-10 rounded-lg bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#FAFAFA] text-sm truncate">{comprobanteFile.name}</p>
                        <p className="text-[#8A8A8A] text-xs">{(comprobanteFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={() => { setComprobanteFile(null); setComprobanteError('') }}
                        className="text-[#8A8A8A] hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="comprobante-detail-input"
                      className="flex flex-col items-center gap-2 p-6 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#D4A853]/30 hover:bg-white/[0.02] transition-all duration-300"
                    >
                      <svg className="w-8 h-8 text-[#8A8A8A]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-[#8A8A8A] text-xs">Haz clic para seleccionar tu comprobante</span>
                    </label>
                  )}
                </div>
                {comprobanteError && (
                  <p className="text-red-400 text-xs mt-2">{comprobanteError}</p>
                )}
                {comprobanteFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComprobanteUpload}
                    disabled={comprobanteUploading}
                    className="w-full mt-3 py-3 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ fontFamily: 'var(--font-clash-display)' }}
                  >
                    {comprobanteUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Enviar Comprobante
                      </>
                    )}
                  </motion.button>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Telegram Bot Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <a
            href={`https://t.me/TitanesGraficosBot?start=pedido_${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[#0088cc]/5 border border-[#0088cc]/20 rounded-xl hover:bg-[#0088cc]/10 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#0088cc]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0088cc]/20 transition-colors">
              <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <p className="text-[#FAFAFA] font-medium text-sm">Recibe actualizaciones por Telegram</p>
              <p className="text-[#8A8A8A] text-xs mt-0.5">Conecta con @TitanesGraficosBot para recibir notificaciones de tu pedido</p>
            </div>
            <svg className="w-4 h-4 text-[#8A8A8A] group-hover:text-[#0088cc] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>
      </div>
    </main>
    </>
  )
}
