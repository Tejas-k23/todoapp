import { useEffect, useState } from "react"

import { useAuth } from "../hooks/useAuth"
import { useToast } from "../hooks/useToast"

const emptyProfile = {
  name: "",
  mobile_number: "",
  email: "",
  instagram: "",
}

export default function ProfilePage() {
  const { user, updateProfile, changePassword, loading } = useAuth()
  const { showToast } = useToast()
  const [profile, setProfile] = useState(emptyProfile)
  const [passwords, setPasswords] = useState({ current: "", next: "" })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        mobile_number: user.mobile_number || "",
        email: user.email || "",
        instagram: user.instagram || "",
      })
    }
  }, [user])

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()
    try {
      const payload = {
        name: profile.name.trim(),
        mobile_number: profile.mobile_number.trim(),
        email: profile.email.trim() || null,
        instagram: profile.instagram.trim() || null,
      }
      await updateProfile(payload)
      showToast("Profile updated", "success")
    } catch (error) {
      showToast(error.response?.data?.detail || "Profile update failed", "error")
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    if (!passwords.current || !passwords.next) {
      showToast("Enter current and new password", "error")
      return
    }
    try {
      await changePassword(passwords.current, passwords.next)
      setPasswords({ current: "", next: "" })
      showToast("Password updated", "success")
    } catch (error) {
      showToast(error.response?.data?.detail || "Password update failed", "error")
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-8 md:px-6 md:pb-10 md:pt-24">
      <div className="glass-panel rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">Profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Account settings</h1>
        <p className="mt-2 text-sm text-slate-600">Update your details and keep your login secure.</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("name", event.target.value)} required value={profile.name} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Mobile number</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("mobile_number", event.target.value)} required type="tel" value={profile.mobile_number} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" type="email" value={profile.email} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Instagram</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => updateField("instagram", event.target.value)} placeholder="@handle" value={profile.instagram} />
          </label>
          <div className="md:col-span-2">
            <button className="rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-float" disabled={loading} type="submit">
              {loading ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">Change password</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handlePasswordSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Current password</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))} type="password" value={passwords.current} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">New password</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))} type="password" value={passwords.next} />
          </label>
          <div className="md:col-span-2">
            <button className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white" disabled={loading} type="submit">
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
