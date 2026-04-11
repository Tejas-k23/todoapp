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

  async function login(identifier, password) {
    setLoading(true)
    try {
      const data = await authService.login(identifier, password)
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  async function signup(name, mobileNumber, password) {
    setLoading(true)
    try {
      const data = await authService.signup(name, mobileNumber, password)
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

  async function updateProfile(payload) {
    setLoading(true)
    try {
      const userData = await authService.updateProfile(payload)
      setUser(userData)
      return userData
    } finally {
      setLoading(false)
    }
  }

  async function changePassword(currentPassword, newPassword) {
    setLoading(true)
    try {
      return await authService.changePassword(currentPassword, newPassword)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, changePassword, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
