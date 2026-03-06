import type { Metadata } from 'next'
import RegistroClient from './RegistroClient'

export const metadata: Metadata = {
  title: 'Crear Cuenta',
}

export default function RegistroPage() {
  return <RegistroClient />
}
