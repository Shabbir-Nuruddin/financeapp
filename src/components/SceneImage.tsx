import { useState } from 'react'

interface Props {
  query: string // stock-photo search term
  emoji: string // fallback + overlay glyph
  className?: string
}

// Shows a real topical stock photo; if it can't load (offline / blocked / deprecated source),
// it gracefully degrades to a vibrant gradient scene with the emoji, so it never looks broken.
export default function SceneImage({ query, emoji, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const src = `https://source.unsplash.com/640x360/?${encodeURIComponent(query)}`

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(110% 120% at 18% 0%, rgba(255,176,32,0.38), transparent 58%),' +
          'radial-gradient(110% 120% at 92% 100%, rgba(255,77,141,0.42), transparent 58%),' +
          'linear-gradient(145deg,#2a2065,#15123a)',
      }}
    >
      {!failed && (
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {/* readability gradient + emoji badge always present */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
      <span
        className={`absolute left-3 bottom-2 text-4xl drop-shadow-lg transition-opacity ${loaded ? 'opacity-90' : 'opacity-100'}`}
      >
        {emoji}
      </span>
    </div>
  )
}
