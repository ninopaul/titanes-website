'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCompanyConfig } from '@/lib/company-config'

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [showName, setShowName] = useState(false)
  const company = useCompanyConfig()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  // Wait for config to load from API, or show after 600ms max
  useEffect(() => {
    if (showName) return
    if (company.loaded) {
      setShowName(true)
      return
    }
    const timeout = setTimeout(() => setShowName(true), 600)
    return () => clearTimeout(timeout)
  }, [company.loaded, showName])

  // Use API logo or fallback to static file
  const logoSrc = company.logo_url || '/logo.png'
  const isExternal = logoSrc.startsWith('http')

  // Company name for letter animation (uppercase)
  const brandName = company.nombre.toUpperCase()

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
              <svg width="100" height="100" viewBox="0 0 100 100" className="absolute -inset-3">
                <rect
                  x="2" y="2" width="96" height="96" rx="20"
                  fill="none"
                  stroke="#D4A853"
                  strokeWidth="1"
                  className="line-draw"
                />
              </svg>

              <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src={logoSrc}
                  alt={company.nombre}
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                  unoptimized={isExternal}
                />
              </div>
            </motion.div>

            {/* Company name reveal — waits for API config */}
            {showName && (
              <div className="flex items-center gap-1 overflow-hidden">
                {brandName.split('').map((letter, i) => (
                  <motion.span
                    key={`${letter}-${i}`}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className={`text-[#FAFAFA] font-black tracking-[0.1em] ${
                      brandName.length > 12 ? 'text-lg' : 'text-2xl'
                    } ${letter === ' ' ? 'w-2' : ''}`}
                    style={{ fontFamily: 'var(--font-clash-display)' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </div>
            )}

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
