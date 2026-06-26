import { useApp } from '../state/AppContext'
import { ACHIEVEMENTS } from '../data/achievements'
import { COURSES, TOPIC_LABEL } from '../data/courses'
import { LESSONS } from '../data/lessons'
import { overallProgress } from '../lib/selectors'
import Icon from '../components/Icon'
import ProgressRing from '../components/ProgressRing'
import { Flame, Award, BookCheck, Star, Lock } from 'lucide-react'
import type { Topic } from '../state/types'

const SKILL_ORDER: Topic[] = [
  'personal-finance', 'budgeting', 'investing', 'taxation', 'stock-markets', 'wealth-creation', 'entrepreneurship',
]

export default function Progress() {
  const { state } = useApp()
  const { progress } = state
  const overall = overallProgress(state)
  const maxXp = Math.max(100, ...Object.values(progress.skillXp))

  const avgScore =
    Object.values(progress.quizScores).length > 0
      ? Math.round(
          Object.values(progress.quizScores).reduce((a, b) => a + b, 0) /
            Object.values(progress.quizScores).length,
        )
      : 0

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-4">Your Progress</h1>

      {/* top stats */}
      <div className="card p-5 mb-4 flex items-center gap-5">
        <ProgressRing value={overall} size={88} stroke={8}>
          <div className="text-center">
            <p className="text-xl font-extrabold">{Math.round(overall * 100)}%</p>
            <p className="text-[9px] text-white/40">complete</p>
          </div>
        </ProgressRing>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <Mini icon={<BookCheck size={16} />} value={`${progress.completedLessons.length}/${LESSONS.length}`} label="Lessons" />
          <Mini icon={<Flame size={16} />} value={`${progress.streakCount}`} label="Day streak" />
          <Mini icon={<Star size={16} />} value={`${avgScore}%`} label="Avg quiz" />
          <Mini icon={<Award size={16} />} value={`${progress.unlockedAchievements.length}/${ACHIEVEMENTS.length}`} label="Badges" />
        </div>
      </div>

      {/* skill development */}
      <p className="text-sm font-semibold text-white/70 mb-2">Skill development</p>
      <div className="card p-4 mb-4 space-y-3">
        {SKILL_ORDER.map((s) => {
          const xp = progress.skillXp[s]
          return (
            <div key={s}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">{TOPIC_LABEL[s]}</span>
                <span className="text-white/40">{xp} XP</span>
              </div>
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-700" style={{ width: `${Math.min(100, (xp / maxXp) * 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* certificates */}
      <p className="text-sm font-semibold text-white/70 mb-2">Certificates</p>
      {progress.certificates.length ? (
        <div className="space-y-2 mb-4">
          {progress.certificates.map((cid) => {
            const c = COURSES.find((x) => x.id === cid)
            if (!c) return null
            return (
              <div key={cid} className="card p-4 flex items-center gap-3 border-gold-500/30">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-gold-500/15 text-gold-400">
                  <Award size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{c.title}</p>
                  <p className="text-xs text-white/40">Certificate of completion</p>
                </div>
                <span className="pill bg-gold-500/15 text-gold-400">Earned ✓</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-4 mb-4 text-center text-white/40 text-sm">
          Finish a full course to earn your first certificate 🎓
        </div>
      )}

      {/* achievements */}
      <p className="text-sm font-semibold text-white/70 mb-2">Achievements</p>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = progress.unlockedAchievements.includes(a.id)
          return (
            <div key={a.id} className={`card p-4 ${unlocked ? '' : 'opacity-50'}`}>
              <div className={`grid place-items-center w-10 h-10 rounded-full mb-2 ${unlocked ? 'bg-gold-500/15 text-gold-400' : 'bg-white/5 text-white/40'}`}>
                {unlocked ? <Icon name={a.icon} size={20} /> : <Lock size={16} />}
              </div>
              <p className="font-semibold text-sm">{a.title}</p>
              <p className="text-xs text-white/40 leading-snug">{a.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Mini({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="text-brand-300 mb-0.5">{icon}</div>
      <p className="font-bold leading-none">{value}</p>
      <p className="text-[10px] text-white/40">{label}</p>
    </div>
  )
}
