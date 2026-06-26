import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COURSES, TOPIC_LABEL } from '../data/courses'
import { LESSONS } from '../data/lessons'
import { useApp } from '../state/AppContext'
import { courseProgress } from '../lib/selectors'
import ProgressRing from '../components/ProgressRing'
import Icon from '../components/Icon'
import { CheckCircle2, Lock, Search } from 'lucide-react'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'some', label: 'Intermediate' },
  { id: 'confident', label: 'Advanced' },
]

export default function CourseLibrary() {
  const { state } = useApp()
  const nav = useNavigate()
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  const courses = COURSES.filter((c) => {
    const matchFilter = filter === 'all' || c.level === filter
    const matchQ =
      !q ||
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      TOPIC_LABEL[c.topic].toLowerCase().includes(q.toLowerCase())
    return matchFilter && matchQ
  })

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-1">Course Library</h1>
      <p className="text-white/50 text-sm mb-4">Every lesson ends in a decision your sim actually makes.</p>

      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics…"
          className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand-400"
        />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill whitespace-nowrap border ${
              filter === f.id
                ? 'bg-brand-500 text-ink-900 border-brand-500'
                : 'border-white/15 text-white/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {courses.map((c) => {
          const prog = courseProgress(state, c.id)
          const lessons = c.lessonIds.map((id) => LESSONS.find((l) => l.id === id)!).filter(Boolean)
          const done = c.lessonIds.filter((id) => state.progress.completedLessons.includes(id)).length
          const certified = state.progress.certificates.includes(c.id)
          return (
            <div key={c.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center w-12 h-12 rounded-xl bg-brand-500/15 text-brand-300 shrink-0">
                  <Icon name={c.icon} size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wide text-brand-300/70">
                      {TOPIC_LABEL[c.topic]}
                    </span>
                    {certified && (
                      <span className="pill bg-gold-500/15 text-gold-400 text-[9px] py-0.5">Certified ✓</span>
                    )}
                  </div>
                  <h3 className="font-bold leading-snug">{c.title}</h3>
                  <p className="text-xs text-white/45 mt-0.5">{c.blurb}</p>
                </div>
                <ProgressRing value={prog} size={44} stroke={5}>
                  <span className="text-[9px] font-bold">{Math.round(prog * 100)}%</span>
                </ProgressRing>
              </div>

              <div className="mt-3 space-y-1">
                {lessons.map((l, i) => {
                  const isDone = state.progress.completedLessons.includes(l.id)
                  const locked = i > 0 && !state.progress.completedLessons.includes(lessons[i - 1].id)
                  return (
                    <button
                      key={l.id}
                      disabled={locked}
                      onClick={() => nav(`/learn/${l.id}`)}
                      className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                        locked ? 'opacity-40' : 'hover:bg-white/5'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-brand-400 shrink-0" />
                      ) : locked ? (
                        <Lock size={14} className="text-white/40 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-white/30 shrink-0" />
                      )}
                      <span className="flex-1 truncate">{l.title}</span>
                      {l.scenario && <span className="text-[9px] text-gold-400">+ decision</span>}
                    </button>
                  )
                })}
              </div>
              <p className="text-[11px] text-white/35 mt-2">
                {done}/{c.lessonIds.length} lessons
              </p>
            </div>
          )
        })}
        {!courses.length && (
          <p className="text-center text-white/40 py-10">No courses match “{q}”.</p>
        )}
      </div>
    </div>
  )
}
