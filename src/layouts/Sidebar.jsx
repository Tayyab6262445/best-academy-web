import { NavLink } from 'react-router-dom'
import Icon from '../components/Icon'
import logo from '../assets/logo.png'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { to: '/attendance', label: 'Attendance', icon: 'calendar-outline' },
  { to: '/results', label: 'Results', icon: 'bar-chart-outline' },
  { to: '/quizzes', label: 'Quizzes', icon: 'book' },
  { to: '/courses', label: 'Courses', icon: 'library-outline' },
  { to: '/profile', label: 'Profile', icon: 'person' },
]

export const MOBILE_TAB_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: 'grid-outline' },
  { to: '/attendance', label: 'Attendance', icon: 'calendar-outline' },
  { to: '/results', label: 'Results', icon: 'bar-chart-outline' },
  { to: '/quizzes', label: 'Quiz', icon: 'book' },
  { to: '/profile', label: 'Profile', icon: 'person' },
]

export default function Sidebar() {
  return (
    <aside className="hidden shrink-0 border-r border-slate-200 bg-white md:flex md:w-64 md:flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
        <img src={logo} alt="Best Academy" className="h-8 w-8 object-contain" />
        <span className="text-[15px] font-semibold tracking-tight text-slate-900">Best Academy</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-academyRed/10 text-academyRed' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Best Academy</p>
      </div>
    </aside>
  )
}
