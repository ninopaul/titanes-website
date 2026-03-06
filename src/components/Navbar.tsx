'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { NAV_LINKS, COMPANY } from '@/lib/constants'
import { useCart } from '@/components/store/CartProvider'
import { useAuth } from '@/lib/auth-context'
import CartDrawer from '@/components/store/CartDrawer'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { getItemCount, openCart } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-16' : 'h-20'
          }`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4A853] to-[#B8923A] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-[#0A0A0B] font-black text-lg" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
                </div>
                <div className="absolute -inset-1 bg-[#D4A853]/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className="text-[#FAFAFA] font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-clash-display)' }}>
                  Titanes
                </span>
                <span className="text-[#D4A853] font-bold text-sm tracking-wider uppercase ml-1" style={{ fontFamily: 'var(--font-clash-display)' }}>
                  Graficos
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isInternal = link.href.startsWith('/') && !link.href.includes('#')
                const className = "relative px-4 py-2 text-sm text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors duration-300 group"
                const inner = (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute bottom-1 left-4 right-4 h-px bg-[#D4A853] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </>
                )
                return isInternal ? (
                  <Link key={link.href} href={link.href} className={className}>{inner}</Link>
                ) : (
                  <a key={link.href} href={link.href} className={className}>{inner}</a>
                )
              })}
            </div>

            {/* Right side: Cart + User + CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Cart Icon */}
              <button
                onClick={openCart}
                className="relative p-2 text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors duration-200"
                aria-label="Carrito"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#D4A853] text-[#0A0A0B] text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* User Icon / Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-[#8A8A8A] hover:text-[#FAFAFA] transition-colors duration-200"
                  aria-label="Usuario"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#111113] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-3 border-b border-white/5">
                            <p className="text-[#FAFAFA] text-sm font-medium truncate">{user?.nombre} {user?.apellido}</p>
                            <p className="text-[#8A8A8A] text-xs truncate">{user?.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/cuenta"
                              onClick={() => setUserMenuOpen(false)}
                              className="block px-4 py-2.5 text-sm text-[#8A8A8A] hover:text-[#FAFAFA] hover:bg-white/5 transition-colors"
                            >
                              Mi Cuenta
                            </Link>
                            <Link
                              href="/cuenta/pedidos"
                              onClick={() => setUserMenuOpen(false)}
                              className="block px-4 py-2.5 text-sm text-[#8A8A8A] hover:text-[#FAFAFA] hover:bg-white/5 transition-colors"
                            >
                              Mis Pedidos
                            </Link>
                            <button
                              onClick={() => { logout(); setUserMenuOpen(false) }}
                              className="block w-full text-left px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                            >
                              Cerrar Sesion
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-1">
                          <Link
                            href="/auth/login"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-[#8A8A8A] hover:text-[#FAFAFA] hover:bg-white/5 transition-colors"
                          >
                            Iniciar Sesion
                          </Link>
                          <Link
                            href="/auth/registro"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-[#D4A853] hover:text-[#E8C776] hover:bg-[#D4A853]/5 transition-colors"
                          >
                            Crear Cuenta
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Button */}
              <a
                href="#contacto"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4A853] text-[#0A0A0B] text-sm font-semibold rounded-full hover:bg-[#E8C776] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]"
              >
                Cotiza tu Proyecto
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex flex-col gap-1.5 p-2 group"
                aria-label="Menu"
              >
                <span className={`block w-6 h-0.5 bg-[#FAFAFA] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-4 h-0.5 bg-[#D4A853] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-[#FAFAFA] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_LINKS.map((link, i) => {
                const isInternal = link.href.startsWith('/') && !link.href.includes('#')
                const props = {
                  initial: { opacity: 0, y: 20 } as const,
                  animate: { opacity: 1, y: 0 } as const,
                  transition: { delay: i * 0.1 },
                  onClick: () => setMobileOpen(false),
                  className: "text-3xl font-bold text-[#FAFAFA] hover:text-[#D4A853] transition-colors",
                  style: { fontFamily: 'var(--font-clash-display)' },
                }
                return isInternal ? (
                  <motion.div key={link.href} {...props}>
                    <Link href={link.href}>{link.label}</Link>
                  </motion.div>
                ) : (
                  <motion.a key={link.href} href={link.href} {...props}>
                    {link.label}
                  </motion.a>
                )
              })}
              <motion.a
                href="#contacto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-8 py-3 bg-[#D4A853] text-[#0A0A0B] font-semibold rounded-full text-lg"
              >
                Cotiza tu Proyecto
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  )
}
