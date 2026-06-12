'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { type ViewKey } from './navigation'

export type CourseData = {
  id: string
  number: string
  passager: string
  chauffeur: string
  depart: string
  arrivee: string
  statut: string
  prix: string
  modePaiement: string
  date: string
}

export type ChauffeurData = {
  id: string
  name: string
  phone: string
  vehicle: string
  note: number
  statut: string
  courses: number
  solde: string
}

const PENDING_COURSE_KEY = 'besttrans-pending-course'
let pendingCourseCache: CourseData | null | undefined = undefined

const PENDING_CHAUFFEUR_KEY = 'besttrans-pending-chauffeur'
let pendingChauffeurCache: ChauffeurData | null | undefined = undefined

export function takePendingCourse(): CourseData | null {
  if (pendingCourseCache !== undefined) return pendingCourseCache
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PENDING_COURSE_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_COURSE_KEY)
  try {
    pendingCourseCache = JSON.parse(raw) as CourseData
    return pendingCourseCache
  } catch {
    pendingCourseCache = null
    return null
  }
}

export function takePendingChauffeur(): ChauffeurData | null {
  if (pendingChauffeurCache !== undefined) return pendingChauffeurCache
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PENDING_CHAUFFEUR_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_CHAUFFEUR_KEY)
  try {
    pendingChauffeurCache = JSON.parse(raw) as ChauffeurData
    return pendingChauffeurCache
  } catch {
    pendingChauffeurCache = null
    return null
  }
}

type DashboardContextValue = {
  activeView: ViewKey
  setActiveView: (view: ViewKey) => void
  navigateTo: (view: ViewKey) => void
  pendingCourse: CourseData | null
  clearPendingCourse: () => void
  navigateToCourseDetail: (course: CourseData) => void
  pendingChauffeur: ChauffeurData | null
  clearPendingChauffeur: () => void
  navigateToChauffeurDetail: (chauffeur: ChauffeurData) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [pendingCourse, setPendingCourse] = useState<CourseData | null>(null)
  const [pendingChauffeur, setPendingChauffeur] = useState<ChauffeurData | null>(null)

  const navigateTo = useCallback((view: ViewKey) => {
    setActiveView(view)
  }, [])

  const clearPendingCourse = useCallback(() => {
    setPendingCourse(null)
  }, [])

  const navigateToCourseDetail = useCallback((course: CourseData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_COURSE_KEY, JSON.stringify(course))
    }
    setPendingCourse(course)
    setActiveView('course-detail')
  }, [])

  const clearPendingChauffeur = useCallback(() => {
    setPendingChauffeur(null)
  }, [])

  const navigateToChauffeurDetail = useCallback((chauffeur: ChauffeurData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_CHAUFFEUR_KEY, JSON.stringify(chauffeur))
    }
    setPendingChauffeur(chauffeur)
    setActiveView('chauffeur-detail')
  }, [])

  const value = useMemo(
    () => ({
      activeView,
      setActiveView,
      navigateTo,
      pendingCourse,
      clearPendingCourse,
      navigateToCourseDetail,
      pendingChauffeur,
      clearPendingChauffeur,
      navigateToChauffeurDetail,
    }),
    [
      activeView,
      navigateTo,
      pendingCourse,
      clearPendingCourse,
      navigateToCourseDetail,
      pendingChauffeur,
      clearPendingChauffeur,
      navigateToChauffeurDetail,
    ]
  )

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return ctx
}
