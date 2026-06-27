// Scripted, intent-matched answers so the mentor always works without an API key.
interface Rule {
  keywords: string[]
  answer: string
}

const RULES: Rule[] = [
  {
    keywords: ['sip', 'systematic'],
    answer:
      'A SIP (Systematic Investment Plan) just means auto-investing a fixed amount, say ₹5,000, into a mutual fund every month. Because you buy in every month, you get more units when prices are low and fewer when high, so you never have to time the market. For a beginner, a low-cost Nifty 50 index fund SIP is a solid, boring, effective place to start.',
  },
  {
    keywords: ['mutual fund', 'index fund', 'nifty'],
    answer:
      'A mutual fund pools money from many investors and invests it for you. An index fund is the simplest kind, it just holds all the companies in an index like the Nifty 50, at very low fees. You’re essentially betting on India’s 50 biggest companies growing over time. Low cost + diversified + hard to mess up = great for beginners.',
  },
  {
    keywords: ['emergency', 'fund', 'buffer'],
    answer:
      'An emergency fund is 3-6 months of expenses kept somewhere safe and instantly accessible (savings account or liquid fund). It exists so that one bad month, a job loss or medical bill, doesn’t force you to sell investments or borrow at 40%. Build this BEFORE chasing high returns.',
  },
  {
    keywords: ['credit card', 'minimum due', 'cibil'],
    answer:
      'Credit cards are great if you pay the FULL statement every month, then it’s a free 45-day loan plus rewards. The trap is the "minimum due": pay only that and interest of 36-42% per year kicks in on the rest. Rule: never spend on a card what you can’t pay in full, and always clear the full bill.',
  },
  {
    keywords: ['tax', '80c', 'regime', 'elss'],
    answer:
      'For salaried Indians: the new regime has lower rates but no deductions; the old regime has higher rates but lets you claim 80C, HRA, etc. If you actually invest in 80C instruments (ELSS, PPF, EPF up to ₹1.5L), the old regime often wins. ELSS funds are popular because they save tax AND grow in equity, with just a 3-year lock-in.',
  },
  {
    keywords: ['compound', 'compounding'],
    answer:
      'Compounding is your returns earning their own returns. ₹5,000/month at ~12% for 30 years becomes roughly ₹1.7 crore, and most of that is growth, not the money you put in. The catch: it needs TIME. Starting at 23 instead of 33 can literally double your final corpus. Start small, but start now.',
  },
  {
    keywords: ['budget', '50 30 20', 'save money'],
    answer:
      'Try the 50-30-20 frame: 50% of take-home on needs, 30% on wants, 20% to your future (savings + investing). The trick is to automate the 20% on salary day, if you save whatever is left, nothing is left. Track every rupee for one month and you’ll usually find ₹3-8K of painless cuts.',
  },
  {
    keywords: ['stock', 'share', 'market', 'sensex'],
    answer:
      'A share is a tiny ownership slice of a company. Indices like the Sensex and Nifty track baskets of big companies. Markets are volatile, they can fall 30-50% sometimes, but historically rise over decades. The biggest mistake is panic-selling at the bottom. For most people, a regular index SIP beats picking individual stocks.',
  },
  {
    keywords: ['debt', 'loan', 'emi'],
    answer:
      'Not all debt is equal. "Good debt" funds things that grow (education, sometimes a home). "Bad debt" is high-interest EMIs on things that lose value, the latest phone, a vacation. Clear high-interest debt before investing, since paying off 40% interest is a guaranteed 40% return.',
  },
  {
    keywords: ['net worth', 'wealth'],
    answer:
      'Net worth = everything you own minus everything you owe. It’s the real scoreboard, income is how fast water flows in, net worth is how full the tank is. To grow it: increase income, automate investing, avoid lifestyle inflation, and step up your SIP every year as you earn more.',
  },
]

export function fallbackAnswer(question: string, goal?: string): string {
  const q = question.toLowerCase()
  const hit = RULES.find((r) => r.keywords.some((k) => q.includes(k)))
  if (hit) return hit.answer

  const goalNudge = goal ? ` Since your goal is "${goal}", the Learn tab has a track tuned exactly for that.` : ''
  return (
    'Great question! Here’s the simple version: in personal finance, the boring fundamentals win, ' +
    'spend less than you earn, keep a 3-6 month emergency fund, automate a monthly SIP into a low-cost index fund, ' +
    'pay credit cards in full, and let compounding do the heavy lifting over decades.' +
    goalNudge +
    ' Want me to break any of those down further?'
  )
}
