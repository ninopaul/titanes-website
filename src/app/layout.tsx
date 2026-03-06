import type { Metadata } from 'next'
import { displayFont, bodyFont, monoFont } from '@/lib/fonts'
import { CartProvider } from '@/components/store/CartProvider'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Titanes Gráficos | Producción Gráfica Profesional',
  description: 'Soluciones integrales en impresión gran formato, corte CNC, láser, sublimación, fachadas, corpóreos y más. 12 servicios, 22+ máquinas de precisión, un solo lugar.',
  keywords: [
    'impresión gran formato', 'corte CNC', 'láser', 'sublimación', 'fachadas',
    'corpóreos', 'señalética', 'rotulado vehicular', 'impresión UV', 'Venezuela',
    'Valencia', 'producción gráfica', 'publicidad exterior', 'vallas publicitarias',
    'tienda online', 'e-commerce', 'imprenta Venezuela',
  ],
  openGraph: {
    title: 'Titanes Gráficos | Creamos Lo Que Imaginas',
    description: 'Producción gráfica profesional. 12 servicios especializados, 22+ máquinas de última generación. Tienda online con envío a toda Venezuela.',
    type: 'website',
    locale: 'es_VE',
    siteName: 'Titanes Gráficos',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased noise-overlay`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
