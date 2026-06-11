'use client'

import { useState } from 'react'

export type ViewKey =
  | 'dashboard'
  | 'dossiers'
  | 'dossier-detail'
  | 'clients'
  | 'transport'
  | 'depots'
  | 'facturation'
  | 'ged'
  | 'corridors'
  | 'calculatrice'
  | 'surestaries'
  | 'securite'
  | 'notifications'
  | 'parametres'

export function useNavigation() {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  return { activeView, setActiveView }
}
