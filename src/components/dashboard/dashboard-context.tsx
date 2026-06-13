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

export type PassagerData = {
  id: string
  name: string
  phone: string
  email: string
  dateInscription: string
  courses: number
  status: 'Actif' | 'Suspendu' | 'Inactif'
}

export type TicketData = {
  id: string
  numero: string
  personne: string
  type: string
  priorite: string
  statut: string
  date: string
  sujet: string
}

const PENDING_COURSE_KEY = 'besttrans-pending-course'
let pendingCourseCache: CourseData | null | undefined = undefined

const PENDING_CHAUFFEUR_KEY = 'besttrans-pending-chauffeur'
let pendingChauffeurCache: ChauffeurData | null | undefined = undefined

const PENDING_TICKET_KEY = 'besttrans-pending-ticket'
let pendingTicketCache: TicketData | null | undefined = undefined

const PENDING_PASSAGER_KEY = 'besttrans-pending-passager'
let pendingPassagerCache: PassagerData | null | undefined = undefined

export function takePendingPassager(): PassagerData | null {
  if (pendingPassagerCache !== undefined) return pendingPassagerCache
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PENDING_PASSAGER_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_PASSAGER_KEY)
  try {
    pendingPassagerCache = JSON.parse(raw) as PassagerData
    return pendingPassagerCache
  } catch {
    pendingPassagerCache = null
    return null
  }
}

export function takePendingTicket(): TicketData | null {
  if (pendingTicketCache !== undefined) return pendingTicketCache
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PENDING_TICKET_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_TICKET_KEY)
  try {
    pendingTicketCache = JSON.parse(raw) as TicketData
    return pendingTicketCache
  } catch {
    pendingTicketCache = null
    return null
  }
}

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
  pendingPassager: PassagerData | null
  clearPendingPassager: () => void
  navigateToPassagerDetail: (passager: PassagerData) => void
  pendingTicket: TicketData | null
  clearPendingTicket: () => void
  navigateToTicketDetail: (ticket: TicketData) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [pendingCourse, setPendingCourse] = useState<CourseData | null>(null)
  const [pendingChauffeur, setPendingChauffeur] = useState<ChauffeurData | null>(null)
  const [pendingPassager, setPendingPassager] = useState<PassagerData | null>(null)
  const [pendingTicket, setPendingTicket] = useState<TicketData | null>(null)

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

  const clearPendingPassager = useCallback(() => {
    setPendingPassager(null)
  }, [])

  const navigateToPassagerDetail = useCallback((passager: PassagerData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_PASSAGER_KEY, JSON.stringify(passager))
    }
    setPendingPassager(passager)
    setActiveView('passager-detail')
  }, [])

  const clearPendingTicket = useCallback(() => {
    setPendingTicket(null)
  }, [])

  const navigateToTicketDetail = useCallback((ticket: TicketData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_TICKET_KEY, JSON.stringify(ticket))
    }
    setPendingTicket(ticket)
    setActiveView('ticket-detail')
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
      pendingPassager,
      clearPendingPassager,
      navigateToPassagerDetail,
      pendingTicket,
      clearPendingTicket,
      navigateToTicketDetail,
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
      pendingPassager,
      clearPendingPassager,
      navigateToPassagerDetail,
      pendingTicket,
      clearPendingTicket,
      navigateToTicketDetail,
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
