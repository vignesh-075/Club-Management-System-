"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('clubsync_user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
      } catch (e) {
        localStorage.removeItem('clubsync_user')
      }
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (res.ok) {
      // Store in localStorage for persistence
      localStorage.setItem('clubsync_user', JSON.stringify(data.user))
      setUser(data.user)
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin')
      } else if (data.user.role === 'moderator') {
        router.push('/leader')
      } else if (data.user.role === 'member') {
        router.push('/student')
      } else {
        // Default fallback
        router.push('/student')
      }
      
      return { success: true }
    }
    return { success: false, error: data.error }
  }

  function logout() {
    localStorage.removeItem('clubsync_user')
    setUser(null)
    router.push('/login')
  }

  async function register(name, email, password, club_id) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, club_id })
    })
    const data = await res.json()
    if (res.ok) return { success: true, message: data.message }
    return { success: false, error: data.error }
  }

  function updateUser(newUserData) {
    const updated = { ...user, ...newUserData }
    localStorage.setItem('clubsync_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}


