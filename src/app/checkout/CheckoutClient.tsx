'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/store/CartProvider'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'
import Navbar from '@/components/Navbar'

interface WebMetodoPago {
  id: number
  tipo: string
  tipo_display: string
  nombre_display: string
  banco_nombre: string
  numero_cuenta: string
  titular: string
  cedula_rif: string
  telefono: string
  email: string
  instrucciones: string
  logo_url: string
}

interface WebMetodoEnvio {
  id: number
  nombre: string
  tipo: string
  tipo_display: string
  precio_usd: number
  descripcion_corta: string
  tiempo_estimado: string
}

interface SiteConfig {
  metodos_pago: WebMetodoPago[]
  metodos_envio: WebMetodoEnvio[]
  tasa_bcv: number
  fecha_tasa: string | null
}

export default function CheckoutClient() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [step, setStep] = useState(1)
  const [deliveryType, setDeliveryType] = useState('')
  const [selectedShipping, setSelectedShipping] = useState<WebMetodoEnvio | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [orderError, setOrderError] = useState('')
  const [notas, setNotas] = useState('')
  const [configLoading, setConfigLoading] = useState(true)
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null)
  const [comprobanteUploading, setComprobanteUploading] = useState(false)
  const [comprobanteUploaded, setComprobanteUploaded] = useState(false)
  const [comprobanteError, setComprobanteError] = useState('')

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    metodos_pago: [],
    metodos_envio: [],
    tasa_bcv: 0,
    fecha_tasa: null,
  })

  const [address, setAddress] = useState({
    direccion: '',
    ciudad: '',
    estado: '',
    referencia: '',
  })

  // Load site config for payment methods, shipping, and rates
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await storeApi.getConfig() as any
        const raw = response?.data !== undefined ? response.data : response
        const config: SiteConfig = {
          metodos_pago: raw.metodos_pago || [],
          metodos_envio: raw.metodos_envio || [],
          tasa_bcv: Number(raw.tasa_bcv) || 0,
          fecha_tasa: raw.fecha_tasa || null,
        }
        setSiteConfig(config)

        // Auto-select first shipping and payment method if available
        if (config.metodos_envio.length > 0) {
          setDeliveryType(config.metodos_envio[0].tipo)
          setSelectedShipping(config.metodos_envio[0])
        }
        if (config.metodos_pago.length > 0) {
          setPaymentMethod(config.metodos_pago[0].tipo)
        }
      } catch {
        // Use empty — checkout will show "loading" until config arrives
      } finally {
        setConfigLoading(false)
      }
    }
    loadConfig()
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [isAuthenticated, authLoading, router])

  const subtotal = getTotal()
  const shippingCost = Number(selectedShipping?.precio_usd) || 0
  const totalUsd = subtotal + shippingCost
  const tasaBcv = siteConfig.tasa_bcv
  const totalBs = tasaBcv > 0 ? totalUsd * tasaBcv : 0

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setOrderError('')
    try {
      const orderData = {
        items: items.map(item => ({
          producto_id: item.productId,
          cantidad: item.quantity,
        })),
        tipo_entrega: deliveryType,
        envio_id: selectedShipping?.id || undefined,
        metodo_pago: paymentMethod,
        notas_cliente: notas || undefined,
        ...(deliveryType !== 'retiro' && {
          direccion_envio: address.direccion,
          ciudad_envio: address.ciudad,
          estado_envio: address.estado,
        }),
      }
      const response = await storeApi.crearPedido(orderData) as any
      const data = response?.data !== undefined ? response.data : response
      setOrderNumber(data?.id || data?.numero || null)
      setOrderComplete(true)
      clearCart()
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Error al crear el pedido. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComprobanteUpload = async () => {
    if (!comprobanteFile || !orderNumber) return
    setComprobanteUploading(true)
    setComprobanteError('')
    try {
      const formData = new FormData()
      formData.append('comprobante', comprobanteFile)
      await storeApi.subirComprobante(orderNumber, formData)
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
    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setComprobanteError('Formato no permitido. Solo JPG, PNG o PDF.')
      return
    }
    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setComprobanteError('El archivo no debe superar los 10MB.')
      return
    }
    setComprobanteError('')
    setComprobanteFile(file)
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8A8A8A] mb-4">Tu carrito esta vacio</p>
          <Link href="/tienda" className="text-[#D4A853] hover:text-[#E8C776] font-medium">
            Ir a la Tienda
          </Link>
        </div>
      </main>
    )
  }

  if (orderComplete) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-black text-[#FAFAFA] mb-3" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Pedido Recibido
          </h1>
          {orderNumber && (
            <p className="text-[#D4A853] font-mono font-bold text-lg mb-2">
              Pedido #{orderNumber}
            </p>
          )}
          <p className="text-[#8A8A8A] text-sm mb-6">
            Tu pedido ha sido registrado exitosamente. Te enviaremos un correo con los detalles y podras rastrear el estado desde tu cuenta.
          </p>

          {/* Comprobante Upload Section */}
          {orderNumber && paymentMethod !== 'efectivo' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#111113] rounded-xl border border-white/5 p-5 mb-6 text-left"
            >
              <h3 className="text-[#FAFAFA] font-bold text-sm mb-3" style={{ fontFamily: 'var(--font-clash-display)' }}>
                Sube tu Comprobante de Pago
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
                      id="comprobante-input"
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
                        htmlFor="comprobante-input"
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
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <a
              href={`https://t.me/TitanesGraficosBot?start=pedido_${orderNumber || ''}`}
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cuenta/pedidos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                Ver Mis Pedidos
              </motion.button>
            </Link>
            <Link href="/tienda">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-white/5 text-[#FAFAFA] font-medium text-sm rounded-full border border-white/10"
              >
                Seguir Comprando
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>
    )
  }

  // Helper to render bank/payment details for a given method
  const renderPaymentDetails = (metodo: WebMetodoPago) => {
    switch (metodo.tipo) {
      case 'pago_movil':
        return (
          <div className="space-y-2 text-sm">
            {metodo.banco_nombre && (
              <p className="text-[#8A8A8A]">Banco: <span className="text-[#FAFAFA] font-mono">{metodo.banco_nombre}</span></p>
            )}
            {metodo.telefono && (
              <p className="text-[#8A8A8A]">Telefono: <span className="text-[#FAFAFA] font-mono">{metodo.telefono}</span></p>
            )}
            {metodo.cedula_rif && (
              <p className="text-[#8A8A8A]">Cedula/RIF: <span className="text-[#FAFAFA] font-mono">{metodo.cedula_rif}</span></p>
            )}
          </div>
        )
      case 'transferencia':
        return (
          <div className="space-y-2 text-sm">
            {metodo.banco_nombre && (
              <p className="text-[#8A8A8A]">Banco: <span className="text-[#FAFAFA] font-mono">{metodo.banco_nombre}</span></p>
            )}
            {metodo.numero_cuenta && (
              <p className="text-[#8A8A8A]">Cuenta: <span className="text-[#FAFAFA] font-mono">{metodo.numero_cuenta}</span></p>
            )}
            {metodo.titular && (
              <p className="text-[#8A8A8A]">Titular: <span className="text-[#FAFAFA] font-mono">{metodo.titular}</span></p>
            )}
            {metodo.cedula_rif && (
              <p className="text-[#8A8A8A]">RIF: <span className="text-[#FAFAFA] font-mono">{metodo.cedula_rif}</span></p>
            )}
          </div>
        )
      case 'zelle':
        return (
          <div className="space-y-2 text-sm">
            {metodo.email && (
              <p className="text-[#8A8A8A]">Email: <span className="text-[#FAFAFA] font-mono">{metodo.email}</span></p>
            )}
            {metodo.titular && (
              <p className="text-[#8A8A8A]">Titular: <span className="text-[#FAFAFA] font-mono">{metodo.titular}</span></p>
            )}
          </div>
        )
      case 'binance':
      case 'paypal':
        return metodo.instrucciones ? (
          <div className="text-sm">
            <p className="text-[#8A8A8A]">{metodo.instrucciones}</p>
          </div>
        ) : null
      case 'efectivo':
        return null
      default:
        return metodo.instrucciones ? (
          <div className="text-sm">
            <p className="text-[#8A8A8A]">{metodo.instrucciones}</p>
          </div>
        ) : null
    }
  }

  const selectedPaymentMethod = siteConfig.metodos_pago.find(m => m.tipo === paymentMethod)

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Back Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/carrito">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-full text-[#8A8A8A] hover:text-[#D4A853] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Carrito</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: 'Envio' },
            { num: 2, label: 'Pago' },
            { num: 3, label: 'Confirmacion' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-4">
              <button
                onClick={() => { if (s.num < step) setStep(s.num) }}
                className={`flex items-center gap-2 ${s.num <= step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === s.num
                    ? 'bg-[#D4A853] text-[#0A0A0B]'
                    : step > s.num
                      ? 'bg-[#D4A853]/20 text-[#D4A853]'
                      : 'bg-white/5 text-[#6A6A6A]'
                }`}>
                  {step > s.num ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.num}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${
                  step >= s.num ? 'text-[#FAFAFA]' : 'text-[#6A6A6A]'
                }`}>
                  {s.label}
                </span>
              </button>
              {i < 2 && (
                <div className={`w-16 h-px ${step > s.num ? 'bg-[#D4A853]/50' : 'bg-white/5'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-6" style={{ fontFamily: 'var(--font-clash-display)' }}>
                Tipo de Entrega
              </h2>
              <div className="space-y-3 mb-8">
                {configLoading ? (
                  // Skeleton loaders while config loads
                  <>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-full p-4 rounded-xl border border-white/5 bg-[#111113] animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-white/5 rounded" />
                            <div className="h-3 w-48 bg-white/5 rounded" />
                          </div>
                          <div className="h-4 w-12 bg-white/5 rounded" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  siteConfig.metodos_envio.map(envio => (
                    <button
                      key={envio.id}
                      onClick={() => { setDeliveryType(envio.tipo); setSelectedShipping(envio) }}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                        deliveryType === envio.tipo
                          ? 'bg-[#D4A853]/5 border-[#D4A853]/30'
                          : 'bg-[#111113] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium text-sm ${deliveryType === envio.tipo ? 'text-[#D4A853]' : 'text-[#FAFAFA]'}`}>
                            {envio.nombre}
                          </p>
                          {envio.descripcion_corta && (
                            <p className="text-[#8A8A8A] text-xs mt-0.5">{envio.descripcion_corta}</p>
                          )}
                          {envio.tiempo_estimado && (
                            <p className="text-[#6A6A6A] text-xs mt-0.5">{envio.tiempo_estimado}</p>
                          )}
                        </div>
                        <span className="text-[#8A8A8A] text-sm font-mono">
                          {Number(envio.precio_usd) === 0 ? 'Gratis' : `$${Number(envio.precio_usd).toFixed(2)}`}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {deliveryType !== 'retiro' && deliveryType !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 mb-8"
                >
                  <h3 className="text-[#FAFAFA] font-medium text-sm">Direccion de Envio</h3>
                  <input
                    value={address.direccion}
                    onChange={(e) => setAddress(a => ({ ...a, direccion: e.target.value }))}
                    placeholder="Direccion completa"
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      value={address.ciudad}
                      onChange={(e) => setAddress(a => ({ ...a, ciudad: e.target.value }))}
                      placeholder="Ciudad"
                      className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
                    />
                    <input
                      value={address.estado}
                      onChange={(e) => setAddress(a => ({ ...a, estado: e.target.value }))}
                      placeholder="Estado"
                      className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
                    />
                  </div>
                  <input
                    value={address.referencia}
                    onChange={(e) => setAddress(a => ({ ...a, referencia: e.target.value }))}
                    placeholder="Punto de referencia (opcional)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
                  />
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                disabled={configLoading || siteConfig.metodos_envio.length === 0}
                className="w-full py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                Continuar al Pago
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-6" style={{ fontFamily: 'var(--font-clash-display)' }}>
                Metodo de Pago
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {siteConfig.metodos_pago.map(metodo => (
                  <button
                    key={metodo.id}
                    onClick={() => setPaymentMethod(metodo.tipo)}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                      paymentMethod === metodo.tipo
                        ? 'bg-[#D4A853]/5 border-[#D4A853]/30'
                        : 'bg-[#111113] border-white/5 hover:border-white/10'
                    }`}
                  >
                    {metodo.logo_url && (
                      <img src={metodo.logo_url} alt={metodo.nombre_display} className="w-8 h-8 mx-auto mb-1 object-contain" />
                    )}
                    <span className={`text-xs font-medium ${paymentMethod === metodo.tipo ? 'text-[#D4A853]' : 'text-[#8A8A8A]'}`}>
                      {metodo.nombre_display || metodo.tipo_display}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bank details */}
              {selectedPaymentMethod && selectedPaymentMethod.tipo !== 'efectivo' && (
                <div className="p-5 bg-[#111113] rounded-xl border border-white/5 mb-6">
                  <h3 className="text-[#FAFAFA] font-medium text-sm mb-3">Datos para el Pago</h3>
                  {renderPaymentDetails(selectedPaymentMethod)}
                  <p className="text-[#D4A853] text-xs mt-4">
                    Monto a pagar: <span className="font-bold font-mono">${totalUsd.toFixed(2)}</span>
                    {totalBs > 0 && (
                      <span className="text-[#8A8A8A] font-mono ml-2">
                        (Bs. {totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Upload comprobante */}
              {selectedPaymentMethod && selectedPaymentMethod.tipo !== 'efectivo' && (
                <div className="p-5 bg-[#111113] rounded-xl border border-dashed border-white/10 mb-6 text-center">
                  <svg className="w-8 h-8 text-[#8A8A8A]/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-[#8A8A8A] text-xs mb-2">Sube tu comprobante de pago (opcional)</p>
                  <p className="text-[#6A6A6A] text-[10px]">Tambien puedes subirlo despues desde tu panel</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 bg-white/5 text-[#8A8A8A] font-medium text-sm rounded-full border border-white/5 hover:bg-white/10 transition-colors"
                >
                  Atras
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  Revisar Pedido
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-6" style={{ fontFamily: 'var(--font-clash-display)' }}>
                Confirmar Pedido
              </h2>

              {/* Order Summary */}
              <div className="bg-[#111113] rounded-xl border border-white/5 p-5 mb-6">
                <h3 className="text-[#FAFAFA] font-medium text-sm mb-4">Productos</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[#8A8A8A] text-xs font-mono">{item.quantity}x</span>
                        <span className="text-[#FAFAFA] text-sm">{item.name}</span>
                      </div>
                      <span className="text-[#FAFAFA] font-mono text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8A8A8A]">Subtotal</span>
                    <span className="text-[#FAFAFA] font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8A8A8A]">Envio ({selectedShipping?.nombre || deliveryType})</span>
                    <span className="text-[#FAFAFA] font-mono">{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5">
                    <span className="text-[#FAFAFA]">Total</span>
                    <div className="text-right">
                      <span className="text-[#D4A853] text-lg font-mono">${totalUsd.toFixed(2)}</span>
                      {totalBs > 0 && (
                        <span className="text-[#8A8A8A] text-xs font-mono block">
                          Bs. {totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {siteConfig.tasa_bcv > 0 && (
                  <p className="text-[#6A6A6A] text-xs text-center mt-2">
                    Tasa BCV: Bs. {Number(siteConfig.tasa_bcv).toFixed(2)} / USD
                    {siteConfig.fecha_tasa && ` (${siteConfig.fecha_tasa})`}
                  </p>
                )}
              </div>

              {/* Payment info summary */}
              <div className="bg-[#111113] rounded-xl border border-white/5 p-5 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8A8A]">Metodo de Pago</span>
                  <span className="text-[#FAFAFA]">
                    {siteConfig.metodos_pago.find(m => m.tipo === paymentMethod)?.nombre_display || paymentMethod}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Notas del Pedido (opcional)</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Instrucciones especiales, detalles adicionales..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all resize-none"
                />
              </div>

              {orderError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-6"
                >
                  <p className="text-red-400 text-xs">{orderError}</p>
                </motion.div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 bg-white/5 text-[#8A8A8A] font-medium text-sm rounded-full border border-white/5 hover:bg-white/10 transition-colors"
                >
                  Atras
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
    </>
  )
}
