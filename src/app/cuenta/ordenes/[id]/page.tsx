import type { Metadata } from 'next'
import OrdenDetailClient from './OrdenDetailClient'

export const metadata: Metadata = {
  title: 'Estatus de tu Orden',
}

export default function OrdenDetailPage() {
  return <OrdenDetailClient />
}
