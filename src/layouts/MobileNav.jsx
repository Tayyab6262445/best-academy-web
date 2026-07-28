import { NavLink } from 'react-router-dom'
import Icon from '../components/Icon'
import { MOBILE_TAB_ITEMS } from './Sidebar'

export default function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden"
      style={{ height: 64 }}
    >
      {MOBILE_TAB_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex flex-1 flex-col items-center gap-1 py-2 transition-colors"
        >
          {({ isActive }) => (
            <>
              <Icon name={item.icon} size={20} className={isActive ? 'text-academyRed' : 'text-slate-400'} />
              <span className={`text-[11px] font-medium ${isActive ? 'text-academyRed' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
