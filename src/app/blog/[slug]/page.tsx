'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import storeApi from '@/lib/store-api'

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
  const [post, setPost] = useState({ ...DEMO_POST, slug })
  const [contentBlocks, setContentBlocks] = useState(DEMO_CONTENT_BLOCKS)
  const [isLoading, setIsLoading] = useState(true)
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    async function fetchPost() {
      setIsLoading(true)
      try {
        const response = await storeApi.getBlogPost(slug) as any
        const data = response?.data !== undefined ? response.data : response
        if (data && data.titulo) {
          setPost(data)
          // If API returns contenido_html, use it; otherwise keep demo blocks
          if (data.contenido_html) {
            setHtmlContent(data.contenido_html)
            setContentBlocks([])
          }
        }
      } catch {
        // Use demo data
        setPost({ ...DEMO_POST, slug })
        setContentBlocks(DEMO_CONTENT_BLOCKS)
      } finally {
        setIsLoading(false)
      }
    }
    if (slug) fetchPost()
  }, [slug])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const telegramShare = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.titulo)}`
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.titulo)}&url=${encodeURIComponent(shareUrl)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] pt-24">
        <div className="max-w-3xl mx-auto px-6 animate-pulse">
          <div className="h-[30vh] bg-white/5 rounded-2xl mb-8" />
          <div className="h-4 bg-white/5 rounded w-1/4 mb-4" />
          <div className="h-8 bg-white/5 rounded w-3/4 mb-4" />
          <div className="h-4 bg-white/5 rounded w-1/3 mb-10" />
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
            <div className="h-4 bg-white/5 rounded w-4/6" />
          </div>
        </div>
      </main>
    )
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
            {htmlContent ? (
              <div
                className="prose prose-invert prose-sm max-w-none [&_h2]:text-[#FAFAFA] [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-[#8A8A8A] [&_p]:leading-relaxed [&_p]:mb-4 [&_li]:text-[#8A8A8A] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              contentBlocks.map((block, i) => (
                <RenderBlock key={i} block={block} />
              ))
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A853]/30 to-transparent my-10" />

          {/* Share */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#8A8A8A] text-sm">Comparte este articulo:</p>
            <div className="flex items-center gap-2">
              <a
                href={telegramShare}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#0088cc]/10 flex items-center justify-center text-[#8A8A8A] hover:text-[#0088cc] transition-all duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
