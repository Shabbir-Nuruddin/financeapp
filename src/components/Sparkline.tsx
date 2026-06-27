interface Props {
  points: number[]
  className?: string
  stroke?: string
  fill?: string
}

// Lightweight area sparkline for the net-worth trajectory. Degrades gracefully to a
// flat baseline when there's only the starting point.
export default function Sparkline({ points, className, stroke = '#ffc857', fill = 'rgba(255,200,87,0.16)' }: Props) {
  const w = 100
  const h = 32
  const data = points.length >= 2 ? points : [points[0] ?? 0, points[0] ?? 0]
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = w / (data.length - 1)
  const coords = data.map((v, i) => {
    const x = i * stepX
    const y = h - 4 - ((v - min) / range) * (h - 8)
    return [x, y] as const
  })
  const line = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden>
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
