import { Fragment, type ReactNode } from 'react'

// Minimal, safe markdown for mentor replies: **bold**, *italic*, bullet & numbered lists,
// paragraphs. Builds React nodes (no dangerouslySetInnerHTML), so Gemini output renders cleanly.
function inline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[2]) nodes.push(<strong key={`${keyBase}-b${i}`} className="font-semibold text-white">{m[2]}</strong>)
    else if (m[3]) nodes.push(<em key={`${keyBase}-i${i}`}>{m[3]}</em>)
    else if (m[4]) nodes.push(<code key={`${keyBase}-c${i}`} className="px-1 rounded bg-white/10 text-brand-200 text-[0.85em]">{m[4]}</code>)
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export default function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let list: { ordered: boolean; items: string[] } | null = null

  const flush = (key: string) => {
    if (!list) return
    const Tag = list.ordered ? 'ol' : 'ul'
    blocks.push(
      <Tag key={key} className={`my-1.5 space-y-1 ${list.ordered ? 'list-decimal' : 'list-disc'} pl-4`}>
        {list.items.map((it, idx) => (
          <li key={idx}>{inline(it, `${key}-${idx}`)}</li>
        ))}
      </Tag>,
    )
    list = null
  }

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd()
    const bullet = line.match(/^\s*[-*]\s+(.*)$/)
    const numbered = line.match(/^\s*\d+\.\s+(.*)$/)
    if (bullet) {
      if (!list || list.ordered) flush(`l${idx}`)
      list = list ?? { ordered: false, items: [] }
      list.items.push(bullet[1])
    } else if (numbered) {
      if (!list || !list.ordered) flush(`l${idx}`)
      list = list ?? { ordered: true, items: [] }
      list.items.push(numbered[1])
    } else {
      flush(`l${idx}`)
      if (line.trim()) blocks.push(<p key={`p${idx}`} className="my-1 first:mt-0 last:mb-0">{inline(line, `p${idx}`)}</p>)
    }
  })
  flush('lend')

  return <Fragment>{blocks}</Fragment>
}
