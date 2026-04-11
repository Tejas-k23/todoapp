import { useState } from "react"

import TimePicker from "./TimePicker"
import { DAYS } from "../../utils/constants"
import { compareTimes, formatTime } from "../../utils/timeUtils"

const defaultState = {
  name: "",
  description: "",
  days: [],
  start_time: "09:00",
  end_time: "10:00",
  notification_enabled: false,
  completed: false,
}

export default function TaskForm({ initialValues, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(initialValues || defaultState)
  const [errors, setErrors] = useState({})
  const [pickerField, setPickerField] = useState(null)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function toggleDay(dayKey) {
    setForm((current) => ({
      ...current,
      days: current.days.includes(dayKey)
        ? current.days.filter((day) => day !== dayKey)
        : [...current.days, dayKey],
    }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = "Task name is required"
    if (!form.days.length) nextErrors.days = "Choose at least one day"
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

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">Days</span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const active = form.days.includes(day.key)
              return (
                <button key={day.key} className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-primary text-white' : 'bg-sand text-primary'}`} onClick={() => toggleDay(day.key)} type="button">{day.key}</button>
              )
            })}
          </div>
          {errors.days ? <p className="mt-1 text-xs text-rose-500">{errors.days}</p> : null}
        </div>

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
