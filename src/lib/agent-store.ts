const NOTIFICATIONS_KEY = 'ricash-notifications-read'
const PROFILE_KEY = 'ricash-agent-profile'
const CLIENTS_EXTRA_KEY = 'ricash-clients-extra'

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadProfileSettings() {
  return loadJson(PROFILE_KEY, null as Record<string, unknown> | null)
}

export function saveProfileSettings(data: Record<string, unknown>) {
  saveJson(PROFILE_KEY, data)
}

export function loadExtraClients<T>() {
  return loadJson<T[]>(CLIENTS_EXTRA_KEY, [])
}

export function saveExtraClients<T>(clients: T[]) {
  saveJson(CLIENTS_EXTRA_KEY, clients)
}

export function loadNotificationState(): Record<string, boolean> {
  return loadJson(NOTIFICATIONS_KEY, {})
}

export function saveNotificationState(state: Record<string, boolean>) {
  saveJson(NOTIFICATIONS_KEY, state)
}
