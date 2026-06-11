'use client'

import { useState } from 'react'

export type ViewKey =
  | 'dashboard'
  | 'depot'
  | 'retrait'
  | 'transfert'
  | 'retrait-transfert'
  | 'clients'
  | 'commissions'
  | 'caisse'
  | 'airtime'
  | 'historique'
  | 'historique-details'
  | 'notifications'
  | 'parametres'
  | 'rapports'

export function useNavigation() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  return { activeView, setActiveView }
}
