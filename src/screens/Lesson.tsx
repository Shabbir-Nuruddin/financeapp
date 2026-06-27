import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { lessonById, lessonsForCourse } from '../data/lessons'
import { courseById } from '../data/courses'
import { useApp } from '../state/AppContext'
import {
  X, ChevronRight, CheckCircle2, XCircle, Lightbulb, Sparkles, TrendingUp, ArrowRight,
  ListChecks, HelpCircle, Gamepad2,
} from 'lucide-react'
import type { ScenarioChoice } from '../state/types'
import Icon from '../components/Icon'
import { Press } from '../components/Motion'

type Phase = 'intro' | 'concept' | 'quiz' | 'scenario' | 'done'

export default function Lesson() {
  const { lessonId } = useParams()
  const nav = useNavigate()
  const { state, completeLesson, applyScenario } = useApp()
  const lesson = lessonId ? lessonById(lessonId) : undefined
  const course = lesson ? courseById(lesson.courseId) : undefined

  const [phase, setPhase] = useState<Phase>('intro')
  const [conceptIdx, setConceptIdx] = useState(0)
  const [quizIdx, setQuizIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [chosenScenario, setChosenScenario] = useState<ScenarioChoice | null>(null)

  const scorePct = useMemo(
    () => (lesson ? Math.round((correctCount / lesson.quiz.length) * 100) : 0),
    [correctCount, lesson],
  )

  if (!lesson || !course) {
    return (
      <div className="p-6">
        <p>Lesson not found.</p>
        <button className="btn-ghost mt-4" onClick={() => nav('/learn')}>Back</button>
      </div>
    )
  }

  const close = () => nav('/learn')

  const finishLesson = () => {
    completeLesson({
      lessonId: lesson.id,
      courseId: lesson.courseId,
      courseLessonIds: course.lessonIds,
      scorePct,
      skill: lesson.skill,
    })
    setPhase('done')
  }

  const nextAfterQuiz = () => {
    if (quizIdx < lesson.quiz.length - 1) {
      setQuizIdx(quizIdx + 1)
      setPicked(null)
    } else {
      // quiz done
      if (lesson.scenario) setPhase('scenario')
      else finishLesson()
    }
  }

  // ----- header -----
  const phaseOrder: Phase[] = ['intro', 'concept', 'quiz', ...(lesson.scenario ? ['scenario'] as Phase[] : []), 'done']
  const stepNum = phaseOrder.indexOf(phase)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button onClick={close} className="p-1 text-white/50 hover:text-white">
          <X size={22} />
        </button>
        <div className="flex-1 flex gap-1">
          {phaseOrder.slice(0, -1).map((p, i) => (
            <div key={p} className={`h-1 flex-1 rounded-full ${i <= stepNum ? 'bg-brand-400' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        {/* INTRO / video stub */}
        {phase === 'intro' && (
          <div className="animate-fade-up">
            <p className="kicker">{course.title}</p>
            <h1 className="text-2xl font-extrabold mb-4 tracking-tight">{lesson.title}</h1>
            {/* Honest, interactive lesson hero (no fake video player) */}
            <div className="card-elevated aspect-[16/10] grid place-items-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_25%,#ffb020,transparent_55%)]" />
              <span className="absolute w-28 h-28 rounded-full border border-brand-400/30 animate-ping" style={{ animationDuration: '2.6s' }} />
              <span className="absolute w-40 h-40 rounded-full border border-brand-400/15" />
              <div className="relative grid place-items-center w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-900 shadow-card">
                <Icon name={course.icon} size={34} />
              </div>
              <span className="absolute bottom-3 left-3 pill bg-black/40 text-white/80">{lesson.durationMin} min · interactive</span>
            </div>
            <div className="card p-4 flex gap-3 mb-3">
              <Sparkles size={18} className="text-gold-400 shrink-0 mt-0.5" />
              <p className="text-sm text-white/70 leading-relaxed">{lesson.videoSummary}</p>
            </div>
            <div className="flex gap-2">
              <span className="pill bg-white/5 text-white/60"><ListChecks size={13} /> {lesson.concept.length} ideas</span>
              <span className="pill bg-white/5 text-white/60"><HelpCircle size={13} /> {lesson.quiz.length} quiz</span>
              {lesson.scenario && <span className="pill bg-gold-500/15 text-gold-400"><Gamepad2 size={13} /> 1 decision</span>}
            </div>
          </div>
        )}

        {/* CONCEPT cards */}
        {phase === 'concept' && (
          <div className="animate-fade-up" key={conceptIdx}>
            <p className="text-xs text-white/40 mb-2">
              Key idea {conceptIdx + 1} of {lesson.concept.length}
            </p>
            <h2 className="text-xl font-extrabold mb-3">{lesson.concept[conceptIdx].heading}</h2>
            <p className="text-white/70 leading-relaxed mb-4">{lesson.concept[conceptIdx].body}</p>
            {lesson.concept[conceptIdx].takeaway && (
              <div className="rounded-xl bg-brand-500/10 border border-brand-500/30 p-4 flex gap-3">
                <Lightbulb size={18} className="text-brand-300 shrink-0 mt-0.5" />
                <p className="text-sm text-brand-100 font-medium">{lesson.concept[conceptIdx].takeaway}</p>
              </div>
            )}
          </div>
        )}

        {/* QUIZ */}
        {phase === 'quiz' && (
          <div className="animate-fade-up" key={quizIdx}>
            <p className="text-xs text-white/40 mb-2">
              Quick check {quizIdx + 1} of {lesson.quiz.length}
            </p>
            <h2 className="text-lg font-bold mb-4">{lesson.quiz[quizIdx].question}</h2>
            <div className="space-y-2.5">
              {lesson.quiz[quizIdx].options.map((opt, i) => {
                const answered = picked !== null
                const isCorrect = i === lesson.quiz[quizIdx].correctIndex
                const isPicked = i === picked
                let cls = 'border-white/10 bg-white/[0.03]'
                if (answered && isCorrect) cls = 'border-brand-400 bg-brand-500/15'
                else if (answered && isPicked) cls = 'border-red-400/60 bg-red-500/10'
                return (
                  <button
                    key={i}
                    disabled={answered}
                    onClick={() => {
                      setPicked(i)
                      if (i === lesson.quiz[quizIdx].correctIndex) setCorrectCount((c) => c + 1)
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
                  >
                    <span className="flex-1">{opt}</span>
                    {answered && isCorrect && <CheckCircle2 size={18} className="text-brand-400 animate-check" />}
                    {answered && isPicked && !isCorrect && <XCircle size={18} className="text-red-400 animate-pop" />}
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 animate-fade-up">
                <p className="text-sm text-white/70">
                  <span className="font-semibold text-white">
                    {picked === lesson.quiz[quizIdx].correctIndex ? 'Correct! ' : 'Not quite. '}
                  </span>
                  {lesson.quiz[quizIdx].explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* SCENARIO -> sim */}
        {phase === 'scenario' && lesson.scenario && (
          <div className="animate-fade-up">
            <div className="pill bg-gold-500/15 text-gold-400 mb-3">
              <TrendingUp size={14} /> Real decision, this affects your sim
            </div>
            <h2 className="text-xl font-extrabold mb-2">{lesson.scenario.prompt}</h2>
            <p className="text-white/55 text-sm mb-5">{lesson.scenario.context}</p>
            <div className="space-y-3">
              {lesson.scenario.choices.map((ch, i) => {
                const isChosen = chosenScenario === ch
                const disabled = chosenScenario !== null
                return (
                  <button
                    key={i}
                    disabled={disabled}
                    onClick={() => {
                      setChosenScenario(ch)
                      applyScenario(`${lesson.id}:${ch.label}`, ch.effect)
                    }}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isChosen
                        ? ch.recommended
                          ? 'border-brand-400 bg-brand-500/15'
                          : 'border-amber-400/60 bg-amber-500/10'
                        : disabled
                          ? 'opacity-40 border-white/10'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/5'
                    }`}
                  >
                    <p className="font-semibold">{ch.label}</p>
                    <p className="text-xs text-white/50 mt-0.5">{ch.detail}</p>
                  </button>
                )
              })}
            </div>
            {chosenScenario && (
              <div
                className={`mt-4 rounded-xl border p-4 animate-fade-up ${
                  chosenScenario.recommended
                    ? 'bg-brand-500/10 border-brand-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <p className="text-sm font-medium">
                  {chosenScenario.recommended
                    ? '✅ Smart move. Your future self thanks you, watch it compound in the simulator.'
                    : '⚠️ Locked in. You’ll feel this choice play out over the years. Learning is in the consequences.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* DONE */}
        {phase === 'done' && (
          <div className="animate-pop text-center pt-6">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-extrabold">Lesson complete!</h2>
            <p className="text-white/50 mb-6">+{20 + Math.round(scorePct / 5)} skill XP earned</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="card p-4">
                <p className="text-2xl font-extrabold text-brand-300">{scorePct}%</p>
                <p className="text-xs text-white/50">Quiz score</p>
              </div>
              <div className="card p-4">
                <p className="text-2xl font-extrabold text-gold-400">
                  {chosenScenario ? (chosenScenario.recommended ? 'Smart' : 'Risky') : '-'}
                </p>
                <p className="text-xs text-white/50">Your decision</p>
              </div>
            </div>
            {chosenScenario && (
              <button
                onClick={() => nav('/simulator')}
                className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
              >
                See it in my Life Sim <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* footer button */}
      <div className="px-5 pb-7 pt-2">
        {phase === 'intro' && (
          <Press onClick={() => setPhase('concept')} className="btn-primary w-full flex items-center justify-center gap-2">
            Start learning <ChevronRight size={18} />
          </Press>
        )}
        {phase === 'concept' && (
          <Press
            onClick={() => {
              if (conceptIdx < lesson.concept.length - 1) setConceptIdx(conceptIdx + 1)
              else setPhase('quiz')
            }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {conceptIdx < lesson.concept.length - 1 ? 'Next idea' : 'Take the quiz'} <ChevronRight size={18} />
          </Press>
        )}
        {phase === 'quiz' && (
          <Press onClick={nextAfterQuiz} disabled={picked === null} className="btn-primary w-full">
            {quizIdx < lesson.quiz.length - 1 ? 'Next question' : lesson.scenario ? 'Make your decision' : 'Finish lesson'}
          </Press>
        )}
        {phase === 'scenario' && (
          <Press onClick={finishLesson} disabled={!chosenScenario} className="btn-primary w-full">
            Finish lesson
          </Press>
        )}
        {phase === 'done' && (
          <Press onClick={() => nav('/learn')} className="btn-ghost w-full">
            Back to courses
          </Press>
        )}
      </div>
    </div>
  )
}
