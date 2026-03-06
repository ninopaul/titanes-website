import type { Metadata } from 'next'
import CuentaClient from './CuentaClient'

export const metadata: Metadata = {
  title: 'Mi Cuenta',
}

export default function CuentaPage() {
  return <CuentaClient />
}
