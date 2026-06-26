import type { RootState } from '../state/types'
import { fallbackAnswer } from './mentorFallback'
import { netWorth, monthlySipTotal } from '../sim/engine'
import { inr } from './format'

const MODEL = 'gemini-2.5-flash'
const KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim()

export const mentorIsLive = Boolean(KEY)

function buildSystemPrompt(state: RootState): string {
  const p = state.profile
  const s = state.sim
  const simLine = s
    ? `Their simulated financial life is at age ${s.age}, net worth ${inr(netWorth(s))}, investing ${inr(monthlySipTotal(s))}/month, ${s.debts.length} active debts, emergency fund ${s.emergencyFund > 0 ? 'yes' : 'no'}.`
    : ''
  return [
    'You are FinLife Mentor, a warm, encouraging AI finance coach for young first-jobbers in India.',
    'Explain concepts in simple, plain language with concrete Indian context (₹, SIP, PPF, 80C, UPI, ELSS).',
    'Keep answers concise (2-5 short sentences or a tight list). Never give specific buy/sell tips for individual stocks or guarantees of returns.',
    'Be practical and behavioural — nudge towards good habits. Use at most one emoji.',
    p ? `The user's name is ${p.name}. Their stated goal: "${p.goal}". Experience level: ${p.experience}.` : '',
    simLine,
  ]
    .filter(Boolean)
    .join(' ')
}

export async function askMentor(question: string, state: RootState): Promise<string> {
  if (!KEY) {
    // small delay so the UI feels natural
    await new Promise((r) => setTimeout(r, 500))
    return fallbackAnswer(question, state.profile?.goal)
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemPrompt(state) }] },
          contents: [{ role: 'user', parts: [{ text: question }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
        }),
      },
    )
    if (!res.ok) throw new Error(`Gemini ${res.status}`)
    const data = await res.json()
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? '')
      .join('')
      .trim()
    if (!text) throw new Error('empty')
    return text
  } catch {
    // transparent fallback so the demo never breaks
    return fallbackAnswer(question, state.profile?.goal)
  }
}
