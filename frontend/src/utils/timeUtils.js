export function formatTime(time24, format = "12H") {
  if (!time24) return "--:--"
  const [h, m] = time24.split(":").map(Number)
  if (format === "24H") {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
  }
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

export function getTodayKey() {
  return ["S", "M", "T", "W", "Th", "F", "Sa"][new Date().getDay()]
}

export function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getMonthKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export function formatDateLabel(value) {
  if (!value) return "No date"
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export function compareTimes(startTime, endTime) {
  return startTime.localeCompare(endTime)
}

export function formatTimeRange(startTime, endTime) {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}

export function getMinutesOptions() {
  return Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"))
}
