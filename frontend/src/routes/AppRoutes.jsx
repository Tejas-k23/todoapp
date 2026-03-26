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

function isInstalledPWA() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
}

function SmartEntryRedirect() {
  const [redirectPath, setRedirectPath] = useState(null)

  useEffect(() => {
    setRedirectPath(isInstalledPWA() ? "/home" : "/install")
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
        <Route element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} path="/dashboard" />
        <Route element={<ProtectedRoute><ListingPage /></ProtectedRoute>} path="/tasks" />
        <Route element={<ProtectedRoute><DetailPage /></ProtectedRoute>} path="/tasks/:id" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  )
}
