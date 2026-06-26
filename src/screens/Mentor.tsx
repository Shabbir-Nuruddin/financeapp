import { useEffect, useRef, useState } from 'react'
import { useApp } from '../state/AppContext'
import { askMentor, mentorIsLive } from '../lib/mentor'
import { recommendedLesson } from '../lib/selectors'
import { Sparkles, Send, Wand2 } from 'lucide-react'
import type { ChatMessage } from '../state/types'
import Markdown from '../components/Markdown'

const SUGGESTIONS = [
  'What exactly is a SIP?',
  'Old vs new tax regime — which is better for me?',
  'How much emergency fund do I need?',
  'How do I start investing my first salary?',
  'Are credit cards worth it?',
]

let idc = 0
const mkId = () => `m-${Date.now()}-${idc++}`

export default function Mentor() {
  const { state, chatAdd, chatUpdate } = useApp()
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const rec = recommendedLesson(state)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [state.chat, thinking])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || thinking) return
    setInput('')
    const userMsg: ChatMessage = { id: mkId(), role: 'user', text: q }
    chatAdd(userMsg)
    const pendingId = mkId()
    chatAdd({ id: pendingId, role: 'mentor', text: '', pending: true })
    setThinking(true)
    const answer = await askMentor(q, state)
    chatUpdate(pendingId, answer, false)
    setThinking(false)
  }

  const empty = state.chat.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="px-5 pt-6 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-900">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">FinLife Mentor</h1>
            <p className="text-xs text-white/45 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${mentorIsLive ? 'bg-brand-400' : 'bg-gold-400'}`} />
              {mentorIsLive ? 'Live AI · knows your sim' : 'Smart mode · add Gemini key for live AI'}
            </p>
          </div>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-3">
        {empty && (
          <div className="animate-fade-up pt-2">
            <div className="card p-4 mb-4">
              <p className="text-sm text-white/75 leading-relaxed">
                Hi {state.profile?.name} 👋 I’m your finance mentor. Ask me anything — I’ll explain it
                in plain language and tailor it to your goal{state.profile ? ` of “${state.profile.goal}”` : ''}.
              </p>
            </div>
            {rec && (
              <div className="card p-4 mb-4 border-brand-500/30 bg-brand-500/5">
                <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold mb-1">
                  <Wand2 size={14} /> RECOMMENDED PATH
                </div>
                <p className="text-sm">Based on your goal, start with <span className="font-semibold">{rec.title}</span> in the Learn tab.</p>
              </div>
            )}
            <p className="text-xs text-white/40 mb-2">Try asking…</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="pill border border-white/15 text-white/70 hover:bg-white/5">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.chat.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-fade-up ${
                m.role === 'user'
                  ? 'bg-brand-500 text-ink-900 rounded-br-md font-medium'
                  : 'bg-white/[0.06] border border-white/10 rounded-bl-md text-white/90'
              }`}
            >
              {m.pending ? <TypingDots /> : m.role === 'mentor' ? <Markdown text={m.text} /> : m.text}
            </div>
          </div>
        ))}
      </div>

      {/* input */}
      <div className="px-4 pb-6 pt-2 border-t border-white/5">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            rows={1}
            placeholder="Ask your money question…"
            className="flex-1 resize-none rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-brand-400 max-h-24"
          />
          <button onClick={() => send(input)} disabled={!input.trim() || thinking} className="btn-primary !px-3.5 !py-3 shrink-0">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  )
}
