import { useState } from "react"

import TimePicker from "./TimePicker"
import { compareTimes, formatTime, getTodayDateString } from "../../utils/timeUtils"

const defaultState = {
  name: "",
  description: "",
  date: getTodayDateString(),
  start_time: "09:00",
  end_time: "10:00",
  notification_enabled: false,
  completed: false,
  priority: "medium",
}

export default function TaskForm({ initialValues, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState({ ...defaultState, ...(initialValues || {}) })
  const [errors, setErrors] = useState({})
  const [pickerField, setPickerField] = useState(null)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = "Task name is required"
    if (!form.date) nextErrors.date = "Choose a date"
    if (compareTimes(form.start_time, form.end_time) >= 0) nextErrors.end_time = "End time must be after start time"
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    await onSubmit({ ...form, name: form.name.trim(), description: form.description.trim() })
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Task name</span>
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField('name', event.target.value)} value={form.name} />
          {errors.name ? <p className="mt-1 text-xs text-rose-500">{errors.name}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
          <textarea className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField('description', event.target.value)} value={form.description} />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Priority</span>
          <div className="grid grid-cols-3 gap-2">
            {["low", "medium", "high"].map((level) => {
              const active = form.priority === level
              return (
                <button
                  key={level}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize ${active ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}
                  onClick={() => updateField("priority", level)}
                  type="button"
                >
                  {level}
                </button>
              )
            })}
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Date</span>
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("date", event.target.value)} type="date" value={form.date} />
          {errors.date ? <p className="mt-1 text-xs text-rose-500">{errors.date}</p> : null}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-2xl border border-slate-200 px-4 py-3 text-left" onClick={() => setPickerField('start_time')} type="button">
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Start</span>
            <span className="mt-1 block font-semibold text-primary">{formatTime(form.start_time)}</span>
          </button>
          <button className="rounded-2xl border border-slate-200 px-4 py-3 text-left" onClick={() => setPickerField('end_time')} type="button">
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">End</span>
            <span className="mt-1 block font-semibold text-primary">{formatTime(form.end_time)}</span>
          </button>
        </div>
        {errors.end_time ? <p className="-mt-3 text-xs text-rose-500">{errors.end_time}</p> : null}

        <label className="flex items-center justify-between rounded-2xl bg-sand px-4 py-3">
          <div>
            <span className="block text-sm font-medium text-slate-700">Notifications</span>
            <span className="text-xs text-slate-500">Enable reminders for this task</span>
          </div>
          <input checked={form.notification_enabled} onChange={(event) => updateField('notification_enabled', event.target.checked)} type="checkbox" />
        </label>

        <label className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <div>
            <span className="block text-sm font-medium text-slate-700">Completed</span>
            <span className="text-xs text-slate-500">Mark this task as done</span>
          </div>
          <input checked={form.completed} onChange={(event) => updateField('completed', event.target.checked)} type="checkbox" />
        </label>

        <div className="flex gap-3 pt-2">
          <button className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600" onClick={onCancel} type="button">Cancel</button>
          <button className="flex-1 rounded-2xl bg-primary px-4 py-3 font-semibold text-white" disabled={submitting} type="submit">
            {submitting ? 'Saving...' : initialValues ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>

      {pickerField ? (
        <TimePicker
          onChange={(value) => updateField(pickerField, value)}
          onClose={() => setPickerField(null)}
          value={form[pickerField]}
        />
      ) : null}
    </>
  )
}
