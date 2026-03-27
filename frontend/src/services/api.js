import axios from "axios"

import { storage } from "../utils/storage"
import { API_URL } from "../utils/constants"

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  // Some third-party APIs reject browser preflights when this legacy header is present.
  if (config.headers?.delete) {
    config.headers.delete("X-Requested-With")
    config.headers.delete("x-requested-with")
  } else if (config.headers) {
    delete config.headers["X-Requested-With"]
    delete config.headers["x-requested-with"]
  }

  const token = storage.get("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("token")
      storage.remove("user")
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api

