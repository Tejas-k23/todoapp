import { useEffect, useMemo, useState } from "react"

import EmptyState from "../components/common/EmptyState"
import LoadingSpinner from "../components/common/LoadingSpinner"
import TaskCard from "../components/tasks/TaskCard"
import TaskForm from "../components/tasks/TaskForm"
import { useTasks } from "../hooks/useTasks"
import { taskService } from "../services/taskService"
import { formatDateLabel, getMonthKey, getTodayDateString } from "../utils/timeUtils"

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

function MonthGrid({ currentMonth, monthTasks, selectedDate, onSelectDate }) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = Array.from({ length: firstDay }, () => null)
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  const cells = [...leading, ...days]
  const counts = useMemo(() => {
    const map = new Map()
    monthTasks.forEach((task) => {
      if (task.date) {
        map.set(task.date, (map.get(task.date) || 0) + 1)
      }
    })
    return map
  }, [monthTasks])

  function toDateString(dayNumber) {
    const monthValue = String(month + 1).padStart(2, "0")
    const dayValue = String(dayNumber).padStart(2, "0")
    return `${year}-${monthValue}-${dayValue}`
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-slate-400">
        {weekdays.map((day) => (
          <span key={day} className="text-center">{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((dayNumber, index) => {
          if (!dayNumber) {
            return <span key={`empty-${index}`} />
          }
          const dateValue = toDateString(dayNumber)
          const isSelected = dateValue === selectedDate
          const count = counts.get(dateValue) || 0
          return (
            <button
              key={dateValue}
              className={`relative rounded-2xl px-2 py-3 text-sm font-semibold transition ${isSelected ? "bg-primary text-white shadow-float" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              onClick={() => onSelectDate(dateValue)}
              type="button"
            >
              <span>{dayNumber}</span>
              {count ? <span className={`absolute right-1 top-1 rounded-full px-1.5 text-[10px] ${isSelected ? "bg-white/20 text-white" : "bg-white text-primary"}`}>{count}</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const todayDate = getTodayDateString()
  const [selectedDate, setSelectedDate] = useState(todayDate)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [monthTasks, setMonthTasks] = useState([])
  const [loadingMonth, setLoadingMonth] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks()
  const completedCount = tasks.filter((task) => task.completed).length
  const pendingCount = tasks.length - completedCount

  useEffect(() => {
    fetchTasks({ date: selectedDate })
  }, [fetchTasks, selectedDate])

  useEffect(() => {
    async function loadMonth() {
      setLoadingMonth(true)
      try {
        const monthKey = getMonthKey(currentMonth)
        const data = await taskService.getAll({ month: monthKey })
        setMonthTasks(data)
      } finally {
        setLoadingMonth(false)
      }
    }

    loadMonth()
  }, [currentMonth])

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
      fetchTasks({ date: selectedDate })
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
            <button className="rounded-full border border-primary/10 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-panel transition hover:border-primary/20 hover:text-primary" onClick={() => fetchTasks({ date: selectedDate })} type="button">
              Refresh
            </button>
            <button className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-float transition hover:bg-primary-dark" onClick={openCreate} type="button">
              Add Task
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div className="rounded-[1.5rem] bg-white/85 p-4 shadow-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Month view</p>
                <p className="mt-1 text-lg font-semibold text-ink">{currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full border border-slate-200 px-3 py-1 text-sm" onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} type="button">Prev</button>
                <button className="rounded-full border border-slate-200 px-3 py-1 text-sm" onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} type="button">Next</button>
              </div>
            </div>
            <MonthGrid
              currentMonth={currentMonth}
              monthTasks={monthTasks}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
            />
            {loadingMonth ? <p className="mt-3 text-xs text-slate-400">Loading month...</p> : null}
          </div>
          <div className="rounded-[1.5rem] bg-[linear-gradient(145deg,#172033_0%,#0f766e_100%)] p-5 text-white shadow-panel">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">Focus for {formatDateLabel(selectedDate)}</p>
            <p className="mt-2 text-2xl font-semibold">{tasks.length} task{tasks.length === 1 ? "" : "s"} lined up</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Pending</p>
                <p className="mt-2 text-lg font-semibold">{pendingCount}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Completed</p>
                <p className="mt-2 text-lg font-semibold">{completedCount}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Total</p>
                <p className="mt-2 text-lg font-semibold">{tasks.length}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/75">Use the floating action on mobile or the Add Task button above to keep your month current.</p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {loading ? <LoadingSpinner /> : null}
        {!loading && !tasks.length ? (
          <div className="glass-panel rounded-[2rem]">
            <EmptyState icon="???" message="No tasks for this date" subMessage="Tap the add button to create a new block and keep this date organized." />
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
