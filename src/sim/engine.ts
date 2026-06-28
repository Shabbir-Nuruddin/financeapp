import type {
  Profile,
  SimState,
  SimEffect,
  Holding,
  Debt,
  SimEvent,
  LifeStage,
} from '../state/types'
import { LIFE_EVENTS } from './scenarios'

let idc = 0
const uid = (p: string) => `${p}-${Date.now()}-${idc++}`

export function createSim(profile: Profile): SimState {
  const income = profile.startingIncome
  const expenses = Math.round(income * 0.6)
  return {
    startAge: 23,
    age: 23,
    cash: Math.round(income * 1.5), // a bit of starting savings
    monthlyIncome: income,
    monthlyExpenses: expenses,
    holdings: [],
    debts: [],
    lifeStage: 'first-job',
    insured: false,
    emergencyFund: 0,
    history: [{ age: 23, netWorth: Math.round(income * 1.5) }],
    events: [],
    appliedChoices: [],
    smartMoves: 0,
    poorMoves: 0,
    panicSold: false,
    pendingEvent: null,
    pendingArrival: null,
    finished: false,
  }
}

export function netWorth(s: SimState): number {
  const assets =
    s.cash +
    s.emergencyFund +
    s.holdings.reduce((a, h) => a + h.balance, 0)
  const liabilities = s.debts.reduce((a, d) => a + d.balance, 0)
  return Math.round(assets - liabilities)
}

export function totalInvested(s: SimState): number {
  return Math.round(s.holdings.reduce((a, h) => a + h.balance, 0))
}

export function monthlySipTotal(s: SimState): number {
  return s.holdings.reduce((a, h) => a + h.monthly, 0)
}

// Apply a lesson scenario choice to the sim. Returns a new state.
export function applyEffect(s: SimState, effect: SimEffect, key: string): SimState {
  if (s.appliedChoices.includes(key)) return s
  const next: SimState = {
    ...s,
    holdings: [...s.holdings],
    debts: [...s.debts],
    appliedChoices: [...s.appliedChoices, key],
  }

  if (effect.addHolding) {
    const h = effect.addHolding
    const holding: Holding = {
      id: uid(h.kind),
      kind: h.kind,
      label: h.label,
      monthly: h.monthly,
      balance: h.initial ?? 0,
      expectedReturn: h.expectedReturn,
      volatility: h.volatility,
    }
    next.holdings.push(holding)
  }
  if (typeof effect.cashDelta === 'number') {
    next.cash = Math.max(0, next.cash + effect.cashDelta)
  }
  if (typeof effect.expenseDelta === 'number') {
    next.monthlyExpenses = Math.max(0, next.monthlyExpenses + effect.expenseDelta)
  }
  if (effect.addDebt) {
    next.debts.push({ ...effect.addDebt, id: uid('debt') })
  }
  if (typeof effect.incomeDelta === 'number') {
    next.monthlyIncome = Math.max(0, next.monthlyIncome + effect.incomeDelta)
  }
  if (effect.sellAllInvestments) {
    const proceeds = next.holdings.reduce((a, h) => a + h.balance, 0)
    next.cash += proceeds
    next.holdings = []
    next.panicSold = true
  }
  if (typeof effect.insured === 'boolean') next.insured = effect.insured
  if (typeof effect.emergencyFund === 'number' && effect.emergencyFund > 0) {
    next.emergencyFund += effect.emergencyFund
  }

  // refresh history point at current age
  next.history = upsertHistory(next.history, next.age, netWorth(next))
  return next
}

// One-time multiplicative shock to every investment (e.g. crash -0.35, rally +0.4).
export function applyShock(s: SimState, pct: number): SimState {
  const next: SimState = {
    ...s,
    holdings: s.holdings.map((h) => ({ ...h, balance: Math.max(0, h.balance * (1 + pct)) })),
  }
  next.history = upsertHistory(next.history, next.age, netWorth(next))
  return next
}

// Hand the player cash (a bonus / windfall arriving).
export function grantCash(s: SimState, amount: number): SimState {
  const next = { ...s, cash: s.cash + amount }
  next.history = upsertHistory(next.history, next.age, netWorth(next))
  return next
}

// Advance the simulation forward to a target age, one year at a time.
export function advanceToAge(s: SimState, targetAge: number): SimState {
  let cur = s
  let guard = 0
  while (cur.age < targetAge && cur.age < 60 && guard < 60) {
    cur = advanceYear(cur)
    guard++
  }
  return cur
}

function upsertHistory(
  hist: { age: number; netWorth: number }[],
  age: number,
  nw: number,
): { age: number; netWorth: number }[] {
  const i = hist.findIndex((h) => h.age === age)
  if (i >= 0) {
    const copy = [...hist]
    copy[i] = { age, netWorth: nw }
    return copy
  }
  return [...hist, { age, netWorth: nw }]
}

const stageFor = (age: number): LifeStage =>
  age < 27 ? 'first-job' : age < 33 ? 'settling-in' : age < 42 ? 'family' : age < 55 ? 'peak-earning' : 'pre-retirement'

// Advance the simulation by one year. Deterministic-ish with light randomness.
export function advanceYear(s: SimState): SimState {
  if (s.finished) return s
  const next: SimState = {
    ...s,
    holdings: s.holdings.map((h) => ({ ...h })),
    debts: s.debts.map((d) => ({ ...d })),
    events: [...s.events],
    history: [...s.history],
  }
  next.age += 1

  // Income grows modestly each year
  const raise = 0.04 + Math.random() * 0.03
  next.monthlyIncome = Math.round(next.monthlyIncome * (1 + raise))
  // Lifestyle inflation: expenses creep up, but slower if disciplined (low expense ratio)
  next.monthlyExpenses = Math.round(next.monthlyExpenses * (1 + 0.03 + Math.random() * 0.03))

  const annualSurplus =
    next.monthlyIncome * 12 - next.monthlyExpenses * 12 - next.debts.reduce((a, d) => a + d.emi * 12, 0)

  // Grow each holding by expected return ± volatility, plus monthly contributions
  for (const h of next.holdings) {
    const shock = (Math.random() * 2 - 1) * h.volatility
    const yearReturn = h.expectedReturn + shock
    h.balance = Math.max(0, h.balance * (1 + yearReturn) + h.monthly * 12)
  }

  // Service debts (reduce balance by emi*12 minus interest)
  for (const d of next.debts) {
    const interest = d.balance * d.rate
    d.balance = Math.max(0, d.balance + interest - d.emi * 12)
  }
  next.debts = next.debts.filter((d) => d.balance > 100)

  // Surplus you DON'T deliberately invest mostly gets spent on lifestyle (only ~25% saved).
  // This is why not investing leaves you modest while disciplined investing builds wealth.
  const sipAnnual = monthlySipTotal(next) * 12
  const freeCash = annualSurplus - sipAnnual
  if (freeCash > 0) next.cash += Math.round(freeCash * 0.25)
  else next.cash = Math.max(0, next.cash + Math.round(freeCash))

  next.lifeStage = stageFor(next.age)

  // Random life events keep the years between decisions feeling alive
  if (Math.random() < 0.4) {
    const ev = pickEvent(next)
    if (ev) applyLifeEvent(next, ev)
  }

  next.history = upsertHistory(next.history, next.age, netWorth(next))
  if (next.age >= 60) next.finished = true
  return next
}

function pickEvent(s: SimState) {
  const pool = LIFE_EVENTS.filter((e) => s.age >= e.minAge && s.age <= e.maxAge)
  if (!pool.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function applyLifeEvent(
  s: SimState,
  ev: (typeof LIFE_EVENTS)[number],
): void {
  let delta = ev.amount
  let detail = ev.detail

  // Emergency fund / insurance softens bad events
  if (ev.kind === 'bad' && ev.amount < 0) {
    if (ev.insurable && s.insured) {
      delta = Math.round(ev.amount * 0.15)
      detail = ev.detail + ' Insurance covered most of it.'
    } else if (s.emergencyFund > 0) {
      const absorbed = Math.min(s.emergencyFund, Math.abs(ev.amount))
      s.emergencyFund -= absorbed
      delta = ev.amount + absorbed
      detail = ev.detail + ' Your emergency fund absorbed the hit.'
    }
  }

  s.cash = s.cash + delta
  // If cash goes negative, it becomes high-interest debt
  if (s.cash < 0) {
    s.debts.push({
      id: uid('debt'),
      label: 'Emergency loan',
      balance: -s.cash,
      rate: 0.36,
      emi: Math.round(-s.cash / 12),
    })
    s.cash = 0
  }

  const event: SimEvent = {
    age: s.age,
    title: ev.title,
    detail,
    delta,
    kind: ev.kind,
  }
  s.events.push(event)
}

// Run remaining years to 60 in one shot (for "fast-forward")
export function runToEnd(s: SimState): SimState {
  let cur = s
  let guard = 0
  while (!cur.finished && guard < 60) {
    cur = advanceYear(cur)
    guard++
  }
  return cur
}
