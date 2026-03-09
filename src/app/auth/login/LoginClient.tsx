'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import type { LoginResult } from '@/lib/auth-context'
import storeApi, { ApiError } from '@/lib/store-api'
import type { TwoFARequired } from '@/lib/store-api'
import { GoogleLogin } from '@react-oauth/google'
import Navbar from '@/components/Navbar'

// ═══════════════════════════════════════
// 2FA Code Input Component
// ═══════════════════════════════════════

function TwoFACodeInput({
  twoFAData,
  onVerified,
  onBack,
}: {
  twoFAData: TwoFARequired
  onVerified: (access: string, refresh: string, user: { id: number; email: string; nombre: string; apellido: string; telefono: string }) => void
  onBack: () => void
}) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [intentosRestantes, setIntentosRestantes] = useState<number | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [recordarDispositivo, setRecordarDispositivo] = useState(false)
  const [sessionToken, setSessionToken] = useState(twoFAData.session_token)
  const [canal, setCanal] = useState(twoFAData.canal)

  // Resend cooldown
  const [resendCooldown, setResendCooldown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Start countdown on mount
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const submitCode = useCallback(async (code: string) => {
    if (code.length !== 6) return

    setIsVerifying(true)
    setError('')

    try {
      const response = await storeApi.verificar2FA({
        session_token: sessionToken,
        codigo: code,
        recordar_dispositivo: recordarDispositivo,
      })
      onVerified(response.access, response.refresh, response.user)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        const remaining = err.body?.intentos_restantes
        if (typeof remaining === 'number') {
          setIntentosRestantes(remaining)
        }
        // If session expired (401), force back to login
        if (err.status === 401) {
          setTimeout(() => onBack(), 2000)
        }
      } else {
        setError(err instanceof Error ? err.message : 'Error al verificar codigo')
      }
      // Clear digits on error
      setDigits(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } finally {
      setIsVerifying(false)
    }
  }, [sessionToken, recordarDispositivo, onVerified, onBack])

  const handleDigitChange = (index: number, value: string) => {
    // Only accept digits
    const digit = value.replace(/\D/g, '').slice(-1)

    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    if (digit && index < 5) {
      // Auto-advance to next input
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are filled
    if (digit && index === 5) {
      const code = newDigits.join('')
      if (code.length === 6) {
        submitCode(code)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') {
      const code = digits.join('')
      if (code.length === 6) submitCode(code)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const newDigits = [...digits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setDigits(newDigits)

    // Focus the next empty or last input
    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()

    // Auto-submit if all 6 pasted
    if (pasted.length === 6) {
      submitCode(pasted)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return

    setIsResending(true)
    setError('')

    try {
      const response = await storeApi.reenviar2FA({ session_token: sessionToken })
      setSessionToken(response.session_token)
      setCanal(response.canal as 'telegram' | 'email')
      setResendCooldown(60)
      setDigits(['', '', '', '', '', ''])
      setIntentosRestantes(null)
      inputRefs.current[0]?.focus()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        // Rate limit - start cooldown from server response
        if (err.status === 429) {
          setResendCooldown(60)
        }
      } else {
        setError(err instanceof Error ? err.message : 'Error al reenviar codigo')
      }
    } finally {
      setIsResending(false)
    }
  }

  const canalLabel = canal === 'telegram' ? 'Telegram' : 'correo electronico'
  const canalIcon = canal === 'telegram' ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md relative"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center gap-2 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-[#D4A853] to-[#B8923A] rounded-lg flex items-center justify-center">
          <span className="text-[#0A0A0B] font-black text-lg" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
        </div>
        <span className="text-[#FAFAFA] font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-clash-display)' }}>
          Titanes <span className="text-[#D4A853]">Graficos</span>
        </span>
      </Link>

      {/* Card */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-8">
        {/* Shield icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <h1
          className="text-2xl font-black text-[#FAFAFA] text-center mb-2"
          style={{ fontFamily: 'var(--font-clash-display)' }}
        >
          Verificacion 2FA
        </h1>

        {/* Channel info */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[#D4A853]">{canalIcon}</span>
          <p className="text-[#8A8A8A] text-sm">
            Codigo enviado via <span className="text-[#FAFAFA] font-medium">{canalLabel}</span>
          </p>
        </div>

        {/* 6-digit inputs */}
        <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isVerifying}
              className={`w-12 h-14 text-center text-xl font-bold bg-white/5 border rounded-xl text-[#FAFAFA] focus:outline-none transition-all duration-200
                ${digit ? 'border-[#D4A853]/40 bg-[#D4A853]/5' : 'border-white/10'}
                focus:border-[#D4A853]/60 focus:shadow-[0_0_12px_rgba(212,168,83,0.15)]
                disabled:opacity-50`}
            />
          ))}
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-xs text-center">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attempts remaining */}
        {intentosRestantes !== null && intentosRestantes <= 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs mb-4"
          >
            <span className={intentosRestantes <= 1 ? 'text-red-400' : 'text-yellow-400'}>
              {intentosRestantes} {intentosRestantes === 1 ? 'intento restante' : 'intentos restantes'}
            </span>
          </motion.p>
        )}

        {/* Verifying spinner */}
        {isVerifying && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-4 h-4 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#8A8A8A] text-sm">Verificando...</span>
          </div>
        )}

        {/* Remember device checkbox */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={recordarDispositivo}
              onChange={(e) => setRecordarDispositivo(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center
              ${recordarDispositivo
                ? 'bg-[#D4A853] border-[#D4A853]'
                : 'border-white/20 bg-white/5 group-hover:border-white/30'
              }`}
            >
              {recordarDispositivo && (
                <svg className="w-3 h-3 text-[#0A0A0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-[#8A8A8A] text-sm group-hover:text-[#AAAAAA] transition-colors">
            Recordar este dispositivo por 30 dias
          </span>
        </label>

        {/* Resend code */}
        <div className="flex items-center justify-center mb-6">
          {resendCooldown > 0 ? (
            <p className="text-[#6A6A6A] text-xs">
              Reenviar codigo en{' '}
              <span className="text-[#8A8A8A] font-mono">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#D4A853] text-xs font-medium hover:text-[#E8C776] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isResending ? (
                <>
                  <div className="w-3 h-3 border border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reenviar codigo
                </>
              )}
            </button>
          )}
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 text-[#8A8A8A] text-sm font-medium hover:text-[#FAFAFA] transition-colors rounded-full border border-white/5 hover:border-white/10"
        >
          Volver al inicio de sesion
        </button>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════
// Main Login Client
// ═══════════════════════════════════════

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/cuenta'
  const { login, completeLoginWith2FA, loginWithGoogle, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 2FA state
  const [twoFAData, setTwoFAData] = useState<TwoFARequired | null>(null)

  useEffect(() => {
    if (isAuthenticated) router.push(redirect)
  }, [isAuthenticated, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos')
      return
    }

    setIsLoading(true)
    try {
      const result: LoginResult = await login(email, password)
      if (result.requires2FA) {
        setTwoFAData(result.twoFAData)
      } else {
        router.push(redirect)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesion')
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAVerified = (access: string, refresh: string, user: { id: number; email: string; nombre: string; apellido: string; telefono: string }) => {
    completeLoginWith2FA(access, refresh, user)
    router.push(redirect)
  }

  const handleBackFromTwoFA = () => {
    setTwoFAData(null)
    setPassword('')
    setError('')
  }

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4A853]/5 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {twoFAData ? (
          <TwoFACodeInput
            key="2fa"
            twoFAData={twoFAData}
            onVerified={handle2FAVerified}
            onBack={handleBackFromTwoFA}
          />
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md relative"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4A853] to-[#B8923A] rounded-lg flex items-center justify-center">
                <span className="text-[#0A0A0B] font-black text-lg" style={{ fontFamily: 'var(--font-clash-display)' }}>T</span>
              </div>
              <span className="text-[#FAFAFA] font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-clash-display)' }}>
                Titanes <span className="text-[#D4A853]">Graficos</span>
              </span>
            </Link>

            {/* Card */}
            <div className="bg-[#111113] rounded-2xl border border-white/5 p-8">
              <h1
                className="text-2xl font-black text-[#FAFAFA] text-center mb-2"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                Iniciar Sesion
              </h1>
              <p className="text-[#8A8A8A] text-sm text-center mb-8">
                Accede a tu cuenta para gestionar tus pedidos
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[#8A8A8A] text-xs font-medium mb-1.5 block">Contrasena</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contrasena"
                      className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/5 rounded-xl text-sm text-[#FAFAFA] placeholder-[#6A6A6A] focus:outline-none focus:border-[#D4A853]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A6A] hover:text-[#8A8A8A] transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <p className="text-red-400 text-xs">{error}</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#D4A853] text-[#0A0A0B] font-bold text-sm rounded-full hover:bg-[#E8C776] transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
                      Ingresando...
                    </>
                  ) : (
                    'Iniciar Sesion'
                  )}
                </motion.button>
              </form>

              {/* Google OAuth — only show if client ID is configured */}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[#6A6A6A] text-xs">o continua con</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="flex justify-center [&_iframe]:!rounded-xl">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (credentialResponse.credential) {
                        setError('')
                        setIsLoading(true)
                        try {
                          await loginWithGoogle(credentialResponse.credential)
                          router.push(redirect)
                        } catch (err) {
                          setError(err instanceof Error ? err.message : 'Error con Google')
                        } finally {
                          setIsLoading(false)
                        }
                      }
                    }}
                    onError={() => setError('Error al conectar con Google')}
                    theme="filled_black"
                    size="large"
                    width="350"
                    text="continue_with"
                  />
                </div>
              </div>
              )}
            </div>

            <p className="text-center text-[#8A8A8A] text-sm mt-6">
              No tienes cuenta?{' '}
              <Link href="/auth/registro" className="text-[#D4A853] hover:text-[#E8C776] font-medium transition-colors">
                Registrate
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </>
  )
}
