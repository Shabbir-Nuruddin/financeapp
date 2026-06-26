import type { RootState } from '../state/types'
import { COURSES } from '../data/courses'
import { LESSONS } from '../data/lessons'

export function courseProgress(state: RootState, courseId: string): number {
  const course = COURSES.find((c) => c.id === courseId)
  if (!course || course.lessonIds.length === 0) return 0
  const done = course.lessonIds.filter((id) => state.progress.completedLessons.includes(id)).length
  return done / course.lessonIds.length
}

export function overallProgress(state: RootState): number {
  if (LESSONS.length === 0) return 0
  return state.progress.completedLessons.length / LESSONS.length
}

// Recommend the next lesson: first incomplete lesson, preferring the user's goal topic.
export function recommendedLesson(state: RootState) {
  const goalTopicMap: Record<string, string> = {
    invest: 'inv',
    budget: 'bud',
    tax: 'tax',
    debt: 'cred',
    wealth: 'wealth',
    business: 'biz',
  }
  const preferredCourse = state.profile ? goalTopicMap[state.profile.goalId] : undefined

  const ordered = [...LESSONS].sort((a, b) => {
    const ap = a.courseId === preferredCourse ? 0 : 1
    const bp = b.courseId === preferredCourse ? 0 : 1
    return ap - bp
  })
  return ordered.find((l) => !state.progress.completedLessons.includes(l.id)) ?? null
}

export function nextLessonInCourse(state: RootState, courseId: string) {
  const course = COURSES.find((c) => c.id === courseId)
  if (!course) return null
  const id = course.lessonIds.find((lid) => !state.progress.completedLessons.includes(lid))
  return id ? LESSONS.find((l) => l.id === id) ?? null : null
}
