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

// Demo users for fallback when DB is not available
const DEMO_USERS: Record<string, { user: AuthUser; password: string }> = {
  admin001: {
    password: 'transit2026',
    user: {
      id: 'admin001',
      username: 'admin001',
      name: 'Seydou Diarra',
      email: 'admin@transitpro.ml',
      role: 'admin',
      permissions: ['dashboard:read', 'dashboard:write', 'dossiers:read', 'dossiers:write', 'dossiers:delete', 'clients:read', 'clients:write', 'clients:delete', 'transport:read', 'transport:write', 'transport:delete', 'depots:read', 'depots:write', 'depots:delete', 'facturation:read', 'facturation:write', 'facturation:delete', 'ged:read', 'ged:write', 'ged:delete', 'securite:read', 'securite:write', 'users:read', 'users:write', 'users:delete', 'audit:read', 'parametres:read', 'parametres:write', 'corridors:read', 'corridors:write', 'calculatrice:read', 'surestaries:read', 'surestaries:write'],
      location: 'Bamako',
      initials: 'SD',
    },
  },
  dir001: {
    password: 'transit2026',
    user: {
      id: 'dir001',
      username: 'dir001',
      name: 'Amadou Diallo',
      email: 's.diarra@transitpro.ml',
      role: 'directeur',
      permissions: ['dashboard:read', 'dashboard:write', 'dossiers:read', 'dossiers:write', 'clients:read', 'clients:write', 'transport:read', 'depots:read', 'facturation:read', 'facturation:write', 'ged:read', 'corridors:read', 'calculatrice:read', 'surestaries:read', 'audit:read', 'parametres:read'],
      location: 'Bamako',
      initials: 'AD',
    },
  },
  decl001: {
    password: 'transit2026',
    user: {
      id: 'decl001',
      username: 'decl001',
      name: 'Aminata Konaté',
      email: 'a.konate@transitpro.ml',
      role: 'declarant',
      permissions: ['dashboard:read', 'dossiers:read', 'dossiers:write', 'clients:read', 'ged:read', 'ged:write', 'corridors:read', 'calculatrice:read'],
      location: 'Bamako',
      initials: 'AK',
    },
  },
  agent001: {
    password: 'transit2026',
    user: {
      id: 'agent001',
      username: 'agent001',
      name: 'Fatoumata Traoré',
      email: 'f.traore@transitpro.ml',
      role: 'agent',
      permissions: ['dashboard:read', 'dossiers:read', 'dossiers:write', 'ged:read', 'ged:write', 'clients:read'],
      location: 'Bamako',
      initials: 'FT',
    },
  },
  mag001: {
    password: 'transit2026',
    user: {
      id: 'mag001',
      username: 'mag001',
      name: 'Ibrahim Sidibé',
      email: 'i.sidibe@transitpro.ml',
      role: 'magasinier',
      permissions: ['dashboard:read', 'depots:read', 'depots:write', 'surestaries:read', 'surestaries:write', 'ged:read'],
      location: 'Bamako',
      initials: 'IS',
    },
  },
  trans001: {
    password: 'transit2026',
    user: {
      id: 'trans001',
      username: 'trans001',
      name: 'Oumar Dembélé',
      email: 'o.dembele@transitpro.ml',
      role: 'transport',
      permissions: ['dashboard:read', 'transport:read', 'transport:write', 'corridors:read'],
      location: 'Bamako',
      initials: 'OD',
    },
  },
  compt001: {
    password: 'transit2026',
    user: {
      id: 'compt001',
      username: 'compt001',
      name: 'Aminata Coulibaly',
      email: 'a.coulibaly@transitpro.ml',
      role: 'comptable',
      permissions: ['dashboard:read', 'facturation:read', 'facturation:write', 'clients:read'],
      location: 'Bamako',
      initials: 'AC',
    },
  },
  comm001: {
    password: 'transit2026',
    user: {
      id: 'comm001',
      username: 'comm001',
      name: 'Mamadou Sissoko',
      email: 'm.sissoko@transitpro.ml',
      role: 'commercial',
      permissions: ['dashboard:read', 'clients:read', 'clients:write', 'facturation:read'],
      location: 'Bamako',
      initials: 'MS',
    },
  },
  audit001: {
    password: 'transit2026',
    user: {
      id: 'audit001',
      username: 'audit001',
      name: 'Djénéba Keïta',
      email: 'd.keita@transitpro.ml',
      role: 'auditeur',
      permissions: ['dashboard:read', 'dossiers:read', 'clients:read', 'transport:read', 'depots:read', 'facturation:read', 'ged:read', 'audit:read', 'securite:read'],
      location: 'Bamako',
      initials: 'DK',
    },
  },
}

// Build email-to-username lookup
const emailLookup: Record<string, string> = {}
for (const [username, entry] of Object.entries(DEMO_USERS)) {
  emailLookup[entry.user.email.toLowerCase()] = username
}

export function validateCredentials(
  identifier: string,
  password: string
): AuthUser | null {
  const id = identifier.trim().toLowerCase()

  // Try by username
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
    admin: 'Administrateur',
    directeur: 'Directeur',
    declarant: 'Déclarant',
    agent: 'Agent de transit',
    magasinier: 'Magasinier',
    transport: 'Resp. Transport',
    comptable: 'Comptable',
    commercial: 'Commercial',
    auditeur: 'Auditeur',
    client: 'Client',
  }
  return labels[role] || role
}

export function getRoleColor(role: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    admin: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    directeur: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    declarant: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    agent: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    magasinier: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    transport: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    comptable: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    commercial: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    auditeur: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    client: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
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
  if (user.role === 'admin') return true
  return user.permissions.includes(permission)
}
