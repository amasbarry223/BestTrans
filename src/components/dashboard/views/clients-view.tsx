'use client'

import React, { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wallet,
  FileText,
  ArrowLeft,
  Phone,
  ShieldCheck,
  MapPin,
  CreditCard,
  Calendar,
  TrendingUp,
  QrCode,
  Smartphone,
  Printer,
  Users,
  UserCheck,
  UserX,
  ChevronRight,
  Star,
  Eye,
  Mail,
  Download,
  BarChart3,
  Activity,
  ArrowRight,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { exportCsv, printDocument } from '@/lib/export-utils'
import { buildClientSheetPrintHtml, buildClientsListPrintHtml } from '@/lib/print-templates'
import { loadExtraClients, saveExtraClients } from '@/lib/agent-store'
import { useAuthUser } from '@/hooks/use-auth-user'
import { QrCodeDialog } from '@/components/dashboard/qr-code-dialog'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type KYCLevel = 1 | 2 | 3
type FilterTab = 'all' | 'verified' | 'pending' | 'premium'
type DetailTab = 'overview' | 'operations' | 'documents' | 'activity'

interface Client {
  id: number
  name: string
  phone: string
  kycLevel: KYCLevel
  balance: string
  balanceNum: number
  initials: string
  email: string
  address: string
  dateOfBirth: string
  joinedDate: string
  totalDeposits: string
  totalWithdrawals: string
  totalTransfers: string
  totalOps: number
}

const kycBadge: Record<KYCLevel, { label: string; shortLabel: string; style: string; dotColor: string; description: string }> = {
  1: { label: 'Niveau 1 – Non vérifié', shortLabel: 'Non vérifié', style: 'bg-gray-100 text-gray-600', dotColor: 'bg-gray-400', description: 'Limites réduites – Vérification requise' },
  2: { label: 'Niveau 2 – Vérifié', shortLabel: 'Vérifié', style: 'bg-emerald-50 text-emerald-700', dotColor: 'bg-emerald-500', description: 'Limites standard – Identité vérifiée' },
  3: { label: 'Niveau 3 – Premium', shortLabel: 'Premium', style: 'bg-violet-50 text-violet-700', dotColor: 'bg-violet-500', description: 'Limites étendues – Client premium' },
}

const baseClients: Client[] = [
  { id: 1, name: 'Koffi Dossou',    phone: '+223 70 12 34 56', kycLevel: 2, balance: '125 000 FCFA',  balanceNum: 125000, initials: 'KD', email: 'koffi.dossou@email.com',  address: 'Bamako, Badalabougou',  dateOfBirth: '15 Mars 1990',  joinedDate: '12 Jan 2024', totalDeposits: '850 000 FCFA',  totalWithdrawals: '625 000 FCFA', totalTransfers: '200 000 FCFA', totalOps: 23 },
  { id: 2, name: 'Fatou Alazar',    phone: '+223 96 55 44 33', kycLevel: 2, balance: '78 500 FCFA',   balanceNum: 78500,  initials: 'FA', email: 'fatou.alazar@email.com',  address: 'Sikasso, Centre', dateOfBirth: '22 Juil 1985',  joinedDate: '05 Mar 2024', totalDeposits: '420 000 FCFA',  totalWithdrawals: '341 500 FCFA', totalTransfers: '150 000 FCFA', totalOps: 15 },
  { id: 3, name: 'Ibrahim Saka',    phone: '+223 95 88 77 66', kycLevel: 1, balance: '12 000 FCFA',   balanceNum: 12000,  initials: 'IS', email: 'ibrahim.saka@email.com',  address: 'Kayes, Médina',    dateOfBirth: '08 Nov 1995',  joinedDate: '20 Jun 2024', totalDeposits: '95 000 FCFA',   totalWithdrawals: '83 000 FCFA',  totalTransfers: '0 FCFA', totalOps: 5 },
  { id: 4, name: 'Aminata Diallo',  phone: '+223 97 33 22 11', kycLevel: 3, balance: '350 000 FCFA',  balanceNum: 350000, initials: 'AD', email: 'aminata.diallo@email.com',address: 'Bamako, Hamdallaye',    dateOfBirth: '30 Sep 1988',  joinedDate: '01 Oct 2023', totalDeposits: '2 500 000 FCFA',totalWithdrawals: '2 000 000 FCFA',totalTransfers: '850 000 FCFA', totalOps: 48 },
  { id: 5, name: 'Moussa Bello',    phone: '+223 96 11 22 33', kycLevel: 1, balance: '5 000 FCFA',    balanceNum: 5000,   initials: 'MB', email: 'moussa.bello@email.com',  address: 'Kati, Bamako-Coura', dateOfBirth: '14 Fév 1992', joinedDate: '15 Aug 2024', totalDeposits: '25 000 FCFA',  totalWithdrawals: '20 000 FCFA',  totalTransfers: '0 FCFA', totalOps: 3 },
  { id: 6, name: 'Adèle Kpéka',    phone: '+223 95 44 55 66', kycLevel: 2, balance: '89 200 FCFA',   balanceNum: 89200,  initials: 'AK', email: 'adele.kpeka@email.com',   address: 'Bamako, Korofina', dateOfBirth: '27 Déc 1983',  joinedDate: '18 Feb 2024', totalDeposits: '520 000 FCFA',  totalWithdrawals: '430 800 FCFA', totalTransfers: '180 000 FCFA', totalOps: 19 },
]

interface DocStatus {
  label: string
  status: 'verified' | 'pending' | 'rejected'
}

const docStatusStyle: Record<string, { icon: React.ElementType; style: string; text: string }> = {
  verified: { icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700', text: 'Vérifié' },
  pending:  { icon: AlertCircle,  style: 'bg-amber-50 text-amber-700',    text: 'En attente' },
  rejected: { icon: XCircle,      style: 'bg-rose-50 text-rose-700',      text: 'Rejeté' },
}

const clientDocuments: Record<number, DocStatus[]> = {
  1: [
    { label: 'Carte nationale', status: 'verified' },
    { label: 'Justificatif de domicile', status: 'verified' },
    { label: 'Selfie vérification', status: 'verified' },
  ],
  2: [
    { label: 'Carte nationale', status: 'verified' },
    { label: 'Justificatif de domicile', status: 'pending' },
    { label: 'Selfie vérification', status: 'verified' },
  ],
  3: [
    { label: 'Carte nationale', status: 'pending' },
    { label: 'Justificatif de domicile', status: 'rejected' },
    { label: 'Selfie vérification', status: 'pending' },
  ],
  4: [
    { label: 'Passeport', status: 'verified' },
    { label: 'Justificatif de domicile', status: 'verified' },
    { label: 'Selfie vérification', status: 'verified' },
  ],
  5: [
    { label: 'Carte nationale', status: 'pending' },
    { label: 'Justificatif de domicile', status: 'pending' },
    { label: 'Selfie vérification', status: 'pending' },
  ],
  6: [
    { label: 'Permis de conduire', status: 'verified' },
    { label: 'Justificatif de domicile', status: 'verified' },
    { label: 'Selfie vérification', status: 'pending' },
  ],
}

interface RecentOp {
  type: 'Dépôt' | 'Retrait' | 'Transfert' | 'Airtime'
  amount: string
  date: string
  status: 'Succès' | 'Échoué' | 'En cours'
  reference: string
}

const clientRecentOps: Record<number, RecentOp[]> = {
  1: [
    { type: 'Dépôt',     amount: '50 000 FCFA',  date: '28 Fév 2025, 14:30', status: 'Succès',   reference: 'RIC-DEP-001234' },
    { type: 'Transfert',  amount: '25 000 FCFA',  date: '27 Fév 2025, 10:15', status: 'Succès',   reference: 'RIC-TRF-005678' },
    { type: 'Retrait',    amount: '10 000 FCFA',  date: '25 Fév 2025, 16:45', status: 'Succès',   reference: 'RIC-RET-009012' },
    { type: 'Airtime',    amount: '2 500 FCFA',   date: '24 Fév 2025, 09:20', status: 'Succès',   reference: 'RIC-AIR-003456' },
    { type: 'Dépôt',     amount: '30 000 FCFA',  date: '22 Fév 2025, 11:00', status: 'Succès',   reference: 'RIC-DEP-001235' },
  ],
  2: [
    { type: 'Dépôt',     amount: '30 000 FCFA',  date: '01 Mar 2025, 08:30', status: 'Succès',   reference: 'RIC-DEP-001236' },
    { type: 'Retrait',    amount: '15 000 FCFA',  date: '28 Fév 2025, 14:00', status: 'Succès',   reference: 'RIC-RET-009013' },
    { type: 'Transfert',  amount: '20 000 FCFA',  date: '26 Fév 2025, 09:45', status: 'Échoué',   reference: 'RIC-TRF-005679' },
    { type: 'Dépôt',     amount: '10 000 FCFA',  date: '24 Fév 2025, 16:20', status: 'Succès',   reference: 'RIC-DEP-001237' },
  ],
  3: [
    { type: 'Dépôt',     amount: '5 000 FCFA',   date: '02 Mar 2025, 10:00', status: 'Succès',   reference: 'RIC-DEP-001238' },
    { type: 'Dépôt',     amount: '7 000 FCFA',   date: '25 Fév 2025, 15:30', status: 'Succès',   reference: 'RIC-DEP-001239' },
    { type: 'Retrait',    amount: '3 000 FCFA',   date: '20 Fév 2025, 11:15', status: 'Échoué',   reference: 'RIC-RET-009014' },
  ],
  4: [
    { type: 'Dépôt',     amount: '100 000 FCFA', date: '01 Mar 2025, 09:00', status: 'Succès',   reference: 'RIC-DEP-001240' },
    { type: 'Transfert',  amount: '75 000 FCFA',  date: '28 Fév 2025, 13:45', status: 'Succès',   reference: 'RIC-TRF-005680' },
    { type: 'Dépôt',     amount: '50 000 FCFA',  date: '24 Fév 2025, 10:30', status: 'Succès',   reference: 'RIC-DEP-001241' },
    { type: 'Retrait',    amount: '25 000 FCFA',  date: '22 Fév 2025, 16:00', status: 'En cours', reference: 'RIC-RET-009015' },
    { type: 'Airtime',    amount: '5 000 FCFA',   date: '20 Fév 2025, 08:15', status: 'Succès',   reference: 'RIC-AIR-003457' },
  ],
  5: [
    { type: 'Dépôt',     amount: '5 000 FCFA',   date: '02 Mar 2025, 14:00', status: 'Succès',   reference: 'RIC-DEP-001242' },
    { type: 'Retrait',    amount: '2 000 FCFA',   date: '28 Fév 2025, 09:30', status: 'Échoué',   reference: 'RIC-RET-009016' },
    { type: 'Dépôt',     amount: '3 000 FCFA',   date: '22 Fév 2025, 11:45', status: 'Succès',   reference: 'RIC-DEP-001243' },
  ],
  6: [
    { type: 'Transfert',  amount: '40 000 FCFA',  date: '02 Mar 2025, 10:20', status: 'Succès',   reference: 'RIC-TRF-005681' },
    { type: 'Dépôt',     amount: '25 000 FCFA',  date: '28 Fév 2025, 15:00', status: 'Succès',   reference: 'RIC-DEP-001244' },
    { type: 'Retrait',    amount: '15 000 FCFA',  date: '25 Fév 2025, 12:30', status: 'Succès',   reference: 'RIC-RET-009017' },
    { type: 'Dépôt',     amount: '20 000 FCFA',  date: '22 Fév 2025, 09:00', status: 'Succès',   reference: 'RIC-DEP-001245' },
  ],
}

const opTypeIcon: Record<string, React.ElementType> = {
  'Dépôt': ArrowDownToLine,
  'Retrait': ArrowUpFromLine,
  'Transfert': Send,
  'Airtime': Smartphone,
}

const opTypeAccent: Record<string, { bg: string; text: string }> = {
  'Dépôt':    { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'Retrait':  { bg: 'bg-sky-100',     text: 'text-sky-600' },
  'Transfert':{ bg: 'bg-amber-100',   text: 'text-amber-600' },
  'Airtime':  { bg: 'bg-rose-100',    text: 'text-rose-600' },
}

const opStatusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  'Succès':   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Échoué':   { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500' },
  'En cours': { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
}

const avatarColors = [
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
]

/* Activity timeline data */
interface ActivityItem {
  id: string
  type: 'creation' | 'deposit' | 'withdrawal' | 'transfer' | 'kyc_upgrade' | 'document'
  description: string
  date: string
  meta?: string
}

const clientActivity: Record<number, ActivityItem[]> = {
  1: [
    { id: '1-1', type: 'deposit', description: 'Dépôt de 50 000 FCFA', date: '28 Fév 2025', meta: 'RIC-DEP-001234' },
    { id: '1-2', type: 'transfer', description: 'Transfert de 25 000 FCFA', date: '27 Fév 2025', meta: 'RIC-TRF-005678' },
    { id: '1-3', type: 'withdrawal', description: 'Retrait de 10 000 FCFA', date: '25 Fév 2025', meta: 'RIC-RET-009012' },
    { id: '1-4', type: 'deposit', description: 'Dépôt de 30 000 FCFA', date: '22 Fév 2025', meta: 'RIC-DEP-001235' },
    { id: '1-5', type: 'kyc_upgrade', description: 'Passage au Niveau 2', date: '15 Jan 2024' },
    { id: '1-6', type: 'document', description: 'Document vérifié – Carte nationale', date: '13 Jan 2024' },
    { id: '1-7', type: 'creation', description: 'Compte créé', date: '12 Jan 2024' },
  ],
  2: [
    { id: '2-1', type: 'deposit', description: 'Dépôt de 30 000 FCFA', date: '01 Mar 2025', meta: 'RIC-DEP-001236' },
    { id: '2-2', type: 'withdrawal', description: 'Retrait de 15 000 FCFA', date: '28 Fév 2025', meta: 'RIC-RET-009013' },
    { id: '2-3', type: 'transfer', description: 'Transfert échoué de 20 000 FCFA', date: '26 Fév 2025', meta: 'RIC-TRF-005679' },
    { id: '2-4', type: 'document', description: 'Justificatif en attente', date: '06 Mar 2024' },
    { id: '2-5', type: 'creation', description: 'Compte créé', date: '05 Mar 2024' },
  ],
  3: [
    { id: '3-1', type: 'deposit', description: 'Dépôt de 5 000 FCFA', date: '02 Mar 2025', meta: 'RIC-DEP-001238' },
    { id: '3-2', type: 'deposit', description: 'Dépôt de 7 000 FCFA', date: '25 Fév 2025', meta: 'RIC-DEP-001239' },
    { id: '3-3', type: 'creation', description: 'Compte créé', date: '20 Jun 2024' },
  ],
  4: [
    { id: '4-1', type: 'deposit', description: 'Dépôt de 100 000 FCFA', date: '01 Mar 2025', meta: 'RIC-DEP-001240' },
    { id: '4-2', type: 'transfer', description: 'Transfert de 75 000 FCFA', date: '28 Fév 2025', meta: 'RIC-TRF-005680' },
    { id: '4-3', type: 'kyc_upgrade', description: 'Passage au Niveau 3 – Premium', date: '15 Nov 2024' },
    { id: '4-4', type: 'document', description: 'Tous les documents vérifiés', date: '02 Oct 2023' },
    { id: '4-5', type: 'creation', description: 'Compte créé', date: '01 Oct 2023' },
  ],
  5: [
    { id: '5-1', type: 'deposit', description: 'Dépôt de 5 000 FCFA', date: '02 Mar 2025', meta: 'RIC-DEP-001242' },
    { id: '5-2', type: 'creation', description: 'Compte créé', date: '15 Aug 2024' },
  ],
  6: [
    { id: '6-1', type: 'transfer', description: 'Transfert de 40 000 FCFA', date: '02 Mar 2025', meta: 'RIC-TRF-005681' },
    { id: '6-2', type: 'deposit', description: 'Dépôt de 25 000 FCFA', date: '28 Fév 2025', meta: 'RIC-DEP-001244' },
    { id: '6-3', type: 'document', description: 'Selfie en attente de vérification', date: '20 Feb 2024' },
    { id: '6-4', type: 'creation', description: 'Compte créé', date: '18 Feb 2024' },
  ],
}

const activityConfig: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
  creation:  { icon: Users,          bg: 'bg-gray-100',    text: 'text-gray-600' },
  deposit:   { icon: ArrowDownToLine, bg: 'bg-emerald-100', text: 'text-emerald-600' },
  withdrawal:{ icon: ArrowUpFromLine, bg: 'bg-sky-100',     text: 'text-sky-600' },
  transfer:  { icon: Send,           bg: 'bg-amber-100',   text: 'text-amber-600' },
  kyc_upgrade:{ icon: Star,          bg: 'bg-violet-100',  text: 'text-violet-600' },
  document:  { icon: FileText,       bg: 'bg-rose-100',    text: 'text-rose-600' },
}

/* ------------------------------------------------------------------ */
/*  Filter Tabs                                                        */
/* ------------------------------------------------------------------ */

const filterTabs: { key: FilterTab; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Tous', icon: Users },
  { key: 'verified', label: 'Vérifiés', icon: UserCheck },
  { key: 'pending', label: 'Non vérifiés', icon: UserX },
  { key: 'premium', label: 'Premium', icon: Star },
]

const kycFilterLabels: Record<FilterTab, string> = {
  all: 'Tous',
  verified: 'Vérifiés',
  pending: 'Non vérifiés',
  premium: 'Premium',
}

const detailTabs: { key: DetailTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
  { key: 'operations', label: 'Opérations', icon: Activity },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'activity', label: 'Activité', icon: Clock },
]

/* ------------------------------------------------------------------ */
/*  Client Detail Page                                                 */
/* ------------------------------------------------------------------ */

function clientToOperation(client: Client) {
  const badge = kycBadge[client.kycLevel]
  return {
    initials: client.initials,
    name: client.name,
    phone: client.phone,
    kycLevel: badge.label,
    kycVerified: client.kycLevel >= 2,
    balance: client.balance,
  }
}

function ClientDetailPage({ client, onBack }: { client: Client; onBack: () => void }) {
  const { navigateToOperation } = useDashboard()
  const user = useAuthUser()
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [qrOpen, setQrOpen] = useState(false)
  const docs = clientDocuments[client.id] ?? []
  const ops = clientRecentOps[client.id] ?? []
  const activities = clientActivity[client.id] ?? []
  const badge = kycBadge[client.kycLevel]
  const avatarStyle = avatarColors[client.id - 1]
  const verifiedCount = docs.filter(d => d.status === 'verified').length
  const totalDocs = docs.length

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Top bar with back */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const html = buildClientSheetPrintHtml({
                reference: `RIC-CLI-${String(client.id).padStart(4, '0')}`,
                name: client.name,
                initials: client.initials,
                phone: client.phone,
                email: client.email,
                address: client.address,
                dateOfBirth: client.dateOfBirth,
                joinedDate: client.joinedDate,
                balance: client.balance,
                kycLabel: badge.label,
                kycShortLabel: badge.shortLabel,
                totalDeposits: client.totalDeposits,
                totalWithdrawals: client.totalWithdrawals,
                totalTransfers: client.totalTransfers,
                totalOps: client.totalOps,
                docs: docs.map((doc) => ({
                  label: doc.label,
                  status: doc.status,
                  statusLabel: docStatusStyle[doc.status].text,
                })),
                ops: ops.map((op) => ({
                  type: op.type,
                  amount: op.amount,
                  date: op.date,
                  status: op.status,
                  reference: op.reference,
                })),
                activities: activities.map((item) => ({
                  description: item.description,
                  date: item.date,
                  meta: item.meta,
                })),
                agentName: user?.name,
                agentLocation: user?.location,
              })
              const ok = printDocument(html, `Fiche client — ${client.name}`)
              if (!ok) toast.error('Impossible d\'ouvrir l\'impression')
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimer
          </button>
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Code
          </button>
        </div>
      </div>

      <QrCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        mode="display"
        title="QR Code client"
        description="Présentez ce code au guichet pour identification rapide."
        code={`RIC-CLI-${client.id}`}
      />

      {/* Profile header card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0', avatarStyle)}>
            {client.initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-xl font-bold text-[#111827]">{client.name}</h1>
              <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit', badge.style)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', badge.dotColor)} />
                {badge.label}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {client.phone}
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {client.email}
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateToOperation('depot', clientToOperation(client))}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm transition-colors"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Dépôt
            </button>
            <button
              type="button"
              onClick={() => navigateToOperation('retrait', clientToOperation(client))}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-700 shadow-sm transition-colors"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Retrait
            </button>
            <button
              type="button"
              onClick={() => navigateToOperation('transfert', clientToOperation(client))}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-amber-600 text-white rounded-xl hover:bg-amber-700 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              Transfert
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-1.5">
        <div className="flex items-center gap-1">
          {detailTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'overview' && (
          <OverviewTab client={client} docs={docs} ops={ops} verifiedCount={verifiedCount} totalDocs={totalDocs} />
        )}
        {activeTab === 'operations' && (
          <OperationsTab ops={ops} clientName={client.name} />
        )}
        {activeTab === 'documents' && (
          <DocumentsTab docs={docs} verifiedCount={verifiedCount} totalDocs={totalDocs} />
        )}
        {activeTab === 'activity' && (
          <ActivityTab activities={activities} />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Overview Tab                                                       */
/* ------------------------------------------------------------------ */

function OverviewTab({ client, docs, ops, verifiedCount, totalDocs }: {
  client: Client
  docs: DocStatus[]
  ops: RecentOp[]
  verifiedCount: number
  totalDocs: number
}) {
  const successOps = ops.filter(o => o.status === 'Succès').length
  const failedOps = ops.filter(o => o.status === 'Échoué').length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left column: Personal info */}
      <div className="lg:col-span-1 space-y-5">
        {/* Contact info card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#111827]">Informations personnelles</h3>
          <div className="space-y-3.5">
            <InfoRow icon={Phone} label="Téléphone" value={client.phone} />
            <InfoRow icon={Mail} label="Email" value={client.email} />
            <InfoRow icon={Wallet} label="Solde Wallet" value={client.balance} valueClass="text-emerald-600 font-bold" />
            <InfoRow icon={MapPin} label="Adresse" value={client.address} />
            <InfoRow icon={Calendar} label="Date de naissance" value={client.dateOfBirth} />
            <InfoRow icon={Clock} label="Client depuis" value={client.joinedDate} />
          </div>
        </div>

        {/* KYC Summary */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6B7280]" />
              <h3 className="text-sm font-semibold text-[#111827]">Statut KYC</h3>
            </div>
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              verifiedCount === totalDocs ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            )}>
              {verifiedCount}/{totalDocs} vérifiés
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                verifiedCount === totalDocs ? 'bg-emerald-500' : 'bg-amber-500'
              )}
              style={{ width: `${(verifiedCount / totalDocs) * 100}%` }}
            />
          </div>
          <div className="space-y-2">
            {docs.map((doc) => {
              const ds = docStatusStyle[doc.status]
              const DocIcon = ds.icon
              return (
                <div
                  key={doc.label}
                  className="flex items-center justify-between py-2 px-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-sm text-[#6B7280]">{doc.label}</span>
                  </div>
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', ds.style)}>
                    <DocIcon className="w-3 h-3" />
                    {ds.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right column: Stats + Mini transactions */}
      <div className="lg:col-span-2 space-y-5">
        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={ArrowDownToLine} iconBg="bg-emerald-100" iconColor="text-emerald-600" label="Total Dépôts" value={client.totalDeposits} />
          <StatCard icon={ArrowUpFromLine} iconBg="bg-sky-100" iconColor="text-sky-600" label="Total Retraits" value={client.totalWithdrawals} />
          <StatCard icon={Send} iconBg="bg-amber-100" iconColor="text-amber-600" label="Total Transferts" value={client.totalTransfers} />
          <StatCard icon={Activity} iconBg="bg-violet-100" iconColor="text-violet-600" label="Nb. Opérations" value={String(client.totalOps)} />
        </div>

        {/* Operation success rate */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#111827]">{successOps}</p>
              <p className="text-xs text-[#9CA3AF]">Opérations réussies</p>
            </div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#111827]">{failedOps}</p>
              <p className="text-xs text-[#9CA3AF]">Opérations échouées</p>
            </div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {ops.length > 0 ? Math.round((successOps / ops.length) * 100) : 0}%
              </p>
              <p className="text-xs text-[#9CA3AF]">Taux de succès</p>
            </div>
          </div>
        </div>

        {/* Recent ops mini-table */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#111827]">Opérations récentes</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">
              {ops.length} dernières
            </span>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {ops.slice(0, 4).map((op, i) => {
              const OpIcon = opTypeIcon[op.type]
              const accent = opTypeAccent[op.type]
              const status = opStatusStyle[op.status]
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F9FAFB] transition-colors">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', accent.bg)}>
                    <OpIcon className={cn('w-4 h-4', accent.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827]">{op.type}</p>
                    <p className="text-xs text-[#9CA3AF] font-mono">{op.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm font-semibold whitespace-nowrap', op.type === 'Dépôt' ? 'text-emerald-600' : 'text-[#111827]')}>
                      {op.type === 'Dépôt' ? '+' : '-'}{op.amount}
                    </p>
                    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold', status.bg, status.text)}>
                      <span className={cn('w-1 h-1 rounded-full', status.dot)} />
                      {op.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Operations Tab                                                     */
/* ------------------------------------------------------------------ */

function OperationsTab({ ops, clientName }: { ops: RecentOp[]; clientName: string }) {
  function handleExportOps() {
    exportCsv(
      ops.map((op) => ({
        Client: clientName,
        Type: op.type,
        Référence: op.reference,
        Montant: op.amount,
        Date: op.date,
        Statut: op.status,
      })),
      `operations-${clientName.replace(/\s+/g, '-')}.csv`
    )
    toast.success('Export CSV téléchargé')
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Historique des opérations</h3>
        </div>
        <button
          type="button"
          onClick={handleExportOps}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Exporter
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#F9FAFB]">
            <tr className="border-b border-[#E5E7EB]">
              <th className="py-3 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
              <th className="py-3 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Référence</th>
              <th className="py-3 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Montant</th>
              <th className="py-3 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
              <th className="py-3 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody>
            {ops.map((op, i) => {
              const OpIcon = opTypeIcon[op.type]
              const accent = opTypeAccent[op.type]
              const status = opStatusStyle[op.status]
              return (
                <tr key={i} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', accent.bg)}>
                        <OpIcon className={cn('w-4 h-4', accent.text)} />
                      </div>
                      <span className="font-medium text-[#111827]">{op.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[#6B7280] group-hover:text-[#111827] transition-colors">{op.reference}</td>
                  <td className={cn(
                    'py-3 px-3 text-right font-semibold whitespace-nowrap',
                    op.type === 'Dépôt' ? 'text-emerald-600' : 'text-[#111827]'
                  )}>
                    {op.type === 'Dépôt' ? '+' : '-'}{op.amount}
                  </td>
                  <td className="py-3 px-3 text-right text-[#9CA3AF]">{op.date}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', status.bg, status.text)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                      {op.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden divide-y divide-[#F3F4F6]">
        {ops.map((op, i) => {
          const OpIcon = opTypeIcon[op.type]
          const accent = opTypeAccent[op.type]
          const status = opStatusStyle[op.status]
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', accent.bg)}>
                <OpIcon className={cn('w-4.5 h-4.5', accent.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#111827]">{op.type}</p>
                  <span className={cn('text-sm font-bold whitespace-nowrap ml-2', op.type === 'Dépôt' ? 'text-emerald-600' : 'text-[#111827]')}>
                    {op.type === 'Dépôt' ? '+' : '-'}{op.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[#9CA3AF]">{op.date}</p>
                  <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ml-2', status.bg, status.text)}>
                    <span className={cn('w-1 h-1 rounded-full', status.dot)} />
                    {op.status}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Documents Tab                                                      */
/* ------------------------------------------------------------------ */

function DocumentsTab({ docs, verifiedCount, totalDocs }: { docs: DocStatus[]; verifiedCount: number; totalDocs: number }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Documents KYC</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', verifiedCount === totalDocs ? 'bg-emerald-500' : 'bg-amber-500')}
                style={{ width: `${(verifiedCount / totalDocs) * 100}%` }}
              />
            </div>
            <span className={cn('text-xs font-semibold', verifiedCount === totalDocs ? 'text-emerald-600' : 'text-amber-600')}>
              {verifiedCount}/{totalDocs}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {docs.map((doc) => {
          const ds = docStatusStyle[doc.status]
          const DocIcon = ds.icon
          return (
            <div
              key={doc.label}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border transition-colors',
                doc.status === 'verified' ? 'bg-emerald-50/50 border-emerald-200' :
                doc.status === 'rejected' ? 'bg-rose-50/50 border-rose-200' :
                'bg-amber-50/50 border-amber-200'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', ds.style)}>
                  <DocIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{doc.label}</p>
                  <p className="text-xs text-[#9CA3AF]">{ds.text}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {doc.status === 'pending' && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Vérifier
                  </button>
                )}
                {doc.status === 'rejected' && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Re-soumettre
                  </button>
                )}
                {doc.status === 'verified' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Activity Tab                                                       */
/* ------------------------------------------------------------------ */

function ActivityTab({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
        <Clock className="w-4 h-4 text-emerald-600" />
        <h3 className="text-sm font-semibold text-[#111827]">Historique d&apos;activité</h3>
      </div>

      <div className="p-5">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#E5E7EB]" />

          <div className="space-y-5">
            {activities.map((item, i) => {
              const config = activityConfig[item.type]
              const Icon = config.icon
              const isLast = i === activities.length - 1
              return (
                <div key={item.id} className="relative flex items-start gap-4">
                  {/* Icon node */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 relative',
                    config.bg
                  )}>
                    <Icon className={cn('w-4 h-4', config.text)} />
                  </div>

                  {/* Content */}
                  <div className={cn('flex-1 pb-1', !isLast && 'pb-5')}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{item.description}</p>
                        {item.meta && (
                          <p className="text-xs text-[#9CA3AF] font-mono mt-0.5">{item.meta}</p>
                        )}
                      </div>
                      <span className="text-xs text-[#9CA3AF] whitespace-nowrap shrink-0">{item.date}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Reusable Components                                                */
/* ------------------------------------------------------------------ */

function InfoRow({ icon: Icon, label, value, valueClass }: {
  icon: React.ElementType
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#6B7280]" />
      </div>
      <div>
        <p className="text-xs text-[#9CA3AF]">{label}</p>
        <p className={cn('text-sm font-medium text-[#111827]', valueClass)}>{value}</p>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value }: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
  value: string
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
        <Icon className={cn('w-4 h-4', iconColor)} />
      </div>
      <div>
        <p className="text-xs text-[#9CA3AF]">{label}</p>
        <p className="text-sm font-bold text-[#111827]">{value}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Client List Page                                                   */
/* ------------------------------------------------------------------ */

const filterTabLabels: Record<FilterTab, string> = {
  all: 'Tous',
  verified: 'Vérifiés',
  pending: 'En attente',
  premium: 'Premium',
}

function ClientListPage({
  clients,
  onSelectClient,
  onCreateClient,
}: {
  clients: Client[]
  onSelectClient: (c: Client) => void
  onCreateClient: (client: Client) => void
}) {
  const user = useAuthUser()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newAddress, setNewAddress] = useState('')

  const filteredClients = clients.filter((c) => {
    // Filter by tab
    if (activeFilter === 'verified' && c.kycLevel !== 2) return false
    if (activeFilter === 'pending' && c.kycLevel !== 1) return false
    if (activeFilter === 'premium' && c.kycLevel !== 3) return false
    // Filter by search
    if (search) {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.phone.includes(search) || c.email.toLowerCase().includes(q)
    }
    return true
  })

  // Stats
  const totalClients = clients.length
  const verifiedClients = clients.filter(c => c.kycLevel === 2).length
  const pendingClients = clients.filter(c => c.kycLevel === 1).length
  const premiumClients = clients.filter(c => c.kycLevel === 3).length
  const totalBalance = clients.reduce((sum, c) => sum + c.balanceNum, 0)
  const hasActiveKycFilter = activeFilter !== 'all'
  const advancedFiltersVisible = showAdvancedFilters || hasActiveKycFilter

  function handleExportList() {
    const ok = printDocument(
      buildClientsListPrintHtml({
        rows: filteredClients.map((c) => ({
          name: c.name,
          phone: c.phone,
          email: c.email,
          kyc: kycBadge[c.kycLevel].shortLabel,
          balance: c.balance,
        })),
        stats: {
          total: totalClients,
          verified: verifiedClients,
          pending: pendingClients,
          premium: premiumClients,
          totalBalance,
        },
        filter: filterTabLabels[activeFilter],
        search,
        agentName: user?.name,
        agentLocation: user?.location,
      }),
      'Liste clients Ricash'
    )
    if (ok) {
      toast.success('Liste clients exportée')
    } else {
      toast.error('Impossible d\'ouvrir la fenêtre d\'impression')
    }
  }

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Gestion des Clients</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Créer, rechercher et gérer les clients</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportList}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            type="button"
            onClick={() => setShowNewDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Nouveau Client</span>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Total Clients</p>
            <p className="text-lg font-bold text-[#111827]">{totalClients}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Vérifiés</p>
            <p className="text-lg font-bold text-[#111827]">{verifiedClients}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <UserX className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Non vérifiés</p>
            <p className="text-lg font-bold text-[#111827]">{pendingClients}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <Star className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Premium</p>
            <p className="text-lg font-bold text-[#111827]">{premiumClients}</p>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Solde total clients</p>
            <p className="text-lg font-bold text-emerald-600">{(totalBalance / 1000).toFixed(0)}K <span className="text-xs text-[#9CA3AF] font-normal">FCFA</span></p>
          </div>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            type="button"
            onClick={() => setShowAdvancedFilters((open) => !open)}
            aria-expanded={advancedFiltersVisible}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-xl transition-colors shrink-0',
              advancedFiltersVisible
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                : 'text-[#6B7280] bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres avancés</span>
            {hasActiveKycFilter && (
              <span className="min-w-[18px] h-[18px] rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                1
              </span>
            )}
          </button>
        </div>

        {/* KYC filter tabs (panneau filtres avancés) */}
        {advancedFiltersVisible && (
          <div className="space-y-2 pt-1 border-t border-[#F3F4F6]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[#6B7280]">
                Utilisez les onglets KYC ci-dessous pour filtrer
              </p>
              {hasActiveKycFilter && (
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 shrink-0"
                >
                  Réinitialiser
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 p-1 bg-[#F3F4F6] rounded-lg">
              {filterTabs.map((tab) => {
                const Icon = tab.icon
                const count =
                  tab.key === 'all' ? totalClients
                  : tab.key === 'verified' ? verifiedClients
                  : tab.key === 'pending' ? pendingClients
                  : premiumClients

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all',
                      activeFilter === tab.key
                        ? 'bg-white text-[#111827] shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111827]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span
                      className={cn(
                        'min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1',
                        activeFilter === tab.key
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-[#E5E7EB] text-[#6B7280]'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Client list */}
      <div className="flex-1 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Header row (desktop) */}
        <div className="hidden md:grid grid-cols-[1fr_160px_140px_130px_130px_44px] items-center px-5 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</span>
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Téléphone</span>
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Niveau KYC</span>
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Solde</span>
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Opérations</span>
          <span />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-[#F3F4F6]">
          {filteredClients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-3">
                <Search className="w-7 h-7 text-[#9CA3AF]" />
              </div>
              <p className="text-sm font-medium text-[#111827]">Aucun client trouvé</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Essayez un autre terme de recherche ou filtre</p>
            </div>
          )}

          {filteredClients.map((client) => {
            const badge = kycBadge[client.kycLevel]
            const avatarStyle = avatarColors[client.id - 1]

            return (
              <button
                key={client.id}
                type="button"
                onClick={() => onSelectClient(client)}
                className={cn(
                  'w-full grid grid-cols-1 md:grid-cols-[1fr_160px_140px_130px_130px_44px] items-center',
                  'px-5 py-4 text-left hover:bg-emerald-50/50 transition-colors group'
                )}
              >
                {/* Name + Avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 group-hover:scale-105 transition-transform',
                      avatarStyle
                    )}
                  >
                    {client.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate group-hover:text-emerald-600 transition-colors">
                      {client.name}
                    </p>
                    <p className="text-xs text-[#9CA3AF] truncate">{client.email}</p>
                  </div>
                </div>

                {/* Phone (desktop) */}
                <p className="hidden md:block text-sm text-[#6B7280]">{client.phone}</p>

                {/* KYC badge */}
                <div className="mt-1 md:mt-0">
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', badge.style)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', badge.dotColor)} />
                    {badge.shortLabel}
                  </span>
                </div>

                {/* Balance */}
                <p className="text-sm font-semibold text-emerald-600 mt-1 md:mt-0 md:text-right">
                  {client.balance}
                </p>

                {/* Operations count */}
                <div className="hidden md:flex items-center justify-end gap-1.5">
                  <Hash className="w-3 h-3 text-[#9CA3AF]" />
                  <span className="text-sm font-medium text-[#6B7280]">{client.totalOps}</span>
                </div>

                {/* More button */}
                <div className="hidden md:flex justify-end">
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-emerald-500 transition-colors" />
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer with count */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-[#9CA3AF]">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} affiché{filteredClients.length !== 1 ? 's' : ''}
            {hasActiveKycFilter && (
              <span className="text-emerald-600 font-medium"> · {kycFilterLabels[activeFilter]}</span>
            )}
          </span>
          <span className="text-xs text-[#9CA3AF]">sur {totalClients} total</span>
        </div>
      </div>

      {/* New Client Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-[#E5E7EB] max-h-[90vh] overflow-y-auto">
            {/* Dialog header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#111827]">Nouveau Client</h2>
                  <p className="text-xs text-[#9CA3AF]">Créer un nouveau compte client</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewDialog(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280] hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Nom complet</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Koffi Dossou"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Téléphone</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 text-sm text-[#6B7280] bg-[#F9FAFB] border border-r-0 border-[#E5E7EB] rounded-l-xl">+223</span>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="70 12 34 56"
                    className="flex-1 px-3.5 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-r-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Email (optionnel)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ex: koffi.dossou@email.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Date de naissance</label>
                <input
                  type="date"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">Type de document</label>
                  <select className="w-full px-3.5 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow appearance-none">
                    <option>Carte nationale</option>
                    <option>Passeport</option>
                    <option>Permis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">Numéro de document</label>
                  <input
                    type="text"
                    placeholder="Ex: BN-1234567"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Adresse</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Ex: Bamako, Badalabougou"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
                />
              </div>
            </div>

            {/* Dialog footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setShowNewDialog(false)
                  setNewName('')
                  setNewPhone('')
                  setNewEmail('')
                  setNewAddress('')
                }}
                className="px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newName.trim() || !newPhone.trim()) {
                    toast.error('Nom et téléphone requis')
                    return
                  }
                  const parts = newName.trim().split(/\s+/)
                  const initials = parts.length >= 2
                    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                    : newName.slice(0, 2).toUpperCase()
                  const nextId = Math.max(0, ...clients.map((c) => c.id)) + 1
                  const phone = newPhone.includes('+223') ? newPhone.trim() : `+223 ${newPhone.trim()}`
                  onCreateClient({
                    id: nextId,
                    name: newName.trim(),
                    phone,
                    kycLevel: 1,
                    balance: '0 FCFA',
                    balanceNum: 0,
                    initials,
                    email: newEmail.trim() || `${parts[0].toLowerCase()}@email.com`,
                    address: newAddress.trim() || 'Bamako',
                    dateOfBirth: '—',
                    joinedDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                    totalDeposits: '0 FCFA',
                    totalWithdrawals: '0 FCFA',
                    totalTransfers: '0 FCFA',
                    totalOps: 0,
                  })
                  setShowNewDialog(false)
                  setNewName('')
                  setNewPhone('')
                  setNewEmail('')
                  setNewAddress('')
                }}
                className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Créer le client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ClientsView() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [allClients, setAllClients] = useState<Client[]>(() => {
    const extra = loadExtraClients<Client>()
    return extra.length > 0 ? [...baseClients, ...extra] : baseClients
  })

  function handleCreateClient(client: Client) {
    const updated = [...allClients, client]
    setAllClients(updated)
    const extra = updated.filter((c) => !baseClients.some((b) => b.id === c.id))
    saveExtraClients(extra)
    toast.success('Client créé', { description: `${client.name} a été ajouté` })
  }

  if (selectedClient) {
    const current = allClients.find((c) => c.id === selectedClient.id) ?? selectedClient
    return (
      <ClientDetailPage
        client={current}
        onBack={() => setSelectedClient(null)}
      />
    )
  }

  return (
    <ClientListPage
      clients={allClients}
      onSelectClient={setSelectedClient}
      onCreateClient={handleCreateClient}
    />
  )
}
