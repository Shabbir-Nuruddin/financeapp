import type { SimEffect } from '../state/types'

export interface DecisionChoice {
  label: string
  detail: string
  effect: SimEffect
  outcome: string // ONE punchy line of teaching after choosing
  smart?: boolean
}

export interface Decision {
  id: string
  age: number
  concept: string // the skill, in a few words
  title: string // short, plain (no emoji)
  emoji: string
  query: string // stock-photo search term
  situation: string // ONE short line
  grant?: number
  shock?: number
  choices: DecisionChoice[]
}

// The money-decision backbone. Kept deliberately short; the teaching is in the consequence.
export const DECISIONS: Decision[] = [
  {
    id: 'first-salary', age: 23, concept: 'Pay yourself first', title: 'Your first salary lands',
    emoji: '💸', query: 'salary money india',
    situation: '₹45,000 just hit your account. Your first move sets the habit.',
    choices: [
      { label: 'Auto-invest ₹9,000/mo', detail: 'Before you spend a rupee', smart: true,
        effect: { addHolding: { kind: 'sip', label: 'Index SIP', monthly: 9000, expectedReturn: 0.12, volatility: 0.18 } },
        outcome: 'Investing before you can spend it is the #1 wealth habit.' },
      { label: 'Spend now, save later', detail: 'Treat yourself', effect: { expenseDelta: 6000 },
        outcome: 'There’s never anything “left”. Spending fills your income.' },
    ],
  },
  {
    id: 'hot-tip', age: 24, concept: 'Spotting scams', title: 'A “guaranteed” crypto tip',
    emoji: '🪙', query: 'cryptocurrency coins',
    situation: 'A friend swears by a coin paying “30% a month”. Get in?',
    choices: [
      { label: 'Politely pass', detail: 'Too good to be true', smart: true, effect: {},
        outcome: 'Guaranteed + high returns = scam. You dodged it.' },
      { label: 'Put in ₹2 lakh', detail: 'FOMO is real', effect: { addHolding: { kind: 'crypto', label: 'Hot coin', monthly: 0, expectedReturn: 0.05, volatility: 0.98, initial: 200000 }, cashDelta: -200000 },
        outcome: 'That’s a bet, not investing. It can go to zero.' },
    ],
  },
  {
    id: 'emergency-fund', age: 25, concept: 'Safety net first', title: 'You’ve saved ₹1 lakh',
    emoji: '🛟', query: 'safety net umbrella rain',
    situation: 'Build a cushion, or chase higher returns?',
    choices: [
      { label: 'Build an emergency fund', detail: '4 months of expenses', smart: true,
        effect: { emergencyFund: 100000, cashDelta: -100000 },
        outcome: 'Now one bad month can’t force you to sell low.' },
      { label: 'Put it all in equity', detail: 'Chase the return', effect: { addHolding: { kind: 'stocks', label: 'Equity lump', monthly: 0, expectedReturn: 0.12, volatility: 0.2, initial: 100000 }, cashDelta: -100000 },
        outcome: 'No cushion. When life hits, you’ll sell at the worst time.' },
    ],
  },
  {
    id: 'credit-card', age: 26, concept: 'The card trap', title: 'A ₹40,000 card bill',
    emoji: '💳', query: 'credit card payment',
    situation: 'The app nudges you: “minimum due, just ₹2,000”.',
    choices: [
      { label: 'Pay the full ₹40,000', detail: 'Clear it', smart: true, effect: { cashDelta: -40000 },
        outcome: 'Paid in full = a free loan + rewards. Correct.' },
      { label: 'Pay just ₹2,000', detail: 'Keep cash now', effect: { addDebt: { label: 'Credit card debt', balance: 38000, rate: 0.4, emi: 3000 } },
        outcome: 'The rest now grows at 40%. The classic debt trap.' },
    ],
  },
  {
    id: 'first-raise', age: 27, concept: 'Lifestyle creep', title: 'A big ₹20,000/mo raise',
    emoji: '📈', query: 'career promotion success',
    situation: 'A bigger flat and newer phone are calling.',
    choices: [
      { label: 'Invest half, enjoy half', detail: 'Bank the raise', smart: true,
        effect: { incomeDelta: 20000, addHolding: { kind: 'sip', label: 'SIP top-up', monthly: 10000, expectedReturn: 0.12, volatility: 0.18 }, expenseDelta: 10000 },
        outcome: 'Keeping half of every raise is how you get rich.' },
      { label: 'Upgrade your lifestyle', detail: 'You earned it', effect: { incomeDelta: 20000, expenseDelta: 20000 },
        outcome: 'The raise vanished into lifestyle. Earn more, keep nothing.' },
    ],
  },
  {
    id: 'insurance', age: 28, concept: 'Cap your downside', title: 'Health insurance offer',
    emoji: '🛡️', query: 'health insurance hospital',
    situation: 'About ₹1,000/month for cover. Worth it while young?',
    choices: [
      { label: 'Get covered', detail: 'Peace of mind', smart: true, effect: { insured: true, expenseDelta: 1000 },
        outcome: '₹1k/mo caps a bill that could erase years of savings.' },
      { label: 'Skip it', detail: 'You’re healthy', effect: {},
        outcome: 'One illness now risks your entire net worth.' },
    ],
  },
  {
    id: 'crash', age: 30, concept: 'Don’t panic-sell', title: 'The market crashes 35%',
    emoji: '📉', query: 'stock market crash red',
    situation: 'Your portfolio is deep red. Everyone is selling.',
    shock: -0.35,
    choices: [
      { label: 'Hold tight', detail: 'Ride it out', smart: true, effect: {},
        outcome: 'Crashes are temporary; selling makes them permanent.' },
      { label: 'Buy the dip (₹2L)', detail: 'On sale', smart: true, effect: { addHolding: { kind: 'stocks', label: 'Dip buy', monthly: 0, expectedReturn: 0.12, volatility: 0.2, initial: 200000 }, cashDelta: -200000 },
        outcome: 'Buying cheap is how fortunes get built.' },
      { label: 'Panic-sell everything', detail: 'Stop the pain', effect: { sellAllInvestments: true },
        outcome: 'You turned a dip into a permanent loss.' },
    ],
  },
  {
    id: 'tax-saving', age: 31, concept: 'Save tax (80C)', title: 'Cut your tax bill',
    emoji: '🧾', query: 'tax savings calculator',
    situation: 'Invest ₹1.5L under 80C and pay less tax?',
    choices: [
      { label: 'Invest in ELSS', detail: 'Tax break + growth', smart: true, effect: { addHolding: { kind: 'sip', label: 'ELSS (80C)', monthly: 0, expectedReturn: 0.12, volatility: 0.2, initial: 150000 }, cashDelta: -150000 },
        outcome: 'Saved ~₹45k tax AND it grows. Free money.' },
      { label: 'Don’t bother', detail: 'Too much hassle', effect: {},
        outcome: 'You gifted the taxman money you could’ve kept.' },
    ],
  },
  {
    id: 'car', age: 33, concept: 'Good vs bad debt', title: 'Time to buy a car',
    emoji: '🚗', query: 'new car dealership',
    situation: 'A car’s useful now. How you pay matters most.',
    choices: [
      { label: 'Used car, in cash', detail: 'No EMI', smart: true, effect: { cashDelta: -400000 },
        outcome: 'Cars only lose value. Cash keeps the rest compounding.' },
      { label: 'New car, 7-yr loan', detail: '“Just” ₹18k/mo', effect: { addDebt: { label: 'Car loan', balance: 900000, rate: 0.1, emi: 18000 } },
        outcome: 'Interest on a depreciating thing drains you for years.' },
    ],
  },
  {
    id: 'house', age: 36, concept: 'Rent vs buy', title: 'Buy a flat, or keep renting?',
    emoji: '🏠', query: 'house keys new home',
    situation: 'An ₹80L flat means a ₹70L, 20-year loan.',
    choices: [
      { label: 'Rent, invest the gap', detail: 'Stay liquid', smart: true, effect: { addHolding: { kind: 'sip', label: 'Invest-the-gap SIP', monthly: 25000, expectedReturn: 0.12, volatility: 0.18 } },
        outcome: 'Rent isn’t wasted if you invest the difference.' },
      { label: 'Buy with a ₹70L loan', detail: 'Own it', effect: { addDebt: { label: 'Home loan', balance: 7000000, rate: 0.085, emi: 60000 } },
        outcome: 'Fine if the EMI’s comfy. Don’t buy on emotion.' },
    ],
  },
  {
    id: 'windfall', age: 40, concept: 'Diversify a windfall', title: 'A ₹15 lakh windfall',
    emoji: '🎁', query: 'celebration money gift',
    situation: 'An ESOP payout just landed. What now?',
    grant: 1500000,
    choices: [
      { label: 'Spread it around', detail: 'Equity + buffer', smart: true,
        effect: { addHolding: { kind: 'stocks', label: 'Equity (windfall)', monthly: 0, expectedReturn: 0.12, volatility: 0.18, initial: 1000000 }, emergencyFund: 200000, cashDelta: -1200000 },
        outcome: 'Diversified, no single crash can undo it.' },
      { label: 'All in one hot stock', detail: 'Swing big', effect: { addHolding: { kind: 'stocks', label: 'One big bet', monthly: 0, expectedReturn: 0.11, volatility: 0.55, initial: 1500000 }, cashDelta: -1500000 },
        outcome: 'Could double or halve. You traded safety for a gamble.' },
      { label: 'Blow it on a spree', detail: 'Live now', effect: { cashDelta: -1500000 },
        outcome: 'Years of compounding, gone in a week.' },
    ],
  },
  {
    id: 'euphoria', age: 45, concept: 'Don’t get greedy', title: 'Everyone’s getting rich',
    emoji: '🤑', query: 'stock market bull rally',
    situation: 'A roaring bull run. Friends are borrowing to invest.',
    shock: 0.4,
    choices: [
      { label: 'Book some gains', detail: 'Take risk off', smart: true, effect: { addHolding: { kind: 'fd', label: 'Debt fund', monthly: 0, expectedReturn: 0.07, volatility: 0.05, initial: 600000 }, cashDelta: -600000 },
        outcome: 'Trim near the top. The crash always follows euphoria.' },
      { label: 'Borrow to invest more', detail: 'Leverage up', effect: { addDebt: { label: 'Margin loan', balance: 1000000, rate: 0.12, emi: 22000 }, addHolding: { kind: 'stocks', label: 'Leveraged bet', monthly: 0, expectedReturn: 0.12, volatility: 0.3, initial: 1000000 } },
        outcome: 'Leverage at the top is how people get wiped out.' },
    ],
  },
  {
    id: 'derisk', age: 52, concept: 'Glide to safety', title: 'Retirement is near',
    emoji: '🎯', query: 'retirement planning beach',
    situation: 'A crash now would hurt badly. Adjust?',
    choices: [
      { label: 'Move some to safe assets', detail: 'Protect it', smart: true, effect: { addHolding: { kind: 'ppf', label: 'PPF / Debt', monthly: 0, expectedReturn: 0.07, volatility: 0.04, initial: 2000000 }, cashDelta: -2000000 },
        outcome: 'Don’t risk a crash right before you need the money.' },
      { label: 'Stay 100% equity', detail: 'Max growth', effect: {},
        outcome: 'A 40% drop at 58 could delay retirement by years.' },
    ],
  },
  {
    id: 'final-stretch', age: 58, concept: 'Protect what you built', title: 'One last “sure thing”',
    emoji: '🏁', query: 'finish line marathon',
    situation: 'A tipster promises to “double your money”. Tempted?',
    choices: [
      { label: 'Stay steady', detail: 'Don’t tinker', smart: true, effect: {},
        outcome: 'Protecting a finished fortune beats risking it.' },
      { label: 'Make one big bet', detail: 'Go for it', effect: { addHolding: { kind: 'crypto', label: 'Final gamble', monthly: 0, expectedReturn: 0.05, volatility: 0.9, initial: 500000 }, cashDelta: -500000 },
        outcome: 'Greed at the buzzer is how people lose it all.' },
    ],
  },
]
