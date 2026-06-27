// Small custom brand mark, a sprouting coin. Signals "designed", not stock-icon.
export default function Wordmark({ size = 22, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="19" r="11" fill="url(#fl-coin)" stroke="#7c4a00" strokeWidth="1.5" />
        <path d="M16 19c-2.6 0-4-1.4-4-3.2 0-1.3 1-2.3 2.6-2.6M16 19c2.6 0 4 1.3 4 3.1 0 1.4-1.1 2.4-2.8 2.7M16 11.5V25"
          stroke="#7c4a00" strokeWidth="1.7" strokeLinecap="round" />
        {/* sprout */}
        <path d="M16 11c0-2.5-1.6-4.4-4.2-4.8C12 8.7 13.6 10.6 16 11Z" fill="#e63673" />
        <path d="M16 10.4c0.4-2.5 2.3-4.2 4.9-4.2C20.4 8.6 18.5 10.2 16 10.4Z" fill="#ff6fa3" />
        <defs>
          <linearGradient id="fl-coin" x1="5" y1="9" x2="27" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fcd34d" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      {withText && (
        <span className="font-extrabold tracking-tight text-white">
          Fin<span className="text-brand-300">Life</span>
        </span>
      )}
    </span>
  )
}
