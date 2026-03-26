import { useEffect, useState } from "react"

import DayTabs from "../components/tasks/DayTabs"
import EmptyState from "../components/common/EmptyState"
import LoadingSpinner from "../components/common/LoadingSpinner"
import TaskCard from "../components/tasks/TaskCard"
import TaskForm from "../components/tasks/TaskForm"
import { useTasks } from "../hooks/useTasks"
import { getTodayKey } from "../utils/timeUtils"

function TaskModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-900/40 p-0 backdrop-blur-sm md:items-center md:justify-center md:p-6">
      <div className="w-full rounded-t-[2rem] bg-white p-5 shadow-float animate-slide-up md:max-w-xl md:rounded-[2rem] md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-200" onClick={onClose} type="button">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const today = getTodayKey()
  const [selectedDay, setSelectedDay] = useState(today)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks()

  useEffect(() => {
    fetchTasks(selectedDay)
  }, [fetchTasks, selectedDay])

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
      fetchTasks(selectedDay)
    } finally {
      setSubmitting(false)
    }
  }

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:px-8 md:pb-12 md:pt-24">
      <section className="glass-panel rounded-[2rem] p-4 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">Weekly rhythm</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">A cleaner way to see your timetable.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Browse each day quickly, keep task details readable on mobile, and jump into edits without losing context.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <button className="rounded-full border border-primary/10 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-panel transition hover:border-primary/20 hover:text-primary" onClick={() => fetchTasks(selectedDay)} type="button">
              Refresh
            </button>
            <button className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-float transition hover:bg-primary-dark" onClick={openCreate} type="button">
              Add Task
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div className="rounded-[1.5rem] bg-white/85 p-3 shadow-panel">
            <DayTabs onDayChange={setSelectedDay} selectedDay={selectedDay} />
          </div>
          <div className="rounded-[1.5rem] bg-[linear-gradient(145deg,#172033_0%,#0f766e_100%)] p-5 text-white shadow-panel">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">Focus for {selectedDay}</p>
            <p className="mt-2 text-2xl font-semibold">{tasks.length} task{tasks.length === 1 ? "" : "s"} lined up</p>
            <p className="mt-2 text-sm leading-6 text-white/75">Use the floating action on mobile or the Add Task button above to keep your week current.</p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {loading ? <LoadingSpinner /> : null}
        {!loading && !tasks.length ? (
          <div className="glass-panel rounded-[2rem]">
            <EmptyState icon="???" message="No tasks for this day" subMessage="Tap the add button to create a new block and keep this day organized." />
          </div>
        ) : null}
        {!loading && tasks.map((task) => (
          <TaskCard key={task.id} onDelete={deleteTask} onEdit={openEdit} task={task} />
        ))}
      </section>

      <button className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-float transition hover:bg-primary-dark md:bottom-10 md:right-10 lg:hidden" onClick={openCreate} type="button">+</button>

      {modalOpen ? (
        <TaskModal onClose={() => { setModalOpen(false); setEditingTask(null) }} title={editingTask ? "Edit task" : "Add task"}>
          <TaskForm initialValues={editingTask} onCancel={() => { setModalOpen(false); setEditingTask(null) }} onSubmit={handleSubmit} submitting={submitting} />
        </TaskModal>
      ) : null}
    </div>
  )
}
