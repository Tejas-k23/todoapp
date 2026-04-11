import { useCallback, useState } from "react"

import { useToast } from "./useToast"
import { taskService } from "../services/taskService"

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const fetchTasks = useCallback(async (params) => {
    setLoading(true)
    try {
      const data = await taskService.getAll(params)
      setTasks(data)
      return data
    } catch (error) {
      showToast(error.response?.data?.detail || "Failed to load tasks", "error")
      return []
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const createTask = useCallback(async (payload) => {
    const task = await taskService.create(payload)
    setTasks((current) => [...current, task].sort((a, b) => a.start_time.localeCompare(b.start_time)))
    showToast("Task created", "success")
    return task
  }, [showToast])

  const updateTask = useCallback(async (id, payload) => {
    const updated = await taskService.update(id, payload)
    setTasks((current) => current.map((task) => (task.id === id ? updated : task)))
    showToast("Task updated", "success")
    return updated
  }, [showToast])

  const deleteTask = useCallback(async (id) => {
    await taskService.delete(id)
    setTasks((current) => current.filter((task) => task.id !== id))
    showToast("Task deleted", "success")
  }, [showToast])

  return { tasks, setTasks, loading, fetchTasks, createTask, updateTask, deleteTask }
}
