// Indian-currency aware formatting helpers.

/** Compact INR: 4500 -> ₹4.5K, 1850000 -> ₹18.5L, 23000000 -> ₹2.3Cr */
export function inr(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(abs >= 1_00_00_00_000 ? 0 : 2)}Cr`
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(abs >= 10_00_000 ? 1 : 2)}L`
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`
  return `${sign}₹${Math.round(abs)}`
}

/** Full grouped INR: 1850000 -> ₹18,50,000 */
export function inrFull(n: number): string {
  const sign = n < 0 ? '-' : ''
  const abs = Math.round(Math.abs(n)).toString()
  let last3 = abs.slice(-3)
  let rest = abs.slice(0, -3)
  if (rest) last3 = ',' + last3
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `${sign}₹${rest}${last3}`
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00').getTime()
  const db = new Date(b + 'T00:00:00').getTime()
  return Math.round((db - da) / 86_400_000)
}
