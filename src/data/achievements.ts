import type { Achievement } from '../state/types'

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Step', description: 'Complete your first lesson', icon: 'Footprints' },
  { id: 'quiz-ace', title: 'Quiz Ace', description: 'Score 100% on a quiz', icon: 'Target' },
  { id: 'first-sip', title: 'SIP Starter', description: 'Start your first SIP in the simulator', icon: 'TrendingUp' },
  { id: 'decision-maker', title: 'Decision Maker', description: 'Make 3 financial decisions', icon: 'Split' },
  { id: 'decade', title: 'A Decade In', description: 'Live 10 years in the simulator', icon: 'CalendarClock' },
  { id: 'course-complete', title: 'Graduate', description: 'Finish an entire course', icon: 'GraduationCap' },
  { id: 'emergency-ready', title: 'Safety Net', description: 'Build an emergency fund in the sim', icon: 'Shield' },
  { id: 'crorepati', title: 'Crorepati', description: 'Cross ₹1Cr net worth in the simulator', icon: 'Gem' },
  { id: 'life-complete', title: 'Full Life', description: 'Run your financial life to age 60', icon: 'Trophy' },
]
