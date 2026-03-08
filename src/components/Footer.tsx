'use client'

import Image from 'next/image'
import { COMPANY, NAV_LINKS, SERVICES } from '@/lib/constants'
import { useCompanyConfig } from '@/lib/company-config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const company = useCompanyConfig()

  return (
    <footer className="relative bg-[#0A0A0B] border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {company.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={company.nombre}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain animate-fade-in"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#1A1A1C] overflow-hidden">
                  <div className="w-full h-full animate-shimmer bg-gradient-to-r from-[#1A1A1C] via-[#D4A853]/10 to-[#1A1A1C] bg-[length:200%_100%]" />
                </div>
              )}
              <div>
                <span className="text-[#FAFAFA] font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-clash-display)' }}>
                  Titanes
                </span>
                <span className="text-[#D4A853] font-bold text-sm tracking-wider uppercase ml-1" style={{ fontFamily: 'var(--font-clash-display)' }}>
                  Gráficos
                </span>
              </div>
            </div>
            <p className="text-[#8A8A8A] text-sm leading-relaxed mb-4">
              {company.slogan || 'Soluciones integrales en impresión, corte y producción gráfica profesional.'}
            </p>
            {company.rif && (
              <p className="text-[#8A8A8A]/60 text-xs mb-4 font-mono">RIF: {company.rif}</p>
            )}
            {company.direccion && (
              <p className="text-[#8A8A8A]/70 text-xs mb-6 leading-relaxed">📍 {company.direccion}</p>
            )}
            {/* Social links */}
            <div className="flex items-center gap-3">
              {company.instagram && (
                <a href={`https://instagram.com/${company.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[#8A8A8A] hover:text-[#D4A853] hover:border-[#D4A853]/30 transition-all duration-300"
                  aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {company.tiktok && (
                <a href={`https://tiktok.com/${company.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[#8A8A8A] hover:text-[#D4A853] hover:border-[#D4A853]/30 transition-all duration-300"
                  aria-label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              )}
              {company.telegram && (
                <a href={`https://t.me/${company.telegram}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[#8A8A8A] hover:text-[#0088cc] hover:border-[#0088cc]/30 transition-all duration-300"
                  aria-label="Telegram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
              )}
              {company.email && (
                <a href={`mailto:${company.email}`}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[#8A8A8A] hover:text-[#D4A853] hover:border-[#D4A853]/30 transition-all duration-300"
                  aria-label="Email">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#FAFAFA] font-bold text-sm uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Navegación
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#8A8A8A] text-sm hover:text-[#D4A853] transition-colors duration-300 hover-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#FAFAFA] font-bold text-sm uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Servicios
            </h4>
            <ul className="space-y-3">
              {SERVICES.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <a
                    href="#servicios"
                    className="text-[#8A8A8A] text-sm hover:text-[#D4A853] transition-colors duration-300 hover-underline"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="text-[#FAFAFA] font-bold text-sm uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-clash-display)' }}>
              Cotiza Ahora
            </h4>
            <p className="text-[#8A8A8A] text-sm mb-6 leading-relaxed">
              ¿Tienes un proyecto en mente? Escríbenos y te enviamos tu cotización en menos de 24 horas.
            </p>
            <a
              href={`https://t.me/${company.telegram || 'titanes_graficos_bot'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0088cc] text-white text-sm font-bold rounded-full hover:bg-[#0099dd] transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Escribir por Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8A8A8A]/50 text-xs">
            &copy; {currentYear} {company.nombre}. {company.rif && `RIF: ${company.rif}.`} Todos los derechos reservados.
          </p>
          <p className="text-[#8A8A8A]/30 text-xs">
            Diseñado con ✦ por Titanes Gráficos
          </p>
        </div>
      </div>
    </footer>
  )
}
