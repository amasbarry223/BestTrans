'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  Map,
  Navigation,
  XCircle,
  RotateCcw,
  User,
  Phone,
  Car,
  Clock,
  CreditCard,
  Calendar,
  Timer,
  Banknote,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Star,
  Smartphone,
  AlertCircle,
  Send,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { toast } from 'sonner'
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

const CourseDetailMapInner = dynamic(
  () => import('./course-detail-map-inner'),
  { ssr: false, loading: () => <div className="h-full w-full bg-orange-50/60 animate-pulse rounded-2xl" /> }
)

/* ──────────────────────────────────────────────────────────────────── */
/*  Status config                                                       */
/* ──────────────────────────────────────────────────────────────────── */

const statutConfig: Record<string, {
  bg: string; text: string; dot: string; border: string; accent: string; label: string
}> = {
  'En attente': { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500',     border: 'border-sky-200',     accent: 'bg-sky-500',     label: 'En attente' },
  'En cours':   { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   border: 'border-amber-200',   accent: 'bg-amber-500',   label: 'En cours' },
  'Terminée':   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200', accent: 'bg-emerald-500', label: 'Terminée' },
  'Annulée':    { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500',    border: 'border-rose-200',    accent: 'bg-rose-500',    label: 'Annulée' },
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Timeline                                                            */
/* ──────────────────────────────────────────────────────────────────── */

type StepStatus = 'done' | 'current' | 'pending' | 'cancelled'

interface TimelineStep { label: string; time: string; status: StepStatus; icon: React.ElementType }

function buildTimeline(statut: string): TimelineStep[] {
  const base: TimelineStep[] = [
    { label: 'Réservation', time: '', status: 'pending', icon: Calendar },
    { label: 'Affectation',  time: '', status: 'pending', icon: User },
    { label: 'En route',     time: '', status: 'pending', icon: Navigation },
    { label: 'Arrivée',      time: '', status: 'pending', icon: CheckCircle2 },
  ]
  if (statut === 'En attente') {
    base[0] = { ...base[0], time: '08:30', status: 'current' }
  } else if (statut === 'En cours') {
    base[0] = { ...base[0], time: '08:30', status: 'done' }
    base[1] = { ...base[1], time: '08:32', status: 'done' }
    base[2] = { ...base[2], time: '08:35', status: 'current' }
  } else if (statut === 'Terminée') {
    base[0] = { ...base[0], time: '08:30', status: 'done' }
    base[1] = { ...base[1], time: '08:32', status: 'done' }
    base[2] = { ...base[2], time: '08:35', status: 'done' }
    base[3] = { ...base[3], time: '08:58', status: 'done' }
  } else if (statut === 'Annulée') {
    base[0] = { ...base[0], time: '08:30', status: 'done' }
    base[1] = { ...base[1], time: '—',     status: 'cancelled' }
    base[2] = { ...base[2], time: '—',     status: 'cancelled' }
    base[3] = { ...base[3], time: '—',     status: 'cancelled' }
  }
  return base
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Mock extra data                                                     */
/* ──────────────────────────────────────────────────────────────────── */

const chauffeurDetails: Record<string, { phone: string; vehicle: string; note: number }> = {
  'Ibrahim Keita':   { phone: '+223 70 12 34 56', vehicle: 'Toyota Corolla · ML-2345-AB',  note: 4.8 },
  'Moussa Sissoko':  { phone: '+223 96 55 44 33', vehicle: 'Hyundai Accent · ML-6789-CD',  note: 4.5 },
  'Seydou Diabaté':  { phone: '+223 95 88 77 66', vehicle: 'Kia Picanto · ML-3456-EF',     note: 4.9 },
  'Amadou Coulibaly':{ phone: '+223 97 33 22 11', vehicle: 'Renault Logan · ML-7890-GH',   note: 4.6 },
  'Bakary Traoré':   { phone: '+223 70 99 88 77', vehicle: 'Dacia Sandero · ML-4567-IJ',   note: 4.3 },
}

const passagerDetails: Record<string, { phone: string }> = {
  'Amadou Diallo':      { phone: '+223 71 22 33 44' },
  'Fatoumata Traoré':   { phone: '+223 72 33 44 55' },
  'Kadiatou Bah':       { phone: '+223 73 44 55 66' },
  'Oumar Sidibé':       { phone: '+223 74 55 66 77' },
  'Aminata Coulibaly':  { phone: '+223 75 66 77 88' },
  'Mamadou Diarra':     { phone: '+223 76 77 88 99' },
  'Rokia Dembélé':      { phone: '+223 77 88 99 00' },
  'Drissa Sanogo':      { phone: '+223 78 99 00 11' },
  'Awa Kamissoko':      { phone: '+223 79 00 11 22' },
  'Boubacar Dia':       { phone: '+223 80 11 22 33' },
  'Mariam Sacko':       { phone: '+223 81 22 33 44' },
  'Salif Keita':        { phone: '+223 82 33 44 55' },
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Helper: initials avatar                                             */
/* ──────────────────────────────────────────────────────────────────── */

function Initials({ name, bg, fg }: { name: string; bg: string; fg: string }) {
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold text-sm shrink-0', bg, fg)}>
      {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                           */
/* ──────────────────────────────────────────────────────────────────── */

export function CourseDetailView() {
  const { pendingCourse, clearPendingCourse, setActiveView } = useDashboard()
  const course = pendingCourse
  const [notes, setNotes] = useState('')
  const [reassignDialog, setReassignDialog] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [refundDialog, setRefundDialog] = useState(false)

  const handleBack = () => {
    clearPendingCourse()
    setActiveView('courses')
  }

  /* ── Empty state ── */
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center">
          <Map className="w-10 h-10 text-orange-300" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-[#111827]">Aucune course sélectionnée</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Retournez à la liste pour sélectionner une course</p>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux courses
        </button>
      </div>
    )
  }

  const st = statutConfig[course.statut] || statutConfig['En attente']
  const timeline = buildTimeline(course.statut)
  const chauffeur = chauffeurDetails[course.chauffeur] || { phone: '+223 00 00 00 00', vehicle: 'N/A', note: 0 }
  const passager  = passagerDetails[course.passager]   || { phone: '+223 00 00 00 00' }
  const isCompleted = course.statut === 'Terminée'
  const isCancelled = course.statut === 'Annulée'
  const isActive    = course.statut === 'En cours'

  /* ── Payment icon ── */
  const PayIcon = course.modePaiement === 'Mobile Money' ? Smartphone
    : course.modePaiement === 'Cash'           ? Banknote
    : CreditCard

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ════════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════════ */}
      <div className={cn(
        'relative rounded-2xl overflow-hidden',
        isCompleted ? 'bg-gradient-to-br from-emerald-600 to-emerald-800'
          : isCancelled ? 'bg-gradient-to-br from-rose-600 to-rose-800'
          : isActive    ? 'bg-gradient-to-br from-amber-500 to-orange-700'
          : 'bg-gradient-to-br from-sky-600 to-sky-800'
      )}>
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative px-6 pt-5 pb-6">
          {/* Top row: back + actions */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour aux courses</span>
            </button>

            <div className="flex items-center gap-2">
              {!isCancelled && !isCompleted && (
                <>
                  <button
                    onClick={() => setReassignDialog(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors border border-white/20"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Réaffecter
                  </button>
                  <button
                    onClick={() => setCancelDialog(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Annuler
                  </button>
                </>
              )}
              {(isCompleted || isCancelled) && (
                <button
                  onClick={() => setRefundDialog(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors border border-white/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Rembourser
                </button>
              )}
            </div>
          </div>

          {/* Course number + status */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-medium mb-1 uppercase tracking-widest">Cours</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-none">
                {course.number}
              </h1>
              {/* Route summary */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="flex items-center gap-1 text-white/90 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 text-white/60" />
                  {course.depart}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <span className="flex items-center gap-1 text-white/90 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 text-white/60" />
                  {course.arrivee}
                </span>
              </div>
            </div>

            {/* Status + key stats */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Statut</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={cn('w-2 h-2 rounded-full', isCompleted ? 'bg-emerald-300' : isCancelled ? 'bg-rose-300' : isActive ? 'bg-amber-200 animate-pulse' : 'bg-sky-300')} />
                  <span className="text-white text-sm font-bold">{course.statut}</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Prix</p>
                <p className="text-white text-sm font-black mt-0.5">{course.prix}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Durée</p>
                <p className="text-white text-sm font-bold mt-0.5">
                  {isCompleted ? '23 min' : isCancelled ? '—' : 'En cours'}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Paiement</p>
                <p className="text-white text-sm font-bold mt-0.5">{course.modePaiement}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          TIMELINE HORIZONTALE
      ════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-5">Chronologie de la course</p>
        <div className="flex items-start gap-0">
          {timeline.map((step, i) => {
            const Icon = step.icon
            const isDone      = step.status === 'done'
            const isCurrent   = step.status === 'current'
            const isCancelled2= step.status === 'cancelled'
            const isPending   = step.status === 'pending'
            const isLast      = i === timeline.length - 1

            return (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-2">
                {/* Line + dot row */}
                <div className="w-full flex items-center">
                  {/* left half-line */}
                  <div className={cn(
                    'h-0.5 flex-1',
                    i === 0 ? 'invisible' :
                    isDone || isCurrent ? 'bg-orange-400' : 'bg-[#E5E7EB]'
                  )} />
                  {/* dot */}
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all',
                    isDone      ? 'bg-orange-100 ring-2 ring-orange-500 ring-offset-2' :
                    isCurrent   ? 'bg-orange-500 ring-2 ring-orange-300 ring-offset-2' :
                    isCancelled2? 'bg-rose-50 ring-1 ring-rose-200' :
                    'bg-[#F9FAFB] ring-1 ring-[#E5E7EB]'
                  )}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-orange-600" />
                    ) : isCurrent ? (
                      <Icon className="w-5 h-5 text-white" />
                    ) : isCancelled2 ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Icon className="w-4 h-4 text-[#D1D5DB]" />
                    )}
                  </div>
                  {/* right half-line */}
                  <div className={cn(
                    'h-0.5 flex-1',
                    isLast ? 'invisible' :
                    isDone ? 'bg-orange-400' : 'bg-[#E5E7EB]'
                  )} />
                </div>
                {/* Label + time */}
                <div className="text-center px-1">
                  <p className={cn(
                    'text-xs font-semibold',
                    isDone      ? 'text-orange-700' :
                    isCurrent   ? 'text-orange-600' :
                    isCancelled2? 'text-rose-400' :
                    'text-[#D1D5DB]'
                  )}>
                    {step.label}
                  </p>
                  {step.time ? (
                    <p className={cn(
                      'text-[10px] font-mono mt-0.5',
                      isDone    ? 'text-[#6B7280]' :
                      isCurrent ? 'text-orange-500 font-bold' :
                      'text-[#D1D5DB]'
                    )}>
                      {step.time}
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#D1D5DB] mt-0.5">—</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAIN GRID
      ════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── LEFT col (2/5) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Passager */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Passager</p>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-black text-sm shrink-0">
                {course.passager.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827]">{course.passager}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5 font-mono">{passager.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-[#F3F4F6]">
              <a
                href={`tel:${passager.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Appeler
              </a>
              <button
                onClick={() => toast.info('Messagerie en cours de développement', { description: 'Cette fonctionnalité sera disponible prochainement.' })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#6B7280] bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </button>
            </div>
          </div>

          {/* Chauffeur */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Chauffeur</p>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-black text-sm shrink-0">
                {course.chauffeur.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827]">{course.chauffeur}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-[#374151]">{chauffeur.note}</span>
                  <span className="text-xs text-[#9CA3AF]">/ 5</span>
                </div>
              </div>
            </div>
            <div className="bg-[#F9FAFB] rounded-xl p-3 space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Phone className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span className="font-mono">{chauffeur.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Car className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span>{chauffeur.vehicle}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-[#F3F4F6]">
              <a
                href={`tel:${chauffeur.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Appeler
              </a>
              <button
                onClick={() => toast.info('Messagerie en cours de développement', { description: 'Cette fonctionnalité sera disponible prochainement.' })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#6B7280] bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </button>
            </div>
          </div>

          {/* Détails financiers */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <PayIcon className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Paiement</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-xs text-[#6B7280]">Prix estimé</span>
                <span className="text-sm font-semibold text-[#374151]">{course.prix}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-xs text-[#6B7280]">Prix final</span>
                <span className={cn('text-sm font-bold', isCompleted ? 'text-orange-700' : 'text-[#9CA3AF]')}>
                  {isCompleted ? course.prix : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-xs text-[#6B7280]">Commission BestTrans</span>
                <span className={cn('text-xs font-semibold', isCompleted ? 'text-violet-700' : 'text-[#9CA3AF]')}>
                  {isCompleted ? '375 FCFA' : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-[#6B7280]">Mode de paiement</span>
                <div className="flex items-center gap-1.5">
                  <PayIcon className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span className="text-xs font-semibold text-[#374151]">{course.modePaiement}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Durée */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Dates & Durée</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Date', value: course.date, icon: Calendar },
                { label: 'Durée', value: isCompleted ? '23 min' : isCancelled ? '—' : 'En cours…', icon: Timer },
                { label: "T. d'attente", value: '2 min', icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-[#F9FAFB] rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 text-[#9CA3AF] mx-auto mb-1" />
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{label}</p>
                  <p className="text-xs font-bold text-[#111827] mt-0.5 leading-tight">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT col (3/5) ── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Carte du trajet */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col">
            {/* Map header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Map className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Carte du trajet</p>
              </div>
              {isActive && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-amber-700">En direct</span>
                </div>
              )}
            </div>

            {/* Route legend */}
            <div className="px-5 py-3 bg-[#FAFAFA] border-b border-[#F3F4F6]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-200 shrink-0" />
                  <span className="text-xs font-medium text-[#374151]">{course.depart}</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-300 via-orange-400 to-emerald-400 border-dashed" />
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0" />
                  <span className="text-xs font-medium text-[#374151]">{course.arrivee}</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-72 lg:h-96">
              <CourseDetailMapInner depart={course.depart} arrivee={course.arrivee} />
            </div>
          </div>

          {/* Trajet schématique */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Itinéraire</p>
              {isCompleted && (
                <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ≈ 8,4 km
                </span>
              )}
            </div>
            <div className="flex items-stretch gap-4">
              {/* visual line */}
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className="w-4 h-4 rounded-full bg-orange-500 ring-3 ring-orange-200 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="w-0.5 flex-1 my-1.5 bg-gradient-to-b from-orange-300 to-emerald-300 min-h-[40px]" />
                <div className="w-4 h-4 rounded-full bg-emerald-500 ring-3 ring-emerald-200 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              {/* addresses */}
              <div className="flex-1 space-y-4">
                <div className="bg-orange-50/60 rounded-xl p-3 border border-orange-100">
                  <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider mb-0.5">Point de départ</p>
                  <p className="text-sm font-bold text-[#111827]">{course.depart}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">Bamako, Mali</p>
                </div>
                <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-0.5">Point d&apos;arrivée</p>
                  <p className="text-sm font-bold text-[#111827]">{course.arrivee}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">Bamako, Mali</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerte annulation */}
          {isCancelled && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-700">Course annulée</p>
                <p className="text-xs text-rose-600 mt-0.5 leading-relaxed">
                  Cette course a été annulée le {course.date}. Si un paiement a été effectué, vous pouvez initier un remboursement via le bouton ci-dessus.
                </p>
              </div>
            </div>
          )}

          {/* Notes & commentaires */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5 text-[#6B7280]" />
              </div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">Notes internes</p>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter une note ou un commentaire sur cette course…"
              rows={3}
              className="w-full px-4 py-3 text-sm text-[#374151] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-[#FAFAFA] placeholder:text-[#D1D5DB] transition-all"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-[11px] text-[#9CA3AF]">{notes.length} caractères</p>
              <button
                disabled={!notes.trim()}
                onClick={() => toast.success('Note enregistrée', { description: 'La note interne a été sauvegardée.' })}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AlertDialog: Réaffecter ── */}
      <AlertDialog open={reassignDialog} onOpenChange={setReassignDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réaffecter la course</AlertDialogTitle>
            <AlertDialogDescription>
              La course <strong className="text-orange-700">{course.number}</strong> sera mise en file d&apos;attente et le chauffeur actuel sera notifié de l&apos;annulation de l&apos;affectation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setReassignDialog(false)
                toast.success('Course réaffectée', { description: `La course ${course.number} a été mise en file d'attente.` })
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Réaffecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── AlertDialog: Annuler ── */}
      <AlertDialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la course</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action annulera définitivement la course <strong className="text-rose-700">{course.number}</strong>. Cette opération est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setCancelDialog(false)
                toast.error('Course annulée', { description: `La course ${course.number} a été annulée.` })
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirmer l&apos;annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── AlertDialog: Rembourser ── */}
      <AlertDialog open={refundDialog} onOpenChange={setRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Initier un remboursement</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmer le remboursement de{' '}
              <strong className="text-orange-700">{course.prix}</strong> au passager{' '}
              <strong>{course.passager}</strong> pour la course {course.number}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRefundDialog(false)
                toast.success('Remboursement initié', { description: `${course.prix} seront remboursés à ${course.passager} sous 24-48h.` })
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Confirmer le remboursement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
