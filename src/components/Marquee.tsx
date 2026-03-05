'use client'

import { motion } from 'framer-motion'

const WORDS = [
  'IMPRESIÓN', '◆', 'CORTE CNC', '◆', 'LÁSER', '◆', 'SUBLIMACIÓN', '◆',
  'FACHADAS', '◆', 'CORPÓREOS', '◆', 'SEÑALÉTICA', '◆', 'ROTULADO', '◆',
]

export default function Marquee() {
  return (
    <div className="relative py-6 overflow-hidden bg-[#0A0A0B] border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10" />

      <div className="flex whitespace-nowrap animate-marquee">
        {/* Double the content for seamless loop */}
        {[...WORDS, ...WORDS].map((word, i) => (
          <span
            key={i}
            className={`mx-4 text-xl md:text-2xl font-black tracking-wider ${
              word === '◆'
                ? 'text-[#D4A853] text-sm'
                : 'text-white/8 hover:text-[#D4A853]/30 transition-colors duration-500'
            }`}
            style={{ fontFamily: word !== '◆' ? 'var(--font-clash-display)' : undefined }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
