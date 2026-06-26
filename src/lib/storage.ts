import type { RootState } from '../state/types'

const KEY = 'finlife.state.v1'

export function loadState(): RootState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as RootState
  } catch {
    return null
  }
}

export function saveState(state: RootState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
