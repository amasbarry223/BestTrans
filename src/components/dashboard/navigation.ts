'use client'

import { useState } from 'react'

export type ViewKey =
  | 'dashboard'
  | 'passagers'
  | 'chauffeurs'
  | 'chauffeur-detail'
  | 'kyc-validation'
  | 'courses'
  | 'course-detail'
  | 'carte-operations'
  | 'transactions'
  | 'revenus-chauffeurs'
  | 'synthese-finance'
  | 'tickets'
  | 'ticket-detail'
  | 'faq'
  | 'rapports'
  | 'parametres'
  | 'notifications'

export function useNavigation() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  return { activeView, setActiveView }
}
