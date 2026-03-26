import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { DAYS } from "../../utils/constants"
import { formatTimeRange } from "../../utils/timeUtils"

export default function TaskCard({ task, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const daySet = new Set(task.days)

  function handleDelete(event) {
    event.stopPropagation()
    if (window.confirm(`Delete ${task.name}?`)) {
      onDelete(task.id)
    }
  }

  return (
    <article className="cursor-pointer rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md" onClick={() => navigate(`/tasks/${task.id}`)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{task.name}</h3>
          <p className="mt-1 text-sm text-primary">🕐 {formatTimeRange(task.start_time, task.end_time)}</p>
        </div>
        <div className="relative">
          <button className="rounded-full p-2 text-slate-400 hover:bg-slate-100" onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open) }} type="button">⋯</button>
          {menuOpen ? (
            <div className="absolute right-0 top-10 z-10 flex gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg">
              <button className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-primary" onClick={(event) => { event.stopPropagation(); onEdit(task) }} type="button">Edit</button>
              <button className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600" onClick={handleDelete} type="button">Delete</button>
            </div>
          ) : null}
        </div>
      </div>
      <p className="mt-3 truncate text-sm text-slate-500">{task.description || "No description added yet."}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {DAYS.map((day) => (
            <span key={day.key} className={`h-2.5 w-2.5 rounded-full ${daySet.has(day.key) ? "bg-primary" : "bg-slate-200"}`} title={day.full} />
          ))}
        </div>
        {task.notification_enabled ? <span className="text-xs font-medium text-accent">Alerts on</span> : null}
      </div>
    </article>
  )
}
