'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { COMPANY } from '@/lib/constants'
import { useCompanyConfig } from '@/lib/company-config'

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const company = useCompanyConfig()
  const [formState, setFormState] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
    mensaje: '',
  })

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('sending')
    try {
      const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3003'
      const res = await fetch(`${API_URL}/api/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Solicitud de contacto:\nNombre: ${formState.nombre}\nEmail: ${formState.email}\nTeléfono: ${formState.telefono}\nServicio: ${formState.servicio}\nMensaje: ${formState.mensaje}`,
          session_id: 'contact_form_' + Date.now(),
        }),
      })
      if (res.ok) {
        setSubmitStatus('sent')
        setFormState({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' })
        setTimeout(() => setSubmitStatus('idle'), 4000)
      } else {
        throw new Error('Error')
      }
    } catch {
      setSubmitStatus('error')
      // Fallback: open WhatsApp with the message
      const msg = `Hola! Soy ${formState.nombre}.\n\nServicio: ${formState.servicio}\n\n${formState.mensaje}\n\nContacto: ${formState.email} | ${formState.telefono}`
      const whatsappNum = company.whatsapp.replace(/[^0-9]/g, '')
      window.open(`https://wa.me/58${whatsappNum}?text=${encodeURIComponent(msg)}`, '_blank')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  return (
    <section id="contacto" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0B]/90" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Concentric circles - top right */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.03]"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="#D4A853" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#D4A853" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="#D4A853" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#D4A853" strokeWidth="0.3" />
        </motion.svg>

        {/* Cross - bottom left */}
        <motion.svg
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-10 -left-10 w-[150px] h-[150px] opacity-[0.04]"
          viewBox="0 0 100 100"
        >
          <path d="M40,0 L60,0 L60,40 L100,40 L100,60 L60,60 L60,100 L40,100 L40,60 L0,60 L0,40 L40,40 Z" fill="none" stroke="#D4A853" strokeWidth="0.4" />
        </motion.svg>

        {/* Gradient glow - center */}
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Pulsing dots */}
        {[
          { top: '10%', right: '20%', delay: 0 },
          { top: '80%', left: '15%', delay: 1 },
          { top: '30%', left: '5%', delay: 2 },
        ].map((p, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#D4A853]"
            style={p}
          />
        ))}
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
              Contacto
            </span>
            <span className="w-8 h-px bg-[#D4A853]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#FAFAFA] tracking-tight"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            Hagamos tu{' '}
            <span className="text-gradient-gold">Proyecto Realidad</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[#8A8A8A] text-xs uppercase tracking-wider mb-2 font-medium">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.nombre}
                    onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                    className="w-full px-4 py-3 bg-[#141416]/80 backdrop-blur-sm border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8A8A] text-xs uppercase tracking-wider mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#141416]/80 backdrop-blur-sm border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[#8A8A8A] text-xs uppercase tracking-wider mb-2 font-medium">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formState.telefono}
                    onChange={(e) => setFormState({ ...formState, telefono: e.target.value })}
                    className="w-full px-4 py-3 bg-[#141416]/80 backdrop-blur-sm border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300"
                    placeholder="+58 412-1234567"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8A8A] text-xs uppercase tracking-wider mb-2 font-medium">
                    Servicio
                  </label>
                  <select
                    value={formState.servicio}
                    onChange={(e) => setFormState({ ...formState, servicio: e.target.value })}
                    className="w-full px-4 py-3 bg-[#141416]/80 backdrop-blur-sm border border-white/10 rounded-xl text-[#FAFAFA] focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300 appearance-none"
                  >
                    <option value="" className="bg-[#141416]">Seleccionar servicio</option>
                    <option value="Impresión Gran Formato" className="bg-[#141416]">Impresión Gran Formato</option>
                    <option value="Impresión UV" className="bg-[#141416]">Impresión UV</option>
                    <option value="Corte CNC" className="bg-[#141416]">Corte CNC</option>
                    <option value="Láser" className="bg-[#141416]">Grabado Láser</option>
                    <option value="Sublimación" className="bg-[#141416]">Sublimación</option>
                    <option value="Rotulado Vehicular" className="bg-[#141416]">Rotulado Vehicular</option>
                    <option value="Fachadas" className="bg-[#141416]">Fachadas</option>
                    <option value="Corpóreos" className="bg-[#141416]">Corpóreos</option>
                    <option value="Otro" className="bg-[#141416]">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8A8A8A] text-xs uppercase tracking-wider mb-2 font-medium">
                  Cuéntanos tu proyecto
                </label>
                <textarea
                  required
                  rows={4}
                  value={formState.mensaje}
                  onChange={(e) => setFormState({ ...formState, mensaje: e.target.value })}
                  className="w-full px-4 py-3 bg-[#141416]/80 backdrop-blur-sm border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300 resize-none"
                  placeholder="Describe tu proyecto, medidas, cantidad, material..."
                />
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'sending'}
                className={`group relative w-full sm:w-auto px-8 py-4 font-bold text-base rounded-full transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
                  submitStatus === 'sent'
                    ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                    : submitStatus === 'error'
                    ? 'bg-red-500/80 text-white'
                    : 'bg-[#D4A853] text-[#0A0A0B] hover:bg-[#E8C776] hover:shadow-[0_0_30px_rgba(212,168,83,0.3)]'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  {submitStatus === 'sending' ? 'Enviando...' :
                   submitStatus === 'sent' ? '✓ Solicitud Enviada' :
                   submitStatus === 'error' ? 'Redirigiendo a Telegram...' :
                   'Enviar Solicitud'}
                  {submitStatus === 'idle' && (
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  )}
                </span>
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Info cards */}
            <div className="space-y-4">
              {[
                { icon: '📍', label: 'Ubicación', value: company.direccion },
                { icon: '📞', label: 'Teléfono', value: company.telefono, href: `tel:${company.telefono}` },
                { icon: '📧', label: 'Email', value: company.email, href: `mailto:${company.email}` },
                { icon: '🕐', label: 'Horario', value: company.horario },
                { icon: '📸', label: 'Instagram', value: company.instagram, href: `https://instagram.com/${company.instagram.replace('@', '')}` },
                ...(company.tiktok ? [{ icon: '🎵', label: 'TikTok', value: company.tiktok, href: `https://tiktok.com/${company.tiktok.replace('@', '')}` }] : []),
              ].filter(info => info.value).map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-[#141416]/80 backdrop-blur-sm rounded-xl border border-white/5 hover:border-[#D4A853]/20 transition-all duration-300 group"
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{info.icon}</span>
                  <div>
                    <div className="text-[#8A8A8A] text-xs uppercase tracking-wider font-medium mb-1">
                      {info.label}
                    </div>
                    {'href' in info && info.href ? (
                      <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-[#FAFAFA] text-sm group-hover:text-[#D4A853] transition-colors duration-300">
                        {info.value}
                      </a>
                    ) : (
                      <div className="text-[#FAFAFA] text-sm group-hover:text-[#D4A853] transition-colors duration-300">
                        {info.value}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Google Maps */}
            {(() => {
              const mapsUrl = company.google_maps_url
              if (!mapsUrl) {
                return (
                  <div className="h-48 bg-[#141416]/80 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden relative group hover:border-[#D4A853]/20 transition-all duration-500">
                    <div className="absolute inset-0 grid-bg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">📍</span>
                        <span className="text-[#8A8A8A] text-sm">Mapa Interactivo</span>
                      </div>
                    </div>
                  </div>
                )
              }

              // Extract lat/lng from Google Maps URL
              let embedSrc = ''
              const coordMatch = mapsUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/) ||
                                 mapsUrl.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/)
              if (coordMatch) {
                const lat = coordMatch[1]
                const lng = coordMatch[2]
                embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`
              } else {
                // Fallback: use the address
                const addr = encodeURIComponent(company.direccion || 'Titanes Graficos')
                embedSrc = `https://maps.google.com/maps?q=${addr}&z=17&output=embed`
              }

              return (
                <div className="h-56 rounded-xl border border-white/5 overflow-hidden relative group hover:border-[#D4A853]/20 transition-all duration-500">
                  <iframe
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación en Google Maps"
                  />
                  {/* Gold border glow on hover */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: 'inset 0 0 30px rgba(212,168,83,0.08)' }}
                  />
                </div>
              )
            })()}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
