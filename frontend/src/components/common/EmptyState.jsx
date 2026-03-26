export default function EmptyState({ message, subMessage, icon = "🗂️", action }) {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 text-6xl">{icon}</div>
      <h3 className="text-xl font-semibold text-primary">{message}</h3>
      {subMessage ? <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{subMessage}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
