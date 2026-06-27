import { useEffect, useState } from 'react'
import type { Profile } from '../state/types'
import type { FutureScore } from '../sim/score'
import { makeShareImage } from '../lib/shareImage'
import { inr } from '../lib/format'
import { Download, Share2, RefreshCw, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import CountUp from './CountUp'
import { Press } from './Motion'

interface Props {
  profile: Profile
  fs: FutureScore
  onReplay: () => void
}

export default function ShareCard({ profile, fs, onReplay }: Props) {
  const [copied, setCopied] = useState(false)
  const [pulse, setPulse] = useState(false)
  // ring sweeps from empty to its value on mount
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(t)
  }, [])
  const ringC = 2 * Math.PI * 44

  const shareText = `I just played my financial life on FinLife and scored ${fs.score}/100, "${fs.personality}" with ${inr(fs.finalNetWorth)} net worth at 60. Think you can beat me?`

  const download = () => {
    const url = makeShareImage(profile, fs)
    const a = document.createElement('a')
    a.href = url
    a.download = `finlife-score-${fs.score}.png`
    a.click()
  }

  const share = async () => {
    setPulse(true)
    setTimeout(() => setPulse(false), 900)
    try {
      const url = makeShareImage(profile, fs)
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'finlife-score.png', { type: 'image/png' })
      // @ts-ignore - canShare files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, title: 'My FinLife Score' })
        return
      }
      if (navigator.share) {
        await navigator.share({ text: shareText, title: 'My FinLife Score' })
        return
      }
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* user cancelled */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      {/* visual card */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-ink-700 via-ink-900 to-ink-950 p-6 text-center relative">
        <div className="absolute -top-12 -right-10 w-48 h-48 rounded-full bg-brand-400/25 blur-3xl" />
        <div className="absolute -bottom-12 -left-10 w-44 h-44 rounded-full bg-gold-500/20 blur-3xl" />
        <p className="text-brand-300 font-bold tracking-widest text-sm relative">FINLIFE</p>
        <p className="text-white/50 text-xs mb-4 relative">My financial life, played to 60</p>

        <div className="relative mx-auto w-36 h-36 mb-3">
          <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
            <circle
              cx="50" cy="50" r="44" fill="none" stroke="#ffb020" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={ringC}
              strokeDashoffset={revealed ? ringC * (1 - fs.score / 100) : ringC}
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <CountUp value={fs.score} format={(n) => String(Math.round(n))} durationMs={1000} className="text-4xl font-extrabold leading-none num" />
              <p className="text-[9px] text-white/50 tracking-wide">/ 100</p>
            </div>
          </div>
        </div>

        <p className="text-gold-400 font-extrabold">Grade {fs.grade}</p>
        <h3 className="text-2xl font-extrabold mt-1">{fs.personality}</h3>
        <p className="text-white/50 text-xs mt-3">Net worth at 60</p>
        <CountUp value={fs.finalNetWorth} format={inr} durationMs={1100} className="text-brand-300 text-3xl font-extrabold num block" />
        <p className="text-white/65 text-sm mt-3 leading-relaxed">{fs.verdict}</p>
      </div>

      {/* actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Press onClick={share} className={`btn-share flex items-center justify-center gap-2 ${pulse ? 'animate-reward' : ''}`}>
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied ? 'Copied!' : 'Share my score'}
        </Press>
        <Press onClick={download} className="btn-ghost flex items-center justify-center gap-2">
          <Download size={18} /> Save image
        </Press>
      </div>
      <button onClick={onReplay} className="w-full mt-3 flex items-center justify-center gap-2 text-white/50 text-sm py-2 hover:text-white">
        <RefreshCw size={15} /> Replay with smarter choices
      </button>
    </motion.div>
  )
}
