import { Navigate, Link } from "react-router-dom"

import { useAuth } from "../hooks/useAuth"

const features = [
  {
    title: "Adaptive weekly planning",
    description: "Build routines by day, adjust blocks quickly, and keep the whole week readable on any screen.",
    icon: "01",
  },
  {
    title: "Mobile-first task flow",
    description: "Fast cards, bottom navigation, and compact actions make the app feel closer to a native planner.",
    icon: "02",
  },
  {
    title: "Simple mobile sign-in",
    description: "Use your mobile number as your account identifier and get back into your planner quickly.",
    icon: "03",
  },
]

const highlights = ["Offline-friendly PWA", "Focused day tabs", "Fast mobile sign-in"]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-20 sm:px-6 md:px-8 md:pb-16 md:pt-28">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary shadow-panel backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Study Planner
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            A fresher, calmer timetable UI for planning your week.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Organize classes, routines, and daily tasks in one place with a cleaner dashboard, better mobile spacing, and phone-first account access.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-full bg-primary px-6 py-3 text-center font-semibold text-white shadow-float transition hover:bg-primary-dark" to="/signup">
              Start Free
            </Link>
            <Link className="rounded-full border border-primary/15 bg-white/80 px-6 py-3 text-center font-semibold text-primary shadow-panel transition hover:bg-white" to="/login">
              Login
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span key={item} className="rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary sm:text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-[2rem] p-4 sm:p-5">
          <div className="rounded-[1.75rem] bg-[linear-gradient(145deg,#172033_0%,#0f766e_55%,#14b8a6_100%)] p-5 text-white sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Today</p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Move through your day with clarity.</h2>
              </div>
              <div className="hidden rounded-2xl bg-white/10 px-3 py-2 text-xs font-medium text-white/80 sm:block">Synced</div>
            </div>
            <div className="mt-6 space-y-3">
              {[
                ["08:30", "Deep work block", "Priority"],
                ["12:00", "Class review", "Study"],
                ["18:30", "Workout + reset", "Personal"],
              ].map(([time, title, tag]) => (
                <div key={time} className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{time}</p>
                    <p className="mt-1 font-medium text-white">{title}</p>
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="glass-panel rounded-[1.75rem] p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
              {feature.icon}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-ink">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

