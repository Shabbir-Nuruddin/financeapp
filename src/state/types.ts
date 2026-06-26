// ---------- Core domain types for FinLife ----------

export type ExperienceLevel = 'beginner' | 'some' | 'confident'

export interface Profile {
  name: string
  goal: string // e.g. "Understand SIPs & start investing"
  goalId: string
  experience: ExperienceLevel
  startingIncome: number // monthly take-home in INR
  createdAt: number
}

// ---------- Learning content ----------

export type Topic =
  | 'personal-finance'
  | 'investing'
  | 'stock-markets'
  | 'budgeting'
  | 'taxation'
  | 'entrepreneurship'
  | 'wealth-creation'
  | 'financial-planning'

export interface ConceptCard {
  heading: string
  body: string
  // optional highlighted takeaway
  takeaway?: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

// A scenario decision that writes into the simulator when the lesson is completed.
export interface ScenarioChoice {
  label: string
  detail: string
  // effect applied to the sim when chosen
  effect: SimEffect
  // is this the financially "smart" choice? used for feedback + scoring nudges
  recommended?: boolean
}

export interface LessonScenario {
  prompt: string
  context: string
  choices: ScenarioChoice[]
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  durationMin: number
  // a tiny "video lesson" stub line shown on the player
  videoSummary: string
  concept: ConceptCard[]
  quiz: QuizQuestion[]
  scenario?: LessonScenario
  skill: Topic // which skill this builds
}

export interface Course {
  id: string
  title: string
  topic: Topic
  blurb: string
  icon: string // lucide icon name
  accent: string // tailwind color hint
  lessonIds: string[]
  level: ExperienceLevel
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
}

// ---------- Simulator ----------

export type AssetKind = 'sip' | 'stocks' | 'fd' | 'ppf' | 'gold' | 'crypto' | 'cash'

export interface Holding {
  id: string
  kind: AssetKind
  label: string
  monthly: number // recurring monthly contribution (SIP-style), 0 for lump only
  balance: number // current value
  expectedReturn: number // annual, e.g. 0.12
  volatility: number // annual stdev-ish, for event swings
}

export interface Debt {
  id: string
  label: string
  balance: number
  rate: number // annual interest
  emi: number // monthly payment
}

export type LifeStage =
  | 'first-job'
  | 'settling-in'
  | 'family'
  | 'peak-earning'
  | 'pre-retirement'

export interface SimEvent {
  age: number
  title: string
  detail: string
  delta: number // net worth impact, signed
  kind: 'good' | 'bad' | 'neutral'
}

// Effect produced by a lesson scenario choice.
export interface SimEffect {
  // start/boost a recurring investment
  addHolding?: Omit<Holding, 'id' | 'balance'> & { initial?: number }
  // one-time cash change (spend / windfall)
  cashDelta?: number
  // change monthly expenses (e.g. lifestyle inflation)
  expenseDelta?: number
  // take on a debt
  addDebt?: Omit<Debt, 'id'>
  // emergency fund flag etc.
  insured?: boolean
  emergencyFund?: number
}

export interface SimState {
  startAge: number
  age: number
  cash: number
  monthlyIncome: number
  monthlyExpenses: number
  holdings: Holding[]
  debts: Debt[]
  lifeStage: LifeStage
  insured: boolean
  emergencyFund: number
  history: { age: number; netWorth: number }[]
  events: SimEvent[]
  appliedChoices: string[] // lessonId:choiceLabel keys already applied
  finished: boolean
}

// ---------- Progress ----------

export interface Progress {
  completedLessons: string[]
  completedCourses: string[]
  quizScores: Record<string, number> // lessonId -> % correct
  unlockedAchievements: string[]
  certificates: string[] // courseIds
  streakCount: number
  lastActiveDay: string // YYYY-MM-DD
  skillXp: Record<Topic, number>
}

// ---------- Mentor ----------

export interface ChatMessage {
  id: string
  role: 'user' | 'mentor'
  text: string
  pending?: boolean
}

// ---------- Root persisted state ----------

export interface RootState {
  onboarded: boolean
  profile: Profile | null
  sim: SimState | null
  progress: Progress
  chat: ChatMessage[]
}
