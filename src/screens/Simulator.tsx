import { useEffect, useRef, useState } from 'react'
import { useApp } from '../state/AppContext'
import { netWorth, monthlySipTotal } from '../sim/engine'
import { futureScore } from '../sim/score'
import { inr } from '../lib/format'
import { DECISIONS } from '../sim/decisions'
import { getEvent } from '../sim/events'
import type { SimEffect } from '../state/types'
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'
import {
  TrendingUp, TrendingDown, Wallet, Shield, AlertTriangle, Sparkles, RotateCcw, Lightbulb,
  Check, ArrowRight, Trophy,
} from 'lucide-react'
import ShareCard from '../components/ShareCard'
import CountUp from '../components/CountUp'
import SceneImage from '../components/SceneImage'
import { Press } from '../components/Motion'

type AnyChoice = { label: string; detail?: string; outcome: string; effect: SimEffect; smart?: boolean }

const STAGE_LABEL: Record<string, string> = {
  'first-job': 'First job · 23-26',
  'settling-in': 'Settling in · 27-32',
  family: 'Family years · 33-41',
  'peak-earning': 'Peak earning · 42-54',
  'pre-retirement': 'Pre-retirement · 55-60',
}

const KIND_LABEL: Record<string, string> = {
  sip: 'SIP', stocks: 'Stocks', fd: 'FD', ppf: 'PPF', gold: 'Gold', crypto: 'Crypto', cash: 'Cash',
}

export default function Simulator() {
  const { state, simResolve, simResolveEvent, simRunToEnd, simReset } = useApp()
  const { sim, profile } = state
  const [chosen, setChosen] = useState<AnyChoice | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const nw = sim ? netWorth(sim) : 0

  // Flash green/red on the real net-worth delta after each resolution.
  const prevNw = useRef(nw)
  useEffect(() => {
    if (nw !== prevNw.current) {
      setFlash(nw > prevNw.current ? 'up' : 'down')
      prevNw.current = nw
      const t = setTimeout(() => setFlash(null), 800)
      return () => clearTimeout(t)
    }
  }, [nw])

  if (!sim || !profile) return null

  const resolvedCount = sim.appliedChoices.filter((k) => k.startsWith('decision:')).length
  const current = DECISIONS[resolvedCount]
  const event = sim.pendingEvent ? getEvent(sim.pendingEvent) : null
  const fs = futureScore(sim)

  // ---------- FINISHED STATE (no decision left and no event pending) ----------
  if (sim.finished || (!current && !event)) {
    return (
      <div className="px-5 pt-6 pb-8">
        <div className="text-center mb-5 animate-fade-up">
          <div className="pill bg-brand-500/15 text-brand-300 mb-2 mx-auto">
            <Trophy size={14} /> Life complete · age 60
          </div>
          <h1 className="text-2xl font-extrabold">Here’s how your money story ended</h1>
          <p className="text-white/50 text-sm mt-1">The sum of {resolvedCount} decisions you made.</p>
        </div>
        {sim.finished ? (
          <>
            <ShareCard profile={profile} fs={fs} onReplay={() => { setChosen(null); simReset() }} />

            {/* decision scorecard */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="card p-3 text-center">
                <p className="text-2xl font-extrabold text-brand-300 num">{fs.smart}</p>
                <p className="text-[11px] text-white/50">Smart decisions</p>
              </div>
              <div className="card p-3 text-center">
                <p className="text-2xl font-extrabold text-red-400 num">{fs.poor}</p>
                <p className="text-[11px] text-white/50">Costly decisions</p>
              </div>
            </div>

            {/* plain-language coaching, the "how to be smarter" the user asked for */}
            <div className={`rounded-2xl border p-4 mt-4 ${fs.lost ? 'border-gold-500/40 bg-gold-500/10' : 'border-brand-500/30 bg-brand-500/[0.07]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className={fs.lost ? 'text-gold-400' : 'text-brand-300'} />
                <p className="font-bold text-sm">{fs.lost ? 'How to do better next time' : 'To go from great to unstoppable'}</p>
              </div>
              <ul className="space-y-2">
                {fs.tips.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/75 leading-relaxed">
                    <span className={fs.lost ? 'text-gold-400' : 'text-brand-300'}>•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <Press onClick={simRunToEnd} className="btn-primary w-full">See your final result</Press>
        )}

        <div className="mt-6">
          <p className="text-sm font-semibold text-white/70 mb-2">Your life in events</p>
          <div className="space-y-2">
            {[...sim.events].slice(-6).reverse().map((e, i) => (
              <EventRow key={i} title={e.title} detail={`Age ${e.age}`} delta={e.delta} kind={e.kind} />
            ))}
            {sim.events.length === 0 && (
              <p className="card p-4 text-center text-white/40 text-sm">A calm life, no major surprises.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ---------- ACTIVE: DECISION GAME ----------
  const chartData = sim.history.map((h) => ({ age: h.age, nw: h.netWorth }))
  const isLast = resolvedCount === DECISIONS.length - 1

  const next = () => {
    if (!chosen) return
    if (event) {
      simResolveEvent(`event:${event.id}`, chosen.effect)
    } else {
      const upcoming = DECISIONS[resolvedCount + 1]
      const nextArrival = upcoming
        ? { age: upcoming.age, grant: upcoming.grant, shock: upcoming.shock }
        : null
      simResolve(`decision:${current.id}`, chosen.effect, !!chosen.smart, nextArrival)
    }
    setChosen(null)
  }

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-up">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-2xl font-extrabold leading-none">Life Simulator</h1>
          <p className="text-white/45 text-sm mt-1">{STAGE_LABEL[sim.lifeStage]}</p>
        </div>
        <button
          onClick={() => { if (confirm('Restart your financial life from age 23?')) { setChosen(null); simReset() } }}
          className="pill bg-white/10 text-white/60 hover:text-white"
          title="Restart life"
        >
          <RotateCcw size={13} /> Age {sim.age}
        </button>
      </div>

      {/* net worth + chart */}
      <div className={`card-elevated p-4 my-4 transition duration-300 ${flash === 'up' ? 'ring-2 ring-brand-400' : flash === 'down' ? 'ring-2 ring-red-400/60' : ''}`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-xs">Net worth</p>
            <CountUp value={nw} format={inr} className="text-3xl font-extrabold num block" />
          </div>
          <div className="text-right text-xs text-white/50 leading-relaxed">
            <p>💰 {inr(sim.cash + sim.emergencyFund)} liquid</p>
            <p>📈 {inr(monthlySipTotal(sim))}/mo SIP</p>
          </div>
        </div>
        <div className="h-20 -mx-1 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 6, left: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="nwLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffc857" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <XAxis dataKey="age" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip
                contentStyle={{ background: '#1e1a47', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#ffc857' }}
                formatter={(v: number) => [inr(v), 'Net worth']}
                labelFormatter={(l) => `Age ${l}`}
              />
              <Line type="monotone" dataKey="nw" stroke="url(#nwLine)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* progress (decisions only) */}
      {!event && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-500" style={{ width: `${(resolvedCount / DECISIONS.length) * 100}%` }} />
          </div>
          <span className="text-[11px] text-white/45 shrink-0">Decision {resolvedCount + 1} / {DECISIONS.length}</span>
        </div>
      )}

      {/* THE CARD: a random life event, or a money decision */}
      <div className="card-elevated overflow-hidden mb-5">
        <SceneImage
          query={event ? event.query : current.query}
          emoji={event ? event.emoji : current.emoji}
          className="h-32 w-full"
        />
        <div className="p-5">
          <div className={`pill mb-2 ${event ? 'bg-gold-500/15 text-gold-400' : 'bg-brand-500/15 text-brand-300'}`}>
            {event ? <><Sparkles size={13} /> Life happens</> : <><Lightbulb size={13} /> {current.concept}</>}
          </div>
          <h2 className="text-xl font-extrabold leading-snug mb-1.5">{event ? event.title : current.title}</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-4">{event ? event.prompt : current.situation}</p>

          {!chosen ? (
            <div className="space-y-2.5">
              {((event ? event.choices : current.choices) as AnyChoice[]).map((c, i) => (
                <Press
                  key={i}
                  onClick={() => setChosen(c)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] p-3.5 text-left"
                >
                  <p className="font-semibold text-sm">{c.label}</p>
                  {c.detail && <p className="text-xs text-white/45 mt-0.5">{c.detail}</p>}
                </Press>
              ))}
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className={`rounded-xl border p-4 mb-4 ${event ? 'border-white/15 bg-white/[0.04]' : chosen.smart ? 'border-brand-500/40 bg-brand-500/10' : 'border-gold-500/40 bg-gold-500/10'}`}>
                <div className={`flex items-center gap-1.5 text-xs font-bold mb-1.5 ${event ? 'text-white/70' : chosen.smart ? 'text-brand-300' : 'text-gold-400'}`}>
                  {event ? <><Sparkles size={14} /> WHAT HAPPENED</> : chosen.smart ? <><Check size={14} /> SMART MOVE</> : <><AlertTriangle size={14} /> LESSON LEARNED</>}
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{chosen.outcome}</p>
              </div>
              <Press onClick={next} className="btn-primary w-full flex items-center justify-center gap-2">
                {!event && isLast ? 'See how your life turned out' : 'Continue living'} <ArrowRight size={18} />
              </Press>
            </div>
          )}
        </div>
      </div>

      {/* portfolio */}
      <p className="text-sm font-semibold text-white/70 mb-2">Your portfolio</p>
      <div className="space-y-2 mb-4">
        <Row icon={<Wallet size={16} className="text-brand-300" />} label="Cash + emergency fund" value={inr(sim.cash + sim.emergencyFund)} sub={sim.emergencyFund > 0 ? 'Safety net active' : 'No buffer yet'} />
        {sim.holdings.map((h) => (
          <Row
            key={h.id}
            icon={<TrendingUp size={16} className="text-brand-300" />}
            label={h.label}
            value={inr(h.balance)}
            sub={`${KIND_LABEL[h.kind]}${h.monthly ? ` · ${inr(h.monthly)}/mo` : ''}`}
          />
        ))}
        {sim.debts.map((d) => (
          <Row key={d.id} icon={<TrendingDown size={16} className="text-red-400" />} label={d.label} value={`-${inr(d.balance)}`} sub={`${Math.round(d.rate * 100)}% interest`} danger />
        ))}
        {sim.insured && <Row icon={<Shield size={16} className="text-cyan-300" />} label="Health insurance" value="Active" sub="Softens medical shocks" />}
      </div>
    </div>
  )
}

function Row({ icon, label, value, sub, danger }: { icon: React.ReactNode; label: string; value: string; sub?: string; danger?: boolean }) {
  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <div className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{label}</p>
        {sub && <p className="text-xs text-white/40">{sub}</p>}
      </div>
      <p className={`font-bold text-sm ${danger ? 'text-red-400' : ''}`}>{value}</p>
    </div>
  )
}

function EventRow({ title, detail, delta, kind }: { title: string; detail: string; delta: number; kind: string }) {
  const color = kind === 'good' ? 'text-brand-300' : kind === 'bad' ? 'text-red-400' : 'text-white/60'
  const Icon = kind === 'bad' ? AlertTriangle : kind === 'good' ? TrendingUp : Sparkles
  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <Icon size={16} className={color} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{title}</p>
        <p className="text-xs text-white/40">{detail}</p>
      </div>
      {delta !== 0 && <p className={`text-sm font-bold ${delta > 0 ? 'text-brand-300' : 'text-red-400'}`}>{delta > 0 ? '+' : ''}{inr(delta)}</p>}
    </div>
  )
}
