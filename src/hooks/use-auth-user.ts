'use client'

import { useSyncExternalStore } from 'react'
import { getAuthCookie, type AuthUser } from '@/lib/auth'

function subscribe() {
  return () => {}
}

function getSnapshot(): AuthUser | null {
  return getAuthCookie()
}

function getServerSnapshot(): AuthUser | null {
  return null
}

export function useAuthUser(): AuthUser | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
