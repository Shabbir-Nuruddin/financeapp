import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } },
}

// Staggered entrance for a list/grid of cards (used on Home + Simulator, not everywhere).
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  )
}

export function Item({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}

// Tactile press wrapper for the hero CTAs (spring squash on tap).
export function Press({ children, className, ...rest }: HTMLMotionProps<'button'> & { children: ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
