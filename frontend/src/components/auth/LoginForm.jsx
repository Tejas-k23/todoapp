import { useState } from "react"

export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", password: "" })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(form) }}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary" name="name" onChange={handleChange} required value={form.name} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary" name="password" onChange={handleChange} required type="password" value={form.password} />
      </label>
      <button className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/20" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  )
}
