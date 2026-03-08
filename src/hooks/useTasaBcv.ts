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
        const raw = data.tasa_bcv ?? data.tasa ?? 0
        setTasa({
          tasa_bcv: typeof raw === 'string' ? parseFloat(raw) || 0 : Number(raw) || 0,
          fecha: data.fecha_bcv || data.fecha || null,
          desactualizada: data.desactualizada || false,
        })
      }
    }).catch(() => {})
  }, [])

  return tasa
}

export function formatBs(usd: number | string, tasa: number | string): string {
  const usdNum = typeof usd === 'string' ? parseFloat(usd) : usd
  const tasaNum = typeof tasa === 'string' ? parseFloat(tasa) : tasa
  if (!tasaNum || tasaNum <= 0 || !usdNum) return ''
  const bs = usdNum * tasaNum
  return `Bs. ${bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
