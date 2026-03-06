import type { Metadata } from 'next'
import PedidoDetailClient from './PedidoDetailClient'

export const metadata: Metadata = {
  title: 'Detalle del Pedido',
}

export default function PedidoDetailPage() {
  return <PedidoDetailClient />
}
