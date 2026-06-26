import type { ReactNode } from 'react'

// Centers the app inside a phone bezel on desktop; full-bleed on small screens.
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full sm:w-[400px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[2.6rem] sm:border-[10px] sm:border-ink-900 sm:shadow-phone bg-ink-900 overflow-hidden">
        {/* notch */}
        <div className="hidden sm:block absolute left-1/2 top-0 -translate-x-1/2 w-32 h-6 bg-ink-900 rounded-b-2xl z-30" />
        <div className="relative h-full w-full bg-gradient-to-b from-ink-900 via-ink-900 to-[#06100c] text-white flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
