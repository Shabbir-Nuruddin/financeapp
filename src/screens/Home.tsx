import { Link, useNavigate } from 'react-router-dom'
import { Flame, Target, ChevronRight, Play, TrendingUp, Award, RotateCcw } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { overallProgress, recommendedLesson } from '../lib/selectors'
import { netWorth, monthlySipTotal } from '../sim/engine'
import { inr } from '../lib/format'
import ProgressRing from '../components/ProgressRing'
import { courseById } from '../data/courses'
import { ACHIEVEMENTS } from '../data/achievements'
import Icon from '../components/Icon'
import CountUp from '../components/CountUp'
import Wordmark from '../components/Wordmark'
import Sparkline from '../components/Sparkline'

const STAGE_LABEL: Record<string, string> = {
  'first-job': 'First job',
  'settling-in': 'Settling in',
  family: 'Family years',
  'peak-earning': 'Peak earning',
  'pre-retirement': 'Pre-retirement',
}

export default function Home() {
  const { state, resetAll } = useApp()
  const nav = useNavigate()
  const { profile, sim, progress } = state
  if (!profile || !sim) return null

  const rec = recommendedLesson(state)
  const recCourse = rec ? courseById(rec.courseId) : null
  const overall = overallProgress(state)
  const nw = netWorth(sim)
  const recentAch = ACHIEVEMENTS.filter((a) => progress.unlockedAchievements.includes(a.id)).slice(-3)

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-up">
      {/* header */}
      <div className="flex items-center justify-between mb-1">
        <Wordmark size={20} />
        <button onClick={() => { if (confirm('Reset all progress and start over?')) resetAll() }} className="p-2 text-white/30 hover:text-white/60" title="Reset demo">
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-white/50 text-sm">Welcome back,</p>
          <h1 className="text-2xl font-extrabold tracking-tight">{profile.name} 👋</h1>
        </div>
        <div className="pill bg-gold-500/15 text-gold-400">
          <Flame size={14} /> {progress.streakCount} day streak
        </div>
      </div>

      {/* HERO: simulated financial life */}
      <Link
        to="/simulator"
        className="block rounded-3xl p-5 mb-4 border border-white/10 shadow-card relative overflow-hidden"
        style={{
          background:
            'radial-gradient(130% 120% at 88% -15%, rgba(255,176,32,0.40), transparent 52%),' +
            'radial-gradient(130% 130% at -5% 120%, rgba(255,77,141,0.38), transparent 58%),' +
            'linear-gradient(150deg, #2a2065 0%, #15123a 100%)',
        }}
      >
        {/* net-worth trajectory, embedded subtly into the card */}
        <Sparkline points={sim.history.map((h) => h.netWorth)} className="absolute inset-x-0 bottom-0 h-16 w-full opacity-70" />

        <div className="relative flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-brand-200 text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-brand-300 animate-pulse" /> YOUR FINANCIAL LIFE
          </div>
          <span className="pill bg-black/25 text-brand-100">Age {sim.age} · {sim.age < 27 ? 'First job' : STAGE_LABEL[sim.lifeStage]}</span>
        </div>
        <div className="relative flex items-end justify-between">
          <div>
            <p className="text-white/55 text-sm">Net worth so far</p>
            <CountUp value={nw} format={inr} className="text-[2rem] leading-none font-extrabold num block" />
            <p className="text-brand-200/80 text-xs mt-1.5">
              {monthlySipTotal(sim) > 0 ? `${inr(monthlySipTotal(sim))}/mo invested` : 'Not investing yet'} · play to grow it
            </p>
          </div>
          <span className="pill bg-white/15 text-white shrink-0">
            Play <ChevronRight size={14} />
          </span>
        </div>
      </Link>

      {/* goal + progress */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card p-4">
          <Target size={18} className="text-brand-300 mb-2" />
          <p className="text-xs text-white/50">Your goal</p>
          <p className="font-semibold text-sm leading-snug mt-0.5">{profile.goal}</p>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <ProgressRing value={overall} size={56}>
            <span className="text-xs font-bold">{Math.round(overall * 100)}%</span>
          </ProgressRing>
          <div>
            <p className="text-xs text-white/50">Course progress</p>
            <p className="font-semibold text-sm">{progress.completedLessons.length} lessons done</p>
          </div>
        </div>
      </div>

      {/* recommended next */}
      {rec && (
        <div className="mb-5">
          <p className="text-sm font-semibold text-white/70 mb-2">Recommended for you</p>
          <button
            onClick={() => nav(`/learn/${rec.id}`)}
            className="w-full card p-4 flex items-center gap-3 text-left hover:bg-white/[0.07] transition"
          >
            <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand-500/15 text-brand-300 shrink-0">
              <Play size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wide text-brand-300/80">{recCourse?.title}</p>
              <p className="font-semibold text-sm truncate">{rec.title}</p>
              <p className="text-xs text-white/40">{rec.durationMin} min · lesson + real decision</p>
            </div>
            <ChevronRight size={18} className="text-white/30" />
          </button>
        </div>
      )}

      {/* quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="Net worth" value={inr(nw)} icon={<TrendingUp size={16} />} />
        <Stat label="Courses" value={`${progress.completedCourses.length}/8`} icon={<Award size={16} />} />
        <Stat label="Badges" value={`${progress.unlockedAchievements.length}`} icon={<Flame size={16} />} />
      </div>

      {/* achievements */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-white/70">Recent achievements</p>
        <Link to="/progress" className="text-xs text-brand-300">See all</Link>
      </div>
      {recentAch.length ? (
        <div className="flex gap-3">
          {recentAch.map((a) => (
            <div key={a.id} className="card p-3 flex-1 text-center">
              <div className="grid place-items-center w-9 h-9 mx-auto rounded-full bg-gold-500/15 text-gold-400 mb-1">
                <Icon name={a.icon} size={18} />
              </div>
              <p className="text-[10px] font-semibold leading-tight">{a.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-4 text-center text-white/40 text-sm">
          Complete your first lesson to earn a badge 🏅
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card p-3">
      <div className="text-brand-300 mb-1">{icon}</div>
      <p className="font-bold text-sm">{value}</p>
      <p className="text-[10px] text-white/40">{label}</p>
    </div>
  )
}
