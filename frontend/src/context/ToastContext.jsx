import { createContext, useCallback, useContext, useMemo, useState } from "react"

import Toast from "../components/common/Toast"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const normalizeMessage = useCallback((message) => {
    if (Array.isArray(message)) {
      const parts = message
        .map((item) => {
          if (typeof item === "string") return item
          if (item && typeof item === "object") {
            return item.msg || item.message || JSON.stringify(item)
          }
          return String(item)
        })
        .filter(Boolean)
      return parts.length ? parts.join(", ") : "Something went wrong"
    }
    if (message && typeof message === "object") {
      return message.msg || message.message || JSON.stringify(message)
    }
    return message || "Something went wrong"
  }, [])

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message: normalizeMessage(message), type }])
    window.setTimeout(() => dismissToast(id), 3000)
  }, [dismissToast, normalizeMessage])

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  return useContext(ToastContext)
}
