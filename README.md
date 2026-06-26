# FinLife — Learn money by *living* it 🪙

A finance-learning mobile app for India's first-jobbers, built around a **Financial Life
Simulator**. Instead of abstract lessons you forget, every lesson ends in a real decision that
feeds a simulated financial life — first salary to age 60 — and you finish with a shareable
**Financial Future Score**.

> **The one selling point:** Most finance apps fail the documented *knowing–doing gap* — they raise
> confidence without competence and reward streaks over outcomes. FinLife makes learning literally
> drive a simulated life, so concepts compound into a net worth you can see (and share).

## Why it grows organically

The end-of-life **Future Score card** (score, "financial personality", net worth at 60, and a
"Think you can beat my score?" hook) is a one-tap share/download image — a BitLife-for-money viral
loop, no paid gift-card bribery.

## The 6 screens (all in the brief)

1. **Home Dashboard** — net worth hero, streak, course progress, goal, recommended next, achievements
2. **Course Library** — 8 India-relevant tracks (personal finance, investing, budgeting, taxation, stocks, wealth, entrepreneurship…)
3. **Interactive Learning** — video stub → concept cards → quiz → **scenario decision that writes to the sim**
4. **Progress & Achievements** — lessons, quiz scores, certificates, streaks, skill XP, badges
5. **Finance Simulator** — playable financial life: decisions, yearly timeline, net-worth chart, random life events, Future Score
6. **AI Finance Mentor** — plain-language coach, aware of your goal *and* your live sim state

## Tech

React 18 + Vite + TypeScript + Tailwind + Recharts. State in React Context + `useReducer`,
persisted to `localStorage` (no backend). AI Mentor uses the **Gemini API** with a transparent
scripted fallback so the demo never breaks.

## Run locally

```bash
npm install
cp .env.example .env   # optional: paste a Gemini key for live AI mentor
npm run dev            # http://localhost:5173
```

Get a free Gemini key at https://aistudio.google.com/app/apikey and set
`VITE_GEMINI_API_KEY` in `.env`. Without it, the mentor runs in smart scripted mode.

## Build & deploy

```bash
npm run build          # outputs dist/
```

Deploy `dist/` to any static host. SPA routing fallbacks are included:
- **Vercel** — `vercel.json` rewrites all routes to `index.html`. Add `VITE_GEMINI_API_KEY` as an env var.
- **Netlify** — `public/_redirects` handles the same. Build command `npm run build`, publish `dist`.

> Note: a client-only Vite app exposes the API key in the browser bundle. That's acceptable for a
> hackathon prototype; for production, move the Gemini call behind a serverless function.
