import { useState } from "react"

import { usePWA } from "../../hooks/usePWA"

export default function InstallPrompt() {
  const { isInstallable, promptInstall, dismissPrompt } = usePWA()
  const [hidden, setHidden] = useState(false)

  if (!isInstallable || hidden) return null

  return (
    <div className="animate-slide-down fixed left-0 right-0 top-0 z-50 bg-primary px-4 py-3 text-white shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span>📱</span>
          <span className="text-sm font-medium">Add Timetable+ to your home screen</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary" onClick={promptInstall} type="button">Install</button>
          <button className="rounded-full border border-white/30 px-3 py-1 text-xs" onClick={() => { setHidden(true); dismissPrompt() }} type="button">x</button>
        </div>
      </div>
    </div>
  )
}
