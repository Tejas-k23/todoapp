import { useEffect, useMemo, useState } from "react"

import EmptyState from "../components/common/EmptyState"
import LoadingSpinner from "../components/common/LoadingSpinner"
import TaskCard from "../components/tasks/TaskCard"
import TaskForm from "../components/tasks/TaskForm"
import { useTasks } from "../hooks/useTasks"
import { formatDateLabel } from "../utils/timeUtils"

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

export default function ListingPage() {
  const [query, setQuery] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filtered = useMemo(
    () => tasks.filter((task) => task.name.toLowerCase().includes(query.toLowerCase())),
    [query, tasks]
  )

  const grouped = useMemo(() => {
    const map = new Map()
    filtered.forEach((task) => {
      const key = task.date || "no-date"
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(task)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, tasks]) => ({ key, label: formatDateLabel(key === "no-date" ? null : key), tasks }))
  }, [filtered])

  async function handleSubmit(payload) {
    setSubmitting(true)
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload)
      } else {
        await createTask(payload)
      }
      setModalOpen(false)
      setEditingTask(null)
      fetchTasks()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-8 md:px-6 md:pb-10 md:pt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">Task library</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">All tasks</h1>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <input className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks by name" value={query} />
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && !tasks.length ? <EmptyState icon="✅" message="No tasks yet" subMessage="Create your first timetable item to see it grouped here." /> : null}

      <div className="mt-8 space-y-8">
        {grouped.map((section) => (
          <section key={section.key}>
            <h2 className="mb-3 text-lg font-semibold text-primary">{section.label}</h2>
            <div className="space-y-4">
              {section.tasks.map((task) => (
                <TaskCard key={task.id} onDelete={deleteTask} onEdit={(value) => { setEditingTask(value); setModalOpen(true) }} task={task} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <button className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-float md:bottom-10 md:right-10" onClick={() => { setEditingTask(null); setModalOpen(true) }} type="button">+</button>

      {modalOpen ? (
        <TaskModal onClose={() => { setEditingTask(null); setModalOpen(false) }} title={editingTask ? "Edit task" : "Add task"}>
          <TaskForm initialValues={editingTask} onCancel={() => { setEditingTask(null); setModalOpen(false) }} onSubmit={handleSubmit} submitting={submitting} />
        </TaskModal>
      ) : null}
    </div>
  )
}
