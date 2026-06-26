import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

// Render a lucide icon by its string name (icons stored as data).
export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name] ?? Icons.Circle
  return <Cmp {...props} />
}
