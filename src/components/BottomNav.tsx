import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Gamepad2, Trophy, Sparkles } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/simulator', label: 'Life Sim', icon: Gamepad2, hero: true },
  { to: '/progress', label: 'Progress', icon: Trophy },
  { to: '/mentor', label: 'Mentor', icon: Sparkles },
]

export default function BottomNav() {
  return (
    <nav className="shrink-0 border-t border-white/10 bg-ink-900/90 backdrop-blur px-2 pt-2 pb-3">
      <ul className="flex items-end justify-between">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <li key={t.to} className="flex-1">
              <NavLink
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-1 text-[10px] font-semibold transition ${
                    isActive ? 'text-brand-300' : 'text-white/45'
                  }`
                }
              >
                {({ isActive }) =>
                  t.hero ? (
                    <>
                      <span
                        className={`-mt-5 grid place-items-center w-12 h-12 rounded-2xl shadow-card transition ${
                          isActive ? 'bg-brand-400 text-ink-900' : 'bg-brand-500/90 text-ink-900'
                        }`}
                      >
                        <Icon size={22} strokeWidth={2.4} />
                      </span>
                      <span>{t.label}</span>
                    </>
                  ) : (
                    <>
                      <Icon size={20} strokeWidth={isActive ? 2.6 : 2} />
                      <span>{t.label}</span>
                    </>
                  )
                }
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
