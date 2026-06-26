import type { Lesson } from '../state/types'

// Real, India-relevant lesson content. Lessons that produce a sim decision carry a `scenario`.
export const LESSONS: Lesson[] = [
  // ---------------- Personal Finance Foundations ----------------
  {
    id: 'pf-1',
    courseId: 'pf',
    skill: 'personal-finance',
    title: 'Your First Salary: The First 3 Moves',
    durationMin: 4,
    videoSummary: 'CTC isn’t take-home. Here’s what actually lands in your account and what to do with it.',
    concept: [
      {
        heading: 'CTC ≠ what you get',
        body: 'A ₹6L CTC might mean ₹42–45K in hand after PF, professional tax and TDS. Always plan around take-home, not the offer-letter number.',
        takeaway: 'Budget on take-home pay, never on CTC.',
      },
      {
        heading: 'The 50-30-20 starting point',
        body: '50% needs (rent, food, transport), 30% wants (eating out, subscriptions), 20% to your future (savings + investing). It’s a starting frame, not a law.',
        takeaway: 'Pay your future self first — automate the 20%.',
      },
    ],
    quiz: [
      {
        question: 'You get a ₹6L CTC job. Roughly what should you budget your monthly life around?',
        options: ['₹50,000 (CTC ÷ 12)', '₹42–45K take-home', '₹60,000', 'The full CTC'],
        correctIndex: 1,
        explanation: 'Take-home after PF, taxes and deductions is what actually hits your account.',
      },
    ],
    scenario: {
      prompt: 'Your first ₹45,000 salary just landed. What do you do with the first chunk?',
      context: 'This single habit, repeated for years, decides whether you build wealth or live paycheck to paycheck.',
      choices: [
        {
          label: 'Auto-invest 20% before spending',
          detail: 'Set up a ₹9,000 auto-transfer on salary day.',
          recommended: true,
          effect: { addHolding: { kind: 'sip', label: 'Index SIP', monthly: 9000, expectedReturn: 0.12, volatility: 0.18, initial: 0 } },
        },
        {
          label: 'Spend first, save what’s left',
          detail: 'Most months, nothing is left.',
          effect: { expenseDelta: 4000 },
        },
      ],
    },
  },
  {
    id: 'pf-2',
    courseId: 'pf',
    skill: 'personal-finance',
    title: 'The Emergency Fund',
    durationMin: 3,
    videoSummary: 'Before investing for returns, build the buffer that stops one bad month from sinking you.',
    concept: [
      {
        heading: 'Why it comes first',
        body: 'A job loss or medical bill forces people to sell investments at the worst time or borrow at 40%. A 3–6 month expense buffer in a liquid account prevents that.',
        takeaway: '3–6 months of expenses, kept boring and accessible.',
      },
    ],
    quiz: [
      {
        question: 'Where should an emergency fund live?',
        options: ['In stocks for growth', 'In a liquid fund / savings account', 'In a 5-year FD', 'In crypto'],
        correctIndex: 1,
        explanation: 'It must be safe and instantly accessible — returns are not the point.',
      },
    ],
    scenario: {
      prompt: 'You have ₹60,000 saved up. Build a safety net or chase returns?',
      context: 'Your monthly expenses are about ₹30,000.',
      choices: [
        {
          label: 'Park ₹60K as an emergency fund',
          detail: '2 months of buffer to start, grow it later.',
          recommended: true,
          effect: { emergencyFund: 60000, cashDelta: -60000 },
        },
        {
          label: 'Put all ₹60K into a hot stock tip',
          detail: 'High risk, no buffer.',
          effect: { addHolding: { kind: 'stocks', label: 'Tip stock', monthly: 0, expectedReturn: 0.1, volatility: 0.55, initial: 60000 }, cashDelta: -60000 },
        },
      ],
    },
  },
  {
    id: 'pf-3',
    courseId: 'pf',
    skill: 'personal-finance',
    title: 'Lifestyle Inflation: The Silent Killer',
    durationMin: 3,
    videoSummary: 'Every raise quietly becomes a bigger spend. Here’s how to keep some of it.',
    concept: [
      {
        heading: 'The raise trap',
        body: 'Salary goes up 30%, lifestyle goes up 35%. A bigger flat, newer phone, more swiggy. You earn more but save the same — or less.',
        takeaway: 'On every raise, invest at least half of the increase before lifestyle catches up.',
      },
    ],
    quiz: [
      {
        question: 'You get a ₹15,000/month raise. Smartest first move?',
        options: ['Upgrade flat by ₹15K', 'Invest ₹7–10K of it, enjoy the rest', 'Buy a bike on EMI', 'Spend it all, you earned it'],
        correctIndex: 1,
        explanation: 'Capturing half of every raise compounds into serious money over a career.',
      },
    ],
  },

  // ---------------- Budgeting ----------------
  {
    id: 'bud-1',
    courseId: 'bud',
    skill: 'budgeting',
    title: 'Where Did the Money Go?',
    durationMin: 4,
    videoSummary: 'Track for 30 days and the leaks become obvious — usually food delivery and subscriptions.',
    concept: [
      {
        heading: 'You can’t fix what you don’t see',
        body: 'Most overspending is invisible: ₹250 here, a ₹149 subscription there. Tracking one month surfaces ₹3–8K of painless cuts for most people.',
        takeaway: 'Track everything for 30 days before judging yourself.',
      },
    ],
    quiz: [
      {
        question: 'The fastest way to find spending leaks is to…',
        options: ['Guess from memory', 'Track every rupee for a month', 'Cut all fun spending', 'Ask a friend'],
        correctIndex: 1,
        explanation: 'Real data beats guessing — small recurring charges add up fast.',
      },
    ],
  },
  {
    id: 'bud-2',
    courseId: 'bud',
    skill: 'budgeting',
    title: 'Needs vs Wants vs The Future',
    durationMin: 3,
    videoSummary: 'A simple 3-bucket system that survives real life better than spreadsheets.',
    concept: [
      {
        heading: 'Three buckets, automated',
        body: 'On salary day, money auto-splits: needs account, a “guilt-free” spending account, and an invest-it account. You never have to feel willpower.',
        takeaway: 'Automation beats discipline. Set it once.',
      },
    ],
    quiz: [
      {
        question: 'Why automate your savings on salary day?',
        options: ['Banks force you to', 'So saving doesn’t depend on willpower', 'To earn more interest', 'It’s legally required'],
        correctIndex: 1,
        explanation: 'If you save what’s left, nothing is left. Pay your future first, automatically.',
      },
    ],
  },

  // ---------------- Investing 101 ----------------
  {
    id: 'inv-1',
    courseId: 'inv',
    skill: 'investing',
    title: 'What Is a SIP, Really?',
    durationMin: 4,
    videoSummary: 'A SIP is just auto-investing a fixed amount monthly into a mutual fund. That’s it.',
    concept: [
      {
        heading: 'Rupee-cost averaging',
        body: 'Investing ₹5,000 every month buys more units when markets are low, fewer when high. You stop trying to time the market and let consistency win.',
        takeaway: 'A SIP turns volatility from a threat into an advantage.',
      },
      {
        heading: 'Index funds for beginners',
        body: 'A Nifty 50 index fund holds India’s 50 biggest companies for a tiny fee. Low cost, diversified, hard to mess up.',
        takeaway: 'Start with a low-cost index fund, not a hot tip.',
      },
    ],
    quiz: [
      {
        question: 'What does a SIP help you avoid?',
        options: ['Paying any tax', 'Timing the market', 'All risk', 'Inflation entirely'],
        correctIndex: 1,
        explanation: 'SIPs average your buy price over time so you don’t need to guess the “right” moment.',
      },
    ],
    scenario: {
      prompt: 'You’re ready to invest ₹5,000/month. Where does it go?',
      context: 'You have a 20+ year horizon and a stable salary.',
      choices: [
        {
          label: 'Nifty 50 index fund SIP',
          detail: 'Low cost, diversified, ~12% long-run.',
          recommended: true,
          effect: { addHolding: { kind: 'sip', label: 'Nifty 50 SIP', monthly: 5000, expectedReturn: 0.12, volatility: 0.18, initial: 0 } },
        },
        {
          label: 'A trending crypto coin',
          detail: 'Could 3x. Could go to zero.',
          effect: { addHolding: { kind: 'crypto', label: 'Meme coin', monthly: 5000, expectedReturn: 0.15, volatility: 0.9, initial: 0 } },
        },
      ],
    },
  },
  {
    id: 'inv-2',
    courseId: 'inv',
    skill: 'investing',
    title: 'The Magic of Compounding',
    durationMin: 4,
    videoSummary: '₹5K/month for 30 years at 12% becomes ~₹1.7 crore. Most of it is growth, not your money.',
    concept: [
      {
        heading: 'Time is the real ingredient',
        body: 'Starting at 23 vs 33 with the same SIP can mean double the final corpus — purely because the early money compounds longer.',
        takeaway: 'The best day to start was your first salary. The second best is today.',
      },
    ],
    quiz: [
      {
        question: 'What matters most for compounding?',
        options: ['Picking the perfect fund', 'Time in the market', 'A huge starting amount', 'Daily trading'],
        correctIndex: 1,
        explanation: 'Long, uninterrupted time lets returns earn their own returns.',
      },
    ],
  },
  {
    id: 'inv-3',
    courseId: 'inv',
    skill: 'investing',
    title: 'Asset Allocation Basics',
    durationMin: 3,
    videoSummary: 'Don’t put it all in one place. Mix growth (equity) with stability (debt/PPF).',
    concept: [
      {
        heading: 'Don’t bet the farm on one asset',
        body: 'A simple rule of thumb: equity % ≈ 100 − your age. At 25 that’s ~75% equity, rest in safer debt/PPF for ballast.',
        takeaway: 'Diversify across assets so no single crash ruins you.',
      },
    ],
    quiz: [
      {
        question: 'Why diversify across asset types?',
        options: ['To pay more fees', 'So one crash doesn’t wipe you out', 'To guarantee returns', 'To avoid taxes'],
        correctIndex: 1,
        explanation: 'Different assets fall at different times — the mix smooths the ride.',
      },
    ],
    scenario: {
      prompt: 'You have ₹1,00,000 to allocate. Pick a mix.',
      context: 'You already have a small SIP and an emergency fund.',
      choices: [
        {
          label: 'Balanced: ₹70K equity, ₹30K PPF',
          detail: 'Growth with a safe anchor.',
          recommended: true,
          effect: {
            addHolding: { kind: 'stocks', label: 'Equity lump sum', monthly: 0, expectedReturn: 0.12, volatility: 0.2, initial: 70000 },
            cashDelta: -100000,
            emergencyFund: 0,
          },
        },
        {
          label: 'All ₹1L into one stock',
          detail: 'Concentrated bet.',
          effect: { addHolding: { kind: 'stocks', label: 'Single stock', monthly: 0, expectedReturn: 0.11, volatility: 0.5, initial: 100000 }, cashDelta: -100000 },
        },
      ],
    },
  },

  // ---------------- Credit & Debt ----------------
  {
    id: 'cred-1',
    courseId: 'cred',
    skill: 'personal-finance',
    title: 'How Credit Cards Actually Work',
    durationMin: 4,
    videoSummary: 'Pay in full = a free 45-day loan + rewards. Pay minimum = a 36–42% annual trap.',
    concept: [
      {
        heading: 'The full-payment rule',
        body: 'If you clear the full statement by the due date, you pay zero interest and keep the rewards. Pay only the “minimum due” and interest of 3–3.5% per month kicks in on everything.',
        takeaway: 'Always pay the full statement, never just the minimum.',
      },
    ],
    quiz: [
      {
        question: 'Paying only the “minimum due” on a credit card means…',
        options: ['You’re doing great', 'Interest of ~36–42% a year starts piling up', 'You skip that month free', 'Your limit increases'],
        correctIndex: 1,
        explanation: 'The minimum due is a trap — interest compounds on the rest at brutal rates.',
      },
    ],
    scenario: {
      prompt: 'Your credit card bill is ₹40,000. You can pay it all. What do you do?',
      context: 'The “minimum due” shown is just ₹2,000.',
      choices: [
        {
          label: 'Pay the full ₹40,000',
          detail: 'Zero interest, rewards kept.',
          recommended: true,
          effect: { cashDelta: -40000 },
        },
        {
          label: 'Pay only ₹2,000 minimum',
          detail: 'Keep cash now, pay dearly later.',
          effect: { addDebt: { label: 'Credit card debt', balance: 38000, rate: 0.4, emi: 3000 } },
        },
      ],
    },
  },
  {
    id: 'cred-2',
    courseId: 'cred',
    skill: 'personal-finance',
    title: 'Good Debt vs Bad Debt',
    durationMin: 3,
    videoSummary: 'A home loan can build wealth. A phone on a 24-month EMI usually destroys it.',
    concept: [
      {
        heading: 'Does it appreciate or depreciate?',
        body: 'Debt for assets that grow (education, sometimes a home) can be worth it. Debt for depreciating wants (gadgets, vacations) at high interest is wealth going backwards.',
        takeaway: 'Borrow for things that grow, pay cash for things that shrink.',
      },
    ],
    quiz: [
      {
        question: 'Which is most likely “bad debt”?',
        options: ['An education loan', 'A 22% EMI on the latest phone', 'A reasonable home loan', 'A 0% no-cost EMI you’ll clear easily'],
        correctIndex: 1,
        explanation: 'High-interest debt for a depreciating want is the classic wealth-killer.',
      },
    ],
  },

  // ---------------- Taxes ----------------
  {
    id: 'tax-1',
    courseId: 'tax',
    skill: 'taxation',
    title: 'Old vs New Tax Regime',
    durationMin: 4,
    videoSummary: 'New regime = lower rates, no deductions. Old regime = higher rates, but 80C/HRA/etc. Pick by your deductions.',
    concept: [
      {
        heading: 'It depends on your deductions',
        body: 'If you actually use deductions (80C investments, HRA, home loan interest), the old regime can win. If you don’t, the new regime’s lower slabs usually win. Run both numbers.',
        takeaway: 'No universal answer — compare both for your situation.',
      },
    ],
    quiz: [
      {
        question: 'The old tax regime tends to win when you…',
        options: ['Have no investments or deductions', 'Heavily use 80C, HRA and other deductions', 'Earn below ₹2.5L', 'Are self-employed only'],
        correctIndex: 1,
        explanation: 'Deductions are what make the old regime’s higher rates worth it.',
      },
    ],
  },
  {
    id: 'tax-2',
    courseId: 'tax',
    skill: 'taxation',
    title: 'Section 80C: Save Tax + Invest',
    durationMin: 4,
    videoSummary: 'Up to ₹1.5L in ELSS/PPF/EPF can cut taxable income — investing and saving tax at once.',
    concept: [
      {
        heading: 'ELSS: the 2-in-1',
        body: 'ELSS mutual funds qualify for 80C (old regime), have the shortest lock-in (3 years) among tax-savers, and invest in equity for growth. PPF is the safe, long-term cousin.',
        takeaway: 'ELSS = tax break + market growth, with a 3-year lock-in.',
      },
    ],
    quiz: [
      {
        question: 'What’s a key advantage of ELSS under 80C?',
        options: ['No risk at all', 'Shortest lock-in (3 yrs) + equity growth', 'Guaranteed 15% returns', 'It’s tax-free forever'],
        correctIndex: 1,
        explanation: 'Among 80C options, ELSS has the shortest lock-in and equity upside (with market risk).',
      },
    ],
    scenario: {
      prompt: 'You can invest ₹50,000 to save tax this year. Where?',
      context: 'You’re on the old regime and have room left in your 80C limit.',
      choices: [
        {
          label: 'ELSS fund (tax-saving SIP)',
          detail: 'Saves tax + grows in equity.',
          recommended: true,
          effect: { addHolding: { kind: 'sip', label: 'ELSS (80C)', monthly: 0, expectedReturn: 0.12, volatility: 0.2, initial: 50000 }, cashDelta: -50000 },
        },
        {
          label: 'Skip it, keep the cash idle',
          detail: 'Pay more tax, no growth.',
          effect: { cashDelta: 0 },
        },
      ],
    },
  },

  // ---------------- Stock Markets ----------------
  {
    id: 'stk-1',
    courseId: 'stk',
    skill: 'stock-markets',
    title: 'Shares, Sensex & Nifty',
    durationMin: 4,
    videoSummary: 'A share is part-ownership of a company. Sensex/Nifty are scoreboards of big Indian companies.',
    concept: [
      {
        heading: 'You’re buying a slice of a business',
        body: 'When you buy a share, you own a tiny piece of that company’s future profits. Indices like the Nifty 50 track the combined performance of India’s largest firms.',
        takeaway: 'Investing in an index = betting on the Indian economy growing.',
      },
    ],
    quiz: [
      {
        question: 'The Nifty 50 represents…',
        options: ['50 random stocks', '50 of India’s largest listed companies', 'Government bonds', 'Gold prices'],
        correctIndex: 1,
        explanation: 'It’s a benchmark of 50 large, established Indian companies.',
      },
    ],
  },
  {
    id: 'stk-2',
    courseId: 'stk',
    skill: 'stock-markets',
    title: 'Why You Shouldn’t Panic-Sell',
    durationMin: 3,
    videoSummary: 'Markets crash, then recover. The biggest losses come from selling at the bottom.',
    concept: [
      {
        heading: 'Volatility is the price of returns',
        body: 'Equity rises over decades but falls 30–50% sometimes along the way. Those who hold (or keep buying) through crashes capture the recovery. Those who panic-sell lock in the loss.',
        takeaway: 'A crash is a sale, not a fire. Keep your SIP running.',
      },
    ],
    quiz: [
      {
        question: 'The market drops 35%. The historically smart move for a long-term SIP investor is to…',
        options: ['Stop the SIP and sell', 'Keep investing / hold', 'Move everything to cash', 'Borrow to invest more'],
        correctIndex: 1,
        explanation: 'Continuing to invest through downturns buys units cheap and captures the recovery.',
      },
    ],
  },

  // ---------------- Wealth Creation ----------------
  {
    id: 'wealth-1',
    courseId: 'wealth',
    skill: 'wealth-creation',
    title: 'The Boring Path to a Crore',
    durationMin: 4,
    videoSummary: 'No lottery, no day-trading. Just automate, increase with raises, and don’t interrupt it.',
    concept: [
      {
        heading: 'Step up your SIP every year',
        body: 'Increasing your SIP by even 10% a year (as your income grows) dramatically shortens the time to your goals — often by many years.',
        takeaway: 'Automate, step up annually, and leave it alone.',
      },
    ],
    quiz: [
      {
        question: 'A “step-up SIP” means…',
        options: ['Withdrawing yearly', 'Increasing your monthly investment each year', 'Switching funds often', 'Taking a loan to invest'],
        correctIndex: 1,
        explanation: 'Raising contributions as income grows compounds your corpus much faster.',
      },
    ],
  },
  {
    id: 'wealth-2',
    courseId: 'wealth',
    skill: 'wealth-creation',
    title: 'Net Worth: Your Real Scoreboard',
    durationMin: 3,
    videoSummary: 'Net worth = what you own minus what you owe. It’s the number that actually matters.',
    concept: [
      {
        heading: 'Track the right number',
        body: 'Income is how fast water flows in; net worth is how full the tank is. Two people on the same salary can have wildly different net worths a decade later.',
        takeaway: 'Grow assets, shrink liabilities — watch net worth, not just salary.',
      },
    ],
    quiz: [
      {
        question: 'Net worth is…',
        options: ['Your monthly salary', 'Assets minus liabilities', 'Your credit limit', 'Your CTC'],
        correctIndex: 1,
        explanation: 'It’s everything you own minus everything you owe.',
      },
    ],
  },

  // ---------------- Entrepreneurship ----------------
  {
    id: 'biz-1',
    courseId: 'biz',
    skill: 'entrepreneurship',
    title: 'Runway & Cash Flow',
    durationMin: 4,
    videoSummary: 'Profit is opinion, cash is fact. Runway = how many months before you run out.',
    concept: [
      {
        heading: 'Cash flow kills more businesses than bad ideas',
        body: 'Runway = cash in bank ÷ monthly burn. Knowing your runway tells you how long you can experiment before you must earn or raise.',
        takeaway: 'Always know your runway in months.',
      },
    ],
    quiz: [
      {
        question: 'If you have ₹3L saved and burn ₹50K/month, your runway is…',
        options: ['3 months', '6 months', '12 months', 'Unlimited'],
        correctIndex: 1,
        explanation: '₹3,00,000 ÷ ₹50,000 = 6 months of runway.',
      },
    ],
    scenario: {
      prompt: 'You want to start a side hustle. How do you fund it?',
      context: 'You have a stable job and ₹2L saved.',
      choices: [
        {
          label: 'Start small while keeping your job',
          detail: 'Build income before quitting. Adds side income.',
          recommended: true,
          effect: { cashDelta: 0, expenseDelta: -3000 },
        },
        {
          label: 'Quit and bet ₹2L on it now',
          detail: 'All-in, no income, no buffer.',
          effect: { cashDelta: -200000, expenseDelta: 0 },
        },
      ],
    },
  },
  {
    id: 'biz-2',
    courseId: 'biz',
    skill: 'entrepreneurship',
    title: 'Paying Yourself & Reinvesting',
    durationMin: 3,
    videoSummary: 'Separate business and personal money from day one. Pay yourself a real salary.',
    concept: [
      {
        heading: 'Keep the accounts separate',
        body: 'Mixing personal and business money hides whether you’re actually profitable and creates a tax mess. Pay yourself a fixed amount; reinvest the rest deliberately.',
        takeaway: 'Separate accounts, deliberate reinvestment.',
      },
    ],
    quiz: [
      {
        question: 'Why separate business and personal accounts?',
        options: ['It’s illegal not to for everyone', 'To see real profit and simplify taxes', 'Banks pay more interest', 'To hide income'],
        correctIndex: 1,
        explanation: 'Clean separation reveals true profitability and keeps tax filing sane.',
      },
    ],
  },
]

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}

export function lessonsForCourse(courseId: string): Lesson[] {
  return LESSONS.filter((l) => l.courseId === courseId)
}
