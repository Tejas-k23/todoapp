import api from "./api"

export const taskService = {
  getAll: (params) => api.get("/tasks/", { params: params || {} }).then((response) => response.data),
  getById: (id) => api.get(`/tasks/${id}`).then((response) => response.data),
  create: (data) => api.post("/tasks/", data).then((response) => response.data),
  update: (id, data) => api.put(`/tasks/${id}`, data).then((response) => response.data),
  delete: (id) => api.delete(`/tasks/${id}`),
  deleteAll: () => api.delete("/tasks/"),
}
