import { AUTH_COOKIE, AUTH_MAX_AGE } from './auth-constants'

export { AUTH_COOKIE, AUTH_MAX_AGE }

export type AuthUser = {
  id: string
  username: string
  name: string
  email: string
  role: string
  permissions: string[]
  location: string
  initials: string
}

// BestTrans Demo Users — RBAC: Super Admin, Admin
const DEMO_USERS: Record<string, { user: AuthUser; password: string }> = {
  superadmin: {
    password: 'besttrans2025',
    user: {
      id: 'superadmin',
      username: 'superadmin',
      name: 'Amadou Diallo',
      email: 'a.diallo@besttrans.ml',
      role: 'super_admin',
      permissions: ['dashboard:read', 'users:read', 'users:write', 'users:delete', 'drivers:read', 'drivers:write', 'drivers:validate', 'courses:read', 'courses:write', 'courses:cancel', 'payments:read', 'payments:write', 'payments:refund', 'support:read', 'support:write', 'reports:read', 'reports:export', 'settings:read', 'settings:write', 'roles:manage', 'audit:read', 'notifications:read'],
      location: 'Bamako',
      initials: 'AD',
    },
  },
  admin: {
    password: 'besttrans2025',
    user: {
      id: 'admin',
      username: 'admin',
      name: 'Fatoumata Traoré',
      email: 'f.traore@besttrans.ml',
      role: 'admin',
      permissions: ['dashboard:read', 'users:read', 'users:write', 'drivers:read', 'drivers:write', 'drivers:validate', 'courses:read', 'courses:write', 'courses:cancel', 'payments:read', 'payments:write', 'support:read', 'support:write', 'reports:read', 'reports:export', 'settings:read', 'notifications:read'],
      location: 'Bamako',
      initials: 'FT',
    },
  },
  'modybarry50@gmail.com': {
    password: 'besttrans2025',
    user: {
      id: 'modybarry50',
      username: 'modybarry50@gmail.com',
      name: 'Mody Barry',
      email: 'modybarry50@gmail.com',
      role: 'support',
      permissions: ['dashboard:read', 'users:read', 'drivers:read', 'courses:read', 'support:read', 'support:write', 'notifications:read'],
      location: 'Bamako',
      initials: 'MB',
    },
  },

}

const emailLookup: Record<string, string> = {}
for (const [username, entry] of Object.entries(DEMO_USERS)) {
  emailLookup[entry.user.email.toLowerCase()] = username
}

export function validateCredentials(
  identifier: string,
  password: string
): AuthUser | null {
  const id = identifier.trim().toLowerCase()
  const entry = DEMO_USERS[id] || DEMO_USERS[emailLookup[id] || '']
  if (entry && password === entry.password) {
    return entry.user
  }
  return null
}

export function getAllDemoUsers(): { username: string; name: string; role: string; email: string; initials: string }[] {
  return Object.values(DEMO_USERS).map((e) => ({
    username: e.user.username,
    name: e.user.name,
    role: e.user.role,
    email: e.user.email,
    initials: e.user.initials,
  }))
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    support: 'Support',
  }
  return labels[role] || role
}

export function getRoleColor(role: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    super_admin: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    admin: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    support: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  }
  return colors[role] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
}

export function encodeAuthUser(user: AuthUser): string {
  return JSON.stringify(user)
}

export function decodeAuthUser(value: string): AuthUser | null {
  try {
    return JSON.parse(value) as AuthUser
  } catch {
    return null
  }
}

export function setAuthCookie(user: AuthUser) {
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(encodeAuthUser(user))}; path=/; max-age=${AUTH_MAX_AGE}; SameSite=Lax`
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
  const rawValue = match.slice(AUTH_COOKIE.length + 1)
  return decodeAuthUser(decodeURIComponent(rawValue))
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false
  if (user.role === 'super_admin') return true
  return user.permissions.includes(permission)
}
