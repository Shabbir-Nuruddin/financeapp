import type { ExperienceLevel } from '../state/types'

export interface GoalOption {
  id: string
  label: string
  emoji: string
}

// Goals a first-jobber actually has. Drives mentor context + recommendations.
export const GOALS: GoalOption[] = [
  { id: 'invest', label: 'Start investing my first salary', emoji: '📈' },
  { id: 'budget', label: 'Stop running out of money each month', emoji: '🧾' },
  { id: 'tax', label: 'Pay less tax, legally', emoji: '🛡️' },
  { id: 'debt', label: 'Use credit cards without getting trapped', emoji: '💳' },
  { id: 'wealth', label: 'Build long-term wealth', emoji: '🌱' },
  { id: 'business', label: 'Save up to start something of my own', emoji: '🚀' },
]

export const EXPERIENCE_OPTIONS: { id: ExperienceLevel; label: string; sub: string }[] = [
  { id: 'beginner', label: 'Total beginner', sub: 'Salary just hit my account' },
  { id: 'some', label: 'Know the basics', sub: 'I save, but don’t really invest' },
  { id: 'confident', label: 'Fairly confident', sub: 'I invest, want to go deeper' },
]
