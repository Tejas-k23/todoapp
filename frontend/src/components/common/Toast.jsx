const toneClasses = {
  success: "bg-emerald-500",
  error: "bg-rose-500",
  info: "bg-slate-800",
}

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 flex w-[90%] max-w-sm -translate-x-1/2 flex-col gap-2 md:bottom-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-lg animate-slide-up ${toneClasses[toast.type] || toneClasses.info}`}
        >
          <span>{toast.message}</span>
          <button className="ml-4 text-white/80" onClick={() => onDismiss(toast.id)} type="button">x</button>
        </div>
      ))}
    </div>
  )
}
