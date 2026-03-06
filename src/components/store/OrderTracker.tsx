'use client'

import { motion } from 'framer-motion'

interface OrderStep {
  key: string
  label: string
  timestamp?: string
}

const ORDER_STEPS: OrderStep[] = [
  { key: 'recibido', label: 'Recibido' },
  { key: 'confirmado', label: 'Confirmado' },
  { key: 'en_produccion', label: 'En Produccion' },
  { key: 'listo', label: 'Listo' },
  { key: 'entregado', label: 'Entregado' },
]

interface OrderTrackerProps {
  currentStatus: string
  timestamps?: Record<string, string>
}

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    pendiente: 0,
    recibido: 0,
    confirmado: 1,
    en_produccion: 2,
    listo: 3,
    entregado: 4,
    cancelado: -1,
  }
  return map[status] ?? 0
}

export default function OrderTracker({ currentStatus, timestamps = {} }: OrderTrackerProps) {
  const currentIndex = getStepIndex(currentStatus)
  const isCancelled = currentStatus === 'cancelado'

  if (isCancelled) {
    return (
      <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-400 font-bold text-sm" style={{ fontFamily: 'var(--font-clash-display)' }}>Pedido Cancelado</p>
        <p className="text-[#8A8A8A] text-xs mt-1">Este pedido ha sido cancelado</p>
      </div>
    )
  }

  return (
    <div className="py-6">
      {/* Desktop tracker */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Background line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/5" />

          {/* Progress line */}
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-[#D4A853] to-[#E8C776]"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />

          {ORDER_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isFuture = index > currentIndex

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="relative flex flex-col items-center z-10"
              >
                {/* Circle */}
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? 'bg-[#D4A853] shadow-[0_0_15px_rgba(212,168,83,0.4)]'
                    : isCurrent
                      ? 'bg-[#0A0A0B] border-2 border-[#D4A853] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                      : 'bg-[#1A1A1D] border border-white/10'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-[#0A0A0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-[#D4A853]" />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#D4A853]/40"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  )}
                </div>

                {/* Label */}
                <p className={`mt-3 text-xs font-medium text-center whitespace-nowrap ${
                  isCompleted || isCurrent ? 'text-[#FAFAFA]' : 'text-[#6A6A6A]'
                }`}>
                  {step.label}
                </p>

                {/* Timestamp */}
                {timestamps[step.key] && (
                  <p className="mt-1 text-[10px] text-[#8A8A8A] font-mono">
                    {timestamps[step.key]}
                  </p>
                )}

                {/* "Current" indicator for Future steps hidden, but subtle for current */}
                {isFuture && (
                  <p className="mt-1 text-[10px] text-[#6A6A6A]/50">
                    Pendiente
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Mobile tracker (vertical) */}
      <div className="sm:hidden space-y-1">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isFuture = index > currentIndex
          const isLast = index === ORDER_STEPS.length - 1

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="flex items-start gap-4"
            >
              {/* Vertical line + circle */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-[#D4A853]'
                    : isCurrent
                      ? 'bg-[#0A0A0B] border-2 border-[#D4A853]'
                      : 'bg-[#1A1A1D] border border-white/10'
                }`}>
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5 text-[#0A0A0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4A853]" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-8 ${isCompleted ? 'bg-[#D4A853]/50' : 'bg-white/5'}`} />
                )}
              </div>

              {/* Label */}
              <div className="pt-1.5">
                <p className={`text-sm font-medium ${
                  isCompleted || isCurrent ? 'text-[#FAFAFA]' : 'text-[#6A6A6A]'
                }`}>
                  {step.label}
                </p>
                {timestamps[step.key] && (
                  <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">{timestamps[step.key]}</p>
                )}
                {isFuture && (
                  <p className="text-[10px] text-[#6A6A6A]/50 mt-0.5">Pendiente</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
