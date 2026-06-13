'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ChevronRight,
  Star,
  Map,
  Ban,
  Trash2,
  Users,
  MessageSquare,
  Smartphone,
  Banknote,
  CreditCard,
  TrendingUp,
  User,
  CheckCircle2,
  XCircle,
  Clock,
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
/*  Static mock data                                                   */
/* ──────────────────────────────────────────────────────────────────── */

const mockRecentCourses: Record<
  string,
  { date: string; depart: string; arrivee: string; montant: string; statut: string; chauffeur: string }[]
> = {
  '1': [
    { date: '05 Mar 2026', depart: 'Hamdallaye',   arrivee: 'Badalabougou',  montant: '3 500 FCFA', statut: 'Terminée', chauffeur: 'Ibrahim Keita'    },
    { date: '03 Mar 2026', depart: 'ACI 2000',     arrivee: 'Kalaban-Coura', montant: '5 200 FCFA', statut: 'Terminée', chauffeur: 'Moussa Sissoko'   },
    { date: '01 Mar 2026', depart: 'Medina Coura', arrivee: 'Sébenikoro',    montant: '2 800 FCFA', statut: 'Annulée',  chauffeur: 'Seydou Diabaté'   },
    { date: '26 Fév 2026', depart: 'Badalabougou', arrivee: 'Korofina',      montant: '4 100 FCFA', statut: 'Terminée', chauffeur: 'Bakary Traoré'    },
    { date: '24 Fév 2026', depart: 'Lafiabougou',  arrivee: 'Hamdallaye',    montant: '1 900 FCFA', statut: 'Terminée', chauffeur: 'Amadou Coulibaly' },
  ],
  '4': [
    { date: '04 Mar 2026', depart: 'Korofina',     arrivee: 'Lafiabougou',   montant: '4 000 FCFA', statut: 'Terminée', chauffeur: 'Amadou Coulibaly' },
    { date: '28 Fév 2026', depart: 'Badalabougou', arrivee: 'ACI 2000',      montant: '6 500 FCFA', statut: 'Terminée', chauffeur: 'Bakary Traoré'    },
  ],
}

const mockPayments: Record<string, { type: 'mobile' | 'cash' | 'card'; label: string; defaut: boolean }[]> = {
  '1': [
    { type: 'mobile', label: 'Orange Money — +223 70 12 34 56', defaut: true  },
    { type: 'cash',   label: 'Espèces',                          defaut: false },
  ],
  '4': [
    { type: 'mobile', label: 'Wave — +223 97 33 22 11',          defaut: true  },
    { type: 'card',   label: 'Carte bancaire ****4521',           defaut: false },
  ],
}

const mockRatings: Record<string, { chauffeur: string; note: number; date: string; comment: string }[]> = {
  '1': [
    { chauffeur: 'Ibrahim Keita',    note: 5, date: '05 Mar 2026', comment: 'Très ponctuel et courtois' },
    { chauffeur: 'Moussa Sissoko',   note: 4, date: '03 Mar 2026', comment: 'Bonne conduite'            },
    { chauffeur: 'Seydou Diabaté',   note: 5, date: '01 Mar 2026', comment: ''                          },
    { chauffeur: 'Bakary Traoré',    note: 3, date: '26 Fév 2026', comment: 'En retard de 10 min'       },
  ],
  '4': [
    { chauffeur: 'Amadou Coulibaly', note: 5, date: '04 Mar 2026', comment: 'Excellent service'         },
    { chauffeur: 'Bakary Traoré',    note: 3, date: '02 Mar 2026', comment: 'En retard de 10 min'       },
  ],
}

const paymentIcon = {
  mobile: Smartphone,
  cash:   Banknote,
  card:   CreditCard,
} as const

/* ──────────────────────────────────────────────────────────────────── */
/*  Helpers                                                            */
/* ──────────────────────────────────────────────────────────────────── */

/* Star row — always rendered on dark hero → text-white */
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
      <span className="text-sm font-bold text-white ml-2">{rating.toFixed(1)}</span>
    </div>
  )
}

/* Inline star for ratings list — rendered on white bg → text-[#111827] */
function MiniStars({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(
          'w-3 h-3',
          i <= note ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-100'
        )} />
      ))}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                          */
/* ──────────────────────────────────────────────────────────────────── */

export function PassagerDetailView() {
  const { pendingPassager, clearPendingPassager, setActiveView } = useDashboard()

  const [suspendDialog, setSuspendDialog] = useState(false)
  const [deleteDialog, setDeleteDialog]   = useState(false)
  const [contactDialog, setContactDialog] = useState(false)
  const [localStatus, setLocalStatus]     = useState<string | null>(null)

  /* ── Empty state ── */
  if (!pendingPassager) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center">
          <Users className="w-10 h-10 text-orange-300" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-[#111827]">Aucun passager sélectionné</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Retournez à la liste pour sélectionner un passager</p>
        </div>
        <button
          onClick={() => setActiveView('passagers')}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux passagers
        </button>
      </div>
    )
  }

  const p        = pendingPassager
  const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const currentStatus = localStatus ?? p.status
  const isActif    = currentStatus === 'Actif'
  const isSuspendu = currentStatus === 'Suspendu'

  const handleConfirmSuspend = () => {
    const next = isSuspendu ? 'Actif' : 'Suspendu'
    setLocalStatus(next)
    mockDb.addLog('MODIFICATION', 'Passager', `${p.name} ${isSuspendu ? 'réactivé' : 'suspendu'}`)
    setSuspendDialog(false)
    toast.success(
      isSuspendu ? 'Passager réactivé' : 'Passager suspendu',
      { description: `${p.name} est maintenant ${next.toLowerCase()}.` }
    )
  }

  const handleConfirmDelete = () => {
    mockDb.addLog('SUPPRESSION', 'Passager', `${p.name} supprimé définitivement`)
    setDeleteDialog(false)
    toast.success('Passager supprimé', { description: `${p.name} a été supprimé définitivement.` })
    clearPendingPassager()
    setActiveView('passagers')
  }

  const courses  = mockRecentCourses[p.id] ?? []
  const payments = mockPayments[p.id]      ?? []
  const ratings  = mockRatings[p.id]       ?? []

  const avgRating = ratings.length
    ? Math.round((ratings.reduce((s, r) => s + r.note, 0) / ratings.length) * 10) / 10
    : 4.7

  const totalSpent = courses
    .filter(c => c.statut === 'Terminée')
    .reduce((s, c) => s + parseInt(c.montant.replace(/\s|FCFA/g, ''), 10), 0)

  const handleBack = () => {
    clearPendingPassager()
    setActiveView('passagers')
  }

  /* ── Performance stats (computed) ── */
  const statCards = [
    {
      label: 'Courses totales',  value: String(p.courses),
      icon: Map,        iconColor: 'text-orange-600', iconBg: 'bg-orange-100',
      cardBg: 'bg-white', cardBorder: 'border-orange-200', valueColor: 'text-orange-700', labelColor: 'text-orange-500',
    },
    {
      label: 'Note moyenne',     value: avgRating.toFixed(1),
      icon: Star,       iconColor: 'text-amber-600',  iconBg: 'bg-amber-100',
      cardBg: 'bg-white', cardBorder: 'border-amber-200',  valueColor: 'text-amber-700',  labelColor: 'text-amber-500',
    },
    {
      label: 'Total dépensé',    value: totalSpent > 0 ? `${totalSpent.toLocaleString('fr-FR')} F` : '—',
      icon: CreditCard, iconColor: 'text-violet-600', iconBg: 'bg-violet-100',
      cardBg: 'bg-white', cardBorder: 'border-violet-200', valueColor: 'text-violet-700', labelColor: 'text-violet-500',
    },
    {
      label: 'Courses annulées', value: String(courses.filter(c => c.statut === 'Annulée').length),
      icon: XCircle,    iconColor: 'text-rose-600',   iconBg: 'bg-rose-100',
      cardBg: 'bg-white', cardBorder: 'border-rose-200',   valueColor: 'text-rose-700',   labelColor: 'text-rose-500',
    },
  ]

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ════════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════════ */}
      <div className={cn(
        'relative rounded-2xl overflow-hidden',
        isActif    ? 'bg-gradient-to-br from-[#1A1A2E] to-[#16213E]'
          : isSuspendu ? 'bg-gradient-to-br from-rose-700 to-rose-900'
          : 'bg-gradient-to-br from-gray-600 to-gray-800'
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
              <span className="hidden sm:inline">Retour aux passagers</span>
            </button>

            <div className="flex items-center gap-2">
              {!isSuspendu ? (
                <button
                  onClick={() => setSuspendDialog(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Ban className="w-3.5 h-3.5" /> Suspendre
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
                onClick={() => setDeleteDialog(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
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
              <span className={cn(
                'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm',
                isActif ? 'bg-emerald-400' : isSuspendu ? 'bg-rose-400' : 'bg-gray-400'
              )} />
            </div>

            {/* Name + rating + inscription */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-black text-white tracking-tight leading-none">{p.name}</h1>
                <span className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                  isActif
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                    : isSuspendu
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                    : 'bg-gray-500/20 text-gray-200 border-gray-400/40'
                )}>
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isActif ? 'bg-emerald-300 animate-pulse' : isSuspendu ? 'bg-rose-300' : 'bg-gray-300'
                  )} />
                  {currentStatus}
                </span>
              </div>
              {/* Star rating — white-safe */}
              <StarRow rating={avgRating} />
              {/* Inscription date — white/70 readable */}
              <p className="text-white/70 text-xs font-medium mt-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/50 shrink-0" />
                Inscrit le {p.dateInscription}
              </p>
            </div>

            {/* KPI pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Courses',    value: String(p.courses)               },
                { label: 'Téléphone',  value: p.phone                         },
                { label: 'ID',         value: `PAS-${p.id.padStart(4, '0')}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/15 border border-white/25 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">{label}</p>
                  <p className="text-white text-sm font-black mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          STATS CARDS
      ════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, iconColor, iconBg, cardBg, cardBorder, valueColor, labelColor }) => (
          <div key={label} className={cn(
            'relative rounded-2xl p-5 flex flex-col gap-2 border overflow-hidden shadow-sm',
            cardBg, cardBorder
          )}>
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

          {/* Informations de contact */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Informations de contact</p>
            </div>
            <div className="space-y-1">
              {[
                { label: 'Nom complet',       value: p.name,             icon: User     },
                { label: 'Téléphone',          value: p.phone,            icon: Phone    },
                { label: 'Email',              value: p.email,            icon: Mail     },
                { label: 'Date inscription',   value: p.dateInscription,  icon: Calendar },
                { label: 'ID Passager',        value: `PAS-${p.id.padStart(4, '0')}`, icon: Users },
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

          {/* Modes de paiement */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Modes de paiement</p>
            </div>
            {payments.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] text-center py-4">Aucun mode enregistré</p>
            ) : (
              <div className="space-y-2">
                {payments.map((pm, i) => {
                  const PmIcon = paymentIcon[pm.type]
                  return (
                    <div key={i} className={cn(
                      'flex items-center gap-3 p-3.5 rounded-xl border',
                      pm.defaut
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-[#F9FAFB] border-[#F3F4F6]'
                    )}>
                      <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        pm.defaut ? 'bg-orange-500' : 'bg-[#E5E7EB]'
                      )}>
                        <PmIcon className={cn('w-4 h-4', pm.defaut ? 'text-white' : 'text-[#6B7280]')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate">{pm.label}</p>
                        {pm.defaut && (
                          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mt-0.5">Par défaut</p>
                        )}
                      </div>
                      {pm.defaut && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Activité récente summary */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Activité</p>
            </div>
            <div className="space-y-3">
              {/* Completed */}
              <div className="flex items-center gap-3 p-3.5 bg-emerald-600 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-emerald-500 border border-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-emerald-100 text-[10px] font-semibold uppercase tracking-wide">Courses terminées</p>
                  <p className="text-white text-lg font-black mt-0.5">
                    {courses.filter(c => c.statut === 'Terminée').length} / {courses.length}
                  </p>
                </div>
              </div>
              {/* Cancelled */}
              <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Courses annulées</p>
                  <p className="text-sm font-bold text-[#111827] mt-0.5">
                    {courses.filter(c => c.statut === 'Annulée').length} annulation{courses.filter(c => c.statut === 'Annulée').length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {/* Last activity */}
              <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Dernière activité</p>
                  <p className="text-sm font-bold text-[#111827] mt-0.5">
                    {courses[0]?.date ?? '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT col (3/5) ── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Courses récentes */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Map className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Courses récentes</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
                {courses.length} course{courses.length !== 1 ? 's' : ''}
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#9CA3AF]">Aucune course récente</div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[300px]">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                      <tr className="border-b border-[#E5E7EB]">
                        {['Date', 'Chauffeur', 'Trajet', 'Montant', 'Statut'].map(h => (
                          <th key={h} className="py-3 px-4 text-left text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c, i) => (
                        <tr key={i} className="border-b border-[#F3F4F6] last:border-0 hover:bg-orange-50/40 transition-colors">
                          <td className="py-3 px-4 text-xs text-[#9CA3AF] font-mono">{c.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[10px] shrink-0">
                                {c.chauffeur.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </div>
                              <span className="text-xs font-semibold text-[#111827]">{c.chauffeur}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                              <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                              <span className="truncate max-w-[72px]">{c.depart}</span>
                              <ChevronRight className="w-3 h-3 text-[#D1D5DB] shrink-0" />
                              <span className="truncate max-w-[72px]">{c.arrivee}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs font-bold text-[#111827]">{c.montant}</td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                              c.statut === 'Terminée'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            )}>
                              {c.statut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-[#F3F4F6]">
                  {courses.map((c, i) => (
                    <div key={i} className="px-4 py-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#9CA3AF] font-mono">{c.date}</span>
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          c.statut === 'Terminée'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        )}>{c.statut}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#111827]">{c.chauffeur}</p>
                      <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span>{c.depart}</span>
                        <ChevronRight className="w-3 h-3 text-[#D1D5DB]" />
                        <span>{c.arrivee}</span>
                        <span className="ml-auto font-bold text-[#111827]">{c.montant}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notations aux chauffeurs */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                </div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Notations aux chauffeurs</p>
              </div>
              {ratings.length > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-700">Moy. {avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {ratings.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#9CA3AF]">Aucune notation</div>
            ) : (
              <div className="divide-y divide-[#F3F4F6]">
                {ratings.map((r, i) => (
                  <div key={i} className="px-5 py-4 flex items-start gap-4">
                    {/* Chauffeur avatar */}
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[10px] shrink-0">
                      {r.chauffeur.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-bold text-[#111827]">{r.chauffeur}</p>
                        <span className="text-[10px] text-[#9CA3AF] font-mono">{r.date}</span>
                      </div>
                      {/* Stars — on white bg → amber & gray-200 fully visible */}
                      <div className="flex items-center gap-2 mt-1">
                        <MiniStars note={r.note} />
                        <span className="text-xs font-bold text-[#374151]">{r.note} / 5</span>
                      </div>
                      {r.comment && (
                        <p className="text-xs text-[#6B7280] mt-1.5 italic">
                          &ldquo;{r.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── AlertDialog : Suspendre / Réactiver ── */}
      <AlertDialog open={suspendDialog} onOpenChange={setSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuspendu ? 'Réactiver le passager' : 'Suspendre le passager'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuspendu
                ? <>Vous êtes sur le point de <strong>réactiver</strong> le compte de <strong>{p.name}</strong>. Il pourra de nouveau réserver des courses.</>
                : <>Vous êtes sur le point de <strong>suspendre</strong> le compte de <strong>{p.name}</strong>. Il ne pourra plus réserver de courses tant que son compte est suspendu.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 my-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 text-sm shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">{p.name}</p>
              <p className="text-xs text-[#6B7280]">{p.phone} · ID PAS-{p.id.padStart(4, '0')}</p>
            </div>
            <span className={cn(
              'ml-auto text-xs font-bold px-2.5 py-1 rounded-full',
              isSuspendu ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            )}>
              {currentStatus}
            </span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSuspend}
              className={isSuspendu
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
              }
            >
              {isSuspendu
                ? <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Réactiver</>
                : <><Ban className="w-4 h-4 mr-1.5" /> Suspendre</>
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── AlertDialog : Supprimer ── */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le passager</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est <strong>irréversible</strong>. Le compte de <strong>{p.name}</strong> sera définitivement supprimé ainsi que tout son historique de courses et de paiements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 my-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-700 text-sm shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">{p.name}</p>
              <p className="text-xs text-[#6B7280]">{p.phone} · {p.courses} course{p.courses !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Dialog : Contacter ── */}
      <Dialog open={contactDialog} onOpenChange={setContactDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              Contacter {p.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">Téléphone</p>
                <p className="text-sm font-semibold text-[#111827] truncate">{p.phone}</p>
              </div>
              <div className="flex gap-1.5">
                <a
                  href={`tel:${p.phone.replace(/\s/g, '')}`}
                  className="p-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                  title="Appeler"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText(p.phone); toast.success('Numéro copié') }}
                  className="p-2 rounded-lg bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#6B7280] transition-colors"
                  title="Copier"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-[#111827] truncate">{p.email}</p>
              </div>
              <div className="flex gap-1.5">
                <a
                  href={`mailto:${p.email}`}
                  className="p-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors"
                  title="Envoyer un email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText(p.email); toast.success('Email copié') }}
                  className="p-2 rounded-lg bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#6B7280] transition-colors"
                  title="Copier"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
