'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import storeApi from '@/lib/store-api'

export default function PerfilClient() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    estado: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/cuenta/perfil')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
      }))
    }
  }, [user])

  // Fetch full profile from API (may include address fields)
  useEffect(() => {
    if (!isAuthenticated) return
    async function fetchProfile() {
      try {
        const response = await storeApi.getPerfil() as any
        const data = response?.data !== undefined ? response.data : response
        if (data) {
          setForm({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.email || '',
            telefono: data.telefono || '',
            direccion: data.direccion || '',
            ciudad: data.ciudad || '',
            estado: data.estado || '',
          })
        }
      } catch {
        // Use auth context user data as fallback
      }
    }
    fetchProfile()
  }, [isAuthenticated])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess(false)

    try {
      const { email, ...updateData } = form
      await storeApi.updatePerfil(updateData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

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

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-[#FAFAFA]" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Mi <span className="text-gradient-gold">Perfil</span>
          </h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Actualiza tus datos personales</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSave}
          className="bg-[#111113] rounded-2xl border border-white/5 p-6 sm:p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Nombre</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] focus:outline-none focus:border-[#D4A853]/30 transition-all"
              />
            </div>
            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Apellido</label>
              <input
                value={form.apellido}
                onChange={(e) => setForm(f => ({ ...f, apellido: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] focus:outline-none focus:border-[#D4A853]/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Email</label>
            <input
              value={form.email}
              readOnly
              className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#6A6A6A] cursor-not-allowed"
            />
            <p className="text-[#6A6A6A] text-[10px] mt-1">El email no se puede modificar</p>
          </div>

          <div>
            <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Telefono</label>
            <input
              value={form.telefono}
              onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] focus:outline-none focus:border-[#D4A853]/30 transition-all"
            />
          </div>

          <div className="w-full h-px bg-white/5" />

          <h3 className="text-[#FAFAFA] font-bold text-sm" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Direccion de Envio
          </h3>

          <div>
            <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Direccion</label>
            <input
              value={form.direccion}
              onChange={(e) => setForm(f => ({ ...f, direccion: e.target.value }))}
              placeholder="Av. Bolivar Norte, C.C. Hiper Jumbo"
              className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Ciudad</label>
              <input
                value={form.ciudad}
                onChange={(e) => setForm(f => ({ ...f, ciudad: e.target.value }))}
                placeholder="Valencia"
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
              />
            </div>
            <div>
              <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Estado</label>
              <input
                value={form.estado}
                onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}
                placeholder="Carabobo"
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <p className="text-green-400 text-xs">Perfil actualizado exitosamente</p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
            className="w-full py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </motion.button>
        </motion.form>
      </div>
    </main>
  )
}
