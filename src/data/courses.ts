import type { Course } from '../state/types'

// 8 tracks covering the full brief. Lesson ids map into lessons.ts.
export const COURSES: Course[] = [
  {
    id: 'pf',
    title: 'Personal Finance Foundations',
    topic: 'personal-finance',
    blurb: 'Your first salary, where it should go, and the 50-30-20 rule.',
    icon: 'Wallet',
    accent: 'emerald',
    level: 'beginner',
    lessonIds: ['pf-1', 'pf-2', 'pf-3'],
  },
  {
    id: 'bud',
    title: 'Budgeting That Actually Sticks',
    topic: 'budgeting',
    blurb: 'Stop wondering where the money went by the 20th.',
    icon: 'Receipt',
    accent: 'lime',
    level: 'beginner',
    lessonIds: ['bud-1', 'bud-2'],
  },
  {
    id: 'inv',
    title: 'Investing 101 (SIP & Mutual Funds)',
    topic: 'investing',
    blurb: 'SIPs, compounding, and why time beats timing.',
    icon: 'TrendingUp',
    accent: 'teal',
    level: 'beginner',
    lessonIds: ['inv-1', 'inv-2', 'inv-3'],
  },
  {
    id: 'cred',
    title: 'Credit Cards & Debt Without the Trap',
    topic: 'personal-finance',
    blurb: 'Use the bank’s money for free — or pay 42% interest. Your call.',
    icon: 'CreditCard',
    accent: 'amber',
    level: 'beginner',
    lessonIds: ['cred-1', 'cred-2'],
  },
  {
    id: 'tax',
    title: 'Taxes for Salaried Indians',
    topic: 'taxation',
    blurb: 'Old vs new regime, 80C, and keeping more of your CTC.',
    icon: 'ShieldCheck',
    accent: 'cyan',
    level: 'some',
    lessonIds: ['tax-1', 'tax-2'],
  },
  {
    id: 'stk',
    title: 'Stock Markets Demystified',
    topic: 'stock-markets',
    blurb: 'Shares, indices, and how not to lose your shirt.',
    icon: 'LineChart',
    accent: 'violet',
    level: 'some',
    lessonIds: ['stk-1', 'stk-2'],
  },
  {
    id: 'wealth',
    title: 'Wealth Creation & Compounding',
    topic: 'wealth-creation',
    blurb: 'How small, boring, consistent moves become a crore.',
    icon: 'Sprout',
    accent: 'green',
    level: 'some',
    lessonIds: ['wealth-1', 'wealth-2'],
  },
  {
    id: 'biz',
    title: 'Entrepreneurship & Side Income',
    topic: 'entrepreneurship',
    blurb: 'Runway, cash flow, and funding your own thing.',
    icon: 'Rocket',
    accent: 'orange',
    level: 'confident',
    lessonIds: ['biz-1', 'biz-2'],
  },
]

export function courseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id)
}

export const TOPIC_LABEL: Record<string, string> = {
  'personal-finance': 'Personal Finance',
  investing: 'Investing',
  'stock-markets': 'Stock Markets',
  budgeting: 'Budgeting',
  taxation: 'Taxation',
  entrepreneurship: 'Entrepreneurship',
  'wealth-creation': 'Wealth Creation',
  'financial-planning': 'Financial Planning',
}
