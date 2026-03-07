'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { COMPANY } from './constants'

// ═══════════════════════════════════════════════════════════
// Company Config Provider
// Fetches empresa data from ERP API (/api/v1/web/config/)
// Falls back to hardcoded COMPANY constants if API fails
// ═══════════════════════════════════════════════════════════

export interface CompanyConfig {
  nombre: string
  slogan: string
  telefono: string
  whatsapp: string
  email: string
  direccion: string
  horario: string
  instagram: string
  facebook: string
  tiktok: string
  rif: string
  google_maps_url: string
  logo_url: string | null
  chatbot_habilitado: boolean
}

const DEFAULT_CONFIG: CompanyConfig = {
  nombre: COMPANY.name,
  slogan: COMPANY.tagline,
  telefono: COMPANY.phone,
  whatsapp: COMPANY.phone,
  email: COMPANY.email,
  direccion: COMPANY.address,
  horario: COMPANY.hours,
  instagram: COMPANY.instagram,
  facebook: '',
  tiktok: '',
  rif: '',
  google_maps_url: '',
  logo_url: null,
  chatbot_habilitado: true,
}

const CompanyConfigContext = createContext<CompanyConfig>(DEFAULT_CONFIG)

export function useCompanyConfig() {
  return useContext(CompanyConfigContext)
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/web'

export function CompanyConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CompanyConfig>(DEFAULT_CONFIG)

  useEffect(() => {
    let cancelled = false

    async function fetchConfig() {
      try {
        const res = await fetch(`${API_BASE}/config/`, {
          headers: {
            'X-Tenant-Id': 'titanes_tenant',
            'X-Request-Id': `web-cfg-${Date.now()}`,
          },
          next: { revalidate: 300 }, // Cache 5 min
        })
        if (!res.ok) return
        const json = await res.json()
        if (!json.success || !json.data) return

        const d = json.data
        if (!cancelled) {
          setConfig({
            nombre: d.empresa_nombre || DEFAULT_CONFIG.nombre,
            slogan: d.slogan || DEFAULT_CONFIG.slogan,
            telefono: d.telefono || DEFAULT_CONFIG.telefono,
            whatsapp: d.whatsapp || d.telefono || DEFAULT_CONFIG.whatsapp,
            email: d.email || DEFAULT_CONFIG.email,
            direccion: d.direccion || DEFAULT_CONFIG.direccion,
            horario: d.horario || DEFAULT_CONFIG.horario,
            instagram: d.instagram || DEFAULT_CONFIG.instagram,
            facebook: d.facebook || DEFAULT_CONFIG.facebook,
            tiktok: d.tiktok || DEFAULT_CONFIG.tiktok,
            rif: d.rif || DEFAULT_CONFIG.rif,
            google_maps_url: d.google_maps_url || DEFAULT_CONFIG.google_maps_url,
            logo_url: d.logo_url || DEFAULT_CONFIG.logo_url,
            chatbot_habilitado: d.chatbot_habilitado ?? true,
          })
        }
      } catch {
        // Silently fail — use defaults
      }
    }

    fetchConfig()
    return () => { cancelled = true }
  }, [])

  return (
    <CompanyConfigContext.Provider value={config}>
      {children}
    </CompanyConfigContext.Provider>
  )
}
