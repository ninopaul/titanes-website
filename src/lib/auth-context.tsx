'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import storeApi from './store-api'

interface User {
  id: number
  email: string
  nombre: string
  apellido: string
  telefono: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; nombre: string; apellido: string; telefono: string; password: string }) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'titanes-auth-token'
const REFRESH_KEY = 'titanes-auth-refresh'
const USER_KEY = 'titanes-auth-user'

function getStoredTokens() {
  if (typeof window === 'undefined') return { access: null, refresh: null }
  return {
    access: localStorage.getItem(TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  }
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

function storeAuth(access: string, refresh: string, user: User) {
  localStorage.setItem(TOKEN_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  storeApi.setToken(access)
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
  storeApi.setToken(null)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshAuth = useCallback(async () => {
    const { access, refresh } = getStoredTokens()
    if (!access || !refresh) {
      setUser(null)
      setIsLoading(false)
      return
    }

    storeApi.setToken(access)

    try {
      const profile = await storeApi.getPerfil() as User
      setUser(profile)
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
    } catch {
      // Token might be expired, try refresh
      try {
        const data = await storeApi.refreshToken(refresh) as { access: string }
        storeApi.setToken(data.access)
        localStorage.setItem(TOKEN_KEY, data.access)
        const profile = await storeApi.getPerfil() as User
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
      } catch {
        clearAuth()
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // On mount, try to restore from localStorage
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
      const { access } = getStoredTokens()
      if (access) storeApi.setToken(access)
    }
    // Attempt a silent refresh in the background
    refreshAuth()
  }, [refreshAuth])

  const login = async (email: string, password: string) => {
    const data = await storeApi.login({ email, password }) as {
      access: string
      refresh: string
      user: User
    }
    storeAuth(data.access, data.refresh, data.user)
    setUser(data.user)
  }

  const register = async (regData: { email: string; nombre: string; apellido: string; telefono: string; password: string }) => {
    const data = await storeApi.registro(regData) as {
      access: string
      refresh: string
      user: User
    }
    storeAuth(data.access, data.refresh, data.user)
    setUser(data.user)
  }

  const loginWithGoogle = async (credential: string) => {
    const data = await storeApi.googleLogin(credential) as {
      access: string
      refresh: string
      user: User
    }
    storeAuth(data.access, data.refresh, data.user)
    setUser(data.user)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      loginWithGoogle,
      logout,
      refreshAuth,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
