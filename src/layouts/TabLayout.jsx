import { NavLink, Outlet } from 'react-router-dom'
import Icon from '../components/Icon'
import logo from '../assets/logo.png'

const TABS = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/attendance', label: 'Attendance', icon: 'calendar' },
  { to: '/results', label: 'Results', icon: 'stats-chart' },
  { to: '/quizzes', label: 'Quiz', icon: 'book' },
  { to: '/profile', label: 'Profile', icon: 'person' },
]

const ACTIVE = '#E31E24'
const INACTIVE = '#94A3B8'

// Mirrors app/(tabs)/_layout.tsx. Bottom tab bar on mobile/tablet becomes a
// left sidebar on desktop (md+) — same items, same colors, same icons.
export default function TabLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-slate-100 md:py-8">
        <div className="mb-10 flex items-center gap-3 px-6">
          <img src={logo} alt="Best Academy" className="h-10 w-10 object-contain" />
          <span className="text-lg font-black tracking-tight text-slate-900">Best Academy</span>
        </div>
        <nav className="flex flex-col gap-1 px-4">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-colors ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={tab.icon} size={20} color={isActive ? '#fff' : INACTIVE} />
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 pb-[65px] md:pb-0">
        <Outlet />
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-100 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
        style={{ height: 65 }}
      >
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className="flex flex-1 flex-col items-center gap-1 py-2">
            {({ isActive }) => (
              <>
                <Icon name={tab.icon} size={22} color={isActive ? ACTIVE : INACTIVE} />
                <span
                  className="text-[10px] font-bold"
                  style={{ color: isActive ? ACTIVE : INACTIVE }}
                >
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
