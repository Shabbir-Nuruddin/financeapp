import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import BottomNav from './components/BottomNav'
import { useApp } from './state/AppContext'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import CourseLibrary from './screens/CourseLibrary'
import Lesson from './screens/Lesson'
import Progress from './screens/Progress'
import Simulator from './screens/Simulator'
import Mentor from './screens/Mentor'

export default function App() {
  const { state } = useApp()
  const location = useLocation()

  if (!state.onboarded) {
    return (
      <PhoneFrame>
        <Onboarding />
      </PhoneFrame>
    )
  }

  const isLesson = location.pathname.startsWith('/learn/')
  // Lessons own their internal step transitions, so don't re-key per lessonId.
  const routeKey = isLesson ? 'lesson' : location.pathname

  return (
    <PhoneFrame>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={routeKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<CourseLibrary />} />
              <Route path="/learn/:lessonId" element={<Lesson />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/mentor" element={<Mentor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      {!isLesson && <BottomNav />}
    </PhoneFrame>
  )
}
