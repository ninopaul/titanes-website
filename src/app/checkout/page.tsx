import type { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Finalizar Compra',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
