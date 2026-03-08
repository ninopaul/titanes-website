'use client'
import { useState, useEffect } from 'react'
import storeApi from '@/lib/store-api'

interface TasaInfo {
  tasa_bcv: number
  fecha: string | null
  desactualizada: boolean
}

export function useTasaBcv(): TasaInfo {
  const [tasa, setTasa] = useState<TasaInfo>({
    tasa_bcv: 0, fecha: null, desactualizada: false
  })

  useEffect(() => {
    storeApi.getTasaBCV().then((res: any) => {
      const data = res?.data !== undefined ? res.data : res
      if (data) {
        setTasa({
          tasa_bcv: data.tasa_bcv || 0,
          fecha: data.fecha_bcv || null,
          desactualizada: data.desactualizada || false,
        })
      }
    }).catch(() => {})
  }, [])

  return tasa
}

export function formatBs(usd: number, tasa: number): string {
  if (!tasa || tasa <= 0 || !usd) return ''
  const bs = usd * tasa
  return `Bs. ${bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
