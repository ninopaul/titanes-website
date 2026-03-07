import type { Metadata } from 'next'
import { displayFont, bodyFont, monoFont } from '@/lib/fonts'
import { CartProvider } from '@/components/store/CartProvider'
import { AuthProvider } from '@/lib/auth-context'
import { CompanyConfigProvider } from '@/lib/company-config'
import JsonLd from '@/components/JsonLd'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Titanes Gráficos | Soluciones en Impresión y Producción Gráfica',
    template: '%s | Titanes Gráficos',
  },
  description: 'Soluciones integrales en impresión gran formato, corte CNC, grabado láser, sublimación y rotulado vehicular. Más de 15 años de experiencia en Valencia, Venezuela.',
  keywords: ['impresión gran formato', 'corte CNC', 'grabado láser', 'sublimación', 'rotulado vehicular', 'impresión UV', 'señalética', 'corpóreos', 'fachadas', 'Valencia Venezuela', 'Titanes Gráficos'],
  authors: [{ name: 'Titanes Gráficos' }],
  creator: 'Titanes Gráficos',
  publisher: 'Titanes Gráficos',
  metadataBase: new URL('https://titanesgraficos.com.ve'),
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://titanesgraficos.com.ve',
    siteName: 'Titanes Gráficos',
    title: 'Titanes Gráficos | Impresión y Producción Gráfica Profesional',
    description: 'Soluciones integrales en impresión, corte y producción gráfica profesional en Valencia, Venezuela.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Titanes Gráficos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Titanes Gráficos',
    description: 'Soluciones en impresión y producción gráfica profesional',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://titanesgraficos.com.ve',
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
        <JsonLd />
        <CompanyConfigProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </CompanyConfigProvider>
      </body>
    </html>
  )
}
