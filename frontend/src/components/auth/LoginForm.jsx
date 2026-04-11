import { useState } from "react"

export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(form) }}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Name or mobile number</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary" name="name" onChange={handleChange} placeholder="Enter name or mobile number" required value={form.name} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
        <div className="relative">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-20 outline-none transition focus:border-primary" name="password" onChange={handleChange} required type={showPassword ? "text" : "password"} value={form.password} />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600" onClick={() => setShowPassword((value) => !value)} type="button">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>
      <button className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/20" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  )
}
