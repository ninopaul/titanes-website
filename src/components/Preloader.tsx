'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#0A0A0B] flex items-center justify-center"
        >
          <div className="relative flex flex-col items-center">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              {/* Animated border */}
              <svg width="80" height="80" viewBox="0 0 80 80" className="absolute -inset-2">
                <rect
                  x="2" y="2" width="76" height="76" rx="16"
                  fill="none"
                  stroke="#D4A853"
                  strokeWidth="1"
                  className="line-draw"
                />
              </svg>

              <div className="w-16 h-16 bg-gradient-to-br from-[#D4A853] to-[#B8923A] rounded-xl flex items-center justify-center">
                <span className="text-[#0A0A0B] font-black text-3xl" style={{ fontFamily: 'var(--font-clash-display)' }}>
                  T
                </span>
              </div>
            </motion.div>

            {/* Company name reveal */}
            <div className="flex items-center gap-2 overflow-hidden">
              {'TITANES'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  className="text-[#FAFAFA] text-2xl font-black tracking-[0.2em]"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ duration: 1.8, delay: 0.2, ease: 'easeInOut' }}
              className="h-px bg-gradient-to-r from-transparent via-[#D4A853] to-transparent mt-6"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
