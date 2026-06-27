import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { netWorth, monthlySipTotal } from '../sim/engine'
import { futureScore } from '../sim/score'
import { inr } from '../lib/format'
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'
import {
  FastForward, ChevronRight, TrendingUp, TrendingDown, Wallet, Shield, AlertTriangle, Sparkles, BookOpen,
} from 'lucide-react'
import ShareCard from '../components/ShareCard'
import CountUp from '../components/CountUp'
import { Press } from '../components/Motion'

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
  const { state, simAdvance, simRunToEnd, simReset } = useApp()
  const nav = useNavigate()
  const { sim, profile } = state
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  if (!sim || !profile) return null

  const nw = netWorth(sim)
  const fs = futureScore(sim)
  const lastEvents = [...sim.events].reverse().slice(0, 6)
  const hasDecisions = sim.appliedChoices.length > 0

  // Flash green/red based on the REAL net-worth delta after the state actually updates.
  const prevNw = useRef(nw)
  useEffect(() => {
    if (nw !== prevNw.current) {
      setFlash(nw > prevNw.current ? 'up' : 'down')
      prevNw.current = nw
      const t = setTimeout(() => setFlash(null), 700)
      return () => clearTimeout(t)
    }
  }, [nw])

  const advance = () => {
    if (busy || sim.finished) return
    simAdvance()
  }

  // ---------- FINISHED STATE ----------
  if (sim.finished) {
    return (
      <div className="px-5 pt-6 pb-8">
        <div className="text-center mb-5 animate-fade-up">
          <div className="pill bg-brand-500/15 text-brand-300 mb-2 mx-auto">
            <Sparkles size={14} /> Life complete · age 60
          </div>
          <h1 className="text-2xl font-extrabold">Here’s how your money story ended</h1>
        </div>
        <ShareCard profile={profile} fs={fs} onReplay={simReset} />

        <div className="mt-6">
          <p className="text-sm font-semibold text-white/70 mb-2">Your life in events</p>
          <div className="space-y-2">
            {[...sim.events].slice(-6).reverse().map((e, i) => (
              <EventRow key={i} title={e.title} detail={`Age ${e.age}`} delta={e.delta} kind={e.kind} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ---------- ACTIVE STATE ----------
  const chartData = sim.history.map((h) => ({ age: h.age, nw: h.netWorth }))

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-up">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-extrabold">Life Simulator</h1>
        <span className="pill bg-white/10 text-white/70">Age {sim.age}</span>
      </div>
      <p className="text-white/45 text-sm mb-4">{STAGE_LABEL[sim.lifeStage]}</p>

      {/* net worth hero */}
      <div className={`card-elevated p-5 mb-4 transition duration-300 ${flash === 'up' ? 'ring-2 ring-brand-400' : flash === 'down' ? 'ring-2 ring-red-400/60' : ''}`}>
        <p className="text-white/50 text-sm">Net worth</p>
        <CountUp value={nw} format={inr} className="text-4xl font-extrabold num block" />
        <div className="flex gap-4 mt-2 text-xs text-white/50">
          <span>💰 {inr(sim.cash + sim.emergencyFund)} liquid</span>
          <span>📈 {inr(monthlySipTotal(sim))}/mo invested</span>
        </div>
        <div className="h-28 -mx-2 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
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

      {/* No decisions yet nudge */}
      {!hasDecisions && (
        <button
          onClick={() => nav('/learn')}
          className="w-full card p-4 mb-4 flex items-center gap-3 text-left border-gold-500/30 bg-gold-500/5"
        >
          <BookOpen size={20} className="text-gold-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Your sim is empty, go make decisions</p>
            <p className="text-xs text-white/50">Complete lessons to add SIPs, funds & habits to this life.</p>
          </div>
          <ChevronRight size={18} className="text-white/30" />
        </button>
      )}

      {/* controls */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Press onClick={advance} disabled={busy} className="btn-primary flex items-center justify-center gap-2">
          <ChevronRight size={18} /> Live 1 year
        </Press>
        <Press
          onClick={() => { setBusy(true); setTimeout(() => { simRunToEnd(); setBusy(false) }, 300) }}
          disabled={busy}
          className="btn-ghost flex items-center justify-center gap-2"
        >
          <FastForward size={18} /> To age 60
        </Press>
      </div>

      {/* portfolio */}
      <p className="text-sm font-semibold text-white/70 mb-2">Portfolio</p>
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

      {/* events */}
      {lastEvents.length > 0 && (
        <>
          <p className="text-sm font-semibold text-white/70 mb-2">Life events</p>
          <div className="space-y-2">
            {lastEvents.map((e, i) => (
              <EventRow key={i} title={e.title} detail={`Age ${e.age}`} delta={e.delta} kind={e.kind} />
            ))}
          </div>
        </>
      )}
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
