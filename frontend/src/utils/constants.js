export const COLORS = {
  primary: "#6B1C3E",
  primaryLight: "#8B2252",
  primaryDark: "#4A1229",
  accent: "#00B4A6",
}

export const DAYS = [
  { key: "S", label: "Sun", full: "Sunday" },
  { key: "M", label: "Mon", full: "Monday" },
  { key: "T", label: "Tue", full: "Tuesday" },
  { key: "W", label: "Wed", full: "Wednesday" },
  { key: "Th", label: "Thu", full: "Thursday" },
  { key: "F", label: "Fri", full: "Friday" },
  { key: "Sa", label: "Sat", full: "Saturday" },
]

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
