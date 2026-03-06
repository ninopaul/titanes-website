import type { Metadata } from 'next'
import PerfilClient from './PerfilClient'

export const metadata: Metadata = {
  title: 'Mi Perfil',
}

export default function PerfilPage() {
  return <PerfilClient />
}
