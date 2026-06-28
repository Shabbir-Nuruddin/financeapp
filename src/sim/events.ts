import type { SimEffect, SimState } from '../state/types'

export interface EventChoice {
  label: string
  effect: SimEffect
  outcome: string // one short line
}

export interface LifeEvent {
  id: string
  emoji: string
  query: string // stock-photo term
  title: string
  prompt: string // one short line
  minAge: number
  maxAge: number
  choices: EventChoice[]
}

// Random surprises that interrupt the years between money decisions. A mix of life, career
// and traps, so it feels like a real life sim, not a finance quiz. These don't affect the
// score (they're life, not a test) but they very much affect your money.
export const LIFE_EVENTS_INTERACTIVE: LifeEvent[] = [
  {
    id: 'marriage', emoji: '💍', query: 'wedding couple celebration', title: 'You’re in love',
    prompt: 'You’ve met someone special. Get married now?', minAge: 27, maxAge: 37,
    choices: [
      { label: 'Yes, keep it sensible', effect: { cashDelta: -300000 }, outcome: 'A wedding you can afford is a joy, not a debt.' },
      { label: 'Not yet', effect: {}, outcome: 'No rush, and no ₹3L dent. Your call.' },
    ],
  },
  {
    id: 'baby', emoji: '👶', query: 'happy baby family', title: 'Starting a family',
    prompt: 'Ready to have a child?', minAge: 30, maxAge: 41,
    choices: [
      { label: 'Yes!', effect: { expenseDelta: 8000 }, outcome: 'A wonderful new chapter, and a real new monthly expense.' },
      { label: 'Wait a while', effect: {}, outcome: 'Big choice. No wrong answer here.' },
    ],
  },
  {
    id: 'pet', emoji: '🐶', query: 'cute puppy dog', title: 'Puppy alert',
    prompt: 'A friend’s dog had puppies. Adopt one?', minAge: 24, maxAge: 50,
    choices: [
      { label: 'Adopt!', effect: { cashDelta: -30000, expenseDelta: 1500 }, outcome: 'All the love, plus food and vet bills. Worth it.' },
      { label: 'Maybe later', effect: {}, outcome: 'Saved the cash, missed the cuddles.' },
    ],
  },
  {
    id: 'emergency', emoji: '🚑', query: 'hospital emergency', title: 'Family emergency',
    prompt: 'A medical emergency needs ₹2 lakh right now.', minAge: 29, maxAge: 56,
    choices: [
      { label: 'Pay from savings', effect: { cashDelta: -200000 }, outcome: 'This is exactly why an emergency fund exists.' },
      { label: 'Take a quick loan', effect: { addDebt: { label: 'Personal loan', balance: 200000, rate: 0.18, emi: 6000 } }, outcome: 'Help arrived, but at 18% interest. Costly.' },
    ],
  },
  {
    id: 'startup', emoji: '🚀', query: 'startup team office', title: 'Friend’s big idea',
    prompt: 'A close friend wants ₹1 lakh for their startup.', minAge: 27, maxAge: 46,
    choices: [
      { label: 'Back them (small bet)', effect: { addHolding: { kind: 'stocks', label: 'Friend’s startup', monthly: 0, expectedReturn: 0.08, volatility: 0.85, initial: 100000 }, cashDelta: -100000 }, outcome: 'Could 10x or vanish. Only bet what you can lose.' },
      { label: 'Wish them luck', effect: {}, outcome: 'Friendship intact, capital safe.' },
    ],
  },
  {
    id: 'job', emoji: '💼', query: 'job interview office', title: 'A risky job offer',
    prompt: 'A startup offers 40% more pay, but less security.', minAge: 26, maxAge: 48,
    choices: [
      { label: 'Take the leap', effect: { incomeDelta: 15000 }, outcome: 'Bigger pay, bigger risk. Sometimes worth it.' },
      { label: 'Stay safe', effect: {}, outcome: 'Stability has value too. No regrets.' },
    ],
  },
  {
    id: 'phone', emoji: '📱', query: 'new smartphone', title: 'Shiny new phone',
    prompt: 'The latest ₹1.2L phone is out. Buy it on EMI?', minAge: 23, maxAge: 42,
    choices: [
      { label: 'Buy on EMI', effect: { addDebt: { label: 'Phone EMI', balance: 120000, rate: 0.2, emi: 6000 } }, outcome: 'A gadget that loses value, on 20% credit. Ouch.' },
      { label: 'Keep your old one', effect: {}, outcome: 'Your wallet thanks you.' },
    ],
  },
  {
    id: 'course', emoji: '🎓', query: 'online learning study', title: 'Level up your skills',
    prompt: 'A ₹50k course could seriously boost your career.', minAge: 25, maxAge: 45,
    choices: [
      { label: 'Invest in yourself', effect: { cashDelta: -50000, incomeDelta: 6000 }, outcome: 'Skills that raise your income are the best investment.' },
      { label: 'Skip it', effect: {}, outcome: 'Saved ₹50k, but skills compound too.' },
    ],
  },
  {
    id: 'lottery', emoji: '🎟️', query: 'winning lottery ticket', title: 'You won ₹1 lakh!',
    prompt: 'An office raffle just paid out. What now?', minAge: 24, maxAge: 55,
    choices: [
      { label: 'Invest it', effect: { addHolding: { kind: 'sip', label: 'Raffle winnings', monthly: 0, expectedReturn: 0.12, volatility: 0.18, initial: 100000 } }, outcome: '₹1L invested young becomes a lot by 60.' },
      { label: 'Treat yourself', effect: {}, outcome: 'Fun now, but that could’ve quietly grown for decades.' },
    ],
  },
  {
    id: 'vacation', emoji: '✈️', query: 'goa beach vacation', title: 'Trip with friends',
    prompt: 'Everyone’s planning a Goa getaway. Join in?', minAge: 26, maxAge: 55,
    choices: [
      { label: 'Go, you earned it', effect: { cashDelta: -60000 }, outcome: 'Memories matter, just budget for them.' },
      { label: 'Sit this one out', effect: {}, outcome: 'Saved ₹60k. FOMO is temporary.' },
    ],
  },
  {
    id: 'scam', emoji: '🎣', query: 'phishing scam fraud', title: 'Suspicious bank SMS',
    prompt: 'A “bank” text asks you to verify your OTP urgently.', minAge: 24, maxAge: 55,
    choices: [
      { label: 'Ignore and report', effect: {}, outcome: 'Banks NEVER ask for your OTP. You stayed sharp.' },
      { label: 'Share the OTP', effect: { cashDelta: -60000 }, outcome: '₹60k gone instantly. Never share an OTP.' },
    ],
  },
  {
    id: 'parents', emoji: '👵', query: 'elderly parents care', title: 'Parents need help',
    prompt: 'Your parents need ₹1.5L for medical care.', minAge: 35, maxAge: 58,
    choices: [
      { label: 'Support them', effect: { cashDelta: -150000 }, outcome: 'Family first, and a good reason to stay liquid and insured.' },
      { label: 'Can’t right now', effect: {}, outcome: 'A hard call. Planning ahead makes these easier.' },
    ],
  },
]

export function getEvent(id: string): LifeEvent | undefined {
  return LIFE_EVENTS_INTERACTIVE.find((e) => e.id === id)
}

// Pick a fresh, age-appropriate event the player hasn't seen yet (or null).
export function pickEligibleEvent(s: SimState): LifeEvent | null {
  const used = new Set(s.appliedChoices.filter((k) => k.startsWith('event:')).map((k) => k.split(':')[1]))
  const pool = LIFE_EVENTS_INTERACTIVE.filter(
    (e) => s.age >= e.minAge && s.age <= e.maxAge && !used.has(e.id),
  )
  if (!pool.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}
