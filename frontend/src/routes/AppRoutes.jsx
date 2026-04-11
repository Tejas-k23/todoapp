import { Suspense, lazy, useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import LoadingSpinner from "../components/common/LoadingSpinner"
import ProtectedRoute from "../components/common/ProtectedRoute"

const HomePage = lazy(() => import("../pages/HomePage"))
const InstallApp = lazy(() => import("../pages/InstallApp"))
const LoginPage = lazy(() => import("../pages/LoginPage"))
const SignupPage = lazy(() => import("../pages/SignupPage"))
const DashboardPage = lazy(() => import("../pages/DashboardPage"))
const ListingPage = lazy(() => import("../pages/ListingPage"))
const DetailPage = lazy(() => import("../pages/DetailPage"))
const ProfilePage = lazy(() => import("../pages/ProfilePage"))

function isInstalledPWA() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
}

function RequireInstalledApp({ children }) {
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

  if (!isInstalled) {
    return <Navigate replace to="/install" />
  }

  return children
}

function SmartEntryRedirect() {
  const [redirectPath, setRedirectPath] = useState(null)

  useEffect(() => {
    setRedirectPath("/home")
  }, [])

  if (!redirectPath) {
    return <LoadingSpinner />
  }

  return <Navigate replace to={redirectPath} />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<SmartEntryRedirect />} path="/" />
        <Route element={<InstallApp />} path="/install" />
        <Route element={<HomePage />} path="/home" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<SignupPage />} path="/signup" />
        <Route element={<RequireInstalledApp><ProtectedRoute><DashboardPage /></ProtectedRoute></RequireInstalledApp>} path="/dashboard" />
        <Route element={<RequireInstalledApp><ProtectedRoute><ListingPage /></ProtectedRoute></RequireInstalledApp>} path="/tasks" />
        <Route element={<RequireInstalledApp><ProtectedRoute><DetailPage /></ProtectedRoute></RequireInstalledApp>} path="/tasks/:id" />
        <Route element={<RequireInstalledApp><ProtectedRoute><ProfilePage /></ProtectedRoute></RequireInstalledApp>} path="/profile" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  )
}
