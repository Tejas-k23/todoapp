import { BrowserRouter, useLocation } from "react-router-dom"

import BottomNav from "./components/common/BottomNav"
import ErrorBoundary from "./components/common/ErrorBoundary"
import Navbar from "./components/common/Navbar"
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"
import AppRoutes from "./routes/AppRoutes"

function AppShell() {
  const location = useLocation()
  const showNavigation = location.pathname !== "/install"

  return (
    <AuthProvider>
      <ToastProvider>
        <ErrorBoundary>
          {showNavigation ? <Navbar /> : null}
          <main className={`min-h-screen bg-transparent ${showNavigation ? "pb-16 md:pb-0 md:pt-16" : ""}`}>
            <AppRoutes />
          </main>
          {showNavigation ? <BottomNav /> : null}
        </ErrorBoundary>
      </ToastProvider>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </BrowserRouter>
  )
}
