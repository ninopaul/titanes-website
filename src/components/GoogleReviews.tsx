'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ═══ Reseñas REALES de Google Maps — Titanes Graficos C.A ═══
// Fuente: https://www.google.com/maps/place/Titanes+Graficos+C.A/
// Última actualización: 2026-03-06
const GOOGLE_REVIEWS = [
  {
    name: 'Roger Acevedo',
    avatar: null,
    initial: 'R',
    color: '#4CAF50',
    rating: 5,
    date: 'Hace 10 meses',
    text: 'Paso por acá para felicitar al trabajo tan impecable y responsable del personal de Titanes Gráficos, muy satisfecho con su agradable atención y amabilidad. Excelente atención por parte del muchacho del delivery. 5 estrellas de verdad. Los mejores de Puerto Ordaz.',
  },
  {
    name: 'Jacqueline Fernandino',
    avatar: null,
    initial: 'J',
    color: '#9C27B0',
    rating: 5,
    date: 'Hace 7 meses',
    text: 'Éxitos y bendiciones a los amigos de TITANES, excelente equipo de trabajo, muy buena y amable la atención al cliente. Desde que entras a la tienda un rico café mientras muestran los productos que buscas y sales con algo más de lo que ibas a buscar.',
  },
  {
    name: 'Yaxi S M',
    avatar: null,
    initial: 'Y',
    color: '#2196F3',
    rating: 5,
    date: 'Hace 7 meses',
    text: 'Son mi primera elección para impresión en pequeño y gran formato. Excelente atención, material 100% de calidad y los instaladores son muy serviciales. Mil de 10.',
  },
  {
    name: 'Carmen Cordova',
    avatar: null,
    initial: 'C',
    color: '#E91E63',
    rating: 5,
    date: 'Hace 5 meses',
    text: 'Excelente atención, y todo su trabajo espectacular.',
  },
  {
    name: 'Carlos Puga',
    avatar: null,
    initial: 'C',
    color: '#FF5722',
    rating: 5,
    date: 'Hace 9 meses',
    text: 'Fue rápido, instalación bien realizada, volveré a solicitar nuevamente el servicio próximamente.',
  },
  {
    name: 'J. Gregorio Maita',
    avatar: null,
    initial: 'G',
    color: '#FF9800',
    rating: 5,
    date: 'Hace 10 meses',
    text: 'Excelente atención y precios accesibles. Gente que entiende, para los que no estamos muy claros sobre lo que queremos, y tienen paciencia para encontrar un punto satisfactorio respecto a lo que necesitas como cliente.',
  },
  {
    name: 'Lindsay Villalobos',
    avatar: null,
    initial: 'L',
    color: '#00BCD4',
    rating: 5,
    date: 'Hace 10 meses',
    text: 'Muy puntuales, excelente servicio. Así de bonito queda el DTF UV, de bello.',
  },
  {
    name: 'Diosmarlys Castillo',
    avatar: null,
    initial: 'D',
    color: '#8BC34A',
    rating: 4,
    date: 'Hace 10 meses',
    text: 'Impresiones de calidad, muy buen servicio y la mejor atención y excelentes precios. 100% recomendados.',
  },
  {
    name: 'Abner Pacheco',
    avatar: null,
    initial: 'A',
    color: '#607D8B',
    rating: 4,
    date: 'Hace 10 meses',
    text: 'Excelente atención person to person. El 90% de las veces, cumplen los objetivos en el tiempo estipulado por ellos mismos. Aliados de confianza!',
  },
]

const OVERALL_RATING = 4.5
const TOTAL_REVIEWS = 79
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Titanes+Graficos+C.A/@8.2932483,-62.7287251,17z/data=!3m1!4b1!4m6!3m5!1s0x8dcbffad12e6b751:0xd4657e69247f5729!8m2!3d8.2932483!4d-62.7287251!16s%2Fg%2F11lgr2s_9r'

// Star component with half-star support
function Stars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4.5 h-4.5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= Math.floor(rating)
        const isHalf = !isFull && star === Math.ceil(rating) && rating % 1 !== 0
        return (
          <div key={star} className="relative">
            {/* Background star (gray) */}
            <svg className={`${sizeClass} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Filled star (yellow) - full or half */}
            {(isFull || isHalf) && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: isHalf ? '50%' : '100%' }}>
                <svg className={`${sizeClass} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Individual review card
function ReviewCard({ review, index }: { review: typeof GOOGLE_REVIEWS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-[320px] md:w-[360px] p-6 bg-[#141416]/80 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-[#D4A853]/15 transition-all duration-500 group"
    >
      {/* Header: avatar + name + Google icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: review.color }}
          >
            {review.initial}
          </div>
          <div>
            <p className="text-[#FAFAFA] font-semibold text-sm">{review.name}</p>
            <p className="text-[#8A8A8A] text-xs">{review.date}</p>
          </div>
        </div>
        {/* Google icon */}
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      </div>

      {/* Stars + verified */}
      <div className="flex items-center gap-2 mb-3">
        <Stars rating={review.rating} size="sm" />
        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>

      {/* Review text */}
      <p className="text-[#C0C0C0] text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
        {review.text}
      </p>
    </motion.div>
  )
}

export default function GoogleReviews() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % GOOGLE_REVIEWS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 380 // card width + gap
      scrollRef.current.scrollTo({
        left: currentSlide * cardWidth,
        behavior: 'smooth',
      })
    }
  }, [currentSlide])

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0B]/95" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.02, 0.06, 0.02] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(212,168,83,0.06) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Quote marks decorative */}
        <motion.div
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-[200px] font-serif text-[#D4A853] leading-none select-none"
        >
          &ldquo;
        </motion.div>
        <motion.div
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-10 right-10 text-[200px] font-serif text-[#D4A853] leading-none select-none rotate-180"
        >
          &ldquo;
        </motion.div>
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs font-medium tracking-[0.3em] uppercase font-mono">
              Testimonios
            </span>
            <span className="w-8 h-px bg-[#D4A853]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#FAFAFA] tracking-tight"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            Lo que nuestros clientes{' '}
            <span className="text-gradient-gold">dicen de nosotros</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[#8A8A8A] text-lg max-w-2xl mx-auto"
          >
            Nos enorgullece saber que nuestros clientes se sienten acompañados, escuchados y satisfechos
          </motion.p>
        </div>

        {/* Google Rating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-8 px-8 py-5 bg-[#141416]/60 backdrop-blur-sm border border-white/5 rounded-2xl">
            {/* Left: Rating summary */}
            <div className="text-center">
              <p
                className="text-[#FAFAFA] font-black text-lg tracking-wide mb-1"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                MUY BUENO
              </p>
              <Stars rating={OVERALL_RATING} size="lg" />
              <p className="text-[#8A8A8A] text-xs mt-1.5">
                A base de <span className="text-[#FAFAFA] font-semibold">{TOTAL_REVIEWS} reseñas</span>
              </p>
              {/* Google logo */}
              <div className="flex items-center justify-center gap-0.5 mt-2">
                <span className="text-[#4285F4] font-bold text-lg">G</span>
                <span className="text-[#EA4335] font-bold text-lg">o</span>
                <span className="text-[#FBBC05] font-bold text-lg">o</span>
                <span className="text-[#4285F4] font-bold text-lg">g</span>
                <span className="text-[#34A853] font-bold text-lg">l</span>
                <span className="text-[#EA4335] font-bold text-lg">e</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-20 bg-white/10" />

            {/* Right: Score */}
            <div className="text-center">
              <p className="text-[#D4A853] text-5xl font-black font-mono">{OVERALL_RATING.toFixed(1)}</p>
              <p className="text-[#8A8A8A] text-xs mt-1">Calificación</p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#0A0A0B] to-transparent" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#0A0A0B] to-transparent" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-1280px)/2)]" />
            {GOOGLE_REVIEWS.map((review, i) => (
              <ReviewCard key={review.name} review={review} index={i} />
            ))}
            <div className="flex-shrink-0 w-4" />
          </div>

          {/* Carousel dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {GOOGLE_REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'bg-[#D4A853] w-6'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA: Leave a review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full shadow-[0_0_30px_rgba(212,168,83,0.3)] hover:shadow-[0_0_40px_rgba(212,168,83,0.5)] transition-all duration-300"
              style={{ fontFamily: 'var(--font-clash-display)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Dejar una Reseña
            </motion.button>
          </a>

          <p className="mt-3 text-[#8A8A8A]/40 text-xs flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
            </svg>
            Reseñas verificadas en Google Maps
          </p>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
