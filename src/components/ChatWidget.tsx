'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

// ═══════════════════════════════════════════════════════════
// CHAT WIDGET — Reemplaza WhatsAppButton
// Conecta con sales-agent-service (:3003)
// ═══════════════════════════════════════════════════════════

const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3003'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
}

function generateSessionId(): string {
  return 'web_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId()
  let sid = document.cookie.match(/chat_session_id=([^;]+)/)?.[1]
  if (!sid) {
    sid = generateSessionId()
    // Cookie expires in 24h
    document.cookie = `chat_session_id=${sid}; path=/; max-age=86400; SameSite=Lax`
  }
  return sid
}

// ── Telegram icon SVG ───────────────────────────────────────
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

// ── Chat Message Bubble ─────────────────────────────────────
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8923A] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
          <span className="text-[#0A0A0B] font-black text-[10px]" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#D4A853] text-[#0A0A0B] rounded-br-md'
            : 'bg-[#1E1E22] text-[#E0E0E0] border border-white/5 rounded-bl-md'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  )
}

// ── Typing indicator ────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8923A] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
        <span className="text-[#0A0A0B] font-black text-[10px]" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
      </div>
      <div className="px-4 py-3 bg-[#1E1E22] border border-white/5 rounded-2xl rounded-bl-md">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-[#D4A853]/60"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Main ChatWidget Component
// ═══════════════════════════════════════════════════════════
export default function ChatWidget() {
  const [visible, setVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [tooltip, setTooltip] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(getSessionId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Show after 2 seconds, hide tooltip after 8
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    const tooltipTimer = setTimeout(() => setTooltip(false), 8000)
    return () => { clearTimeout(timer); clearTimeout(tooltipTimer) }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Welcome message on first open
  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setTooltip(false)
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `👋 ¡Hola! Soy el asistente de ${COMPANY.name}.\n\n¿En qué puedo ayudarte? Puedo buscar productos, mostrarte precios, explicarte nuestros servicios o crear una solicitud de cotización.`,
        ts: Date.now(),
      }])
    }
  }, [messages.length])

  // Send message
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      ts: Date.now(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(`${CHAT_API}/api/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      })

      if (!res.ok) throw new Error('Error en la respuesta')

      const data = await res.json()

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.response || 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.',
        ts: Date.now(),
      }

      setMessages(prev => [...prev, botMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: '⚠️ No pude conectar con el servidor. Puedes contactarnos directamente por Telegram: @titanes_graficos_bot',
        ts: Date.now(),
      }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, sessionId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* ── Chat Window ──────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-[#111113] border border-white/10 rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#141416] to-[#1A1A1E] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8923A] flex items-center justify-center">
                    <span className="text-[#0A0A0B] font-black text-sm" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#141416]" />
                </div>
                <div>
                  <h3 className="text-[#FAFAFA] text-sm font-bold" style={{ fontFamily: 'var(--font-clash-display)' }}>
                    {COMPANY.name}
                  </h3>
                  <p className="text-green-400 text-[10px] font-medium">En línea</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Telegram link */}
                <a
                  href={`https://t.me/${COMPANY.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-[#0088cc] hover:bg-white/5 transition-all duration-200"
                  title="Abrir en Telegram"
                >
                  <TelegramIcon className="w-4 h-4" />
                </a>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8A8A] hover:text-[#FAFAFA] hover:bg-white/5 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/5 bg-[#0E0E10]">
              <div className="flex items-center gap-2 bg-[#1A1A1E] rounded-xl border border-white/5 focus-within:border-[#D4A853]/30 transition-all duration-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#8A8A8A]/50 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="mr-1.5 w-9 h-9 rounded-lg bg-[#D4A853] hover:bg-[#E8C776] disabled:bg-[#D4A853]/30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-[#0A0A0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-[#8A8A8A]/40 text-[10px] text-center mt-2">
                También puedes escribirnos por{' '}
                <a href={`https://t.me/${COMPANY.telegram}`} target="_blank" rel="noopener noreferrer" className="text-[#0088cc]/60 hover:text-[#0088cc]">
                  Telegram
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tooltip + Floating Button ────────────────── */}
      <div className="flex items-end gap-3">
        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="bg-[#FAFAFA] text-[#0A0A0B] px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg max-w-[200px]"
            >
              <div className="relative">
                ¿Necesitas ayuda? Escríbenos
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-0 h-0 border-l-8 border-l-[#FAFAFA] border-t-4 border-t-transparent border-b-4 border-b-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Button */}
        <motion.button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 bg-gradient-to-br from-[#D4A853] to-[#B8923A] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(212,168,83,0.4)] hover:shadow-[0_4px_30px_rgba(212,168,83,0.6)] transition-shadow duration-300"
          aria-label="Chat"
        >
          {/* Ping animation when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#D4A853] animate-ping opacity-20" />
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="w-6 h-6 text-[#0A0A0B] relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="w-7 h-7 text-[#0A0A0B] relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
