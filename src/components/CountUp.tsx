import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  format: (n: number) => string
  durationMs?: number
  className?: string
}

// Animated number roll for the "money moments" only (net worth, score).
export default function CountUp({ value, format, durationMs = 700, className }: Props) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number>()

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) {
      setDisplay(to)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(from + (to - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      fromRef.current = to
    }
  }, [value, durationMs])

  return <span className={className}>{format(display)}</span>
}
