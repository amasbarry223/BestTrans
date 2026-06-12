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

export type TransitDossier = {
  id: string
  number: string
  type: 'Import' | 'Export' | 'Transit' | 'Réexportation'
  client: string
  regime: string
  bl: string
  bureau: string
  merchandise: string
  status: string
  honoraires: string
  droitsTaxes: string
  date: string
  corridor: string
}

const PENDING_DOSSIER_KEY = 'transit-pending-dossier'
let pendingDossierCache: TransitDossier | null | undefined = undefined

export function takePendingDossier(): TransitDossier | null {
  if (pendingDossierCache !== undefined) return pendingDossierCache
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PENDING_DOSSIER_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_DOSSIER_KEY)
  try {
    pendingDossierCache = JSON.parse(raw) as TransitDossier
    return pendingDossierCache
  } catch {
    pendingDossierCache = null
    return null
  }
}

type DashboardContextValue = {
  activeView: ViewKey
  setActiveView: (view: ViewKey) => void
  navigateTo: (view: ViewKey) => void
  pendingDossier: TransitDossier | null
  clearPendingDossier: () => void
  navigateToDossierDetail: (dossier: TransitDossier) => void
  consumePendingDossier: () => TransitDossier | null
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [pendingDossier, setPendingDossier] = useState<TransitDossier | null>(null)

  const navigateTo = useCallback((view: ViewKey) => {
    setActiveView(view)
  }, [])

  const clearPendingDossier = useCallback(() => {
    setPendingDossier(null)
  }, [])

  const navigateToDossierDetail = useCallback((dossier: TransitDossier) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_DOSSIER_KEY, JSON.stringify(dossier))
    }
    setPendingDossier(dossier)
    setActiveView('dossier-detail')
  }, [])

  const consumePendingDossier = useCallback(() => {
    const dossier = pendingDossier
    setPendingDossier(null)
    return dossier
  }, [pendingDossier])

  const value = useMemo(
    () => ({
      activeView,
      setActiveView,
      navigateTo,
      pendingDossier,
      clearPendingDossier,
      navigateToDossierDetail,
      consumePendingDossier,
    }),
    [
      activeView,
      navigateTo,
      pendingDossier,
      clearPendingDossier,
      navigateToDossierDetail,
      consumePendingDossier,
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
