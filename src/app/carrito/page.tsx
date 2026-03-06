import type { Metadata } from 'next'
import CarritoClient from './CarritoClient'

export const metadata: Metadata = {
  title: 'Carrito de Compras',
}

export default function CarritoPage() {
  return <CarritoClient />
}
