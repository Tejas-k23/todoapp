import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

function isInstalledPWA() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
}

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(() => isInstalledPWA())
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    function handleAppInstalled() {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  async function handleInstallClick() {
    if (!deferredPrompt) return

    setIsInstalling(true)

    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
    } finally {
      setDeferredPrompt(null)
      setIsInstalling(false)
    }
  }

  if (isInstalled) {
    return <Navigate replace to="/home" />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_42%,#f8fafc_100%)] px-4 py-8 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.18),_transparent_65%)]" />
      <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-12 bottom-20 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section className="glass-panel w-full rounded-[2rem] border border-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary shadow-panel">
            <span className="h-2 w-2 rounded-full bg-accent" />
            PWA Ready
          </div>

          <h1 className="mt-6 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Download App
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            This website is install-first. To use the planner, please download the app on your device and open it from your home screen.
          </p>

          <div className="mt-8 rounded-[1.75rem] bg-[linear-gradient(145deg,#172033_0%,#0f766e_58%,#2dd4bf_100%)] p-5 text-white shadow-float">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">Why install</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-white/90">
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">Open directly from your home screen like a real app.</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">Use the planner without the normal browser bars and distractions.</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">Unlock the full app experience after installation.</div>
            </div>
          </div>

          {deferredPrompt ? (
            <button
              className="mt-8 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-float transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isInstalling}
              onClick={handleInstallClick}
              type="button"
            >
              {isInstalling ? "Preparing..." : "Install App"}
            </button>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-amber-200 bg-amber-50/90 p-4 text-sm leading-6 text-amber-950">
              <p className="font-semibold text-amber-900">Install prompt not available right now.</p>
              <p className="mt-2">
                Open your browser menu and choose <span className="font-semibold">Install app</span> or <span className="font-semibold">Add to Home Screen</span>. After installation, open the app from your home screen to continue.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
