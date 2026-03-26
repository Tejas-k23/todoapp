import { useState } from "react"

export default function LoginForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ mobile_number: "" })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(form) }}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Mobile number</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary" name="mobile_number" onChange={handleChange} placeholder="Enter phone number" required type="tel" value={form.mobile_number} />
      </label>
      <div className="rounded-2xl bg-sand px-4 py-3 text-xs leading-6 text-slate-500">
        Sign in with the same mobile number you used when creating your account.
      </div>
      <button className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/20" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  )
}
