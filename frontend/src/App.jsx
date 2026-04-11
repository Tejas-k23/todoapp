import { useEffect, useState } from "react"
import { BrowserRouter, useLocation } from "react-router-dom"

import BottomNav from "./components/common/BottomNav"
import ErrorBoundary from "./components/common/ErrorBoundary"
import Navbar from "./components/common/Navbar"
import { ToastProvider } from "./context/ToastContext"
import AppRoutes from "./routes/AppRoutes"

function isInstalledPWA() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
}

function AppShell() {
  const location = useLocation()
  const [isInstalled, setIsInstalled] = useState(() => isInstalledPWA())

  useEffect(() => {
    function handleAppInstalled() {
      setIsInstalled(true)
    }

    const mediaQuery = window.matchMedia("(display-mode: standalone)")

    function handleDisplayModeChange(event) {
      setIsInstalled(event.matches || window.navigator.standalone === true)
    }

    window.addEventListener("appinstalled", handleAppInstalled)
    mediaQuery.addEventListener?.("change", handleDisplayModeChange)

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled)
      mediaQuery.removeEventListener?.("change", handleDisplayModeChange)
    }
  }, [])

  const showNavigation = isInstalled && location.pathname !== "/install"

  return (
    <ToastProvider>
      <ErrorBoundary>
        {showNavigation ? <Navbar /> : null}
        <main className={`min-h-screen bg-transparent ${showNavigation ? "pb-16 md:pb-0 md:pt-16" : ""}`}>
          <AppRoutes />
        </main>
        {showNavigation ? <BottomNav /> : null}
      </ErrorBoundary>
    </ToastProvider>
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
