import type { Metadata } from 'next'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre impresión, diseño gráfico, materiales y tendencias del sector.',
}

export default function BlogPage() {
  return <BlogClient />
}
