'use client'

import { useState } from 'react'
import {
  Route,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp,
  Navigation,
  Timer,
  FileText,
  Shield,
  BarChart3,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CorridorStatus = 'Normal' | 'Ralenti' | 'Bloqué'
type BAXStatus = 'Embarquement' | 'En transit' | 'Poste frontalier' | 'Dédouanement' | 'Livré'

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const corridors = [
  {
    id: '1',
    name: 'Dakar → Bamako',
    distance: '1 200 km',
    pays: 'Sénégal',
    posteFrontalier: 'Diboli',
    status: 'Normal' as CorridorStatus,
    delaiMoyen: '5,2 j',
    benchmark: '5 j',
    dossiersEnTransit: 12,
    tempsAttenteFrontiere: '2h',
    etatRoute: 'Bon',
    derniereMaj: 'Il y a 30 min',
    color: '#0d9488',
    tempsEstime: '5-6 jours',
  },
  {
    id: '2',
    name: 'Abidjan → Bamako',
    distance: '1 100 km',
    pays: "Côte d'Ivoire",
    posteFrontalier: 'Zégoua',
    status: 'Ralenti' as CorridorStatus,
    delaiMoyen: '4,8 j',
    benchmark: '4 j',
    dossiersEnTransit: 8,
    tempsAttenteFrontiere: '6h',
    etatRoute: 'Moyen',
    derniereMaj: 'Il y a 1h',
    color: '#0ea5e9',
    tempsEstime: '4-5 jours',
  },
  {
    id: '3',
    name: 'Lomé → Bamako',
    distance: '1 500 km',
    pays: 'Togo',
    posteFrontalier: 'Cinkassé',
    status: 'Normal' as CorridorStatus,
    delaiMoyen: '6,1 j',
    benchmark: '6 j',
    dossiersEnTransit: 5,
    tempsAttenteFrontiere: '1h30',
    etatRoute: 'Bon',
    derniereMaj: 'Il y a 45 min',
    color: '#f59e0b',
    tempsEstime: '6-7 jours',
  },
  {
    id: '4',
    name: 'Tema → Bamako',
    distance: '1 600 km',
    pays: 'Ghana',
    posteFrontalier: 'Paga',
    status: 'Bloqué' as CorridorStatus,
    delaiMoyen: '8,5 j',
    benchmark: '7 j',
    dossiersEnTransit: 3,
    tempsAttenteFrontiere: '24h+',
    etatRoute: 'Mauvais',
    derniereMaj: 'Il y a 3h',
    color: '#8b5cf6',
    tempsEstime: '7-9 jours',
  },
  {
    id: '5',
    name: 'Conakry → Bamako',
    distance: '1 300 km',
    pays: 'Guinée',
    posteFrontalier: 'Kourémalé',
    status: 'Ralenti' as CorridorStatus,
    delaiMoyen: '5,8 j',
    benchmark: '5 j',
    dossiersEnTransit: 4,
    tempsAttenteFrontiere: '8h',
    etatRoute: 'Moyen',
    derniereMaj: 'Il y a 2h',
    color: '#f43f5e',
    tempsEstime: '5-6 jours',
  },
]

const corridorDossiers: Record<string, { bl: string; client: string; merchandise: string; status: string }[]> = {
  '1': [
    { bl: 'MSCU-2026-44721', client: 'SOCOPAO Mali', merchandise: 'Matériel agricole', status: 'En transit' },
    { bl: 'MSCU-2026-44735', client: 'MALI TEXTILES', merchandise: 'Tissus & vêtements', status: 'Poste frontalier' },
    { bl: 'MAEU-2026-88312', client: 'TOTAL MALI', merchandise: 'Produits pétroliers', status: 'En transit' },
    { bl: 'MSCU-2026-44798', client: 'BRAMALI', merchandise: 'Ciments & matériaux', status: 'En transit' },
  ],
  '2': [
    { bl: 'CMAU-2026-55102', client: 'PHARMACIE POPULAIRE', merchandise: 'Produits pharmaceutiques', status: 'Poste frontalier' },
    { bl: 'CMAU-2026-55118', client: 'SOMADIA', merchandise: 'Noix de cajou', status: 'En transit' },
    { bl: 'OOLU-2026-77234', client: 'CMA CGM Mali', merchandise: 'Conteneurs 40\' HC', status: 'En transit' },
  ],
  '3': [
    { bl: 'MAEU-2026-88456', client: 'MAERSK MALI', merchandise: 'Marchandises diverses', status: 'En transit' },
    { bl: 'TCLU-2026-33012', client: 'ORANGE MALI', merchandise: 'Équipements télécom', status: 'Dédouanement' },
  ],
  '4': [
    { bl: 'MSCU-2026-44901', client: 'SOMAGEP', merchandise: 'Équipements hydrauliques', status: 'Poste frontalier' },
    { bl: 'MAEU-2026-88567', client: 'EDM SA', merchandise: 'Transformateurs', status: 'Bloqué frontière' },
  ],
  '5': [
    { bl: 'CMAU-2026-55301', client: 'GUINÉA MALI SARL', merchandise: 'Produits miniers', status: 'En transit' },
    { bl: 'OOLU-2026-77456', client: 'FRIAL SA', merchandise: 'Produits alimentaires', status: 'Poste frontalier' },
  ],
}

const baxEntries = [
  {
    id: '1',
    baxNumber: 'BAX-DKR-2026-0142',
    corridor: 'Dakar → Bamako',
    corridorId: '1',
    status: 'En transit' as BAXStatus,
    progression: 65,
    bl: 'MSCU-2026-44721',
    client: 'SOCOPAO Mali',
    currentPosition: 'Kayes (Mali)',
    eta: '09 Mars 2026',
  },
  {
    id: '2',
    baxNumber: 'BAX-ABJ-2026-0089',
    corridor: 'Abidjan → Bamako',
    corridorId: '2',
    status: 'Poste frontalier' as BAXStatus,
    progression: 80,
    bl: 'CMAU-2026-55102',
    client: 'PHARMACIE POPULAIRE',
    currentPosition: 'Zégoua (frontière)',
    eta: '08 Mars 2026',
  },
  {
    id: '3',
    baxNumber: 'BAX-LME-2026-0034',
    corridor: 'Lomé → Bamako',
    corridorId: '3',
    status: 'Embarquement' as BAXStatus,
    progression: 15,
    bl: 'MAEU-2026-88456',
    client: 'MAERSK MALI',
    currentPosition: 'Port de Lomé',
    eta: '14 Mars 2026',
  },
  {
    id: '4',
    baxNumber: 'BAX-TEMA-2026-0015',
    corridor: 'Tema → Bamako',
    corridorId: '4',
    status: 'Poste frontalier' as BAXStatus,
    progression: 70,
    bl: 'MSCU-2026-44901',
    client: 'SOMAGEP',
    currentPosition: 'Paga (frontière Ghana/Burkina)',
    eta: '12 Mars 2026',
  },
  {
    id: '5',
    baxNumber: 'BAX-CKY-2026-0023',
    corridor: 'Conakry → Bamako',
    corridorId: '5',
    status: 'Dédouanement' as BAXStatus,
    progression: 90,
    bl: 'CMAU-2026-55301',
    client: 'GUINÉA MALI SARL',
    currentPosition: 'Bamako-Sénou',
    eta: '07 Mars 2026',
  },
]

/* ------------------------------------------------------------------ */
/*  Style Maps                                                         */
/* ------------------------------------------------------------------ */

const corridorStatusStyle: Record<CorridorStatus, { bg: string; text: string; dot: string; border: string }> = {
  'Normal':  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  'Ralenti': { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   border: 'border-amber-200' },
  'Bloqué':  { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500',     border: 'border-rose-200' },
}

const corridorStatusIcon: Record<CorridorStatus, typeof CheckCircle2> = {
  'Normal': CheckCircle2,
  'Ralenti': AlertTriangle,
  'Bloqué': AlertTriangle,
}

const etatRouteStyle: Record<string, { bg: string; text: string; dot: string }> = {
  'Bon':    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Moyen':  { bg: 'bg-amber-50',   text: 'text-amber-700', dot: 'bg-amber-500' },
  'Mauvais': { bg: 'bg-rose-50',   text: 'text-rose-700', dot: 'bg-rose-500' },
}

const baxStatusStyle: Record<BAXStatus, { bg: string; text: string; dot: string }> = {
  'Embarquement':     { bg: 'bg-sky-50',    text: 'text-sky-700',    dot: 'bg-sky-500' },
  'En transit':       { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  'Poste frontalier': { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  'Dédouanement':     { bg: 'bg-teal-50',   text: 'text-teal-700',   dot: 'bg-teal-500' },
  'Livré':            { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

const statsConfig = [
  {
    label: 'Dossiers en transit',
    value: '32',
    icon: Truck,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    label: 'Délai moyen global',
    value: '5,8 j',
    icon: Timer,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    label: 'Dossiers ce mois',
    value: '47',
    icon: FileText,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Alertes corridor',
    value: '2',
    icon: AlertTriangle,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CorridorsView() {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string | null>(null)

  const selectedCorridor = selectedCorridorId
    ? corridors.find((c) => c.id === selectedCorridorId) ?? null
    : null

  const selectedDossiers = selectedCorridorId
    ? corridorDossiers[selectedCorridorId] ?? []
    : []

  return (
    <div className="h-full flex flex-col gap-5">
      {/* ---- Stats Row ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
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

      {/* ---- Corridor Cards Section ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Route className="w-4.5 h-4.5 text-teal-600" />
            <h3 className="text-sm font-semibold text-[#111827]">Corridors de transit</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
              {corridors.length}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#9CA3AF]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Ralenti
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Bloqué
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {corridors.map((corridor) => {
            const sty = corridorStatusStyle[corridor.status]
            const StatusIcon = corridorStatusIcon[corridor.status]
            const isSelected = selectedCorridorId === corridor.id
            const isOverBenchmark = parseFloat(corridor.delaiMoyen.replace(',', '.')) > parseFloat(corridor.benchmark.replace(',', '.'))

            return (
              <div
                key={corridor.id}
                onClick={() => setSelectedCorridorId(isSelected ? null : corridor.id)}
                className={cn(
                  'border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
                  isSelected
                    ? 'border-teal-300 ring-2 ring-teal-100 shadow-md'
                    : 'border-[#E5E7EB] hover:border-teal-200'
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: corridor.color }}
                    />
                    <div>
                      <p className="text-sm font-bold text-[#111827]">{corridor.name}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{corridor.pays}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                      sty.bg,
                      sty.text
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {corridor.status}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> Distance
                    </span>
                    <span className="font-semibold text-[#111827]">{corridor.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Temps estimé
                    </span>
                    <span className="font-semibold text-[#111827]">{corridor.tempsEstime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Dossiers en transit
                    </span>
                    <span className="font-bold text-teal-700">{corridor.dossiersEnTransit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] flex items-center gap-1">
                      <Timer className="w-3 h-3" /> Délai moyen
                    </span>
                    <span className={cn('font-semibold', isOverBenchmark ? 'text-amber-600' : 'text-emerald-600')}>
                      {corridor.delaiMoyen}
                      <span className="text-[#9CA3AF] font-normal ml-1">(ref: {corridor.benchmark})</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Poste frontalier
                    </span>
                    <span className="font-medium text-[#111827]">{corridor.posteFrontalier}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9CA3AF] flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Attente frontière
                    </span>
                    <span
                      className={cn(
                        'font-semibold',
                        corridor.tempsAttenteFrontiere === '24h+'
                          ? 'text-rose-600'
                          : corridor.tempsAttenteFrontiere.includes('h') &&
                            parseInt(corridor.tempsAttenteFrontiere) >= 6
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                      )}
                    >
                      {corridor.tempsAttenteFrontiere}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        etatRouteStyle[corridor.etatRoute]?.dot ?? 'bg-gray-400'
                      )}
                      style={{
                        backgroundColor:
                          corridor.etatRoute === 'Bon'
                            ? '#10b981'
                            : corridor.etatRoute === 'Moyen'
                              ? '#f59e0b'
                              : '#f43f5e',
                      }}
                    />
                    <span className="text-[11px] text-[#9CA3AF]">Route: </span>
                    <span
                      className={cn(
                        'text-[11px] font-medium',
                        etatRouteStyle[corridor.etatRoute]?.text ?? 'text-gray-600'
                      )}
                    >
                      {corridor.etatRoute}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF]">{corridor.derniereMaj}</span>
                </div>

                {/* Expand indicator */}
                <div className="flex justify-center mt-2">
                  {isSelected ? (
                    <ChevronUp className="w-4 h-4 text-teal-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ---- Corridor Detail Panel ---- */}
      {selectedCorridor && (
        <div className="bg-white border border-teal-200 rounded-xl p-5 ring-1 ring-teal-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-10 rounded-full"
                style={{ backgroundColor: selectedCorridor.color }}
              />
              <div>
                <h3 className="text-sm font-bold text-[#111827]">
                  Détail — {selectedCorridor.name}
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  {selectedCorridor.pays} · {selectedCorridor.distance} · Poste frontalier:{' '}
                  {selectedCorridor.posteFrontalier}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCorridorId(null)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-gray-100 hover:text-[#111827] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Detail stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Attente frontière</p>
              <p
                className={cn(
                  'text-sm font-bold mt-0.5',
                  selectedCorridor.tempsAttenteFrontiere === '24h+'
                    ? 'text-rose-600'
                    : parseInt(selectedCorridor.tempsAttenteFrontiere) >= 6
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                )}
              >
                {selectedCorridor.tempsAttenteFrontiere}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">État de la route</p>
              <p
                className={cn(
                  'text-sm font-bold mt-0.5',
                  etatRouteStyle[selectedCorridor.etatRoute]?.text ?? 'text-gray-600'
                )}
              >
                {selectedCorridor.etatRoute}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Dossiers en transit</p>
              <p className="text-sm font-bold text-teal-600 mt-0.5">{selectedCorridor.dossiersEnTransit}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Délai vs Benchmark</p>
              <p
                className={cn(
                  'text-sm font-bold mt-0.5',
                  parseFloat(selectedCorridor.delaiMoyen.replace(',', '.')) >
                  parseFloat(selectedCorridor.benchmark.replace(',', '.'))
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                )}
              >
                {selectedCorridor.delaiMoyen} / {selectedCorridor.benchmark}
              </p>
            </div>
          </div>

          {/* Route visualization */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-3">Parcours du corridor</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {/* Port origin */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedCorridor.color + '20' }}
                >
                  <MapPin className="w-4 h-4" style={{ color: selectedCorridor.color }} />
                </div>
                <span className="text-[10px] font-medium text-[#111827] mt-1">
                  {selectedCorridor.name.split(' → ')[0]}
                </span>
                <span className="text-[9px] text-[#9CA3AF]">Port</span>
              </div>

              {/* Transit segment */}
              <div className="flex-1 flex flex-col items-center min-w-[60px]">
                <div className="w-full h-0.5 rounded-full" style={{ backgroundColor: selectedCorridor.color + '40' }}>
                  <div
                    className="h-full rounded-full animate-pulse"
                    style={{ width: '60%', backgroundColor: selectedCorridor.color }}
                  />
                </div>
                <span className="text-[9px] text-[#9CA3AF] mt-1">Transit</span>
              </div>

              {/* Border post */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    corridorStatusStyle[selectedCorridor.status].bg
                  )}
                >
                  <Shield
                    className={cn('w-4 h-4', corridorStatusStyle[selectedCorridor.status].text)}
                  />
                </div>
                <span className="text-[10px] font-medium text-[#111827] mt-1">
                  {selectedCorridor.posteFrontalier}
                </span>
                <span className="text-[9px] text-[#9CA3AF]">Frontière</span>
              </div>

              {/* Internal transit segment */}
              <div className="flex-1 flex flex-col items-center min-w-[60px]">
                <div className="w-full h-0.5 rounded-full" style={{ backgroundColor: selectedCorridor.color + '40' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: '80%', backgroundColor: selectedCorridor.color }}
                  />
                </div>
                <span className="text-[9px] text-[#9CA3AF] mt-1">Intérieur</span>
              </div>

              {/* Bamako destination */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-[10px] font-medium text-[#111827] mt-1">Bamako</span>
                <span className="text-[9px] text-[#9CA3AF]">Destination</span>
              </div>
            </div>
          </div>

          {/* Active dossiers */}
          <div>
            <h4 className="text-xs font-semibold text-[#111827] mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              Dossiers actifs sur ce corridor
            </h4>
            {selectedDossiers.length > 0 ? (
              <div className="space-y-2">
                {selectedDossiers.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 border border-[#E5E7EB] rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono font-semibold text-[#111827]">{d.bl}</p>
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded',
                            d.status === 'En transit'
                              ? 'bg-amber-50 text-amber-700'
                              : d.status === 'Poste frontalier'
                                ? 'bg-violet-50 text-violet-700'
                                : d.status === 'Dédouanement'
                                  ? 'bg-teal-50 text-teal-700'
                                  : d.status === 'Bloqué frontière'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-gray-50 text-gray-700'
                          )}
                        >
                          {d.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                        {d.client} — {d.merchandise}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#9CA3AF] italic">Aucun dossier actif sur ce corridor.</p>
            )}
          </div>
        </div>
      )}

      {/* ---- BAX Tracking Section ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-teal-600" />
            <h3 className="text-sm font-semibold text-[#111827]">Suivi BAX (Bordereau de Suivi)</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
              {baxEntries.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Progression en temps réel</span>
          </div>
        </div>

        <div className="space-y-3">
          {baxEntries.map((bax) => {
            const sty = baxStatusStyle[bax.status]
            const corridorData = corridors.find((c) => c.id === bax.corridorId)

            return (
              <div
                key={bax.id}
                className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                {/* BAX Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: (corridorData?.color ?? '#0d9488') + '15',
                      }}
                    >
                      <Route
                        className="w-4 h-4"
                        style={{ color: corridorData?.color ?? '#0d9488' }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-[#111827]">{bax.baxNumber}</p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        BL: {bax.bl} · {bax.client}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold w-fit',
                      sty.bg,
                      sty.text
                    )}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                    {bax.status}
                  </span>
                </div>

                {/* Corridor + Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] min-w-0">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate font-medium text-[#111827]">{bax.currentPosition}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span>Bamako</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ETA: <span className="font-medium text-[#111827]">{bax.eta}</span></span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress
                      value={bax.progression}
                      className="h-2 bg-gray-100"
                    />
                  </div>
                  <span
                    className="text-xs font-bold min-w-[40px] text-right"
                    style={{ color: corridorData?.color ?? '#0d9488' }}
                  >
                    {bax.progression}%
                  </span>
                </div>

                {/* Progress milestones */}
                <div className="flex items-center justify-between mt-2 text-[9px] text-[#9CA3AF]">
                  <span className={cn(bax.progression >= 10 && 'text-teal-600 font-medium')}>Embarquement</span>
                  <span className={cn(bax.progression >= 30 && 'text-amber-600 font-medium')}>Transit</span>
                  <span className={cn(bax.progression >= 60 && 'text-violet-600 font-medium')}>Frontière</span>
                  <span className={cn(bax.progression >= 85 && 'text-teal-600 font-medium')}>Dédouanement</span>
                  <span className={cn(bax.progression >= 100 && 'text-emerald-600 font-medium')}>Livré</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
