'use client'

import { useState } from 'react'
import {
  Truck,
  Wrench,
  User,
  MapPin,
  Route,
  Search,
  Plus,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type VehicleType = 'Tracteur' | 'Camion' | 'Remorque'
type VehicleStatus = 'Disponible' | 'En mission' | 'En maintenance'
type MissionStatus = 'Préparée' | 'En route' | 'Livrée' | 'Retour'

const vehicleStatusStyle: Record<VehicleStatus, { bg: string; text: string }> = {
  'Disponible':   { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'En mission':   { bg: 'bg-amber-50',   text: 'text-amber-700' },
  'En maintenance': { bg: 'bg-rose-50',  text: 'text-rose-700' },
}

const missionStatusStyle: Record<MissionStatus, { bg: string; text: string; dot: string }> = {
  'Préparée': { bg: 'bg-sky-50',   text: 'text-sky-700',   dot: 'bg-sky-500' },
  'En route': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Livrée':   { bg: 'bg-emerald-50',text:'text-emerald-700',dot: 'bg-emerald-500' },
  'Retour':   { bg: 'bg-violet-50',text: 'text-violet-700', dot: 'bg-violet-500' },
}

const mockVehicles = [
  { id: '1', immat: 'ML-1234-AB', type: 'Tracteur' as VehicleType, capacite: '40T', status: 'En mission' as VehicleStatus, chauffeur: 'Amadou Coulibaly', visite: '15/06/2026', assurance: 'Valide' },
  { id: '2', immat: 'ML-5678-CD', type: 'Camion' as VehicleType, capacite: '25T', status: 'Disponible' as VehicleStatus, chauffeur: '—', visite: '22/08/2026', assurance: 'Valide' },
  { id: '3', immat: 'ML-9012-EF', type: 'Remorque' as VehicleType, capacite: '30T', status: 'En mission' as VehicleStatus, chauffeur: '—', visite: '03/04/2026', assurance: 'Valide' },
  { id: '4', immat: 'ML-3456-GH', type: 'Tracteur' as VehicleType, capacite: '40T', status: 'En maintenance' as VehicleStatus, chauffeur: '—', visite: 'Expirée', assurance: 'Renouveler' },
  { id: '5', immat: 'ML-7890-IJ', type: 'Camion' as VehicleType, capacite: '20T', status: 'Disponible' as VehicleStatus, chauffeur: '—', visite: '18/09/2026', assurance: 'Valide' },
  { id: '6', immat: 'ML-2345-KL', type: 'Remorque' as VehicleType, capacite: '35T', status: 'En mission' as VehicleStatus, chauffeur: '—', visite: '30/07/2026', assurance: 'Valide' },
]

const mockChauffeurs = [
  { id: '1', name: 'Amadou Coulibaly', permis: 'C+E', validite: '12/2026', perDiem: '15 000 FCFA/j', mission: 'TRS-2026-0142' },
  { id: '2', name: 'Ibrahim Traoré', permis: 'C', validite: '08/2026', perDiem: '12 000 FCFA/j', mission: '—' },
  { id: '3', name: 'Moussa Keita', permis: 'C+E', validite: '03/2027', perDiem: '15 000 FCFA/j', mission: 'TRS-2026-0139' },
  { id: '4', name: 'Oumar Sidibé', permis: 'C', validite: '06/2026', perDiem: '12 000 FCFA/j', mission: '—' },
]

const mockMissions = [
  { id: '1', number: 'MSN-2026-0045', dossier: 'TRS-2026-0142', vehicle: 'ML-1234-AB', chauffeur: 'Amadou Coulibaly', corridor: 'Dakar → Bamako', depart: 'Bamako', destination: 'Dakar', status: 'En route' as MissionStatus, dateDepart: '06/03/2026', eta: '10/03/2026', frais: '850 000 FCFA' },
  { id: '2', number: 'MSN-2026-0044', dossier: 'TRS-2026-0139', vehicle: 'ML-9012-EF', chauffeur: 'Moussa Keita', corridor: 'Lomé → Bamako', depart: 'Bamako', destination: 'Lomé', status: 'En route' as MissionStatus, dateDepart: '05/03/2026', eta: '11/03/2026', frais: '1 200 000 FCFA' },
  { id: '3', number: 'MSN-2026-0043', dossier: 'TRS-2026-0136', vehicle: 'ML-5678-CD', chauffeur: 'Ibrahim Traoré', corridor: 'Abidjan → Bamako', depart: 'Bamako', destination: 'Abidjan', status: 'Livrée' as MissionStatus, dateDepart: '01/03/2026', eta: '04/03/2026', frais: '950 000 FCFA' },
  { id: '4', number: 'MSN-2026-0042', dossier: 'TRS-2026-0135', vehicle: 'ML-2345-KL', chauffeur: 'Oumar Sidibé', corridor: 'Tema → Bamako', depart: 'Bamako', destination: 'Tema', status: 'Préparée' as MissionStatus, dateDepart: '09/03/2026', eta: '—', frais: '1 400 000 FCFA' },
]

const flotteStats = [
  { label: 'Véhicules actifs', value: '6', icon: Truck, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'En mission', value: '3', icon: Route, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'En maintenance', value: '1', icon: Wrench, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Chauffeurs', value: '4', icon: User, color: 'text-sky-600', bg: 'bg-sky-50' },
]

const missionStats = [
  { label: 'Missions en cours', value: '2', icon: Route, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Livrées ce mois', value: '8', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'En préparation', value: '1', icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50' },
]

export function TransportView() {
  const [activeTab, setActiveTab] = useState<'flotte' | 'missions'>('flotte')

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('flotte')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'flotte' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50'
          )}
        >
          <Truck className="w-4 h-4 inline mr-1.5" />Flotte
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'missions' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50'
          )}
        >
          <Route className="w-4 h-4 inline mr-1.5" />Missions
        </button>
      </div>

      {activeTab === 'flotte' ? (
        <>
          {/* Flotte Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {flotteStats.map((s) => {
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

          {/* Vehicle List */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#111827]">Véhicules</h3>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
                <Plus className="w-4 h-4" /> Ajouter véhicule
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockVehicles.map((v) => {
                const sty = vehicleStatusStyle[v.status]
                return (
                  <div key={v.id} className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-teal-600" />
                        <span className="font-bold text-sm text-[#111827] font-mono">{v.immat}</span>
                      </div>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', sty.bg, sty.text)}>{v.status}</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#6B7280]">
                      <div className="flex justify-between">
                        <span>Type</span><span className="font-medium text-[#111827]">{v.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacité</span><span className="font-medium text-[#111827]">{v.capacite}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chauffeur</span><span className="font-medium text-[#111827]">{v.chauffeur}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Visite tech.</span>
                        <span className={cn('font-medium', v.visite === 'Expirée' ? 'text-rose-600' : 'text-[#111827]')}>
                          {v.visite === 'Expirée' && <AlertTriangle className="w-3 h-3 inline mr-1" />}{v.visite}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assurance</span>
                        <span className={cn('font-medium', v.assurance === 'Renouveler' ? 'text-amber-600' : 'text-emerald-600')}>
                          {v.assurance}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chauffeurs */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Chauffeurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockChauffeurs.map((ch) => (
                <div key={ch.id} className="flex items-center gap-3 border border-[#E5E7EB] rounded-lg p-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
                    {ch.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827]">{ch.name}</p>
                    <p className="text-xs text-[#6B7280]">Permis {ch.permis} · Val. {ch.validite}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#111827]">{ch.perDiem}</p>
                    <p className={cn('text-[10px] font-semibold', ch.mission === '—' ? 'text-emerald-600' : 'text-amber-600')}>
                      {ch.mission === '—' ? 'Disponible' : ch.mission}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mission Stats */}
          <div className="grid grid-cols-3 gap-4">
            {missionStats.map((s) => {
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

          {/* Missions */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#111827]">Missions de transport</h3>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
                <Plus className="w-4 h-4" /> Nouvelle Mission
              </button>
            </div>
            <div className="space-y-3">
              {mockMissions.map((m) => {
                const sty = missionStatusStyle[m.status]
                return (
                  <div key={m.id} className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-teal-700">{m.number}</span>
                        <span className="text-xs text-[#6B7280]">Dossier: {m.dossier}</span>
                      </div>
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit', sty.bg, sty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                        {m.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-1.5">
                        <Route className="w-3.5 h-3.5" />
                        <span className="font-medium text-[#111827]">{m.corridor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{m.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{m.chauffeur}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{m.dateDepart} → {m.eta}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[#111827]">{m.frais}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
