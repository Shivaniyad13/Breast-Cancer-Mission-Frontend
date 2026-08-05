'use client'

import { useState, useEffect } from 'react'

export interface User {
  id?: string
  name?: string | null
  email?: string | null
  role?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session')
        if (res.ok) {
          const session = await res.json()
          if (isMounted) {
            setUser(session?.user || null)
          }
        }
      } catch (err) {
        console.error('Failed to fetch auth session:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  return { user, isLoading, isLoggedIn: !!user }
}
