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

export type OperationClient = {
  initials: string
  name: string
  phone: string
  kycLevel?: string
  kycVerified?: boolean
  balance?: string
}

type OperationView = 'depot' | 'retrait' | 'transfert'

const PENDING_CLIENT_KEY = 'ricash-pending-client'
let pendingClientCache: OperationClient | null | undefined = undefined

export type PendingTransaction = {
  id: string
  type: string
  status: string
  period: string
  date: string
  time: string
  amount: string
  positive: boolean
  description: string
  client: string
  reference: string
}

const PENDING_TX_KEY = 'ricash-pending-transaction'
let pendingTxCache: PendingTransaction | null | undefined = undefined

export function takePendingClient(): OperationClient | null {
  if (pendingClientCache !== undefined) return pendingClientCache
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PENDING_CLIENT_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_CLIENT_KEY)
  try {
    pendingClientCache = JSON.parse(raw) as OperationClient
    return pendingClientCache
  } catch {
    pendingClientCache = null
    return null
  }
}

export function takePendingTransaction(): PendingTransaction | null {
  if (pendingTxCache !== undefined) return pendingTxCache
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(PENDING_TX_KEY)
  if (!raw) return null
  sessionStorage.removeItem(PENDING_TX_KEY)
  try {
    pendingTxCache = JSON.parse(raw) as PendingTransaction
    return pendingTxCache
  } catch {
    pendingTxCache = null
    return null
  }
}

type DashboardContextValue = {
  activeView: ViewKey
  setActiveView: (view: ViewKey) => void
  navigateTo: (view: ViewKey) => void
  pendingClient: OperationClient | null
  clearPendingClient: () => void
  navigateToOperation: (view: OperationView, client: OperationClient) => void
  consumePendingClient: () => OperationClient | null
  pendingTransaction: PendingTransaction | null
  clearPendingTransaction: () => void
  navigateToTransactionDetails: (tx: PendingTransaction) => void
  consumePendingTransaction: () => PendingTransaction | null
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [pendingClient, setPendingClient] = useState<OperationClient | null>(
    null
  )
  const [pendingTransaction, setPendingTransaction] =
    useState<PendingTransaction | null>(null)

  const navigateTo = useCallback((view: ViewKey) => {
    setActiveView(view)
  }, [])

  const clearPendingClient = useCallback(() => {
    setPendingClient(null)
  }, [])

  const clearPendingTransaction = useCallback(() => {
    setPendingTransaction(null)
  }, [])

  const navigateToOperation = useCallback(
    (view: OperationView, client: OperationClient) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(PENDING_CLIENT_KEY, JSON.stringify(client))
      }
      setPendingClient(client)
      setActiveView(view)
    },
    []
  )

  const navigateToTransactionDetails = useCallback((tx: PendingTransaction) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_TX_KEY, JSON.stringify(tx))
    }
    setPendingTransaction(tx)
    setActiveView('historique-details')
  }, [])

  const consumePendingClient = useCallback(() => {
    const client = pendingClient
    setPendingClient(null)
    return client
  }, [pendingClient])

  const consumePendingTransaction = useCallback(() => {
    const tx = pendingTransaction
    setPendingTransaction(null)
    return tx
  }, [pendingTransaction])

  const value = useMemo(
    () => ({
      activeView,
      setActiveView,
      navigateTo,
      pendingClient,
      clearPendingClient,
      navigateToOperation,
      consumePendingClient,
      pendingTransaction,
      clearPendingTransaction,
      navigateToTransactionDetails,
      consumePendingTransaction,
    }),
    [
      activeView,
      navigateTo,
      pendingClient,
      clearPendingClient,
      navigateToOperation,
      consumePendingClient,
      pendingTransaction,
      clearPendingTransaction,
      navigateToTransactionDetails,
      consumePendingTransaction,
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
