'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { GoogleLogin } from '@react-oauth/google'

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/cuenta'
  const { login, loginWithGoogle, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.push(redirect)
  }, [isAuthenticated, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4A853]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4A853] to-[#B8923A] rounded-lg flex items-center justify-center">
            <span className="text-[#0A0A0B] font-black text-lg" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
          </div>
          <span className="text-[#FAFAFA] font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Titanes <span className="text-[#D4A853]">Graficos</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-[#111113] rounded-2xl border border-white/5 p-8">
          <h1
            className="text-2xl font-black text-[#FAFAFA] text-center mb-2"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            Iniciar Sesion
          </h1>
          <p className="text-[#8A8A8A] text-sm text-center mb-8">
            Accede a tu cuenta para gestionar tus pedidos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
              />
            </div>

            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Contrasena</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena"
                  className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A6A] hover:text-[#8A8A8A] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-400 text-xs">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-clash-display)' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar Sesion'
              )}
            </motion.button>
          </form>

          {/* Google OAuth */}
          <div className="mt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#6A6A6A] text-xs">o continua con</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="flex justify-center [&_iframe]:!rounded-xl">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    setError('')
                    setIsLoading(true)
                    try {
                      await loginWithGoogle(credentialResponse.credential)
                      router.push(redirect)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Error con Google')
                    } finally {
                      setIsLoading(false)
                    }
                  }
                }}
                onError={() => setError('Error al conectar con Google')}
                theme="filled_black"
                size="large"
                width="350"
                text="continue_with"
                locale="es"
              />
            </div>
          </div>
        </div>

        <p className="text-center text-[#8A8A8A] text-sm mt-6">
          No tienes cuenta?{' '}
          <Link href="/auth/registro" className="text-[#D4A853] hover:text-[#E8C776] font-medium transition-colors">
            Registrate
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
