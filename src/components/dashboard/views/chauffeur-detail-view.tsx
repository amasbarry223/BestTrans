'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Phone,
  Mail,
  Car,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  Wallet,
  CreditCard,
  Banknote,
  MapPin,
  ChevronRight,
  User,
  Award,
  MessageSquare,
  AlertCircle,
  Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { toast } from 'sonner'
import { mockDb } from '@/lib/mock-db'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/* ──────────────────────────────────────────────────────────────────── */
/*  Types & Static data                                                */
/* ──────────────────────────────────────────────────────────────────── */

type KycStatus = 'Validé' | 'En attente' | 'Rejeté'
type KycDoc    = { label: string; status: KycStatus; icon: React.ElementType }

const defaultKycDocs: KycDoc[] = [
  { label: 'Permis de conduire', status: 'Validé',     icon: FileText    },
  { label: 'Carte grise',        status: 'Validé',     icon: FileText    },
  { label: 'Assurance',          status: 'En attente', icon: ShieldCheck },
  { label: "Pièce d'identité",   status: 'Rejeté',     icon: FileText    },
]

const kycConfig: Record<KycStatus, {
  cardBg: string; cardBorder: string;
  iconBg: string; iconColor: string;
  badgeBg: string; badgeBorder: string; badgeText: string; dot: string
}> = {
  'Validé': {
    cardBg: 'bg-emerald-50', cardBorder: 'border-emerald-200',
    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100', badgeBorder: 'border-emerald-300', badgeText: 'text-emerald-800', dot: 'bg-emerald-500',
  },
  'En attente': {
    cardBg: 'bg-amber-50', cardBorder: 'border-amber-200',
    iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
    badgeBg: 'bg-amber-100', badgeBorder: 'border-amber-300', badgeText: 'text-amber-800', dot: 'bg-amber-500',
  },
  'Rejeté': {
    cardBg: 'bg-rose-50', cardBorder: 'border-rose-200',
    iconBg: 'bg-rose-100', iconColor: 'text-rose-600',
    badgeBg: 'bg-rose-100', badgeBorder: 'border-rose-300', badgeText: 'text-rose-800', dot: 'bg-rose-500',
  },
}

type RecentCourse = {
  id: string; passager: string; depart: string; arrivee: string
  prix: string; date: string; statut: string
}

const defaultRecentCourses: RecentCourse[] = [
  { id: 'BTS-3041', passager: 'Aminata Diarra',   depart: 'Kalaban-Coura', arrivee: 'Badalabougou', prix: '3 500 FCFA', date: '04/03/2026', statut: 'Terminée' },
  { id: 'BTS-3039', passager: 'Moussa Traoré',    depart: 'Hamdallaye',    arrivee: 'Sébenikoro',   prix: '2 800 FCFA', date: '04/03/2026', statut: 'Terminée' },
  { id: 'BTS-3036', passager: 'Kadiatou Bah',     depart: 'Lafiabougou',   arrivee: 'Kalaban-Coura',prix: '4 200 FCFA', date: '03/03/2026', statut: 'Terminée' },
  { id: 'BTS-3034', passager: 'Seydou Keïta',     depart: 'Badalabougou',  arrivee: 'Hamdallaye',   prix: '1 900 FCFA', date: '03/03/2026', statut: 'Annulée'  },
  { id: 'BTS-3031', passager: 'Fatoumata Sanogo', depart: 'Sébenikoro',    arrivee: 'Lafiabougou',  prix: '3 100 FCFA', date: '02/03/2026', statut: 'Terminée' },
]

const performanceStats = [
  { label: "Taux d'acceptation", value: '87 %',    icon: TrendingUp, iconColor: 'text-violet-600', iconBg: 'bg-violet-100', cardBg: 'bg-white', cardBorder: 'border-violet-200', valueColor: 'text-violet-700', labelColor: 'text-violet-500' },
  { label: 'Ponctualité',         value: '92 %',    icon: Clock,      iconColor: 'text-sky-600',    iconBg: 'bg-sky-100',    cardBg: 'bg-white', cardBorder: 'border-sky-200',    valueColor: 'text-sky-700',    labelColor: 'text-sky-500'    },
  { label: 'Note moyenne',        value: '4,5 / 5', icon: Star,       iconColor: 'text-amber-600',  iconBg: 'bg-amber-100',  cardBg: 'bg-white', cardBorder: 'border-amber-200',  valueColor: 'text-amber-700',  labelColor: 'text-amber-500'  },
  { label: 'Courses totales',     value: '845',     icon: Car,        iconColor: 'text-orange-600', iconBg: 'bg-orange-100', cardBg: 'bg-white', cardBorder: 'border-orange-200', valueColor: 'text-orange-700', labelColor: 'text-orange-500' },
]

/* ──────────────────────────────────────────────────────────────────── */
/*  Helpers                                                            */
/* ──────────────────────────────────────────────────────────────────── */

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(
          'w-4 h-4',
          i <= Math.floor(rating)  ? 'text-amber-400 fill-amber-400'
            : i - 0.5 <= rating   ? 'text-amber-400 fill-amber-200'
            : 'text-white/20 fill-transparent'
        )} />
      ))}
      {/* white text → readable on any dark hero gradient */}
      <span className="text-sm font-bold text-white ml-2">{rating}</span>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                          */
/* ──────────────────────────────────────────────────────────────────── */

export function ChauffeurDetailView() {
  const { pendingChauffeur, clearPendingChauffeur, setActiveView } = useDashboard()

  const [localStatus, setLocalStatus] = useState<string | null>(null)
  const [suspendDialog, setSuspendDialog] = useState(false)
  const [validateDialog, setValidateDialog] = useState(false)
  const [contactDialog, setContactDialog] = useState(false)
  const [kycDocs, setKycDocs] = useState(defaultKycDocs)
  const [kycValidDialog, setKycValidDialog] = useState<string | null>(null)
  const [kycRejectDialog, setKycRejectDialog] = useState<string | null>(null)
  const [kycViewDialog, setKycViewDialog] = useState<string | null>(null)

  /* ── Empty state ── */
  if (!pendingChauffeur) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center">
          <Car className="w-10 h-10 text-orange-300" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-[#111827]">Aucun chauffeur sélectionné</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Retournez à la liste pour sélectionner un chauffeur</p>
        </div>
        <button
          onClick={() => setActiveView('chauffeurs')}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux chauffeurs
        </button>
      </div>
    )
  }

  const c = pendingChauffeur
  const initials      = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const currentStatus = localStatus ?? c.statut
  const isActif       = currentStatus === 'Actif'
  const isSuspendu    = currentStatus === 'Suspendu'
  const isAttente     = currentStatus === 'En attente'

  const handleConfirmKycValid = (label: string) => {
    setKycDocs(prev => prev.map(d => d.label === label ? { ...d, status: 'Validé' as KycStatus } : d))
    mockDb.addLog('VALIDATION_KYC', 'Chauffeur', `Document '${label}' validé pour ${c.name}`)
    setKycValidDialog(null)
    toast.success('Document validé', { description: `${label} a été validé avec succès.` })
  }

  const handleConfirmKycReject = (label: string) => {
    setKycDocs(prev => prev.map(d => d.label === label ? { ...d, status: 'Rejeté' as KycStatus } : d))
    mockDb.addLog('VALIDATION_KYC', 'Chauffeur', `Document '${label}' rejeté pour ${c.name}`)
    setKycRejectDialog(null)
    toast.error('Document rejeté', { description: `${label} a été rejeté.` })
  }

  const handleBack = () => {
    clearPendingChauffeur()
    setActiveView('chauffeurs')
  }

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ════════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════════ */}
      <div className={cn(
        'relative rounded-2xl overflow-hidden',
        isActif    ? 'bg-gradient-to-br from-[#1A1A2E] to-[#16213E]'
          : isSuspendu ? 'bg-gradient-to-br from-rose-700 to-rose-900'
          : 'bg-gradient-to-br from-amber-600 to-amber-800'
      )}>
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-14 -left-10 w-48 h-48 rounded-full bg-white/[0.04] pointer-events-none" />

        <div className="relative px-6 pt-5 pb-7">

          {/* ── Top bar: back + actions ── */}
          <div className="flex items-center justify-between mb-7">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour aux chauffeurs</span>
            </button>

            <div className="flex items-center gap-2">
              {isAttente && (
                <button
                  onClick={() => setValidateDialog(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valider
                </button>
              )}
              {!isSuspendu ? (
                <button
                  onClick={() => setSuspendDialog(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <XCircle className="w-3.5 h-3.5" /> Suspendre
                </button>
              ) : (
                <button
                  onClick={() => setSuspendDialog(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Réactiver
                </button>
              )}
              <button
                onClick={() => setContactDialog(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Contacter
              </button>
            </div>
          </div>

          {/* ── Profile row ── */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center font-black text-2xl text-white shadow-lg select-none">
                {initials}
              </div>
              {/* online indicator */}
              <span className={cn(
                'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm',
                isActif ? 'bg-emerald-400' : isSuspendu ? 'bg-rose-400' : 'bg-amber-400'
              )} />
            </div>

            {/* Name + rating + vehicle */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-black text-white tracking-tight leading-none">{c.name}</h1>
                <span className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                  isActif
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                    : isSuspendu
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                    : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                )}>
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isActif ? 'bg-emerald-300 animate-pulse' : isSuspendu ? 'bg-rose-300' : 'bg-amber-300 animate-pulse'
                  )} />
                  {currentStatus}
                </span>
              </div>
              {/* Stars — white-safe */}
              <StarRow rating={c.note} />
              {/* Vehicle — white/70 for good visibility */}
              <p className="text-white/70 text-xs font-medium mt-2 flex items-center gap-1.5 truncate">
                <Car className="w-3.5 h-3.5 text-white/50 shrink-0" />
                {c.vehicle}
              </p>
            </div>

            {/* KPI pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Courses', value: String(c.courses) },
                { label: 'Solde',   value: c.solde           },
                { label: 'ID',      value: `CH-${c.id.padStart(4, '0')}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/15 border border-white/25 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                  {/* label: white/60 — visible but secondary */}
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">{label}</p>
                  {/* value: full white — clearly readable */}
                  <p className="text-white text-sm font-black mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          PERFORMANCE STATS
      ════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceStats.map(({ label, value, icon: Icon, iconColor, iconBg, cardBg, cardBorder, valueColor, labelColor }) => (
          <div key={label} className={cn(
            'relative rounded-2xl p-5 flex flex-col gap-2 border overflow-hidden shadow-sm',
            cardBg, cardBorder
          )}>
            {/* subtle decorative circle */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-30 bg-current" style={{ color: 'inherit' }} />
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
              <Icon className={cn('w-5 h-5', iconColor)} />
            </div>
            <p className={cn('text-2xl font-black leading-none', valueColor)}>{value}</p>
            <p className={cn('text-[11px] font-semibold uppercase tracking-wide', labelColor)}>{label}</p>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════
          MAIN GRID  2/5 + 3/5
      ════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── LEFT col (2/5) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Informations personnelles */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Informations personnelles</p>
            </div>
            <div className="space-y-1">
              {[
                { label: 'Nom complet',  value: c.name,                              icon: User     },
                { label: 'Téléphone',    value: c.phone,                             icon: Phone    },
                { label: 'Email',        value: 'chauffeur@mail.com',                icon: Mail     },
                { label: 'N° Permis',    value: 'ML-2024-1042',                      icon: FileText },
                { label: 'N° Chauffeur', value: `CH-${c.id.padStart(4, '0')}`,       icon: Award    },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-[#F3F4F6] last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#6B7280]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-[#111827] truncate mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Véhicule */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Véhicule</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Modèle',          value: c.vehicle.split(' ').slice(0, 2).join(' ') },
                { label: 'Immatriculation', value: 'AB-1234-ML'                                },
                { label: 'Couleur',         value: 'Blanc'                                     },
                { label: 'Année',           value: c.vehicle.match(/\d{4}/)?.[0] ?? '2020'    },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-3">
                  <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-bold text-[#111827] mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenus */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Revenus</p>
            </div>
            <div className="space-y-3">
              {/* Solde — highlighted card */}
              <div className="flex items-center gap-3 p-4 bg-emerald-600 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 border border-emerald-400">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-emerald-100 text-[10px] font-semibold uppercase tracking-wide">Solde disponible</p>
                  <p className="text-white text-lg font-black mt-0.5">{c.solde}</p>
                </div>
              </div>
              {/* Dernier versement */}
              <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Dernier versement</p>
                  <p className="text-sm font-bold text-[#111827] mt-0.5">85 000 FCFA</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">28 Fév. 2026</p>
                </div>
              </div>
              {/* Revenus ce mois */}
              <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <Banknote className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Revenus ce mois</p>
                  <p className="text-sm font-bold text-[#111827] mt-0.5">210 000 FCFA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT col (3/5) ── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* KYC Documents */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            {/* header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Documents KYC</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { dot: 'bg-emerald-500', label: '2 validés',    text: 'text-emerald-700' },
                  { dot: 'bg-amber-500',   label: '1 en attente', text: 'text-amber-700'   },
                  { dot: 'bg-rose-500',    label: '1 rejeté',     text: 'text-rose-700'    },
                ].map(({ dot, label, text }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={cn('w-2 h-2 rounded-full shrink-0', dot)} />
                    <span className={cn('text-xs font-semibold', text)}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kycDocs.map((doc) => {
                const Icon  = doc.icon
                const cfg   = kycConfig[doc.status]
                const isValid    = doc.status === 'Validé'
                const isPending  = doc.status === 'En attente'
                const isRejected = doc.status === 'Rejeté'
                return (
                  <div key={doc.label} className={cn(
                    'border rounded-2xl p-4 flex flex-col gap-3',
                    cfg.cardBg, cfg.cardBorder
                  )}>
                    {/* icon + badge row */}
                    <div className="flex items-start justify-between">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', cfg.iconBg)}>
                        <Icon className={cn('w-5 h-5', cfg.iconColor)} />
                      </div>
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border',
                        cfg.badgeBg, cfg.badgeBorder, cfg.badgeText
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
                        {doc.status}
                      </span>
                    </div>
                    {/* doc name — dark on light bg = readable */}
                    <p className="text-sm font-bold text-[#111827]">{doc.label}</p>
                    {/* actions */}
                    <div className="flex gap-2 mt-auto">
                      {isPending && (
                        <>
                          <button
                            onClick={() => setKycValidDialog(doc.label)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valider
                          </button>
                          <button
                            onClick={() => setKycRejectDialog(doc.label)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 rounded-lg transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Rejeter
                          </button>
                        </>
                      )}
                      {isValid && (
                        <button
                          onClick={() => setKycViewDialog(doc.label)}
                          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg transition-colors shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" /> Voir le document
                        </button>
                      )}
                      {isRejected && (
                        <button
                          onClick={() => toast.info('Relance envoyée', { description: `${doc.label} — relance envoyée` })}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Redemander
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Courses récentes */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Car className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Courses récentes</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
                {defaultRecentCourses.length} courses
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[320px]">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                  <tr className="border-b border-[#E5E7EB]">
                    {['N°', 'Passager', 'Trajet', 'Prix', 'Date', 'Statut'].map(h => (
                      <th key={h} className="py-3 px-4 text-left text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {defaultRecentCourses.map((course) => (
                    <tr key={course.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-orange-50/40 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono font-bold text-orange-600">{course.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-[10px] shrink-0">
                            {course.passager.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-xs font-semibold text-[#111827]">{course.passager}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                          <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                          <span className="truncate max-w-[72px]">{course.depart}</span>
                          <ChevronRight className="w-3 h-3 text-[#D1D5DB] shrink-0" />
                          <span className="truncate max-w-[72px]">{course.arrivee}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-[#111827]">{course.prix}</td>
                      <td className="py-3 px-4 text-xs text-[#9CA3AF] font-mono">{course.date}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                          course.statut === 'Terminée'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        )}>
                          {course.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#F3F4F6]">
              {defaultRecentCourses.map((course) => (
                <div key={course.id} className="px-4 py-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-orange-600">{course.id}</span>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      course.statut === 'Terminée'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    )}>
                      {course.statut}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">{course.passager}</p>
                  <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>{course.depart}</span>
                    <ChevronRight className="w-3 h-3 text-[#D1D5DB]" />
                    <span>{course.arrivee}</span>
                    <span className="ml-auto font-bold text-[#111827]">{course.prix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── AlertDialog: Valider ── */}
      <AlertDialog open={validateDialog} onOpenChange={setValidateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Valider le chauffeur</AlertDialogTitle>
            <AlertDialogDescription>
              Valider le compte de <strong>{c.name}</strong> lui permettra de commencer à accepter des courses sur la plateforme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setLocalStatus('Actif')
                mockDb.addLog('VALIDATION_KYC', 'Chauffeur', `${c.name} validé et activé`)
                setValidateDialog(false)
                toast.success('Chauffeur validé', { description: `${c.name} peut maintenant accepter des courses.` })
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Confirmer la validation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── AlertDialog: Suspendre / Réactiver ── */}
      <AlertDialog open={suspendDialog} onOpenChange={setSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuspendu ? 'Réactiver le chauffeur' : 'Suspendre le chauffeur'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuspendu
                ? `Réactiver le compte de ${c.name} lui permettra à nouveau d'accepter des courses.`
                : `Suspendre le compte de ${c.name} l'empêchera d'accepter de nouvelles courses jusqu'à réactivation.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const next = isSuspendu ? 'Actif' : 'Suspendu'
                setLocalStatus(next)
                mockDb.addLog('MODIFICATION', 'Chauffeur', `${c.name} ${isSuspendu ? 'réactivé' : 'suspendu'}`)
                setSuspendDialog(false)
                if (isSuspendu) {
                  toast.success('Chauffeur réactivé', { description: `${c.name} est de nouveau actif.` })
                } else {
                  toast.error('Chauffeur suspendu', { description: `${c.name} a été suspendu.` })
                }
              }}
              className={isSuspendu
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'}
            >
              {isSuspendu ? 'Réactiver' : 'Suspendre'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Dialog: Contacter ── */}
      <Dialog open={contactDialog} onOpenChange={setContactDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Contacter {c.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <a
              href={`tel:${c.phone}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider">Téléphone</p>
                <p className="text-sm font-bold text-orange-700">{c.phone}</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#6B7280]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-[#374151] truncate">chauffeur@mail.com</p>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText('chauffeur@mail.com'); toast.success('Email copié') }}
                className="p-1.5 rounded-lg hover:bg-[#E5E7EB] transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog: KYC Valider ── */}
      <AlertDialog open={!!kycValidDialog} onOpenChange={(o) => !o && setKycValidDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Valider le document</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmer la validation de <strong>{kycValidDialog}</strong> pour {c.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setKycValidDialog(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => kycValidDialog && handleConfirmKycValid(kycValidDialog)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Valider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── AlertDialog: KYC Rejeter ── */}
      <AlertDialog open={!!kycRejectDialog} onOpenChange={(o) => !o && setKycRejectDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter le document</AlertDialogTitle>
            <AlertDialogDescription>
              Rejeter <strong>{kycRejectDialog}</strong> pour {c.name}. Le chauffeur sera notifié de soumettre un nouveau document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setKycRejectDialog(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => kycRejectDialog && handleConfirmKycReject(kycRejectDialog)}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Rejeter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Dialog: KYC Voir document ── */}
      <Dialog open={!!kycViewDialog} onOpenChange={(o) => !o && setKycViewDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{kycViewDialog}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="aspect-[4/3] bg-[#F3F4F6] rounded-xl flex flex-col items-center justify-center gap-3 border border-[#E5E7EB]">
              <FileText className="w-12 h-12 text-[#D1D5DB]" />
              <p className="text-sm text-[#9CA3AF] font-medium">Aperçu du document</p>
              <p className="text-xs text-[#D1D5DB]">Document en cours de chargement…</p>
            </div>
            <p className="mt-3 text-xs text-[#9CA3AF] text-center">
              Document validé — {c.name}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
