'use client'

import { useSyncExternalStore, type ReactNode } from 'react'

function subscribe() {
  return () => {}
}

function getClientSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

/**
 * Renders children only after mount to avoid hydration mismatches
 * (browser extensions, Recharts, window-dependent UI).
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )

  if (!mounted) {
    return fallback
  }

  return children
}
