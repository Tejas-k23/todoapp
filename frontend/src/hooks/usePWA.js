import { useEffect, useState } from "react"

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setIsInstalled(true)
      return undefined
    }

    function handlePrompt(event) {
      event.preventDefault()
      setInstallPrompt(event)
      setIsInstallable(true)
    }

    function handleInstalled() {
      setIsInstalled(true)
      setIsInstallable(false)
    }

    window.addEventListener("beforeinstallprompt", handlePrompt)
    window.addEventListener("appinstalled", handleInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt)
      window.removeEventListener("appinstalled", handleInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!installPrompt) return false
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === "accepted") {
      setIsInstalled(true)
      setIsInstallable(false)
      return true
    }
    return false
  }

  function dismissPrompt() {
    setIsInstallable(false)
  }

  return { isInstallable, isInstalled, promptInstall, dismissPrompt }
}
