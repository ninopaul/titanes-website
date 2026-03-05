import type { Metadata } from 'next'
import { displayFont, bodyFont, monoFont } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Titanes Gráficos | Producción Gráfica Industrial',
  description: 'Soluciones integrales en impresión gran formato, corte CNC, láser, sublimación, fachadas, corpóreos y más. 12 servicios, 8 máquinas industriales, un solo lugar.',
  keywords: [
    'impresión gran formato', 'corte CNC', 'láser', 'sublimación', 'fachadas',
    'corpóreos', 'señalética', 'rotulado vehicular', 'impresión UV', 'Venezuela',
    'Valencia', 'producción gráfica', 'publicidad exterior', 'vallas publicitarias',
  ],
  openGraph: {
    title: 'Titanes Gráficos | Creamos Lo Que Imaginas',
    description: 'Producción gráfica industrial. 12 servicios especializados, 8 máquinas de última generación.',
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
        {children}
      </body>
    </html>
  )
}
