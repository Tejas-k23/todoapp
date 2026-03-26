import { Link, Navigate, useNavigate } from "react-router-dom"

import SignupForm from "../components/auth/SignupForm"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../hooks/useToast"
import { extractVerificationToken, normalizeMobileNumber, verifyMobileOtp } from "../utils/otpWidget"

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, loading, isAuthenticated } = useAuth()
  const { showToast } = useToast()

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(form) {
    try {
      const mobileNumber = normalizeMobileNumber(form.mobile_number)
      const verificationData = await verifyMobileOtp(mobileNumber)
      const verificationToken = extractVerificationToken(verificationData)
      await signup(form.name, mobileNumber, verificationToken)
      showToast("Account created", "success")
      navigate("/dashboard")
    } catch (error) {
      showToast(error.response?.data?.detail || error.message || "OTP signup failed", "error")
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 shadow-float backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-[linear-gradient(160deg,#fff8ec_0%,#eef6f3_52%,#dff7f2_100%)] p-6 text-ink sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">Create Account</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Create your account with OTP and start planning faster.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            New accounts are created only after your number is verified through the MSG91 OTP widget, so the signup flow stays simple and phone-first.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              "Add your name",
              "Verify mobile number",
              "Land in your planner",
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-primary/10 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-panel">
                <span className="mr-2 text-primary/60">0{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </section>

        <section className="app-shell p-5 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md rounded-[1.75rem] bg-white/80 p-6 shadow-panel backdrop-blur sm:p-8">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-primary/70">STUDY PLANNER</p>
            <h2 className="mt-3 text-center text-3xl font-semibold text-ink">Create your account</h2>
            <p className="mt-2 text-center text-sm text-slate-500">Verify your mobile number with OTP to get started.</p>
            <div className="mt-8">
              <SignupForm loading={loading} onSubmit={handleSubmit} />
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account? <Link className="font-semibold text-primary" to="/login">Login</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
