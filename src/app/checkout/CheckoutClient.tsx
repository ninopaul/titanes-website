'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/store/CartProvider'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'

const DELIVERY_OPTIONS = [
  { id: 'retiro', label: 'Retiro en Tienda', desc: 'Retira tu pedido en nuestra sede', price: 0 },
  { id: 'delivery', label: 'Envio a Domicilio', desc: 'Valencia y alrededores', price: 5.00 },
  { id: 'encomienda', label: 'Encomienda Nacional', desc: 'Envio por MRW, Zoom, Tealca', price: 0 },
]

const PAYMENT_METHODS = [
  { id: 'pago_movil', label: 'Pago Movil', icon: '📱' },
  { id: 'transferencia', label: 'Transferencia Bancaria', icon: '🏦' },
  { id: 'zelle', label: 'Zelle', icon: '💵' },
  { id: 'efectivo', label: 'Efectivo (en tienda)', icon: '💰' },
]

const BANK_INFO = {
  pago_movil: { banco: 'Banesco', telefono: '0412-1234567', cedula: 'J-12345678-9' },
  transferencia: { banco: 'Banesco', cuenta: '0134-0000-00-0000000000', rif: 'J-12345678-9' },
  zelle: { email: 'pagos@titanesgraficos.com.ve' },
}

export default function CheckoutClient() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [step, setStep] = useState(1)
  const [deliveryType, setDeliveryType] = useState('retiro')
  const [paymentMethod, setPaymentMethod] = useState('pago_movil')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [orderError, setOrderError] = useState('')
  const [notas, setNotas] = useState('')
  const [bankInfo, setBankInfo] = useState(BANK_INFO)

  const [address, setAddress] = useState({
    direccion: '',
    ciudad: '',
    estado: '',
    referencia: '',
  })

  // Load site config for bank details
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await storeApi.getConfig() as any
        const data = response?.data !== undefined ? response.data : response
        if (data?.pago_movil || data?.transferencia || data?.zelle) {
          setBankInfo({
            pago_movil: data.pago_movil || BANK_INFO.pago_movil,
            transferencia: data.transferencia || BANK_INFO.transferencia,
            zelle: data.zelle || BANK_INFO.zelle,
          })
        }
      } catch {
        // Use hardcoded fallback
      }
    }
    loadConfig()
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [isAuthenticated, authLoading, router])

  const deliveryOption = DELIVERY_OPTIONS.find(d => d.id === deliveryType)
  const subtotal = getTotal()
  const shipping = deliveryOption?.price || 0
  const total = subtotal + shipping

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
        metodo_pago: paymentMethod,
        notas_cliente: notas || undefined,
        ...(deliveryType === 'delivery' && {
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
          className="text-center max-w-md"
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

  return (
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
                {DELIVERY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setDeliveryType(opt.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                      deliveryType === opt.id
                        ? 'bg-[#D4A853]/5 border-[#D4A853]/30'
                        : 'bg-[#111113] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-sm ${deliveryType === opt.id ? 'text-[#D4A853]' : 'text-[#FAFAFA]'}`}>
                          {opt.label}
                        </p>
                        <p className="text-[#8A8A8A] text-xs mt-0.5">{opt.desc}</p>
                      </div>
                      <span className="text-[#8A8A8A] text-sm font-mono">
                        {opt.price === 0 ? 'Gratis' : `$${opt.price.toFixed(2)}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {deliveryType === 'delivery' && (
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
                className="w-full py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300"
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
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                      paymentMethod === m.id
                        ? 'bg-[#D4A853]/5 border-[#D4A853]/30'
                        : 'bg-[#111113] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{m.icon}</span>
                    <span className={`text-xs font-medium ${paymentMethod === m.id ? 'text-[#D4A853]' : 'text-[#8A8A8A]'}`}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bank details */}
              {paymentMethod !== 'efectivo' && (
                <div className="p-5 bg-[#111113] rounded-xl border border-white/5 mb-6">
                  <h3 className="text-[#FAFAFA] font-medium text-sm mb-3">Datos para el Pago</h3>
                  {paymentMethod === 'pago_movil' && (
                    <div className="space-y-2 text-sm">
                      <p className="text-[#8A8A8A]">Banco: <span className="text-[#FAFAFA] font-mono">{bankInfo.pago_movil.banco}</span></p>
                      <p className="text-[#8A8A8A]">Telefono: <span className="text-[#FAFAFA] font-mono">{bankInfo.pago_movil.telefono}</span></p>
                      <p className="text-[#8A8A8A]">Cedula/RIF: <span className="text-[#FAFAFA] font-mono">{bankInfo.pago_movil.cedula}</span></p>
                    </div>
                  )}
                  {paymentMethod === 'transferencia' && (
                    <div className="space-y-2 text-sm">
                      <p className="text-[#8A8A8A]">Banco: <span className="text-[#FAFAFA] font-mono">{bankInfo.transferencia.banco}</span></p>
                      <p className="text-[#8A8A8A]">Cuenta: <span className="text-[#FAFAFA] font-mono">{bankInfo.transferencia.cuenta}</span></p>
                      <p className="text-[#8A8A8A]">RIF: <span className="text-[#FAFAFA] font-mono">{bankInfo.transferencia.rif}</span></p>
                    </div>
                  )}
                  {paymentMethod === 'zelle' && (
                    <div className="space-y-2 text-sm">
                      <p className="text-[#8A8A8A]">Email: <span className="text-[#FAFAFA] font-mono">{bankInfo.zelle.email}</span></p>
                    </div>
                  )}
                  <p className="text-[#D4A853] text-xs mt-4">
                    Monto a pagar: <span className="font-bold font-mono">${total.toFixed(2)}</span>
                  </p>
                </div>
              )}

              {/* Upload comprobante */}
              {paymentMethod !== 'efectivo' && (
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
                    <span className="text-[#8A8A8A]">Envio ({deliveryOption?.label})</span>
                    <span className="text-[#FAFAFA] font-mono">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5">
                    <span className="text-[#FAFAFA]">Total</span>
                    <span className="text-[#D4A853] text-lg font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment info summary */}
              <div className="bg-[#111113] rounded-xl border border-white/5 p-5 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8A8A]">Metodo de Pago</span>
                  <span className="text-[#FAFAFA]">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span>
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
  )
}
