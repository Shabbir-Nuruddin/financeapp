import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

  return (
    <PhoneFrame>
      <div key={isLesson ? 'lesson' : location.pathname} className="flex-1 min-h-0 overflow-y-auto no-scrollbar animate-page-in">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<CourseLibrary />} />
          <Route path="/learn/:lessonId" element={<Lesson />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isLesson && <BottomNav />}
    </PhoneFrame>
  )
}
