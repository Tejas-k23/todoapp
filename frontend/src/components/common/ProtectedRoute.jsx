import { Navigate } from "react-router-dom"

import LoadingSpinner from "./LoadingSpinner"
import { useAuth } from "../../hooks/useAuth"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
