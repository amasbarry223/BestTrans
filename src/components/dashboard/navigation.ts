'use client'

import { useState } from 'react'

export type ViewKey =
  | 'dashboard'
  // Utilisateurs
  | 'passagers'
  | 'passager-detail'
  | 'chauffeurs'
  | 'chauffeur-detail'
  | 'kyc-validation'
  // Opérations
  | 'courses'
  | 'course-detail'
  | 'carte-operations'
  // Finance
  | 'transactions'
  | 'revenus-chauffeurs'
  | 'synthese-finance'
  | 'commissions'
  // Support
  | 'tickets'
  | 'ticket-detail'
  | 'faq'
  // Système
  | 'rapports'
  | 'parametres'
  | 'notifications'

export function useNavigation() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  return { activeView, setActiveView }
}
