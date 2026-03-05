'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [formState, setFormState] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
    mensaje: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Build WhatsApp message
    const msg = `Hola! Soy ${formState.nombre}.\n\nServicio: ${formState.servicio}\n\n${formState.mensaje}\n\nContacto: ${formState.email} | ${formState.telefono}`
    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="contacto" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0B]" />
      <div className="absolute inset-0 grid-bg opacity-30" />

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
                    className="w-full px-4 py-3 bg-[#141416] border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-[#141416] border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-[#141416] border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-[#141416] border border-white/10 rounded-xl text-[#FAFAFA] focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300 appearance-none"
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
                  className="w-full px-4 py-3 bg-[#141416] border border-white/10 rounded-xl text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:border-[#D4A853]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all duration-300 resize-none"
                  placeholder="Describe tu proyecto, medidas, cantidad, material..."
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-[#D4A853] text-[#0A0A0B] font-bold text-base rounded-full hover:bg-[#E8C776] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,83,0.3)] flex items-center justify-center gap-2 group"
              >
                Enviar por WhatsApp
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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
                { icon: '📍', label: 'Ubicación', value: COMPANY.address },
                { icon: '📞', label: 'Teléfono', value: COMPANY.phone },
                { icon: '📧', label: 'Email', value: COMPANY.email },
                { icon: '🕐', label: 'Horario', value: COMPANY.hours },
                { icon: '📸', label: 'Instagram', value: COMPANY.instagram },
              ].map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-[#141416] rounded-xl border border-white/5 hover:border-[#D4A853]/20 transition-all duration-300 group"
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{info.icon}</span>
                  <div>
                    <div className="text-[#8A8A8A] text-xs uppercase tracking-wider font-medium mb-1">
                      {info.label}
                    </div>
                    <div className="text-[#FAFAFA] text-sm group-hover:text-[#D4A853] transition-colors duration-300">
                      {info.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="h-48 bg-[#141416] rounded-xl border border-white/5 overflow-hidden relative">
              <div className="absolute inset-0 grid-bg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#8A8A8A] text-sm">📍 Mapa Interactivo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
