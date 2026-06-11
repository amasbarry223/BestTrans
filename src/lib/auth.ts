import { AUTH_COOKIE, AUTH_MAX_AGE } from './auth-constants'

export { AUTH_COOKIE, AUTH_MAX_AGE }

export type AuthUser = {
  id: string
  name: string
  email: string
  location: string
  initials: string
}

const DEMO_USER: AuthUser = {
  id: 'agent001',
  name: 'Amadou Moussa',
  email: 'amadou.moussa@ricash.ml',
  location: 'Bamako',
  initials: 'AM',
}

const VALID_IDENTIFIERS = new Set([
  'agent001',
  'amadou.moussa@ricash.ml',
  'amadou',
])

export const DEMO_PASSWORD = 'ricash2024'

export function validateCredentials(
  identifier: string,
  password: string
): AuthUser | null {
  const id = identifier.trim().toLowerCase()
  if (!VALID_IDENTIFIERS.has(id) || password !== DEMO_PASSWORD) {
    return null
  }
  return DEMO_USER
}

export function encodeAuthUser(user: AuthUser): string {
  return encodeURIComponent(JSON.stringify(user))
}

export function decodeAuthUser(value: string): AuthUser | null {
  try {
    return JSON.parse(decodeURIComponent(value)) as AuthUser
  } catch {
    return null
  }
}

export function setAuthCookie(user: AuthUser) {
  document.cookie = `${AUTH_COOKIE}=${encodeAuthUser(user)}; path=/; max-age=${AUTH_MAX_AGE}; SameSite=Lax`
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export function getAuthCookie(): AuthUser | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${AUTH_COOKIE}=`))
  if (!match) return null
  return decodeAuthUser(match.slice(AUTH_COOKIE.length + 1))
}
