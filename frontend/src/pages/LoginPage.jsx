import { Link, Navigate, useNavigate } from "react-router-dom"

import LoginForm from "../components/auth/LoginForm"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../hooks/useToast"
import { extractVerificationToken, normalizeMobileNumber, verifyMobileOtp } from "../utils/otpWidget"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated } = useAuth()
  const { showToast } = useToast()

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(form) {
    try {
      const mobileNumber = normalizeMobileNumber(form.mobile_number)
      const verificationData = await verifyMobileOtp(mobileNumber)
      const verificationToken = extractVerificationToken(verificationData)
      await login(mobileNumber, verificationToken)
      showToast("Welcome back", "success")
      navigate("/dashboard")
    } catch (error) {
      showToast(error.response?.data?.detail || error.message || "OTP login failed", "error")
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 shadow-float backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-[linear-gradient(160deg,#172033_0%,#0f766e_55%,#14b8a6_100%)] p-6 text-white sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Study Planner Login</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Sign in with your mobile number and OTP.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/80 sm:text-base">
            The MSG91 widget opens after you submit your phone number. Once the OTP is verified, we exchange the returned token for your app session.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              "Enter phone number",
              "Verify in MSG91 widget",
              "Continue into dashboard",
            ].map((step, index) => (
              <div key={step} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
                <span className="mr-2 text-white/60">0{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </section>

        <section className="app-shell p-5 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md rounded-[1.75rem] bg-white/80 p-6 shadow-panel backdrop-blur sm:p-8">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-primary/70">STUDY PLANNER</p>
            <h2 className="mt-3 text-center text-3xl font-semibold text-ink">Welcome back</h2>
            <p className="mt-2 text-center text-sm text-slate-500">Use your mobile number and OTP to sign in securely.</p>
            <div className="mt-8">
              <LoginForm loading={loading} onSubmit={handleSubmit} />
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account? <Link className="font-semibold text-primary" to="/signup">Sign up</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
