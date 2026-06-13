'use client'

import { useSyncExternalStore } from 'react'
import { getAuthCookie, type AuthUser } from '@/lib/auth'

let cachedUser: AuthUser | null = null
let cachedCookieRaw: string | null = null
const listeners = new Set<() => void>()

function getSnapshot(): AuthUser | null {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
  if (raw === cachedCookieRaw) return cachedUser
  cachedCookieRaw = raw
  cachedUser = getAuthCookie()
  return cachedUser
}

function getServerSnapshot(): AuthUser | null {
  return null
}

function notify() {
  cachedCookieRaw = null // invalidate cache so getSnapshot re-parses
  listeners.forEach((l) => l())
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  // Poll every second to catch cookie changes (login/logout via Set-Cookie header)
  const interval = setInterval(() => {
    if (document.cookie !== cachedCookieRaw) notify()
  }, 1000)
  return () => {
    listeners.delete(callback)
    clearInterval(interval)
  }
}

export function useAuthUser(): AuthUser | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
