import type { SimState } from '../state/types'
import { netWorth, monthlySipTotal } from './engine'

export interface FutureScore {
  score: number // 0-100
  grade: string
  personality: string
  verdict: string
  finalNetWorth: number
  crorepati: boolean
}

// Turn a finished (or in-progress) sim into a shareable Financial Future Score.
export function futureScore(s: SimState): FutureScore {
  const nw = netWorth(s)
  const debt = s.debts.reduce((a, d) => a + d.balance, 0)
  const investing = monthlySipTotal(s) > 0 || s.holdings.some((h) => h.balance > 0)
  const hasBuffer = s.emergencyFund > 0 || s.insured

  // Score blends absolute net worth (log-scaled) with good habits.
  const nwScore = Math.min(60, Math.max(0, Math.log10(Math.max(nw, 1)) * 9 - 18)) // ~₹10L→~27, ₹1Cr→~45, ₹5Cr→~52
  const habitScore =
    (investing ? 18 : 0) + (hasBuffer ? 12 : 0) + (debt === 0 ? 10 : Math.max(0, 10 - debt / 50000))
  const score = Math.round(Math.min(100, nwScore + habitScore))

  const crorepati = nw >= 1_00_00_000
  let grade = 'C'
  if (score >= 85) grade = 'A+'
  else if (score >= 75) grade = 'A'
  else if (score >= 65) grade = 'B+'
  else if (score >= 55) grade = 'B'
  else if (score >= 45) grade = 'C+'

  let personality = 'The Drifter'
  let verdict = 'Money came and went. Small consistent habits would change everything.'
  if (score >= 85) {
    personality = 'The Wealth Architect'
    verdict = 'You turned an ordinary salary into a serious fortune. Textbook compounding.'
  } else if (score >= 70) {
    personality = 'The Steady Compounder'
    verdict = 'Boring, consistent, and rich because of it. This is how it’s done.'
  } else if (score >= 55) {
    personality = 'The Smart Saver'
    verdict = 'Solid habits got you comfortable. A bit more investing aggression and you’d soar.'
  } else if (score >= 40) {
    personality = 'The Almost-There'
    verdict = 'You did some things right, but lifestyle and gaps held you back.'
  }

  return { score, grade, personality, verdict, finalNetWorth: nw, crorepati }
}
