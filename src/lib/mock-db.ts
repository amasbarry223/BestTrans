'use client'

import { type AuthUser } from './auth'

// ─── Types ───────────────────────────────────────────────────

export type TicketStatus = 'Ouvert' | 'En cours' | 'Résolu'
export type TicketPriority = 'Haute' | 'Moyenne' | 'Basse'

export type SupportTicket = {
  id: string
  numero: string
  personne: string
  personneRole: 'Passager' | 'Chauffeur'
  type: string
  priorite: TicketPriority
  statut: TicketStatus
  assigneA: string
  date: string
  sujet: string
}

export type AuditLogEntry = {
  id: string
  userId: string
  userName: string
  action: string
  entity: string
  details: string
  createdAt: string
}

export type UserEntry = {
  id: string
  username: string
  name: string
  email: string
  role: string
  permissions: string[]
  phone: string | null
  initials: string | null
  active: boolean
  lastLoginAt: string | null
  createdAt: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success' | 'message'
  read: boolean
  createdAt: string
}

// ─── Initial Data ────────────────────────────────────────────

const INITIAL_TICKETS: SupportTicket[] = [
  { id: '1', numero: 'TKT-2026-0234', personne: 'Amadou Diallo',       personneRole: 'Passager',  type: 'Réclamation',   priorite: 'Haute',  statut: 'Ouvert',    assigneA: 'Support A', date: '05 Mar 2026 14:20', sujet: 'Problème de facturation sur ma dernière course' },
  { id: '2', numero: 'TKT-2026-0233', personne: 'Ibrahim Keita',       personneRole: 'Chauffeur', type: 'Technique',      priorite: 'Moyenne', statut: 'En cours',  assigneA: 'Tech B',    date: '05 Mar 2026 13:45', sujet: 'L\'application se ferme inopinément' },
  { id: '3', numero: 'TKT-2026-0232', personne: 'Fatoumata Traoré',    personneRole: 'Passager',  type: 'Remboursement',  priorite: 'Haute',  statut: 'Ouvert',    assigneA: 'Finance C',  date: '05 Mar 2026 12:30', sujet: 'Double débit constaté' },
]

const INITIAL_USERS: UserEntry[] = [
  { id: '1', username: 'superadmin', name: 'Amadou Diallo', email: 'a.diallo@besttrans.ml', role: 'super_admin', permissions: [], phone: '+223 70 00 00 00', initials: 'AD', active: true, lastLoginAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '2', username: 'admin', name: 'Fatoumata Traoré', email: 'f.traore@besttrans.ml', role: 'admin', permissions: [], phone: '+223 71 11 11 11', initials: 'FT', active: true, lastLoginAt: new Date().toISOString(), createdAt: new Date().toISOString() },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Nouveau chauffeur inscrit', message: 'Mamadou Diarra vient de s\'inscrire.', type: 'info', read: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Alerte KYC', message: '3 documents sont en attente de validation.', type: 'warning', read: false, createdAt: new Date().toISOString() },
  { id: '3', title: 'Paiement échoué', message: 'Transaction BT-8829 annulée par la banque.', type: 'error', read: false, createdAt: new Date().toISOString() },
  { id: '4', title: 'Nouveau message', message: 'Vous avez un message de Souleymane Barry.', type: 'message', read: false, createdAt: new Date().toISOString() },
  { id: '5', title: 'Système à jour', message: 'Version 2.0.4 déployée avec succès.', type: 'success', read: false, createdAt: new Date().toISOString() },
]

// ─── Store Logic ─────────────────────────────────────────────

const KEYS = {
  TICKETS: 'besttrans_mock_tickets',
  AUDIT_LOGS: 'besttrans_mock_audit_logs',
  USERS: 'besttrans_mock_users',
  NOTIFICATIONS: 'besttrans_mock_notifications',
}

export const mockDb = {
  // --- Notifications ---
  getNotifications(): Notification[] {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS)
    if (!raw) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS))
      return INITIAL_NOTIFICATIONS
    }
    try {
      return JSON.parse(raw)
    } catch {
      localStorage.removeItem(KEYS.NOTIFICATIONS)
      return INITIAL_NOTIFICATIONS
    }
  },

  getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length
  },

  markAllAsRead() {
    const notifications = this.getNotifications().map(n => ({ ...n, read: true }))
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications))
  },

  markAsRead(id: string) {
    const notifications = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n)
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications))
  },

  // --- Users ---
  getUsers(): UserEntry[] {
    if (typeof window === 'undefined') return INITIAL_USERS
    const raw = localStorage.getItem(KEYS.USERS)
    if (!raw) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS))
      return INITIAL_USERS
    }
    try {
      return JSON.parse(raw)
    } catch {
      localStorage.removeItem(KEYS.USERS)
      return INITIAL_USERS
    }
  },

  addUser(user: Omit<UserEntry, 'id' | 'createdAt' | 'lastLoginAt'>) {
    const users = this.getUsers()
    const newUser: UserEntry = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify([newUser, ...users]))
    this.addLog('CREATION', 'Utilisateur', `Nouvel utilisateur créé: ${user.name}`)
    return newUser
  },

  updateUser(id: string, updates: Partial<UserEntry>) {
    const users = this.getUsers()
    const index = users.findIndex(u => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      localStorage.setItem(KEYS.USERS, JSON.stringify(users))
      this.addLog('MODIFICATION', 'Utilisateur', `Utilisateur ${users[index].name} mis à jour`)
    }
  },

  deleteUser(id: string) {
    const users = this.getUsers()
    const user = users.find(u => u.id === id)
    if (user) {
      const filtered = users.filter(u => u.id !== id)
      localStorage.setItem(KEYS.USERS, JSON.stringify(filtered))
      this.addLog('SUPPRESSION', 'Utilisateur', `Utilisateur supprimé: ${user.name}`)
    }
  },

  // --- Tickets ---
  getTickets(): SupportTicket[] {
    if (typeof window === 'undefined') return INITIAL_TICKETS
    const raw = localStorage.getItem(KEYS.TICKETS)
    if (!raw) {
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS))
      return INITIAL_TICKETS
    }
    try {
      return JSON.parse(raw)
    } catch {
      localStorage.removeItem(KEYS.TICKETS)
      return INITIAL_TICKETS
    }
  },

  updateTicket(id: string, updates: Partial<SupportTicket>) {
    const tickets = this.getTickets()
    const index = tickets.findIndex(t => t.id === id)
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates }
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets))
      this.addLog('MODIFICATION', 'Ticket', `Ticket ${tickets[index].numero} mis à jour: ${Object.keys(updates).join(', ')}`)
    }
  },

  // --- Audit Logs ---
  getLogs(): AuditLogEntry[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(KEYS.AUDIT_LOGS)
    if (!raw) return []
    try {
      return JSON.parse(raw)
    } catch {
      localStorage.removeItem(KEYS.AUDIT_LOGS)
      return []
    }
  },

  addLog(action: string, entity: string, details: string, user?: { id: string; name: string }) {
    if (typeof window === 'undefined') return
    const logs = this.getLogs()
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      userId: user?.id ?? 'system',
      userName: user?.name ?? 'Système',
      action,
      entity,
      details,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify([newLog, ...logs].slice(0, 100)))
  },

  // --- Initialization ---
  init() {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(KEYS.TICKETS)) {
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS))
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS))
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS))
    }
  }
}
