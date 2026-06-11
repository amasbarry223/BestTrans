'use client'

import { useSyncExternalStore, useRef } from 'react'
import { getAuthCookie, type AuthUser } from '@/lib/auth'

const emptySubscribe = () => () => {}

let cachedUser: AuthUser | null = null
let cachedCookieRaw: string | null = null

function getSnapshot(): AuthUser | null {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
  // Only re-parse if cookie string changed
  if (raw === cachedCookieRaw) return cachedUser
  cachedCookieRaw = raw
  cachedUser = getAuthCookie()
  return cachedUser
}

function getServerSnapshot(): AuthUser | null {
  return null
}

export function useAuthUser(): AuthUser | null {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
}
