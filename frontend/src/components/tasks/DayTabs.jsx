import { useEffect, useRef } from "react"

import { DAYS } from "../../utils/constants"
import { getTodayKey } from "../../utils/timeUtils"

export default function DayTabs({ selectedDay, onDayChange }) {
  const refs = useRef({})

  useEffect(() => {
    const target = refs.current[getTodayKey()]
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [])

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 snap-x snap-mandatory">
        {DAYS.map((day) => {
          const active = day.key === selectedDay
          return (
            <button
              key={day.key}
              className={`snap-start whitespace-nowrap rounded-t-2xl border-b-2 px-4 py-3 text-sm transition ${active ? "border-primary font-semibold text-primary" : "border-transparent text-slate-400"}`}
              onClick={() => onDayChange(day.key)}
              ref={(element) => { refs.current[day.key] = element }}
              type="button"
            >
              {day.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
