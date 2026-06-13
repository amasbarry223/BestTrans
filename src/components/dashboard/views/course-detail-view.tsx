'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Map,
  Navigation,
  CheckCircle2,
  XCircle,
  RotateCcw,
  User,
  Phone,
  Car,
  Route,
  Clock,
  CreditCard,
  Calendar,
  Timer,
  DollarSign,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'

/* ──────────── Status styling ──────────── */
const statutStyle: Record<string, { bg: string; text: string; dot: string }> = {
  'En attente': { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  'En cours': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Terminée': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Annulée': { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
}

/* ──────────── Timeline data builder ──────────── */
type StepStatus = 'done' | 'current' | 'pending'

interface TimelineStep {
  label: string
  time: string
  status: StepStatus
}

function buildTimeline(statut: string): TimelineStep[] {
  const steps: TimelineStep[] = [
    { label: 'Réservation', time: '', status: 'pending' },
    { label: 'Affectation', time: '', status: 'pending' },
    { label: 'Départ', time: '', status: 'pending' },
    { label: 'Arrivée', time: '', status: 'pending' },
  ]

  if (statut === 'En attente') {
    steps[0] = { label: 'Réservation', time: '05/03/2026 08:30', status: 'current' }
  } else if (statut === 'En cours') {
    steps[0] = { label: 'Réservation', time: '05/03/2026 08:30', status: 'done' }
    steps[1] = { label: 'Affectation', time: '05/03/2026 08:32', status: 'done' }
    steps[2] = { label: 'Départ', time: '05/03/2026 08:35', status: 'current' }
  } else if (statut === 'Terminée') {
    steps[0] = { label: 'Réservation', time: '05/03/2026 08:30', status: 'done' }
    steps[1] = { label: 'Affectation', time: '05/03/2026 08:32', status: 'done' }
    steps[2] = { label: 'Départ', time: '05/03/2026 08:35', status: 'done' }
    steps[3] = { label: 'Arrivée', time: '05/03/2026 08:58', status: 'done' }
  } else if (statut === 'Annulée') {
    steps[0] = { label: 'Réservation', time: '05/03/2026 08:30', status: 'done' }
    steps[1] = { label: 'Affectation', time: '—', status: 'pending' }
    steps[2] = { label: 'Annulée', time: '05/03/2026 08:31', status: 'current' }
    steps[3] = { label: 'Arrivée', time: '—', status: 'pending' }
  }

  return steps
}

/* ──────────── Mock extended data ──────────── */
const chauffeurDetails: Record<string, { phone: string; vehicle: string }> = {
  'Ibrahim Keita': { phone: '+223 70 12 34 56', vehicle: 'Toyota Corolla — ML-2345-AB' },
  'Moussa Sissoko': { phone: '+223 96 55 44 33', vehicle: 'Hyundai Accent — ML-6789-CD' },
  'Seydou Diabaté': { phone: '+223 95 88 77 66', vehicle: 'Kia Picanto — ML-3456-EF' },
  'Amadou Coulibaly': { phone: '+223 97 33 22 11', vehicle: 'Renault Logan — ML-7890-GH' },
  'Bakary Traoré': { phone: '+223 70 99 88 77', vehicle: 'Dacia Sandero — ML-4567-IJ' },
}

const passagerDetails: Record<string, { phone: string }> = {
  'Amadou Diallo': { phone: '+223 71 22 33 44' },
  'Fatoumata Traoré': { phone: '+223 72 33 44 55' },
  'Kadiatou Bah': { phone: '+223 73 44 55 66' },
  'Oumar Sidibé': { phone: '+223 74 55 66 77' },
  'Aminata Coulibaly': { phone: '+223 75 66 77 88' },
  'Mamadou Diarra': { phone: '+223 76 77 88 99' },
  'Rokia Dembélé': { phone: '+223 77 88 99 00' },
  'Drissa Sanogo': { phone: '+223 78 99 00 11' },
  'Awa Kamissoko': { phone: '+223 79 00 11 22' },
  'Boubacar Dia': { phone: '+223 80 11 22 33' },
  'Mariam Sacko': { phone: '+223 81 22 33 44' },
  'Salif Keita': { phone: '+223 82 33 44 55' },
}

/* ──────────── Component ──────────── */
export function CourseDetailView() {
  const { pendingCourse, clearPendingCourse, setActiveView } = useDashboard()
  const course = pendingCourse

  const [notes, setNotes] = useState('')

  const handleBack = () => {
    clearPendingCourse()
    setActiveView('courses')
  }

  /* No course selected */
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-[#6B7280]">
        <Map className="w-12 h-12" />
        <p className="text-sm">Aucune course sélectionnée</p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux courses
        </button>
      </div>
    )
  }

  const timeline = buildTimeline(course.statut)
  const st = statutStyle[course.statut] || statutStyle['En attente']
  const chauffeur = chauffeurDetails[course.chauffeur] || { phone: '+223 00 00 00 00', vehicle: 'N/A' }
  const passager = passagerDetails[course.passager] || { phone: '+223 00 00 00 00' }

  const isCompleted = course.statut === 'Terminée'
  const isCancelled = course.statut === 'Annulée'

  return (
    <div className="h-full flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#111827] font-mono">{course.number}</h2>
              <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full', st.bg, st.text)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />
                {course.statut}
              </span>
            </div>
            <p className="text-sm text-[#6B7280]">{course.depart} → {course.arrivee}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isCancelled && !isCompleted && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors">
              <XCircle className="w-4 h-4" /> Annuler
            </button>
          )}
          {!isCancelled && !isCompleted && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
              <Navigation className="w-4 h-4" /> Réaffecter
            </button>
          )}
          {(isCompleted || isCancelled) && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
              <RotateCcw className="w-4 h-4" /> Rembourser
            </button>
          )}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Chronologie</h3>
        <div className="relative">
          {timeline.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3 pb-5 last:pb-0">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center shrink-0">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  step.status === 'done' ? 'bg-emerald-100' :
                  step.status === 'current' ? 'bg-orange-100 ring-2 ring-orange-400' :
                  'bg-gray-100'
                )}>
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  ) : step.status === 'current' ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                {i < timeline.length - 1 && (
                  <div className={cn(
                    'w-0.5 h-8',
                    step.status === 'done' && timeline[i + 1].status !== 'pending' ? 'bg-emerald-300' :
                    step.status === 'done' ? 'bg-gray-200' : 'bg-gray-200'
                  )} />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 flex items-center justify-between pt-1">
                <p className={cn(
                  'text-sm font-medium',
                  step.status === 'done' ? 'text-emerald-700' :
                  step.status === 'current' ? 'text-orange-700' :
                  'text-[#9CA3AF]'
                )}>
                  {step.label}
                </p>
                <span className={cn(
                  'text-xs',
                  step.status === 'done' ? 'text-emerald-600 font-medium' :
                  step.status === 'current' ? 'text-orange-600 font-semibold' :
                  'text-[#9CA3AF]'
                )}>
                  {step.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Passager info */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" /> Passager
            </h3>
            <dl className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-700 font-bold text-sm shrink-0">
                  {course.passager.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <dt className="text-[10px] text-[#9CA3AF] uppercase">Nom</dt>
                  <dd className="text-sm font-medium text-[#111827]">{course.passager}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Phone className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span>{passager.phone}</span>
              </div>
            </dl>
          </div>

          {/* Chauffeur info */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-600" /> Chauffeur
            </h3>
            <dl className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                  {course.chauffeur.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <dt className="text-[10px] text-[#9CA3AF] uppercase">Nom</dt>
                  <dd className="text-sm font-medium text-[#111827]">{course.chauffeur}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Phone className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span>{chauffeur.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Car className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span>{chauffeur.vehicle}</span>
              </div>
            </dl>
          </div>

          {/* Trajet */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <Route className="w-4 h-4 text-orange-600" /> Trajet
            </h3>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <div className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-200" />
                <div className="w-0.5 h-8 bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <dt className="text-[10px] text-[#9CA3AF] uppercase">Départ</dt>
                  <dd className="text-sm font-medium text-[#111827]">{course.depart}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-[#9CA3AF] uppercase">Arrivée</dt>
                  <dd className="text-sm font-medium text-[#111827]">{course.arrivee}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Financial info */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" /> Prix & Paiement
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt className="text-[10px] text-[#9CA3AF] uppercase">Prix estimé</dt>
                <dd className="text-sm font-medium text-[#6B7280]">{course.prix}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#9CA3AF] uppercase">Prix final</dt>
                <dd className={cn(
                  'text-sm font-bold',
                  isCompleted ? 'text-orange-700' : 'text-[#111827]'
                )}>
                  {isCompleted ? course.prix : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#9CA3AF] uppercase">Mode de paiement</dt>
                <dd className="text-sm font-medium text-[#111827] flex items-center gap-1.5 mt-0.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  {course.modePaiement}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#9CA3AF] uppercase">Statut</dt>
                <dd>
                  <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', st.bg, st.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />
                    {course.statut}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Date & Duration */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" /> Date & Durée
            </h3>
            <dl className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <dt className="text-[#9CA3AF]">Date/heure :</dt>
                <dd className="font-medium text-[#111827]">{course.date}</dd>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Timer className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <dt className="text-[#9CA3AF]">Durée :</dt>
                <dd className="font-bold text-[#111827]">
                  {isCompleted ? '23 min' : isCancelled ? '—' : 'En cours...'}
                </dd>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <dt className="text-[#9CA3AF]">Attente :</dt>
                <dd className="font-medium text-[#111827]">2 min</dd>
              </div>
            </dl>
          </div>

          {/* Map placeholder */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <Map className="w-4 h-4 text-orange-600" /> Carte du trajet
            </h3>
            <div className="h-48 bg-gradient-to-br from-orange-50 to-sky-50 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-orange-600">Carte du trajet</p>
              <p className="text-[10px] text-[#9CA3AF]">Intégration Google Maps</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-600" /> Notes et commentaires
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ajouter une note ou un commentaire sur cette course..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
