import type { SimState } from '../state/types'
import { netWorth, monthlySipTotal } from './engine'

export interface FutureScore {
  score: number // 0-100, driven by DECISION QUALITY (not just net worth)
  grade: string
  personality: string
  verdict: string
  finalNetWorth: number
  crorepati: boolean
  lost: boolean
  smart: number
  poor: number
  tips: string[] // plain-language "how to be smarter" pointers
}

// The score reflects how WELL you played, not how lucky compounding was.
// Random choices land ~C; consistently smart play approaches A+; bad play fails.
export function futureScore(s: SimState): FutureScore {
  const nw = netWorth(s)
  const debt = s.debts.reduce((a, d) => a + d.balance, 0)
  const invested = monthlySipTotal(s) > 0 || s.holdings.some((h) => h.balance > 0)
  const hasBuffer = s.emergencyFund > 0 || s.insured

  const total = s.smartMoves + s.poorMoves
  const quality = total > 0 ? s.smartMoves / total : 0.5

  let score = quality * 82
  if (invested) score += 5
  if (hasBuffer) score += 5
  if (s.debts.length === 0) score += 6
  else score -= 6
  if (s.panicSold) score -= 6
  score = Math.round(Math.max(0, Math.min(100, score)))

  const crorepati = nw >= 1_00_00_000
  const lost = score < 45

  let grade = 'F'
  if (score >= 90) grade = 'A+'
  else if (score >= 78) grade = 'A'
  else if (score >= 64) grade = 'B'
  else if (score >= 48) grade = 'C'
  else if (score >= 34) grade = 'D'

  let personality: string
  let verdict: string
  if (score >= 85) {
    personality = 'The Wealth Architect'
    verdict = 'Disciplined, patient, and smart at every turn. This is exactly how ordinary salaries become fortunes.'
  } else if (score >= 70) {
    personality = 'The Steady Compounder'
    verdict = 'Mostly sound calls and the compounding did the rest. A few sharper choices and you’d be untouchable.'
  } else if (score >= 55) {
    personality = 'The Getting-There'
    verdict = 'You did some things right and some things expensively wrong. The gap between you and wealthy is just a few habits.'
  } else if (score >= 45) {
    personality = 'The Rocky Road'
    verdict = 'Too many costly calls held you back. The good news: every mistake here has a simple fix.'
  } else {
    personality = 'The Struggler'
    verdict = 'Money came and went, and some choices actively set you back. Don’t worry, the fixes below are genuinely simple.'
  }

  // Plain-language coaching, only for what they actually got wrong.
  const tips: string[] = []
  if (!invested) tips.push('Start investing early. Even ₹2,000/month, automated from your first salary, beats a big lump sum later. Time does the heavy lifting.')
  if (s.debts.length > 0) tips.push('Kill high-interest debt first. A credit card at 40% eats your wealth faster than any investment can build it.')
  if (!s.insured) tips.push('Get health insurance. One hospital bill can wipe out years of saving, and cover is cheap while you’re young.')
  if (s.emergencyFund === 0) tips.push('Keep an emergency fund of 3-6 months’ expenses. It stops you from selling investments at the worst possible time.')
  if (s.panicSold) tips.push('Never panic-sell a crash. Markets recover; selling at the bottom turns a temporary dip into a permanent loss.')
  if (tips.length === 0) tips.push('You nailed the fundamentals. The only way up from here is to invest a bit more aggressively while you’re young.')

  return { score, grade, personality, verdict, finalNetWorth: nw, crorepati, lost, smart: s.smartMoves, poor: s.poorMoves, tips: tips.slice(0, 4) }
}
