'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { GoogleLogin } from '@react-oauth/google'
import Navbar from '@/components/Navbar'

export default function RegistroClient() {
  const router = useRouter()
  const { register, loginWithGoogle, isAuthenticated } = useAuth()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.push('/cuenta')
  }, [isAuthenticated, router])

  const updateField = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.nombre.trim()) newErrors.nombre = 'Requerido'
    if (!form.apellido.trim()) newErrors.apellido = 'Requerido'
    if (!form.email.trim()) newErrors.email = 'Requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email invalido'
    if (!form.telefono.trim()) newErrors.telefono = 'Requerido'
    if (!form.password) newErrors.password = 'Requerido'
    else if (form.password.length < 6) newErrors.password = 'Minimo 6 caracteres'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contrasenas no coinciden'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono,
        password: form.password,
      })
      router.push('/cuenta')
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Error al crear cuenta' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6 py-12">
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

        <div className="bg-[#111113] rounded-2xl border border-white/5 p-8">
          <h1
            className="text-2xl font-black text-[#FAFAFA] text-center mb-2"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            Crear Cuenta
          </h1>
          <p className="text-[#8A8A8A] text-sm text-center mb-8">
            Registrate para realizar pedidos y dar seguimiento
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Nombre</label>
                <input
                  value={form.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  placeholder="Juan"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none transition-all ${
                    errors.nombre ? 'border-red-500/50' : 'border-white/5 focus:border-[#D4A853]/30'
                  }`}
                />
                {errors.nombre && <p className="text-red-400 text-[10px] mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Apellido</label>
                <input
                  value={form.apellido}
                  onChange={(e) => updateField('apellido', e.target.value)}
                  placeholder="Perez"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none transition-all ${
                    errors.apellido ? 'border-red-500/50' : 'border-white/5 focus:border-[#D4A853]/30'
                  }`}
                />
                {errors.apellido && <p className="text-red-400 text-[10px] mt-1">{errors.apellido}</p>}
              </div>
            </div>

            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="tu@email.com"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none transition-all ${
                  errors.email ? 'border-red-500/50' : 'border-white/5 focus:border-[#D4A853]/30'
                }`}
              />
              {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Telefono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => updateField('telefono', e.target.value)}
                placeholder="0412-1234567"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none transition-all ${
                  errors.telefono ? 'border-red-500/50' : 'border-white/5 focus:border-[#D4A853]/30'
                }`}
              />
              {errors.telefono && <p className="text-red-400 text-[10px] mt-1">{errors.telefono}</p>}
            </div>

            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Contrasena</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Minimo 6 caracteres"
                  className={`w-full px-4 py-3 pr-10 bg-white/5 border rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none transition-all ${
                    errors.password ? 'border-red-500/50' : 'border-white/5 focus:border-[#D4A853]/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A6A]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Confirmar Contrasena</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="Repite tu contrasena"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none transition-all ${
                  errors.confirmPassword ? 'border-red-500/50' : 'border-white/5 focus:border-[#D4A853]/30'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-400 text-xs">{errors.general}</p>
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
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </motion.button>
          </form>

          {/* Google OAuth — only show if client ID is configured */}
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <div className="mt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#6A6A6A] text-xs">o registrate con</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="flex justify-center [&_iframe]:!rounded-xl">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    setErrors({})
                    setIsLoading(true)
                    try {
                      await loginWithGoogle(credentialResponse.credential)
                      router.push('/cuenta')
                    } catch (err) {
                      setErrors({ general: err instanceof Error ? err.message : 'Error con Google' })
                    } finally {
                      setIsLoading(false)
                    }
                  }
                }}
                onError={() => setErrors({ general: 'Error al conectar con Google' })}
                theme="filled_black"
                size="large"
                width="350"
                text="signup_with"
                locale="es"
              />
            </div>
          </div>
          )}
        </div>

        <p className="text-center text-[#8A8A8A] text-sm mt-6">
          Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-[#D4A853] hover:text-[#E8C776] font-medium transition-colors">
            Inicia Sesion
          </Link>
        </p>
      </motion.div>
    </main>
    </>
  )
}
