import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, Gamepad2, Trophy, Sparkles } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/simulator', label: 'Life Sim', icon: Gamepad2, hero: true },
  { to: '/progress', label: 'Progress', icon: Trophy },
  { to: '/mentor', label: 'Mentor', icon: Sparkles },
]

function indexForPath(path: string): number {
  if (path === '/') return 0
  if (path.startsWith('/learn')) return 1
  if (path.startsWith('/simulator')) return 2
  if (path.startsWith('/progress')) return 3
  if (path.startsWith('/mentor')) return 4
  return 0
}

// Floating glass dock with a spring-driven active indicator (adapted from 21st.dev "LumaBar").
export default function BottomNav() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const active = indexForPath(pathname)

  return (
    <div className="shrink-0 px-3 pb-3 pt-1">
      <div className="relative flex items-end justify-between rounded-[1.6rem] border border-white/10 bg-ink-900/70 px-2 py-2 backdrop-blur-xl shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.6)]">
        {tabs.map((t, i) => {
          const Icon = t.icon
          const isActive = i === active

          if (t.hero) {
            return (
              <button
                key={t.to}
                onClick={() => nav(t.to)}
                className="relative flex-1 flex flex-col items-center gap-1"
                aria-label={t.label}
              >
                <motion.span
                  whileTap={{ scale: 0.88 }}
                  animate={{
                    y: -16,
                    boxShadow: isActive
                      ? '0 10px 26px -8px rgba(16,185,129,0.9), inset 0 1px 0 rgba(255,255,255,0.5)'
                      : '0 6px 18px -10px rgba(16,185,129,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="grid place-items-center w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-brand-300 to-brand-600 text-ink-900"
                >
                  <Icon size={24} strokeWidth={2.4} />
                </motion.span>
                <span className={`-mt-3 text-[10px] font-semibold ${isActive ? 'text-brand-300' : 'text-white/45'}`}>
                  {t.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={t.to}
              onClick={() => nav(t.to)}
              className="relative flex-1 flex flex-col items-center gap-1 py-1"
              aria-label={t.label}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-3 top-0 h-9 rounded-xl bg-brand-500/15"
                  transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                />
              )}
              <motion.span
                whileTap={{ scale: 0.82 }}
                animate={{ scale: isActive ? 1.08 : 1, color: isActive ? '#6ee7b7' : 'rgba(255,255,255,0.45)' }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="relative z-10"
              >
                <Icon size={21} strokeWidth={isActive ? 2.6 : 2} />
              </motion.span>
              <span className={`relative z-10 text-[10px] font-semibold transition-colors ${isActive ? 'text-brand-300' : 'text-white/45'}`}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
