import { useState } from 'react'
import { GOALS, EXPERIENCE_OPTIONS } from '../data/goals'
import { useApp } from '../state/AppContext'
import type { ExperienceLevel } from '../state/types'
import { ChevronRight, Sparkles, IndianRupee } from 'lucide-react'
import { inr } from '../lib/format'
import { Press } from '../components/Motion'
import Wordmark from '../components/Wordmark'
import Sparkline from '../components/Sparkline'

export default function Onboarding() {
  const { onboard } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goalId, setGoalId] = useState('')
  const [experience, setExperience] = useState<ExperienceLevel | ''>('')
  const [income, setIncome] = useState(45000)

  const goal = GOALS.find((g) => g.id === goalId)

  const finish = () => {
    if (!goal || !experience) return
    onboard({
      name: name.trim() || 'Friend',
      goal: goal.label,
      goalId: goal.id,
      experience,
      startingIncome: income,
      createdAt: Date.now(),
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* progress dots */}
      <div className="flex gap-1.5 px-6 pt-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${i <= step ? 'bg-brand-400' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-8 pb-6">
        {step === 0 && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-7">
              <Wordmark size={22} />
              <span className="pill bg-white/[0.06] text-white/55 border border-white/10">🇮🇳 Made for India</span>
            </div>

            <h1 className="text-[2.1rem] font-extrabold leading-[1.08] tracking-tight">
              Don’t just <span className="text-brand-300">learn</span> money.
            </h1>
            <h1 className="text-[2.1rem] font-extrabold leading-[1.08] tracking-tight mb-3">
              <span className="bg-gradient-to-r from-brand-300 to-gold-400 bg-clip-text text-transparent">Live</span> it.
            </h1>
            <p className="text-white/55 leading-relaxed mb-5">
              Every lesson becomes a real money decision in a simulated life, from your first salary
              to age 60. Watch your choices compound.
            </p>

            {/* hero preview: the financial life arc */}
            <div className="relative rounded-3xl border border-white/10 p-4 mb-5 overflow-hidden"
              style={{ background: 'radial-gradient(120% 120% at 90% -10%, rgba(255,176,32,0.32), transparent 55%), radial-gradient(120% 120% at -5% 120%, rgba(255,77,141,0.34), transparent 58%), linear-gradient(150deg,#2a2065,#15123a)' }}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-[11px] text-white/55">Your money story</p>
                  <p className="font-extrabold text-lg num">₹0 <span className="text-white/40 text-sm">→</span> <span className="text-brand-300">₹9.4Cr</span></p>
                </div>
                <div className="text-center rounded-2xl bg-gold-500/20 border border-gold-500/30 px-3 py-1.5">
                  <p className="text-gold-400 font-extrabold leading-none text-lg">82</p>
                  <p className="text-[8px] text-white/60 tracking-wide">FUTURE SCORE</p>
                </div>
              </div>
              <Sparkline points={[0, 4, 9, 18, 30, 55, 92, 150, 230]} className="h-12 w-full mt-1" />
              <div className="flex justify-between text-[10px] text-white/45 mt-0.5">
                <span>Age 23 · first job</span>
                <span>Age 60</span>
              </div>
            </div>

            <label className="block text-sm font-semibold text-white/70 mb-2">First, what should we call you?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-400"
            />
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-extrabold mb-1">What brings you here?</h2>
            <p className="text-white/50 mb-6">We’ll tune your path and your AI mentor to this.</p>
            <div className="space-y-2.5">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoalId(g.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                    goalId === g.id
                      ? 'border-brand-400 bg-brand-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <span className="font-semibold text-sm">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-extrabold mb-1">How money-savvy are you?</h2>
            <p className="text-white/50 mb-6">No judgement, this just sets your starting difficulty.</p>
            <div className="space-y-2.5">
              {EXPERIENCE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setExperience(o.id)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-left transition ${
                    experience === o.id
                      ? 'border-brand-400 bg-brand-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/5'
                  }`}
                >
                  <div className="font-semibold">{o.label}</div>
                  <div className="text-sm text-white/50">{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-extrabold mb-1">Your starting salary</h2>
            <p className="text-white/50 mb-6">Your simulated life begins at age 23 with this monthly take-home.</p>
            <div className="card p-6 text-center">
              <div className="flex items-center justify-center gap-1 text-4xl font-extrabold text-brand-300">
                <IndianRupee size={28} />
                {income.toLocaleString('en-IN')}
              </div>
              <div className="text-white/40 text-sm mt-1">per month</div>
              <input
                type="range"
                min={20000}
                max={120000}
                step={5000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full mt-6 accent-brand-400"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>{inr(20000)}</span>
                <span>{inr(120000)}</span>
              </div>
            </div>
            <p className="text-center text-white/40 text-sm mt-6">
              Ready, {name.trim() || 'friend'}? Let’s see where your money habits take you.
            </p>
          </div>
        )}
      </div>

      <div className="px-6 pb-8">
        <Press
          onClick={() => {
            if (step < 3) setStep(step + 1)
            else finish()
          }}
          disabled={(step === 1 && !goalId) || (step === 2 && !experience)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {step === 3 ? 'Start my financial life' : 'Continue'}
          <ChevronRight size={18} />
        </Press>
      </div>
    </div>
  )
}
