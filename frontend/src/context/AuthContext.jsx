import { createContext, useContext, useEffect, useState } from "react"

import { authService } from "../services/authService"
import { storage } from "../utils/storage"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.get("user"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function syncUser() {
      if (!storage.get("token")) {
        setLoading(false)
        return
      }
      try {
        const freshUser = await authService.getMe()
        setUser(freshUser)
      } catch {
        storage.remove("token")
        storage.remove("user")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    syncUser()
  }, [])

  async function login(mobileNumber, verificationToken) {
    setLoading(true)
    try {
      const data = await authService.login(mobileNumber, verificationToken)
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  async function signup(name, mobileNumber, verificationToken) {
    setLoading(true)
    try {
      const data = await authService.signup(name, mobileNumber, verificationToken)
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    authService.logout()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}