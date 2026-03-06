'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { COMPANY } from '@/lib/constants'

const DEMO_POST = {
  id: 1,
  slug: 'guia-completa-impresion-gran-formato',
  titulo: 'Guia Completa de Impresion Gran Formato: Todo lo que Necesitas Saber',
  contenido_html: '', // Will be rendered as structured blocks below
  imagen: null,
  categoria: 'Produccion Grafica',
  fecha: '2026-03-04',
  autor: 'Titanes Graficos',
  color: '#1a2332',
}

// Structured content blocks for safe rendering
const DEMO_CONTENT_BLOCKS = [
  { type: 'h2', text: 'Que es la Impresion Gran Formato?' },
  { type: 'p', text: 'La impresion gran formato se refiere a cualquier tipo de impresion que excede el tamano estandar de una impresora de oficina. Generalmente, esto incluye impresiones que van desde 60 cm hasta varios metros de ancho, y se utiliza ampliamente en publicidad, decoracion y senalizacion.' },
  { type: 'h2', text: 'Tipos de Materiales' },
  { type: 'p', text: 'Existen diversos materiales disponibles para impresion gran formato, cada uno con sus propias caracteristicas y aplicaciones:' },
  { type: 'list', items: [
    'Banner 13oz: El material mas versatil y economico para publicidad exterior e interior.',
    'Lona Frontlit: Ideal para cajas de luz y senalizacion retroiluminada.',
    'Vinil Adhesivo: Perfecto para rotulacion y decoracion de superficies.',
    'Microperforado: Permite la visibilidad desde el interior mientras muestra la grafica en el exterior.',
  ]},
  { type: 'h2', text: 'Resoluciones de Impresion' },
  { type: 'p', text: 'La resolucion ideal depende de la distancia de visualizacion. Para vallas publicitarias que se ven desde lejos, 360 dpi puede ser suficiente. Para piezas que se veran de cerca, como pendones en interiores, recomendamos 720 dpi o mas.' },
  { type: 'h2', text: 'Acabados Disponibles' },
  { type: 'p', text: 'Los acabados agregan proteccion y mejoran la apariencia visual de tus impresiones:' },
  { type: 'list', items: [
    'Laminado Mate: Reduce reflejos y da un acabado elegante.',
    'Laminado Brillante: Intensifica los colores y agrega proteccion UV.',
    'Laminado Texturizado: Agrega textura tactil para piezas premium.',
  ]},
  { type: 'h2', text: 'Consejos para Preparar tus Archivos' },
  { type: 'p', text: 'Para obtener los mejores resultados en tu impresion gran formato, asegurate de:' },
  { type: 'list', items: [
    'Trabajar en CMYK, no en RGB',
    'Usar una resolucion minima de 150 dpi a tamano real',
    'Incluir sangrado de al menos 3 cm en todos los lados',
    'Convertir fuentes a curvas antes de enviar',
    'Enviar archivos en formato PDF, AI o PSD',
  ]},
]

interface ContentBlock {
  type: string
  text?: string
  items?: string[]
}

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-[#FAFAFA] font-bold text-xl mt-10 mb-4" style={{ fontFamily: 'var(--font-clash-display)' }}>
          {block.text}
        </h2>
      )
    case 'p':
      return <p className="text-[#8A8A8A] leading-relaxed mb-4">{block.text}</p>
    case 'list':
      return (
        <ul className="text-[#8A8A8A] space-y-2 mb-6 list-disc pl-6">
          {block.items?.map((item, i) => {
            const colonIdx = item.indexOf(':')
            if (colonIdx > 0) {
              return (
                <li key={i}>
                  <span className="text-[#FAFAFA] font-semibold">{item.slice(0, colonIdx)}:</span>
                  {item.slice(colonIdx + 1)}
                </li>
              )
            }
            return <li key={i}>{item}</li>
          })}
        </ul>
      )
    default:
      return null
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [copied, setCopied] = useState(false)

  const post = { ...DEMO_POST, slug }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${post.titulo} - ${shareUrl}`)}`
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.titulo)}&url=${encodeURIComponent(shareUrl)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Back */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/blog">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-full text-[#8A8A8A] hover:text-[#D4A853] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Blog</span>
          </motion.button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        {post.imagen ? (
          <img src={post.imagen} alt={post.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full diagonal-lines" style={{ backgroundColor: post.color }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/5 text-[150px] font-black" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Category */}
          <span className="inline-block px-3 py-1 bg-[#D4A853]/10 text-[#D4A853] text-[10px] font-semibold tracking-wider uppercase rounded-full border border-[#D4A853]/20 mb-4">
            {post.categoria}
          </span>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FAFAFA] tracking-tight mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            {post.titulo}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-[#8A8A8A] text-sm mb-10">
            <span>{post.fecha}</span>
            <span className="w-1 h-1 rounded-full bg-[#8A8A8A]/50" />
            <span>{post.autor}</span>
          </div>

          {/* Article Content - Safe structured rendering */}
          <div className="max-w-none">
            {DEMO_CONTENT_BLOCKS.map((block, i) => (
              <RenderBlock key={i} block={block} />
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A853]/30 to-transparent my-10" />

          {/* Share */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#8A8A8A] text-sm">Comparte este articulo:</p>
            <div className="flex items-center gap-2">
              <a
                href={whatsappShare}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500/10 flex items-center justify-center text-[#8A8A8A] hover:text-green-400 transition-all duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href={twitterShare}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500/10 flex items-center justify-center text-[#8A8A8A] hover:text-blue-400 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <button
                onClick={handleCopyLink}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  copied
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-white/5 hover:bg-white/10 text-[#8A8A8A]'
                }`}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Back to blog */}
          <div className="text-center mt-10">
            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white/5 text-[#FAFAFA] font-medium text-sm rounded-full border border-white/10 hover:border-[#D4A853]/30 hover:text-[#D4A853] transition-all duration-300"
              >
                Ver mas Articulos
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
