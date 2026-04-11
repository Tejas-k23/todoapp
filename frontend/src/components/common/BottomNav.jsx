import { NavLink } from "react-router-dom"

function HomeIcon(props) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M3.75 10.5 12 3.75l8.25 6.75v9a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75V15a2.25 2.25 0 0 0-4.5 0v4.5a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75v-9Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function PlanIcon(props) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M7.5 3.75v3m9-3.75v3M4.5 8.25h15m-13.5 12h12a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5h-12A1.5 1.5 0 0 0 4.5 9.75v9a1.5 1.5 0 0 0 1.5 1.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8.25 12h3v3h-3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function TasksIcon(props) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M9 6.75h10.5M9 12h10.5M9 17.25h10.5M4.5 6.75h.008v.008H4.5V6.75Zm0 5.25h.008v.008H4.5V12Zm0 5.25h.008v.008H4.5v-.008Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function ProfileIcon(props) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.125a7.5 7.5 0 0 1 15 0 .375.375 0 0 1-.375.375H4.875a.375.375 0 0 1-.375-.375Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

export default function BottomNav() {
  const items = [
    { to: "/home", icon: HomeIcon, label: "Home" },
    { to: "/dashboard", icon: PlanIcon, label: "Plan" },
    { to: "/tasks", icon: TasksIcon, label: "Tasks" },
    { to: "/profile", icon: ProfileIcon, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/70 bg-white/90 px-2 pb-safe pt-2 shadow-[0_-14px_30px_rgba(23,32,51,0.08)] backdrop-blur md:hidden">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition ${isActive ? "bg-primary/8 text-primary" : "text-slate-400"}`}
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${isActive ? "bg-primary text-white shadow-float" : "bg-slate-100 text-slate-500"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
