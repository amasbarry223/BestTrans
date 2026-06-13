'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Car, MapPin, Clock, Activity, Layers, Navigation,
  User, Star, ChevronRight, Radio, AlertCircle,
  ArrowRight, RefreshCw, Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { DriverMarker, DemandMarker } from './carte-map-inner'

/* ─── Dynamic map (no SSR) ─── */
const MapComponent = dynamic(() => import('./carte-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-orange-50/40 rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-orange-600 font-semibold">Chargement de la carte…</span>
      </div>
    </div>
  ),
})

/* ─────────────────────────── types ─────────────────────────── */

type DriverStatus = 'En course' | 'Disponible' | 'Hors ligne'
type SideTab = 'chauffeurs' | 'courses' | 'demandes'

interface Driver extends DriverMarker {
  status: DriverStatus
  heureConnexion: string
  coursesToday: number
}

interface CourseActive {
  id: string
  passager: string
  telephone: string
  chauffeurId: string
  chauffeur: string
  origine: string
  destination: string
  prix: string
  tempsEcoule: string
  progression: number
}

interface Demande extends DemandMarker {
  telephone: string
}

/* ─────────────────────────── seed data ─────────────────────────── */

const DRIVERS_SEED: Driver[] = [
  { id: 'CH-1042', name: 'Amadou Keïta',      zone: 'Kalaban-Coura',  status: 'En course',  vehicle: 'Toyota Corolla — BK 4821 A', lat: 12.6100, lng: -8.0150, courseId: 'BT-0847', destination: 'Hamdallaye',    note: 4.8, heureConnexion: '07h14', coursesToday: 6  },
  { id: 'CH-1087', name: 'Fatoumata Diallo',  zone: 'Badalabougou',   status: 'Disponible', vehicle: 'Hyundai Accent — BK 2209 C', lat: 12.6350, lng: -7.9980, note: 4.6, heureConnexion: '06h52', coursesToday: 4  },
  { id: 'CH-1123', name: 'Ibrahim Traoré',    zone: 'Hamdallaye',     status: 'En course',  vehicle: 'Renault Logan — BK 7734 B',  lat: 12.6500, lng: -8.0300, courseId: 'BT-0851', destination: 'Kalaban-Coura', note: 4.5, heureConnexion: '07h30', coursesToday: 5  },
  { id: 'CH-0956', name: 'Mariam Coulibaly',  zone: 'Sébenikoro',     status: 'En course',  vehicle: 'Peugeot 208 — BK 5517 A',   lat: 12.6200, lng: -8.0050, courseId: 'BT-0849', destination: 'Badalabougou', note: 4.9, heureConnexion: '07h05', coursesToday: 7  },
  { id: 'CH-0734', name: 'Oumar Sidibé',      zone: 'Lafiabougou',    status: 'Disponible', vehicle: 'Kia Picanto — BK 1102 D',    lat: 12.6450, lng: -8.0400, note: 4.3, heureConnexion: '08h10', coursesToday: 3  },
  { id: 'CH-1201', name: 'Daouda Camara',     zone: 'Korofina',       status: 'En course',  vehicle: 'Nissan Almera — BK 9900 B',  lat: 12.6700, lng: -7.9800, courseId: 'BT-0845', destination: 'Sébenikoro',   note: 4.7, heureConnexion: '06h40', coursesToday: 8  },
  { id: 'CH-0881', name: 'Awa Traoré',        zone: 'Magnambougou',   status: 'Disponible', vehicle: 'Toyota Yaris — BK 3345 C',   lat: 12.6050, lng: -7.9900, note: 4.4, heureConnexion: '07h55', coursesToday: 2  },
  { id: 'CH-1334', name: 'Bakary Sissoko',    zone: 'Banconi',        status: 'Hors ligne', vehicle: 'Dacia Sandero — BK 6678 A',  lat: 12.6800, lng: -8.0100, note: 4.1, heureConnexion: '—',     coursesToday: 0  },
]

const COURSES_ACTIVES: CourseActive[] = [
  { id: 'BT-0847', passager: 'Salif Dembélé',   telephone: '+223 76 44 11 22', chauffeurId: 'CH-1042', chauffeur: 'Amadou Keïta',    origine: 'Kalaban-Coura',  destination: 'Hamdallaye',    prix: '3 200 FCFA', tempsEcoule: '12 min', progression: 60 },
  { id: 'BT-0851', passager: 'Rokia Keïta',      telephone: '+223 66 78 90 12', chauffeurId: 'CH-1123', chauffeur: 'Ibrahim Traoré',  origine: 'Hamdallaye',     destination: 'Kalaban-Coura', prix: '2 800 FCFA', tempsEcoule: '8 min',  progression: 40 },
  { id: 'BT-0849', passager: 'Cheick Doumbia',   telephone: '+223 79 22 33 44', chauffeurId: 'CH-0956', chauffeur: 'Mariam Coulibaly',origine: 'Sébenikoro',     destination: 'Badalabougou', prix: '1 900 FCFA', tempsEcoule: '5 min',  progression: 25 },
  { id: 'BT-0845', passager: 'Aminata Touré',    telephone: '+223 65 55 77 88', chauffeurId: 'CH-1201', chauffeur: 'Daouda Camara',   origine: 'Korofina',       destination: 'Sébenikoro',   prix: '4 100 FCFA', tempsEcoule: '18 min', progression: 80 },
]

const DEMANDES_SEED: Demande[] = [
  { id: 'DEM-001', passager: 'Modibo Kouyaté',  telephone: '+223 76 33 00 11', origine: 'Quinzambougou', destination: 'Hippodrome',    prixEstime: '2 500 FCFA', tempsAttente: '3 min', lat: 12.6600, lng: -8.0000 },
  { id: 'DEM-002', passager: 'Nana Diarra',      telephone: '+223 66 78 45 90', origine: 'Point G',       destination: 'Kalaban-Coura', prixEstime: '3 800 FCFA', tempsAttente: '5 min', lat: 12.6750, lng: -8.0200 },
  { id: 'DEM-003', passager: 'Souleymane Barry', telephone: '+223 79 22 33 44', origine: 'Djelibougou',   destination: 'Badalabougou', prixEstime: '2 100 FCFA', tempsAttente: '7 min', lat: 12.6620, lng: -8.0350 },
]

/* ─────────────────────────── status config ─────────────────────────── */

const STATUS_CFG: Record<DriverStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  'En course':  { label: 'En course',  dot: 'bg-orange-500 animate-pulse', bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  'Disponible': { label: 'Disponible', dot: 'bg-emerald-500',              bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Hors ligne': { label: 'Hors ligne', dot: 'bg-gray-400',                 bg: 'bg-gray-100',   text: 'text-gray-500',    border: 'border-gray-200' },
}

/* ─────────────────────────── main ─────────────────────────── */

export function CarteOperationsView() {
  const [drivers, setDrivers]       = useState<Driver[]>(DRIVERS_SEED)
  const [demandes]                  = useState<Demande[]>(DEMANDES_SEED)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab]   = useState<SideTab>('chauffeurs')
  const [layer, setLayer]           = useState<'streets' | 'satellite'>('streets')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [secAgo, setSecAgo]         = useState(0)

  /* Simulate GPS movement every 4s */
  useEffect(() => {
    const id = setInterval(() => {
      setDrivers(prev => prev.map(d =>
        d.status !== 'En course' ? d : {
          ...d,
          lat: d.lat + (Math.random() - 0.5) * 0.0015,
          lng: d.lng + (Math.random() - 0.5) * 0.0015,
        }
      ))
      setLastUpdate(new Date())
      setSecAgo(0)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  /* Update "X sec ago" counter */
  useEffect(() => {
    const id = setInterval(() => {
      setSecAgo(Math.round((Date.now() - lastUpdate.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [lastUpdate])

  /* Derived */
  const enCourse   = drivers.filter(d => d.status === 'En course').length
  const disponible = drivers.filter(d => d.status === 'Disponible').length
  const horsligne  = drivers.filter(d => d.status === 'Hors ligne').length
  const total      = drivers.length

  /* Tab counts */
  const TABS: { key: SideTab; label: string; count: number; icon: React.ElementType }[] = [
    { key: 'chauffeurs', label: 'Chauffeurs',      count: total,              icon: Car      },
    { key: 'courses',    label: 'Courses actives', count: COURSES_ACTIVES.length, icon: Navigation },
    { key: 'demandes',   label: 'Demandes',        count: demandes.length,    icon: User     },
  ]

  const handleAssign = (dem: Demande) => {
    toast.success('Demande assignée', { description: `Un chauffeur disponible a été notifié pour ${dem.passager}.` })
  }

  const handleContact = (phone: string, name: string) => {
    toast.info(`Contact : ${name}`, { description: phone })
  }

  const selectedDriver = drivers.find(d => d.id === selectedId) ?? null

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 120px)', minHeight: 620 }}>

      {/* ═══ TOP BAR ═══ */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* KPIs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#374151]">
            <Car className="w-3.5 h-3.5 text-[#9CA3AF]" />{total} en ligne
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-700">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />{enCourse} en course
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />{disponible} disponibles
          </div>
          {horsligne > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />{horsligne} hors ligne
            </div>
          )}
          {demandes.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
              <AlertCircle className="w-3.5 h-3.5" />{demandes.length} en attente
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="font-medium">En direct</span>
            <span>· il y a {secAgo}s</span>
          </div>
          <button
            onClick={() => setLayer(l => l === 'streets' ? 'satellite' : 'streets')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg hover:border-orange-300 hover:text-orange-600 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            {layer === 'streets' ? 'Satellite' : 'Carte'}
          </button>
        </div>
      </div>

      {/* ═══ MAIN: SIDEBAR + MAP ═══ */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">

        {/* ─── LEFT SIDEBAR ─── */}
        <div className="w-full lg:w-[280px] lg:shrink-0 h-64 lg:h-auto order-2 lg:order-1 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col overflow-hidden">

          {/* Tab bar */}
          <div className="flex border-b border-[#F3F4F6] p-1.5 gap-1 shrink-0">
            {TABS.map(t => {
              const Ic = t.icon
              const on = activeTab === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all',
                    on ? 'bg-orange-600 text-white shadow-sm' : 'text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F9FAFB]',
                  )}
                >
                  <Ic className="w-4 h-4" />
                  <span>{t.label}</span>
                  <span className={cn(
                    'text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none',
                    on ? 'bg-white/25 text-white' : 'bg-[#F3F4F6] text-[#6B7280]',
                  )}>{t.count}</span>
                </button>
              )
            })}
          </div>

          {/* ── Tab: Chauffeurs ── */}
          {activeTab === 'chauffeurs' && (
            <div className="flex-1 overflow-y-auto">
              {/* Group by status */}
              {(['En course', 'Disponible', 'Hors ligne'] as DriverStatus[]).map(status => {
                const group = drivers.filter(d => d.status === status)
                if (group.length === 0) return null
                const cfg = STATUS_CFG[status]
                return (
                  <div key={status}>
                    <div className="px-4 py-2 bg-[#F9FAFB] border-b border-[#F3F4F6]">
                      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                        {status} · {group.length}
                      </p>
                    </div>
                    {group.map(d => {
                      const isSel = selectedId === d.id
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelectedId(isSel ? null : d.id)}
                          className={cn(
                            'w-full text-left px-4 py-3 border-b border-[#F9FAFB] transition-colors',
                            isSel ? 'bg-orange-50' : 'hover:bg-[#FAFAFA]',
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Avatar */}
                            <div className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0',
                              isSel ? 'bg-orange-100 text-orange-700' : 'bg-[#F3F4F6] text-[#6B7280]',
                            )}>
                              {d.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className={cn('text-xs font-bold truncate', isSel ? 'text-orange-700' : 'text-[#111827]')}>{d.name}</p>
                                <span className="text-[10px] text-[#9CA3AF] shrink-0 flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 text-amber-400" />{d.note}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{d.vehicle}</p>
                              {d.courseId ? (
                                <p className="text-[10px] text-orange-600 font-semibold mt-1 flex items-center gap-1 truncate">
                                  <Navigation className="w-3 h-3 shrink-0" />
                                  {d.courseId} → {d.destination}
                                </p>
                              ) : d.status === 'Disponible' ? (
                                <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 shrink-0" />{d.zone}
                                </p>
                              ) : (
                                <p className="text-[10px] text-[#C4C9D4] mt-1">
                                  Connecté à {d.heureConnexion}
                                </p>
                              )}
                            </div>
                            <ChevronRight className={cn('w-3.5 h-3.5 shrink-0 transition-colors mt-0.5', isSel ? 'text-orange-500' : 'text-[#D1D5DB]')} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Tab: Courses actives ── */}
          {activeTab === 'courses' && (
            <div className="flex-1 overflow-y-auto">
              {COURSES_ACTIVES.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center px-4">
                  <Navigation className="w-8 h-8 text-[#E5E7EB]" />
                  <p className="text-xs text-[#9CA3AF]">Aucune course active pour le moment.</p>
                </div>
              ) : COURSES_ACTIVES.map(c => {
                const isSel = selectedId === c.chauffeurId
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(isSel ? null : c.chauffeurId)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-[#F9FAFB] transition-colors',
                      isSel ? 'bg-orange-50' : 'hover:bg-[#FAFAFA]',
                    )}
                  >
                    {/* Course header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full', isSel ? 'bg-orange-100 text-orange-700' : 'bg-[#F3F4F6] text-[#6B7280]')}>
                        {c.id}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                        <Clock className="w-3 h-3" />{c.tempsEcoule}
                      </span>
                    </div>
                    {/* Route */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="flex flex-col items-center gap-0.5 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="w-0.5 h-3 bg-[#E5E7EB]" />
                        <span className="w-2 h-2 rounded-full border-2 border-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#6B7280] truncate">{c.origine}</p>
                        <p className="text-[10px] font-semibold text-[#111827] truncate mt-1">{c.destination}</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-[#F3F4F6] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${c.progression}%` }} />
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-[#6B7280] truncate">{c.chauffeur}</p>
                      <p className="text-[10px] font-bold text-orange-600">{c.prix}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Tab: Demandes en attente ── */}
          {activeTab === 'demandes' && (
            <div className="flex-1 overflow-y-auto">
              {demandes.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center px-4">
                  <User className="w-8 h-8 text-[#E5E7EB]" />
                  <p className="text-xs text-[#9CA3AF]">Aucun passager en attente.</p>
                </div>
              ) : demandes.map(d => (
                <div key={d.id} className="px-4 py-3.5 border-b border-[#F9FAFB]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <p className="text-xs font-bold text-[#111827]">{d.passager}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{d.tempsAttente}
                    </span>
                  </div>
                  {/* Route */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="w-0.5 h-3 bg-[#E5E7EB]" />
                      <span className="w-2 h-2 rounded-full border-2 border-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] truncate">{d.origine}</p>
                      <p className="text-[10px] font-semibold text-[#111827] truncate mt-1">{d.destination}</p>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 shrink-0">{d.prixEstime}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleAssign(d)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-orange-600 text-white text-[10px] font-bold hover:bg-orange-700 transition-colors"
                    >
                      <Car className="w-3 h-3" />Assigner
                    </button>
                    <button
                      onClick={() => handleContact(d.telephone, d.passager)}
                      className="flex items-center justify-center w-8 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:border-orange-300 hover:text-orange-600 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sidebar footer */}
          {activeTab === 'chauffeurs' && selectedDriver && (
            <div className="shrink-0 border-t border-[#F3F4F6] p-3 bg-orange-50">
              <p className="text-[10px] font-black text-orange-700 uppercase tracking-wider mb-1.5">Sélectionné</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#111827]">{selectedDriver.name}</p>
                  <p className="text-[10px] text-[#6B7280]">{selectedDriver.coursesToday} courses · ★ {selectedDriver.note}</p>
                </div>
                <button
                  onClick={() => handleContact('', selectedDriver.name)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-orange-200 text-orange-600 text-[10px] font-bold hover:bg-orange-50 transition-colors"
                >
                  <Phone className="w-3 h-3" />Contacter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── MAP ─── */}
        <div className="flex-1 min-h-[300px] lg:min-h-0 order-1 lg:order-2 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm relative min-w-0">
          <MapComponent
            drivers={drivers}
            demandes={demandes}
            selectedId={selectedId}
            onSelectDriver={setSelectedId}
            layer={layer}
          />

          {/* Map legend overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-xl px-3 py-2.5 shadow-md">
            <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-wider mb-1.5">Légende</p>
            <div className="flex flex-col gap-1">
              {[
                { color: 'bg-orange-500', label: 'En course' },
                { color: 'bg-emerald-500', label: 'Disponible' },
                { color: 'bg-gray-400',   label: 'Hors ligne' },
                { color: 'bg-blue-500',   label: 'Passager en attente' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', color)} />
                  <span className="text-[10px] text-[#374151] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity badge */}
          <div className="absolute top-3 right-3 z-[1000]">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-sm text-[10px] font-semibold text-[#374151]">
              <Activity className="w-3 h-3 text-orange-500" />
              {enCourse} course{enCourse > 1 ? 's' : ''} en cours · Bamako
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
