import { useMemo, useState } from "react"

import { getMinutesOptions } from "../../utils/timeUtils"

const positions = [
  [50, 14], [68, 20], [80, 32], [86, 50], [80, 68], [68, 80],
  [50, 86], [32, 80], [20, 68], [14, 50], [20, 32], [32, 20],
]

function to12HourParts(value) {
  const [hourString, minute = "00"] = value.split(":")
  const hour24 = Number(hourString)
  const period = hour24 >= 12 ? "PM" : "AM"
  const hour = hour24 % 12 || 12
  return { hour, minute, period }
}

function to24Hour(hour, minute, period) {
  let resultHour = hour % 12
  if (period === "PM") resultHour += 12
  return `${String(resultHour).padStart(2, "0")}:${minute}`
}

export default function TimePicker({ value = "09:00", onChange, onClose }) {
  const initial = useMemo(() => to12HourParts(value), [value])
  const [step, setStep] = useState("hour")
  const [hour, setHour] = useState(initial.hour)
  const [minute, setMinute] = useState(initial.minute)
  const [period, setPeriod] = useState(initial.period)
  const minutes = getMinutesOptions()

  function confirm() {
    onChange(to24Hour(hour, minute, period))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 px-4 pb-4 md:items-center">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-float animate-slide-up">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pick time</p>
          <div className="mt-3 text-3xl font-semibold text-primary">{String(hour).padStart(2, "0")} : {minute}</div>
          <div className="mt-4 flex justify-center gap-2">
            {['AM', 'PM'].map((valueItem) => (
              <button key={valueItem} className={`rounded-full px-4 py-2 text-sm font-semibold ${period === valueItem ? 'bg-primary text-white' : 'bg-sand text-primary'}`} onClick={() => setPeriod(valueItem)} type="button">{valueItem}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <button className={`rounded-full px-4 py-2 ${step === 'hour' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`} onClick={() => setStep('hour')} type="button">Hour</button>
          <button className={`rounded-full px-4 py-2 ${step === 'minute' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`} onClick={() => setStep('minute')} type="button">Minute</button>
        </div>

        {step === 'hour' ? (
          <svg className="mx-auto mt-6 h-64 w-64" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="#F7F0EA" r="42" />
            {positions.map(([x, y], index) => {
              const valueItem = index + 1
              const selected = valueItem === hour
              return (
                <g key={valueItem} className="cursor-pointer" onClick={() => { setHour(valueItem); setStep('minute') }}>
                  <circle cx={x} cy={y} fill={selected ? '#6B1C3E' : 'white'} r="8" stroke="#E7D8D0" />
                  <text dominantBaseline="middle" fill={selected ? 'white' : '#6B1C3E'} fontSize="5" fontWeight="700" textAnchor="middle" x={x} y={y + 0.7}>{valueItem}</text>
                </g>
              )
            })}
          </svg>
        ) : (
          <div className="mt-6 grid grid-cols-4 gap-3">
            {minutes.map((valueItem) => (
              <button key={valueItem} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${minute === valueItem ? 'bg-primary text-white' : 'bg-sand text-primary'}`} onClick={() => setMinute(valueItem)} type="button">{valueItem}</button>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500" onClick={onClose} type="button">CANCEL</button>
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white" onClick={confirm} type="button">OK</button>
        </div>
      </div>
    </div>
  )
}
