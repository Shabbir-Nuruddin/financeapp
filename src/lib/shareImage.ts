import type { Profile } from '../state/types'
import type { FutureScore } from '../sim/score'
import { inrFull } from './format'

// Draw the shareable Financial Future Score card on a canvas and return a PNG data URL.
export function makeShareImage(profile: Profile, fs: FutureScore): string {
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // background gradient
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#2a2065')
  g.addColorStop(0.55, '#1a1442')
  g.addColorStop(1, '#0e0b26')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // soft glow
  const glow = ctx.createRadialGradient(W * 0.3, H * 0.22, 50, W * 0.3, H * 0.22, 600)
  glow.addColorStop(0, 'rgba(255,176,32,0.28)')
  glow.addColorStop(1, 'rgba(255,176,32,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  const center = W / 2
  ctx.textAlign = 'center'

  // second accent glow (magenta)
  const glow2 = ctx.createRadialGradient(W * 0.8, H * 0.85, 50, W * 0.8, H * 0.85, 620)
  glow2.addColorStop(0, 'rgba(255,77,141,0.22)')
  glow2.addColorStop(1, 'rgba(255,77,141,0)')
  ctx.fillStyle = glow2
  ctx.fillRect(0, 0, W, H)

  // brand
  ctx.fillStyle = '#ffc857'
  ctx.font = '700 38px Inter, sans-serif'
  ctx.fillText('FINLIFE', center, 120)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '400 26px Inter, sans-serif'
  ctx.fillText('My financial life, played to age 60', center, 162)

  // score ring
  const cx = center
  const cy = 430
  const radius = 180
  ctx.lineWidth = 26
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = '#ffb020'
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * fs.score) / 100)
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 150px Inter, sans-serif'
  ctx.fillText(String(fs.score), cx, cy + 40)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '600 34px Inter, sans-serif'
  ctx.fillText('FUTURE SCORE', cx, cy + 100)

  // grade badge
  ctx.fillStyle = '#ff4d8d'
  ctx.font = '800 56px Inter, sans-serif'
  ctx.fillText(`Grade ${fs.grade}`, cx, 720)

  // personality
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 64px Inter, sans-serif'
  ctx.fillText(fs.personality, cx, 800)

  // net worth
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '500 30px Inter, sans-serif'
  ctx.fillText('Net worth at 60', cx, 880)
  ctx.fillStyle = '#ffc857'
  ctx.font = '800 76px Inter, sans-serif'
  ctx.fillText(inrFull(fs.finalNetWorth), cx, 950)

  // verdict (wrapped)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '400 34px Inter, sans-serif'
  wrap(ctx, fs.verdict, cx, 1040, 880, 46)

  // CTA
  ctx.fillStyle = 'rgba(255,77,141,0.95)'
  ctx.font = '700 36px Inter, sans-serif'
  ctx.fillText('Think you can beat my score?', cx, 1230)
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '500 28px Inter, sans-serif'
  ctx.fillText('Play your financial life on FinLife', cx, 1280)

  return canvas.toDataURL('image/png')
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const w of words) {
    const test = line + w + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, yy)
      line = w + ' '
      yy += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, yy)
}
