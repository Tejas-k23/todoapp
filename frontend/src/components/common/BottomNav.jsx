import { NavLink } from "react-router-dom"

const items = [
  { to: "/home", icon: "??", label: "Home" },
  { to: "/dashboard", icon: "??", label: "Plan" },
  { to: "/tasks", icon: "?", label: "Tasks" },
  { to: "/login", icon: "??", label: "Profile" },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/70 bg-white/90 px-2 pb-safe pt-2 shadow-[0_-14px_30px_rgba(23,32,51,0.08)] backdrop-blur md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition ${isActive ? "bg-primary/8 text-primary" : "text-slate-400"}`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
