import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import LoadingSpinner from "../components/common/LoadingSpinner"
import TaskForm from "../components/tasks/TaskForm"
import { taskService } from "../services/taskService"
import { useToast } from "../hooks/useToast"
import { DAYS } from "../utils/constants"
import { formatTimeRange } from "../utils/timeUtils"

function TaskModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-900/40 md:items-center md:justify-center">
      <div className="w-full rounded-t-[2rem] bg-white p-6 animate-slide-up md:max-w-lg md:rounded-[2rem]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500" onClick={onClose} type="button">x</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await taskService.getById(id)
        setTask(data)
      } catch (error) {
        showToast(error.response?.data?.detail || "Task not found", "error")
        navigate("/tasks")
      } finally {
        setLoading(false)
      }
    }

    loadTask()
  }, [id, navigate, showToast])

  async function handleDelete() {
    if (!window.confirm(`Delete ${task.name}?`)) return
    await taskService.delete(task.id)
    showToast("Task deleted", "success")
    navigate("/tasks")
  }

  async function handleUpdate(payload) {
    setSubmitting(true)
    try {
      const updated = await taskService.update(task.id, payload)
      setTask(updated)
      setModalOpen(false)
      showToast("Task updated", "success")
    } catch (error) {
      showToast(error.response?.data?.detail || "Update failed", "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const selectedDays = DAYS.filter((day) => task.days.includes(day.key)).map((day) => day.full).join(", ")

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-8 md:px-6 md:pb-10 md:pt-24">
      <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-100" onClick={() => navigate(-1)} type="button">Back</button>

      <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">Task detail</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{task.name}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">{task.description || "No description added for this task."}</p>
          </div>
          <div className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-primary">{task.notification_enabled ? 'Alerts on' : 'Alerts off'}</div>
        </div>

        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Days</dt><dd className="mt-2 font-semibold text-slate-900">{selectedDays}</dd></div>
          <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Time</dt><dd className="mt-2 font-semibold text-slate-900">{formatTimeRange(task.start_time, task.end_time)}</dd></div>
        </dl>

        <div className="mt-8 flex gap-3">
          <button className="rounded-full bg-primary px-5 py-3 font-semibold text-white" onClick={() => setModalOpen(true)} type="button">Edit</button>
          <button className="rounded-full bg-rose-50 px-5 py-3 font-semibold text-rose-600" onClick={handleDelete} type="button">Delete</button>
        </div>
      </div>

      {modalOpen ? (
        <TaskModal onClose={() => setModalOpen(false)} title="Edit task">
          <TaskForm initialValues={task} onCancel={() => setModalOpen(false)} onSubmit={handleUpdate} submitting={submitting} />
        </TaskModal>
      ) : null}
    </div>
  )
}
