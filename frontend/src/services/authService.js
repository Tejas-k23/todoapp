import api from "./api"
import { storage } from "../utils/storage"

export const authService = {
  async signup(name, mobileNumber, verificationToken) {
    const { data } = await api.post("/auth/signup", {
      name,
      mobile_number: mobileNumber,
      verification_token: verificationToken,
    })
    storage.set("token", data.access_token)
    storage.set("user", data.user)
    return data
  },

  async login(mobileNumber, verificationToken) {
    const { data } = await api.post("/auth/login", {
      mobile_number: mobileNumber,
      verification_token: verificationToken,
    })
    storage.set("token", data.access_token)
    storage.set("user", data.user)
    return data
  },

  async getMe() {
    const { data } = await api.get("/auth/me")
    storage.set("user", data)
    return data
  },

  logout() {
    storage.remove("token")
    storage.remove("user")
    window.location.href = "/login"
  },

  isAuthenticated() {
    return Boolean(storage.get("token"))
  },

  getUser() {
    return storage.get("user")
  },
}