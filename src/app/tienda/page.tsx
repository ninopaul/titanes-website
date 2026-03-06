import type { Metadata } from 'next'
import TiendaClient from './TiendaClient'

export const metadata: Metadata = {
  title: 'Tienda Online',
  description: 'Compra materiales de impresión, vinilos, lonas y más. Entrega en toda Venezuela.',
}

export default function TiendaPage() {
  return <TiendaClient />
}
