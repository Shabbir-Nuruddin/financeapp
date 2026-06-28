import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type {
  RootState,
  Profile,
  Progress,
  Topic,
  SimEffect,
  ChatMessage,
} from './types'
import { loadState, saveState, clearState } from '../lib/storage'
import { todayKey, daysBetween } from '../lib/format'
import { createSim, applyEffect, advanceYear, runToEnd, netWorth, advanceToAge, applyShock, grantCash } from '../sim/engine'
import { pickEligibleEvent } from '../sim/events'
import { ACHIEVEMENTS } from '../data/achievements'

type Arrival = { age: number; grant?: number; shock?: number } | null

// Advance to the next decision (applying its grant/shock), or finish at 60.
function resumeAfter(sim: import('./types').SimState, arrival: Arrival) {
  if (arrival) {
    let s = advanceToAge(sim, arrival.age)
    if (arrival.grant) s = grantCash(s, arrival.grant)
    if (typeof arrival.shock === 'number') s = applyShock(s, arrival.shock)
    return s
  }
  return runToEnd(sim)
}

const emptyProgress = (): Progress => ({
  completedLessons: [],
  completedCourses: [],
  quizScores: {},
  unlockedAchievements: [],
  certificates: [],
  streakCount: 0,
  lastActiveDay: '',
  skillXp: {
    'personal-finance': 0,
    investing: 0,
    'stock-markets': 0,
    budgeting: 0,
    taxation: 0,
    entrepreneurship: 0,
    'wealth-creation': 0,
    'financial-planning': 0,
  },
})

const initialState: RootState = {
  onboarded: false,
  profile: null,
  sim: null,
  progress: emptyProgress(),
  chat: [],
}

type Action =
  | { type: 'HYDRATE'; state: RootState }
  | { type: 'ONBOARD'; profile: Profile }
  | { type: 'TOUCH_STREAK' }
  | {
      type: 'COMPLETE_LESSON'
      lessonId: string
      courseId: string
      courseLessonIds: string[]
      scorePct: number
      skill: Topic
    }
  | { type: 'APPLY_SCENARIO'; key: string; effect: SimEffect }
  | {
      type: 'SIM_RESOLVE'
      key: string
      effect: SimEffect
      smart: boolean
      nextArrival: { age: number; grant?: number; shock?: number } | null
    }
  | { type: 'SIM_RESOLVE_EVENT'; key: string; effect: SimEffect }
  | { type: 'SIM_ADVANCE' }
  | { type: 'SIM_RUN_TO_END' }
  | { type: 'SIM_RESET' }
  | { type: 'UNLOCK'; ids: string[] }
  | { type: 'CHAT_ADD'; message: ChatMessage }
  | { type: 'CHAT_UPDATE'; id: string; text: string; pending?: boolean }
  | { type: 'RESET_ALL' }

function unlockAchievements(state: RootState): string[] {
  const have = new Set(state.progress.unlockedAchievements)
  const add: string[] = []
  const p = state.progress
  const s = state.sim
  const give = (id: string, cond: boolean) => {
    if (cond && !have.has(id)) add.push(id)
  }
  give('first-lesson', p.completedLessons.length >= 1)
  give('quiz-ace', Object.values(p.quizScores).some((v) => v >= 100))
  give('course-complete', p.completedCourses.length >= 1)
  if (s) {
    give('first-sip', s.holdings.some((h) => h.kind === 'sip'))
    give('decision-maker', s.appliedChoices.length >= 3)
    give('decade', s.age - s.startAge >= 10)
    give('emergency-ready', s.emergencyFund > 0 || s.insured)
    give('crorepati', netWorth(s) >= 1_00_00_000)
    give('life-complete', s.finished)
  }
  return add.filter((id) => ACHIEVEMENTS.some((a) => a.id === id))
}

function reducer(state: RootState, action: Action): RootState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state

    case 'ONBOARD': {
      return {
        ...state,
        onboarded: true,
        profile: action.profile,
        sim: createSim(action.profile),
        progress: { ...emptyProgress(), streakCount: 1, lastActiveDay: todayKey() },
      }
    }

    case 'TOUCH_STREAK': {
      const today = todayKey()
      const last = state.progress.lastActiveDay
      if (last === today) return state
      let count = state.progress.streakCount
      if (!last) count = 1
      else {
        const gap = daysBetween(last, today)
        count = gap === 1 ? count + 1 : 1
      }
      const next = {
        ...state,
        progress: { ...state.progress, streakCount: count, lastActiveDay: today },
      }
      return { ...next, progress: { ...next.progress, unlockedAchievements: [...next.progress.unlockedAchievements, ...unlockAchievements(next)] } }
    }

    case 'COMPLETE_LESSON': {
      const already = state.progress.completedLessons.includes(action.lessonId)
      const completedLessons = already
        ? state.progress.completedLessons
        : [...state.progress.completedLessons, action.lessonId]

      const courseDone = action.courseLessonIds.every((id) => completedLessons.includes(id))
      const completedCourses =
        courseDone && !state.progress.completedCourses.includes(action.courseId)
          ? [...state.progress.completedCourses, action.courseId]
          : state.progress.completedCourses
      const certificates =
        courseDone && !state.progress.certificates.includes(action.courseId)
          ? [...state.progress.certificates, action.courseId]
          : state.progress.certificates

      const skillXp = {
        ...state.progress.skillXp,
        [action.skill]: state.progress.skillXp[action.skill] + (already ? 0 : 20 + Math.round(action.scorePct / 5)),
      }

      const progress: Progress = {
        ...state.progress,
        completedLessons,
        completedCourses,
        certificates,
        skillXp,
        quizScores: { ...state.progress.quizScores, [action.lessonId]: action.scorePct },
      }
      const next = { ...state, progress }
      return {
        ...next,
        progress: {
          ...progress,
          unlockedAchievements: [...progress.unlockedAchievements, ...unlockAchievements(next)],
        },
      }
    }

    case 'APPLY_SCENARIO': {
      if (!state.sim) return state
      const sim = applyEffect(state.sim, action.effect, action.key)
      const next = { ...state, sim }
      return {
        ...next,
        progress: {
          ...next.progress,
          unlockedAchievements: [...next.progress.unlockedAchievements, ...unlockAchievements(next)],
        },
      }
    }

    case 'SIM_RESOLVE': {
      if (!state.sim) return state
      let sim = applyEffect(state.sim, action.effect, action.key)
      sim = {
        ...sim,
        smartMoves: sim.smartMoves + (action.smart ? 1 : 0),
        poorMoves: sim.poorMoves + (action.smart ? 0 : 1),
      }
      // ~65% of the time, a random life event interrupts before the next decision.
      const ev = Math.random() < 0.65 ? pickEligibleEvent(sim) : null
      if (ev) {
        sim = { ...sim, pendingEvent: ev.id, pendingArrival: action.nextArrival }
      } else {
        sim = resumeAfter(sim, action.nextArrival)
      }
      const next = { ...state, sim }
      return {
        ...next,
        progress: {
          ...next.progress,
          unlockedAchievements: [...next.progress.unlockedAchievements, ...unlockAchievements(next)],
        },
      }
    }

    case 'SIM_RESOLVE_EVENT': {
      if (!state.sim) return state
      let sim = applyEffect(state.sim, action.effect, action.key)
      const arrival = sim.pendingArrival
      sim = { ...sim, pendingEvent: null, pendingArrival: null }
      sim = resumeAfter(sim, arrival)
      const next = { ...state, sim }
      return {
        ...next,
        progress: {
          ...next.progress,
          unlockedAchievements: [...next.progress.unlockedAchievements, ...unlockAchievements(next)],
        },
      }
    }

    case 'SIM_ADVANCE': {
      if (!state.sim) return state
      const sim = advanceYear(state.sim)
      const next = { ...state, sim }
      return {
        ...next,
        progress: {
          ...next.progress,
          unlockedAchievements: [...next.progress.unlockedAchievements, ...unlockAchievements(next)],
        },
      }
    }

    case 'SIM_RUN_TO_END': {
      if (!state.sim) return state
      const sim = runToEnd(state.sim)
      const next = { ...state, sim }
      return {
        ...next,
        progress: {
          ...next.progress,
          unlockedAchievements: [...next.progress.unlockedAchievements, ...unlockAchievements(next)],
        },
      }
    }

    case 'SIM_RESET': {
      if (!state.profile) return state
      return { ...state, sim: createSim(state.profile) }
    }

    case 'CHAT_ADD':
      return { ...state, chat: [...state.chat, action.message] }

    case 'CHAT_UPDATE':
      return {
        ...state,
        chat: state.chat.map((m) =>
          m.id === action.id ? { ...m, text: action.text, pending: action.pending ?? false } : m,
        ),
      }

    case 'RESET_ALL':
      clearState()
      return { ...initialState, progress: emptyProgress() }

    default:
      return state
  }
}

interface Ctx {
  state: RootState
  onboard: (p: Profile) => void
  completeLesson: (a: {
    lessonId: string
    courseId: string
    courseLessonIds: string[]
    scorePct: number
    skill: Topic
  }) => void
  applyScenario: (key: string, effect: SimEffect) => void
  simResolve: (
    key: string,
    effect: SimEffect,
    smart: boolean,
    nextArrival: { age: number; grant?: number; shock?: number } | null,
  ) => void
  simResolveEvent: (key: string, effect: SimEffect) => void
  simAdvance: () => void
  simRunToEnd: () => void
  simReset: () => void
  chatAdd: (m: ChatMessage) => void
  chatUpdate: (id: string, text: string, pending?: boolean) => void
  resetAll: () => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const loaded = loadState()
    return loaded ?? init
  })

  // Persist on every change
  useEffect(() => {
    saveState(state)
  }, [state])

  // Streak check on mount
  useEffect(() => {
    if (state.onboarded) dispatch({ type: 'TOUCH_STREAK' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const api = useMemo<Ctx>(
    () => ({
      state,
      onboard: (profile) => dispatch({ type: 'ONBOARD', profile }),
      completeLesson: (a) => dispatch({ type: 'COMPLETE_LESSON', ...a }),
      applyScenario: (key, effect) => dispatch({ type: 'APPLY_SCENARIO', key, effect }),
      simResolve: (key, effect, smart, nextArrival) => dispatch({ type: 'SIM_RESOLVE', key, effect, smart, nextArrival }),
      simResolveEvent: (key, effect) => dispatch({ type: 'SIM_RESOLVE_EVENT', key, effect }),
      simAdvance: () => dispatch({ type: 'SIM_ADVANCE' }),
      simRunToEnd: () => dispatch({ type: 'SIM_RUN_TO_END' }),
      simReset: () => dispatch({ type: 'SIM_RESET' }),
      chatAdd: (message) => dispatch({ type: 'CHAT_ADD', message }),
      chatUpdate: (id, text, pending) => dispatch({ type: 'CHAT_UPDATE', id, text, pending }),
      resetAll: () => dispatch({ type: 'RESET_ALL' }),
    }),
    [state],
  )

  return <AppCtx.Provider value={api}>{children}</AppCtx.Provider>
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
