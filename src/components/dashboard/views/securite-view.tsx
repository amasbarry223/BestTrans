'use client'

import { useState } from 'react'
import {
  Shield,
  Users,
  Key,
  Eye,
  Lock,
  Unlock,
  UserPlus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type RoleKey = 'admin' | 'directeur' | 'declarant' | 'agent' | 'magasinier' | 'transport' | 'comptable' | 'commercial' | 'auditeur' | 'client'

const roles: {
  key: RoleKey
  label: string
  description: string
  permissions: string[]
  userCount: number
  color: string
  bg: string
}[] = [
  { key: 'admin', label: 'Administrateur système', description: 'Accès total, configuration, gestion des comptes', permissions: ['Tous les modules', 'Configuration système', 'Gestion utilisateurs', 'Audit logs'], userCount: 1, color: 'text-rose-600', bg: 'bg-rose-50' },
  { key: 'directeur', label: 'Directeur / Direction', description: 'Accès complet aux tableaux de bord et au reporting', permissions: ['Tableaux de bord', 'Rapports', 'Comptabilité (lecture)', 'Tous modules (lecture)'], userCount: 2, color: 'text-teal-600', bg: 'bg-teal-50' },
  { key: 'declarant', label: 'Responsable transit / Déclarant', description: 'Gestion des dossiers et déclarations en douane', permissions: ['Dossiers de transit', 'Déclarations', 'GED (transit)', 'Clients (lecture)'], userCount: 4, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'agent', label: 'Agent de transit / Opérateur', description: 'Saisie et suivi des dossiers', permissions: ['Dossiers (saisie)', 'GED (ajout)', 'Clients (lecture)'], userCount: 8, color: 'text-sky-600', bg: 'bg-sky-50' },
  { key: 'magasinier', label: 'Magasinier / Resp. dépôt', description: 'Mouvements de dépôt, conteneurs, magasinage', permissions: ['Dépôts & Entreposage', 'Conteneurs', 'Magasinage'], userCount: 3, color: 'text-violet-600', bg: 'bg-violet-50' },
  { key: 'transport', label: 'Resp. transport / Dispatch', description: 'Flotte, chauffeurs, missions de transport', permissions: ['Transport & Flotte', 'Missions', 'Chauffeurs'], userCount: 2, color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'comptable', label: 'Comptable / Caissier', description: 'Facturation, règlements, comptabilité', permissions: ['Facturation', 'Règlements', 'Comptabilité', 'Clients (lecture)'], userCount: 3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'commercial', label: 'Commercial', description: 'Clients, contrats, tarification', permissions: ['Clients & Contrats', 'Tarification', 'Rapports commerciaux'], userCount: 2, color: 'text-pink-600', bg: 'bg-pink-50' },
  { key: 'auditeur', label: 'Auditeur', description: 'Lecture seule sur l\'ensemble', permissions: ['Tous modules (lecture seule)', 'Audit logs (lecture)', 'Rapports'], userCount: 1, color: 'text-gray-600', bg: 'bg-gray-50' },
  { key: 'client', label: 'Client (portail)', description: 'Consultation de ses propres dossiers et factures', permissions: ['Dossiers propres (lecture)', 'Factures propres (lecture)'], userCount: 24, color: 'text-indigo-600', bg: 'bg-indigo-50' },
]

const mockUsers = [
  { id: '1', name: 'Seydou Diarra', role: 'Administrateur système' as string, email: 's.diarra@transitpro.ml', lastLogin: '10/03/2026 08:30', status: 'Actif' },
  { id: '2', name: 'Amadou Diallo', role: 'Déclarant' as string, email: 'a.diallo@transitpro.ml', lastLogin: '10/03/2026 07:45', status: 'Actif' },
  { id: '3', name: 'Fatoumata Traoré', role: 'Agent de transit' as string, email: 'f.traore@transitpro.ml', lastLogin: '09/03/2026 17:20', status: 'Actif' },
  { id: '4', name: 'Moussa Koné', role: 'Déclarant' as string, email: 'm.kone@transitpro.ml', lastLogin: '10/03/2026 09:00', status: 'Actif' },
  { id: '5', name: 'Ibrahim Sidibé', role: 'Magasinier' as string, email: 'i.sidibe@transitpro.ml', lastLogin: '10/03/2026 06:15', status: 'Actif' },
  { id: '6', name: 'Aminata Coulibaly', role: 'Comptable' as string, email: 'a.coulibaly@transitpro.ml', lastLogin: '10/03/2026 08:00', status: 'Actif' },
  { id: '7', name: 'Oumar Dembélé', role: 'Resp. transport' as string, email: 'o.dembele@transitpro.ml', lastLogin: '08/03/2026 18:30', status: 'Inactif' },
]

const stats = [
  { label: 'Utilisateurs', value: '26', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Rôles définis', value: '10', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Sessions actives', value: '8', icon: Key, color: 'text-sky-600', bg: 'bg-sky-50' },
  { label: 'Alertes sécurité', value: '1', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
]

export function SecuriteView() {
  const [activeTab, setActiveTab] = useState<'roles' | 'utilisateurs'>('roles')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = mockUsers.filter((u) => {
    return searchTerm === '' ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <Icon className={cn('w-5 h-5', s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#111827]">{s.value}</p>
                <p className="text-xs text-[#6B7280]">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('roles')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeTab === 'roles' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50')}
        >
          <Shield className="w-4 h-4 inline mr-1.5" />Rôles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('utilisateurs')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeTab === 'utilisateurs' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50')}
        >
          <Users className="w-4 h-4 inline mr-1.5" />Utilisateurs
        </button>
      </div>

      {activeTab === 'roles' ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <div key={role.key} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', role.bg)}>
                      <Shield className={cn('w-4 h-4', role.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{role.label}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{role.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#6B7280] bg-gray-50 px-2 py-0.5 rounded">{role.userCount} utilisateur{role.userCount > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-1.5">
                  {role.permissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-[#374151]">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
              />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <UserPlus className="w-4 h-4" /> Nouvel utilisateur
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-440px)]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F9FAFB]">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-2.5 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Utilisateur</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Rôle</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Email</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Dernière connexion</th>
                  <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] cursor-pointer">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                          {u.name.split(' ').map(w => w[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-[#111827]">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-[#374151]">{u.role}</td>
                    <td className="py-3 px-3 text-xs text-[#6B7280]">{u.email}</td>
                    <td className="py-3 px-3 text-xs text-[#6B7280]">{u.lastLogin}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded',
                        u.status === 'Actif' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      )}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
