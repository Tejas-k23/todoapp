import { useState } from "react"

import { useToast } from "../hooks/useToast"

const starterNotes = {
  focus: "Keep mornings for deep work",
  cadence: "Mon-Fri, 2 review blocks",
  reminder: "30 min before each task",
  motto: "Plan it once. Win it daily.",
}

export default function ProfilePage() {
  const { showToast } = useToast()
  const [notes, setNotes] = useState(starterNotes)

  function updateField(field, value) {
    setNotes((current) => ({ ...current, [field]: value }))
  }

  function handleNotesSubmit(event) {
    event.preventDefault()
    showToast("Workspace notes saved", "success")
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-8 md:px-6 md:pb-10 md:pt-24">
      <div className="glass-panel rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">Workspace</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Shared planner profile</h1>
        <p className="mt-2 text-sm text-slate-600">Anyone can view and update tasks. Use this space to keep the team aligned.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Space mode", "Open access"],
            ["Default view", "Dashboard + Tasks"],
            ["Sync focus", "Weekly study blocks"],
            ["Visibility", "Everyone sees updates"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
              <p className="mt-2 text-base font-semibold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">Shared notes</h2>
        <p className="mt-2 text-sm text-slate-600">Add quick preferences or reminders that everyone should see.</p>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleNotesSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Current focus</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("focus", event.target.value)} value={notes.focus} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Weekly cadence</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("cadence", event.target.value)} value={notes.cadence} />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Reminder window</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("reminder", event.target.value)} value={notes.reminder} />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Planner motto</span>
            <textarea className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("motto", event.target.value)} value={notes.motto} />
          </label>
          <div className="md:col-span-2">
            <button className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white" type="submit">
              Save notes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
