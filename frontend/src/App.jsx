import { BrowserRouter } from "react-router-dom"

import BottomNav from "./components/common/BottomNav"
import ErrorBoundary from "./components/common/ErrorBoundary"
import InstallPrompt from "./components/common/InstallPrompt"
import Navbar from "./components/common/Navbar"
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"
import AppRoutes from "./routes/AppRoutes"

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <InstallPrompt />
            <Navbar />
            <main className="min-h-screen bg-transparent pb-16 md:pb-0 md:pt-16">
              <AppRoutes />
            </main>
            <BottomNav />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

