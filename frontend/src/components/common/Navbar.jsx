import { NavLink } from "react-router-dom"

const navItemClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-primary text-white shadow-float" : "text-slate-600 hover:bg-white hover:text-primary"}`

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 hidden border-b border-white/60 bg-white/55 backdrop-blur md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <NavLink className="text-xl font-bold tracking-[0.24em] text-primary" to="/dashboard">STUDY PLANNER</NavLink>
        <nav className="flex items-center gap-2 rounded-full border border-white/60 bg-white/75 p-1 shadow-panel">
          <NavLink className={navItemClass} to="/home">Home</NavLink>
          <NavLink className={navItemClass} to="/dashboard">Dashboard</NavLink>
          <NavLink className={navItemClass} to="/tasks">Tasks</NavLink>
          <NavLink className={navItemClass} to="/profile">Profile</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-primary/10 bg-white/80 px-3 py-2 shadow-panel">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">SP</div>
            <div className="max-w-[12rem] truncate text-sm font-medium text-slate-700">Shared Planner</div>
          </div>
        </div>
      </div>
    </header>
  )
}

