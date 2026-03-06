import type { Metadata } from 'next'
import PedidosClient from './PedidosClient'

export const metadata: Metadata = {
  title: 'Mis Pedidos',
}

export default function PedidosPage() {
  return <PedidosClient />
}
