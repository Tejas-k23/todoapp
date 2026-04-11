import axios from "axios"

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

  return config
})

api.interceptors.response.use((response) => response, (error) => Promise.reject(error))

export default api

