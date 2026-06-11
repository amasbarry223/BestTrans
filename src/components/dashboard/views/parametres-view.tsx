'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  User,
  Building2,
  Bell,
  Shield,
  History,
  Users,
  Save,
  Search,
  LogIn,
  LogOut,
  Plus,
  FileUp,
  CreditCard,
  Pencil,
  Trash2,
  MoreHorizontal,
  Eye,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRoleLabel, getRoleColor } from '@/lib/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ─── Types ───────────────────────────────────────────────────

type AuditAction =
  | 'CONNEXION'
  | 'CREATION'
  | 'MODIFICATION'
  | 'SUPPRESSION'
  | 'PAIEMENT'
  | 'DEPOT_FICHIER'
  | 'DECONNEXION'

type AuditLogEntry = {
  id: string
  userId: string | null
  action: AuditAction
  entity: string
  entityId: string | null
  details: string | null
  createdAt: string
  user: {
    id: string
    name: string
    username: string
    role: string
    initials: string
  } | null
}

type AuditLogResponse = {
  logs: AuditLogEntry[]
  total: number
  limit: number
  offset: number
}

type UserEntry = {
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

// ─── Permission Modules ──────────────────────────────────────

const PERMISSION_MODULES = [
  { key: 'dashboard', label: 'Tableau de bord', perms: ['read', 'write'] },
  { key: 'dossiers', label: 'Dossiers', perms: ['read', 'write', 'delete'] },
  { key: 'clients', label: 'Clients', perms: ['read', 'write', 'delete'] },
  { key: 'transport', label: 'Transport', perms: ['read', 'write', 'delete'] },
  { key: 'depots', label: 'Dépôts', perms: ['read', 'write', 'delete'] },
  { key: 'facturation', label: 'Facturation', perms: ['read', 'write', 'delete'] },
  { key: 'ged', label: 'GED', perms: ['read', 'write', 'delete'] },
  { key: 'securite', label: 'Sécurité', perms: ['read', 'write'] },
  { key: 'users', label: 'Utilisateurs', perms: ['read', 'write', 'delete'] },
  { key: 'audit', label: 'Audit', perms: ['read'] },
  { key: 'parametres', label: 'Paramètres', perms: ['read', 'write'] },
  { key: 'corridors', label: 'Corridors', perms: ['read', 'write'] },
  { key: 'calculatrice', label: 'Calculatrice', perms: ['read'] },
  { key: 'surestaries', label: 'Surestaries', perms: ['read', 'write'] },
] as const

const PERM_LABELS: Record<string, string> = {
  read: 'Lecture',
  write: 'Écriture',
  delete: 'Suppression',
}

// Role-based permission presets
const ROLE_PRESETS: Record<string, string[]> = {
  admin: PERMISSION_MODULES.flatMap((m) => m.perms.map((p) => `${m.key}:${p}`)),
  directeur: [
    'dashboard:read', 'dashboard:write',
    'dossiers:read', 'dossiers:write',
    'clients:read', 'clients:write',
    'transport:read',
    'depots:read',
    'facturation:read', 'facturation:write',
    'ged:read',
    'corridors:read',
    'calculatrice:read',
    'surestaries:read',
    'audit:read',
    'parametres:read',
  ],
  declarant: [
    'dashboard:read',
    'dossiers:read', 'dossiers:write',
    'clients:read',
    'ged:read', 'ged:write',
    'corridors:read',
    'calculatrice:read',
  ],
  agent: [
    'dashboard:read',
    'dossiers:read', 'dossiers:write',
    'ged:read', 'ged:write',
    'clients:read',
  ],
  magasinier: [
    'dashboard:read',
    'depots:read', 'depots:write',
    'surestaries:read', 'surestaries:write',
    'ged:read',
  ],
  transport: [
    'dashboard:read',
    'transport:read', 'transport:write',
    'corridors:read',
  ],
  comptable: [
    'dashboard:read',
    'facturation:read', 'facturation:write',
    'clients:read',
  ],
  commercial: [
    'dashboard:read',
    'clients:read', 'clients:write',
    'facturation:read',
  ],
  auditeur: [
    'dashboard:read',
    'dossiers:read',
    'clients:read',
    'transport:read',
    'depots:read',
    'facturation:read',
    'ged:read',
    'audit:read',
    'securite:read',
  ],
  client: [
    'dashboard:read',
    'dossiers:read',
    'facturation:read',
  ],
}

// ─── Action badge config ─────────────────────────────────────

function getActionBadgeConfig(action: AuditAction) {
  const config: Record<AuditAction, { bg: string; text: string; icon: React.ReactNode }> = {
    CONNEXION: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <LogIn className="w-3 h-3" /> },
    CREATION: { bg: 'bg-green-50', text: 'text-green-700', icon: <Plus className="w-3 h-3" /> },
    MODIFICATION: { bg: 'bg-sky-50', text: 'text-sky-700', icon: <Pencil className="w-3 h-3" /> },
    SUPPRESSION: { bg: 'bg-red-50', text: 'text-red-700', icon: <Trash2 className="w-3 h-3" /> },
    PAIEMENT: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <CreditCard className="w-3 h-3" /> },
    DEPOT_FICHIER: { bg: 'bg-violet-50', text: 'text-violet-700', icon: <FileUp className="w-3 h-3" /> },
    DECONNEXION: { bg: 'bg-gray-50', text: 'text-gray-700', icon: <LogOut className="w-3 h-3" /> },
  }
  return config[action]
}

// ─── Date formatting ─────────────────────────────────────────

function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

function formatDateFrShort(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

// ─── Initials Avatar ─────────────────────────────────────────

function InitialsAvatar({ initials, name, size = 'md' }: { initials: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-16 h-16 text-xl',
  }
  return (
    <div
      className={cn('rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0', sizeClasses[size])}
      title={name}
    >
      {initials}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════

export function ParametresView() {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="profil" className="flex flex-col flex-1 min-h-0">
        <TabsList className="w-full h-auto flex-wrap bg-white border border-[#E5E7EB] rounded-xl p-1.5 gap-1">
          <TabsTrigger
            value="profil"
            className={cn(
              'flex-1 min-w-0 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm',
              'rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors'
            )}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">Mon Profil</span>
          </TabsTrigger>
          <TabsTrigger
            value="entreprise"
            className={cn(
              'flex-1 min-w-0 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm',
              'rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors'
            )}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Entreprise</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className={cn(
              'flex-1 min-w-0 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm',
              'rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors'
            )}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span className="truncate">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="securite"
            className={cn(
              'flex-1 min-w-0 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm',
              'rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors'
            )}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span className="truncate">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger
            value="historique"
            className={cn(
              'flex-1 min-w-0 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm',
              'rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors'
            )}
          >
            <History className="w-4 h-4 shrink-0" />
            <span className="truncate">Historique</span>
          </TabsTrigger>
          <TabsTrigger
            value="utilisateurs"
            className={cn(
              'flex-1 min-w-0 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm',
              'rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors'
            )}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">Utilisateurs</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Mon Profil ── */}
        <TabsContent value="profil" className="flex-1 mt-4 min-h-0 overflow-y-auto">
          <ProfilTab />
        </TabsContent>

        {/* ── Tab 2: Entreprise ── */}
        <TabsContent value="entreprise" className="flex-1 mt-4 min-h-0 overflow-y-auto">
          <EntrepriseTab />
        </TabsContent>

        {/* ── Tab 3: Notifications ── */}
        <TabsContent value="notifications" className="flex-1 mt-4 min-h-0 overflow-y-auto">
          <NotificationsTab />
        </TabsContent>

        {/* ── Tab 4: Sécurité ── */}
        <TabsContent value="securite" className="flex-1 mt-4 min-h-0 overflow-y-auto">
          <SecuriteTab />
        </TabsContent>

        {/* ── Tab 5: Historique & Traçabilité ── */}
        <TabsContent value="historique" className="flex-1 mt-4 min-h-0">
          <HistoriqueTab />
        </TabsContent>

        {/* ── Tab 6: Gestion Utilisateurs ── */}
        <TabsContent value="utilisateurs" className="flex-1 mt-4 min-h-0">
          <UtilisateursTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// TAB 1: MON PROFIL
// ═════════════════════════════════════════════════════════════

function ProfilTab() {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[#111827] mb-6">Informations personnelles</h3>
      <div className="flex items-center gap-4 mb-6">
        <InitialsAvatar initials="SD" name="Seydou Diarra" size="lg" />
        <div>
          <p className="font-semibold text-[#111827]">Seydou Diarra</p>
          <p className="text-sm text-[#6B7280]">Directeur</p>
          <button className="text-xs text-teal-600 font-medium mt-1 hover:underline">
            Changer la photo
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Nom complet</Label>
          <Input type="text" defaultValue="Seydou Diarra" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Email</Label>
          <Input type="email" defaultValue="s.diarra@transitpro.ml" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Téléphone</Label>
          <Input type="tel" defaultValue="+223 70 00 00 00" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Rôle</Label>
          <Input type="text" defaultValue="Directeur" disabled className="mt-1 bg-gray-50 text-[#6B7280]" />
        </div>
      </div>
      <Button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-teal-600 hover:bg-teal-700 text-white"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
        Enregistrer
      </Button>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// TAB 2: ENTREPRISE
// ═════════════════════════════════════════════════════════════

function EntrepriseTab() {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[#111827] mb-6">Paramètres de l&apos;entreprise</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Raison sociale</Label>
          <Input type="text" defaultValue="TransitPro SARL" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">NIF</Label>
          <Input type="text" defaultValue="NIF-12-45-6789-Z" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">RCCM</Label>
          <Input type="text" defaultValue="RCCM-BKO-2020-1234" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Devise</Label>
          <Input type="text" defaultValue="FCFA" disabled className="mt-1 bg-gray-50 text-[#6B7280]" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Zone d&apos;opération</Label>
          <Input type="text" defaultValue="Mali / UEMOA" disabled className="mt-1 bg-gray-50 text-[#6B7280]" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Franchise dépôt (jours)</Label>
          <Input type="number" defaultValue="21" className="mt-1" />
        </div>
      </div>
      <Button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-teal-600 hover:bg-teal-700 text-white"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
        Enregistrer
      </Button>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// TAB 3: NOTIFICATIONS
// ═════════════════════════════════════════════════════════════

function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    franchise: true,
    facturesRetard: true,
    echeances: true,
    missions: false,
    rapports: false,
    alertesSecurite: true,
  })

  const notifications = [
    { key: 'franchise', label: 'Alertes de franchise dépôt', desc: 'Notification quand un dossier approche la franchise' },
    { key: 'facturesRetard', label: 'Factures en retard', desc: 'Rappel pour les factures non réglées après échéance' },
    { key: 'echeances', label: 'Échéances déclarations', desc: 'Rappel pour les déclarations en douane à déposer' },
    { key: 'missions', label: 'Missions de transport', desc: 'Mise à jour du statut des missions' },
    { key: 'rapports', label: 'Rapports hebdomadaires', desc: 'Synthèse hebdomadaire par email' },
    { key: 'alertesSecurite', label: 'Alertes sécurité', desc: 'Tentatives de connexion suspectes' },
  ]

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[#111827] mb-6">Préférences de notifications</h3>
      <div className="space-y-1">
        {notifications.map((item, idx) => (
          <div key={item.key}>
            <div className="flex items-center justify-between py-3">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                <p className="text-xs text-[#6B7280]">{item.desc}</p>
              </div>
              <Switch
                checked={prefs[item.key]}
                onCheckedChange={(checked) =>
                  setPrefs((prev) => ({ ...prev, [item.key]: checked }))
                }
                className="data-[state=checked]:bg-teal-600"
              />
            </div>
            {idx < notifications.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// TAB 4: SÉCURITÉ
// ═════════════════════════════════════════════════════════════

function SecuriteTab() {
  const [saving, setSaving] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [autoLogout, setAutoLogout] = useState(true)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[#111827] mb-6">Sécurité du compte</h3>
      <div className="space-y-4 max-w-lg">
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Mot de passe actuel</Label>
          <Input type="password" placeholder="••••••••" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Nouveau mot de passe</Label>
          <Input type="password" placeholder="••••••••" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-[#6B7280] mb-1">Confirmer le mot de passe</Label>
          <Input type="password" placeholder="••••••••" className="mt-1" />
        </div>
      </div>
      <Separator className="my-6" />
      <div className="space-y-1 max-w-lg">
        <div className="flex items-center justify-between py-3">
          <div className="flex-1 min-w-0 mr-4">
            <p className="text-sm font-medium text-[#111827]">Authentification double facteur (2FA)</p>
            <p className="text-xs text-[#6B7280]">Renforcez la sécurité de votre compte</p>
          </div>
          <Switch
            checked={twoFA}
            onCheckedChange={setTwoFA}
            className="data-[state=checked]:bg-teal-600"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between py-3">
          <div className="flex-1 min-w-0 mr-4">
            <p className="text-sm font-medium text-[#111827]">Déconnexion automatique</p>
            <p className="text-xs text-[#6B7280]">Après 30 minutes d&apos;inactivité</p>
          </div>
          <Switch
            checked={autoLogout}
            onCheckedChange={setAutoLogout}
            className="data-[state=checked]:bg-teal-600"
          />
        </div>
      </div>
      <Button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-teal-600 hover:bg-teal-700 text-white"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
        Mettre à jour
      </Button>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// TAB 5: HISTORIQUE & TRAÇABILITÉ
// ═════════════════════════════════════════════════════════════

const ALL_ACTIONS: AuditAction[] = ['CONNEXION', 'CREATION', 'MODIFICATION', 'SUPPRESSION', 'PAIEMENT', 'DEPOT_FICHIER', 'DECONNEXION']
const ALL_ENTITIES = ['Auth', 'Dossier', 'Client', 'Facture', 'Paiement', 'Transport', 'Mission', 'Dépôt', 'GED', 'Document', 'Utilisateur', 'Paramètre']

function HistoriqueTab() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const limit = 20

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', String(limit))
      params.set('offset', String(offset))
      if (actionFilter !== 'all') params.set('action', actionFilter)
      if (entityFilter !== 'all') params.set('entity', entityFilter)

      const res = await fetch(`/api/audit-logs?${params.toString()}`)
      if (res.ok) {
        const data: AuditLogResponse = await res.json()
        let filtered = data.logs

        // Client-side search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (l) =>
              l.details?.toLowerCase().includes(q) ||
              l.user?.name.toLowerCase().includes(q)
          )
        }

        // Client-side date filter
        if (dateFrom) {
          filtered = filtered.filter((l) => new Date(l.createdAt) >= new Date(dateFrom))
        }
        if (dateTo) {
          const to = new Date(dateTo)
          to.setHours(23, 59, 59, 999)
          filtered = filtered.filter((l) => new Date(l.createdAt) <= to)
        }

        setLogs(filtered)
        setTotal(data.total)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [offset, actionFilter, entityFilter, searchQuery, dateFrom, dateTo])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl flex flex-col h-full">
      {/* Header & Filters */}
      <div className="p-4 border-b border-[#E5E7EB] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827]">Historique &amp; Traçabilité</h3>
          <Badge variant="secondary" className="text-xs">{total} entrées</Badge>
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                placeholder="Rechercher dans les détails..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setOffset(0) }}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>
          <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setOffset(0) }}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les actions</SelectItem>
              {ALL_ACTIONS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setOffset(0) }}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Entité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les entités</SelectItem>
              {ALL_ENTITIES.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setOffset(0) }}
            className="w-[140px] h-8 text-sm"
            placeholder="Du"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setOffset(0) }}
            className="w-[140px] h-8 text-sm"
            placeholder="Au"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B7280]">
            Aucune entrée trouvée
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs font-semibold text-[#374151]">Utilisateur</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Rôle</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Action</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Entité</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Détails</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Date &amp; Heure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const actionConfig = getActionBadgeConfig(log.action)
                const roleColor = log.user ? getRoleColor(log.user.role) : null
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <InitialsAvatar
                          initials={log.user?.initials || '??'}
                          name={log.user?.name || 'Système'}
                          size="sm"
                        />
                        <span className="text-sm font-medium text-[#111827] truncate max-w-[140px]">
                          {log.user?.name || 'Système'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.user && roleColor ? (
                        <Badge variant="outline" className={cn('text-xs', roleColor.bg, roleColor.text, roleColor.border)}>
                          {getRoleLabel(log.user.role)}
                        </Badge>
                      ) : (
                        <span className="text-xs text-[#6B7280]">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs gap-1', actionConfig.bg, actionConfig.text, `border-transparent`)}
                      >
                        {actionConfig.icon}
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#111827]">{log.entity}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#6B7280] truncate block max-w-[250px]">
                        {log.details || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[#6B7280] whitespace-nowrap">
                        {formatDateFr(log.createdAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-xs text-[#6B7280]">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={offset + limit >= total}
              onClick={() => setOffset(offset + limit)}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// TAB 6: GESTION UTILISATEURS
// ═════════════════════════════════════════════════════════════

function UtilisateursTab() {
  const [users, setUsers] = useState<UserEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserEntry | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserEntry | null>(null)
  const [expandedPerms, setExpandedPerms] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  // Form state
  const [formUsername, setFormUsername] = useState('')
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState('agent')
  const [formPermissions, setFormPermissions] = useState<string[]>([])
  const [formInitials, setFormInitials] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (roleFilter !== 'all') params.set('role', roleFilter)
      const res = await fetch(`/api/users?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Filter by search query (client-side)
  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    )
  })

  // Open dialog for new user
  const openNewUserDialog = () => {
    setEditingUser(null)
    setFormUsername('')
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormPassword('')
    setFormRole('agent')
    setFormPermissions(ROLE_PRESETS['agent'] || [])
    setFormInitials('')
    setDialogOpen(true)
  }

  // Open dialog for editing user
  const openEditUserDialog = (user: UserEntry) => {
    setEditingUser(user)
    setFormUsername(user.username)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormPhone(user.phone || '')
    setFormPassword('')
    setFormRole(user.role)
    setFormPermissions(user.permissions || [])
    setFormInitials(user.initials || '')
    setDialogOpen(true)
  }

  // Handle role change → auto-populate permissions
  const handleRoleChange = (role: string) => {
    setFormRole(role)
    setFormPermissions(ROLE_PRESETS[role] || [])
  }

  // Toggle a permission
  const togglePermission = (perm: string) => {
    setFormPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  // Save user (create or update)
  const handleSaveUser = async () => {
    setSaving(true)
    try {
      const computedInitials =
        formInitials ||
        formName
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()

      if (editingUser) {
        // Update
        const body: Record<string, unknown> = {
          id: editingUser.id,
          name: formName,
          email: formEmail,
          role: formRole,
          permissions: formPermissions,
          phone: formPhone || null,
          initials: computedInitials,
        }
        const res = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          setDialogOpen(false)
          fetchUsers()
        }
      } else {
        // Create
        if (!formPassword) {
          setSaving(false)
          return
        }
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formUsername,
            name: formName,
            email: formEmail,
            password: formPassword,
            role: formRole,
            permissions: formPermissions,
            phone: formPhone || null,
            initials: computedInitials,
          }),
        })
        if (res.ok) {
          setDialogOpen(false)
          fetchUsers()
        }
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  // Toggle user active status
  const toggleUserActive = async (user: UserEntry) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, active: !user.active }),
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch {
      // silently fail
    }
  }

  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return
    try {
      const res = await fetch(`/api/users?id=${userToDelete.id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        fetchUsers()
      }
    } catch {
      // silently fail
    }
  }

  // Open permissions dialog for a user
  const openPermissionsForUser = (user: UserEntry) => {
    setEditingUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormRole(user.role)
    setFormPermissions(user.permissions || [])
    setFormUsername(user.username)
    setFormPhone(user.phone || '')
    setFormInitials(user.initials || '')
    setFormPassword('')
    setDialogOpen(true)
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl flex flex-col h-full">
      {/* Top bar */}
      <div className="p-4 border-b border-[#E5E7EB] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827]">Gestion des utilisateurs</h3>
          <Button onClick={openNewUserDialog} className="bg-teal-600 hover:bg-teal-700 text-white h-8 text-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Nouvel utilisateur
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                placeholder="Rechercher par nom, email, identifiant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
              <SelectItem value="directeur">Directeur</SelectItem>
              <SelectItem value="declarant">Déclarant</SelectItem>
              <SelectItem value="agent">Agent de transit</SelectItem>
              <SelectItem value="magasinier">Magasinier</SelectItem>
              <SelectItem value="transport">Resp. Transport</SelectItem>
              <SelectItem value="comptable">Comptable</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="auditeur">Auditeur</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B7280]">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs font-semibold text-[#374151]">Utilisateur</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Email</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Rôle</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Permissions</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Dernière connexion</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151]">Statut</TableHead>
                <TableHead className="text-xs font-semibold text-[#374151] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const roleColor = getRoleColor(user.role)
                const permCount = user.permissions?.length || 0
                const isExpanded = expandedPerms.has(user.id)

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <InitialsAvatar
                          initials={user.initials || user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                          name={user.name}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111827] truncate">{user.name}</p>
                          <p className="text-xs text-[#6B7280]">{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#111827]">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs', roleColor.bg, roleColor.text, roleColor.border)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm text-[#111827]">{permCount}</span>
                        <button
                          onClick={() =>
                            setExpandedPerms((prev) => {
                              const next = new Set(prev)
                              if (next.has(user.id)) next.delete(user.id)
                              else next.add(user.id)
                              return next
                            })
                          }
                          className="text-xs text-teal-600 font-medium ml-1.5 hover:underline"
                        >
                          {isExpanded ? 'Masquer' : 'Voir'}
                        </button>
                        {isExpanded && (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md text-xs text-[#6B7280] max-w-[250px]">
                            {user.permissions.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.permissions.map((p) => (
                                  <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span>Aucune permission</span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[#6B7280] whitespace-nowrap">
                        {formatDateFrShort(user.lastLoginAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          user.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        )}
                      >
                        {user.active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserActive(user)}>
                            {user.active ? (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPermissionsForUser(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Gérer permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setUserToDelete(user)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* User count */}
      <div className="p-3 border-t border-[#E5E7EB]">
        <span className="text-xs text-[#6B7280]">{filteredUsers.length} utilisateur(s) affiché(s)</span>
      </div>

      {/* ── Add/Edit User Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Modifiez les informations et permissions de l\'utilisateur.'
                : 'Remplissez les informations pour créer un nouvel utilisateur.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-[#6B7280]">Identifiant</Label>
                <Input
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  disabled={!!editingUser}
                  placeholder="ex: agent002"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-[#6B7280]">Nom complet</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ex: Amadou Diallo"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-[#6B7280]">Email</Label>
                <Input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="ex: a.diallo@transitpro.ml"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-[#6B7280]">Téléphone</Label>
                <Input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="ex: +223 70 00 00 00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-[#6B7280]">Rôle</Label>
                <Select value={formRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="directeur">Directeur</SelectItem>
                    <SelectItem value="declarant">Déclarant</SelectItem>
                    <SelectItem value="agent">Agent de transit</SelectItem>
                    <SelectItem value="magasinier">Magasinier</SelectItem>
                    <SelectItem value="transport">Resp. Transport</SelectItem>
                    <SelectItem value="comptable">Comptable</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="auditeur">Auditeur</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div>
                  <Label className="text-xs font-medium text-[#6B7280]">Mot de passe</Label>
                  <Input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Permissions section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold text-[#111827]">Permissions</Label>
                <span className="text-xs text-[#6B7280]">
                  {formPermissions.length} permission(s) sélectionnée(s)
                </span>
              </div>
              <ScrollArea className="max-h-[320px]">
                <div className="space-y-3 pr-2">
                  {PERMISSION_MODULES.map((mod) => (
                    <div key={mod.key} className="border border-[#E5E7EB] rounded-lg p-3">
                      <p className="text-sm font-medium text-[#111827] mb-2">{mod.label}</p>
                      <div className="flex flex-wrap gap-3">
                        {mod.perms.map((perm) => {
                          const permKey = `${mod.key}:${perm}`
                          const checked = formPermissions.includes(permKey)
                          return (
                            <label
                              key={permKey}
                              className="flex items-center gap-1.5 cursor-pointer"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => togglePermission(permKey)}
                                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                              />
                              <span className="text-xs text-[#374151]">{PERM_LABELS[perm]}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-9">
              Annuler
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={saving || (!editingUser && !formPassword)}
              className="bg-teal-600 hover:bg-teal-700 text-white h-9"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              {editingUser ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{' '}
              <span className="font-semibold">{userToDelete?.name}</span> ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
