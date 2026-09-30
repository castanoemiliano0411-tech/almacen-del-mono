import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api('/api/auth/me')
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!user) return undefined
    const idle = 30 * 60 * 1000
    let last = Date.now()
    const bump = () => {
      last = Date.now()
    }
    const timer = setInterval(() => {
      if (Date.now() - last >= idle) {
        api('/api/auth/logout', { method: 'POST', body: {} }).catch(() => {})
        setUser(null)
      }
    }, 15000)
    window.addEventListener('pointerdown', bump)
    window.addEventListener('keydown', bump)
    return () => {
      clearInterval(timer)
      window.removeEventListener('pointerdown', bump)
      window.removeEventListener('keydown', bump)
    }
  }, [user])

  const value = useMemo(
    () => ({
      user,
      ready,
      isAdmin: user?.role === 'admin',
      isStaff: user?.role === 'admin' || user?.role === 'worker',
      isClient: user?.role === 'client',
      can: (permission) => {
        if (!user) return false
        if (user.role === 'admin') return true
        const perms = user.permissions || {}
        if (permission === 'products' || permission === 'content') {
          return Boolean(perms.content || perms.products || perms.ads)
        }
        if (permission === 'brands') {
          return Boolean(perms.brands || perms.ads)
        }
        if (permission === 'media') {
          return Boolean(perms.media || perms.content || perms.ads)
        }
        return Boolean(perms[permission])
      },
      login: async (email, password) => {
        const data = await api('/api/auth/login', { method: 'POST', body: { email, password } })
        setUser(data.user)
        return data.user
      },
      loginStaff: async (email, password) => {
        const data = await api('/api/auth/staff/login', { method: 'POST', body: { email, password } })
        if (data.user) setUser(data.user)
        return data
      },
      confirm2fa: async (code) => {
        const data = await api('/api/auth/staff/2fa', { method: 'POST', body: { code } })
        setUser(data.user)
        return data.user
      },
      updateAccount: async (body) => {
        const data = await api('/api/auth/me', { method: 'PATCH', body })
        setUser(data.user)
        return data.user
      },
      register: async (name, email, password) => {
        const data = await api('/api/auth/register', { method: 'POST', body: { name, email, password } })
        setUser(data.user)
        return data.user
      },
      logout: async () => {
        await api('/api/auth/logout', { method: 'POST', body: {} })
        setUser(null)
      },
    }),
    [user, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
