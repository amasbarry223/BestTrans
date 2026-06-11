'use client'

import { useState } from 'react'
import {
  Warehouse,
  Package,
  Container,
  AlertTriangle,
  Search,
  Plus,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type MoveType = 'Entrée' | 'Sortie' | 'Transfert'
type ContainerStatus = 'Plein' | 'Vide'
type ContainerType = "20'" | "40'" | "40' HC" | 'Reefer'

const moveTypeStyle: Record<MoveType, { bg: string; text: string; icon: React.ElementType }> = {
  'Entrée':    { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: ArrowDownToLine },
  'Sortie':    { bg: 'bg-sky-50',     text: 'text-sky-700',     icon: ArrowUpFromLine },
  'Transfert': { bg: 'bg-violet-50',  text: 'text-violet-700',  icon: ArrowRightLeft },
}

const depots = [
  { id: '1', name: 'Magasin sous douane', location: 'Bamako', capacity: 500, used: 390, containers: 28, type: 'Magasin sous douane' },
  { id: '2', name: 'Parc à conteneurs', location: 'Sénou', capacity: 120, used: 78, containers: 56, type: 'Parc à conteneurs' },
  { id: '3', name: 'Entrepôt réel', location: 'Kayes', capacity: 300, used: 135, containers: 0, type: 'Entrepôt réel' },
]

const mockMovements = [
  { id: '1', ref: 'MVT-2026-0234', type: 'Entrée' as MoveType, depot: 'Magasin sous douane', dossier: 'TRS-2026-0142', merchandise: 'Matériel agricole', colis: 120, poids: '8,5 T', container: null, date: '08/03/2026 09:30', dureeSejour: '2j', fraisMag: '0 FCFA', observations: 'Franchise en cours' },
  { id: '2', ref: 'MVT-2026-0233', type: 'Entrée' as MoveType, depot: 'Parc à conteneurs', dossier: 'TRS-2026-0139', merchandise: 'Conteneurs 40\' HC', colis: 4, poids: '32 T', container: 'MSKU-1234567', date: '06/03/2026 14:00', dureeSejour: '4j', fraisMag: '0 FCFA', observations: 'Franchise en cours' },
  { id: '3', ref: 'MVT-2026-0232', type: 'Sortie' as MoveType, depot: 'Magasin sous douane', dossier: 'TRS-2026-0138', merchandise: 'Produits pharmaceutiques', colis: 45, poids: '3,2 T', container: null, date: '06/03/2026 08:15', dureeSejour: '18j', fraisMag: '0 FCFA', observations: 'BAE présenté' },
  { id: '4', ref: 'MVT-2026-0231', type: 'Transfert' as MoveType, depot: 'Parc à conteneurs → Entrepôt réel', dossier: 'TRS-2026-0137', merchandise: 'Équipements pétroliers', colis: 8, poids: '12 T', container: 'CMAU-2345678', date: '05/03/2026 11:45', dureeSejour: '25j', fraisMag: '20 000 FCFA', observations: 'Franchise dépassée (+4j)' },
  { id: '5', ref: 'MVT-2026-0230', type: 'Entrée' as MoveType, depot: 'Magasin sous douane', dossier: 'TRS-2026-0136', merchandise: 'Ciments & matériaux', colis: 300, poids: '15 T', container: null, date: '05/03/2026 07:00', dureeSejour: '5j', fraisMag: '0 FCFA', observations: 'Franchise en cours' },
]

const mockContainers = [
  { id: '1', number: 'MSKU-1234567', type: "40' HC" as ContainerType, status: 'Plein' as ContainerStatus, scelle: 'PLB-789456', depot: 'Parc à conteneurs', surestaries: false, dossier: 'TRS-2026-0139' },
  { id: '2', number: 'CMAU-2345678', type: "20'" as ContainerType, status: 'Plein' as ContainerStatus, scelle: 'PLB-456123', depot: 'Parc à conteneurs', surestaries: true, dossier: 'TRS-2026-0137' },
  { id: '3', number: 'OOLU-3456789', type: "40'" as ContainerType, status: 'Plein' as ContainerStatus, scelle: 'PLB-321654', depot: 'Parc à conteneurs', surestaries: false, dossier: 'TRS-2026-0142' },
  { id: '4', number: 'TCLU-4567890', type: "40' HC" as ContainerType, status: 'Vide' as ContainerStatus, scelle: '—', depot: 'Parc à conteneurs', surestaries: false, dossier: '—' },
  { id: '5', number: 'FCIU-5678901', type: "20'" as ContainerType, status: 'Plein' as ContainerStatus, scelle: 'PLB-654987', depot: 'Parc à conteneurs', surestaries: true, dossier: 'TRS-2026-0135' },
  { id: '6', number: 'HLXU-6789012', type: 'Reefer' as ContainerType, status: 'Plein' as ContainerStatus, scelle: 'PLB-987321', depot: 'Parc à conteneurs', surestaries: false, dossier: 'TRS-2026-0136' },
]

const globalStats = [
  { label: 'Taux occupation', value: '72%', icon: Warehouse, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Colis en dépôt', value: '603', icon: Package, color: 'text-sky-600', bg: 'bg-sky-50' },
  { label: 'Conteneurs', value: '84', icon: Container, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Alertes franchise', value: '5', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
]

export function DepotsView() {
  const [selectedDepot, setSelectedDepot] = useState(depots[0].id)
  const [activeSection, setActiveSection] = useState<'mouvements' | 'conteneurs'>('mouvements')

  const currentDepot = depots.find(d => d.id === selectedDepot)!
  const occupancyPct = Math.round((currentDepot.used / currentDepot.capacity) * 100)

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {globalStats.map((s) => {
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

      {/* Depot Selector */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            {depots.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDepot(d.id)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors border',
                  selectedDepot === d.id
                    ? 'border-teal-300 bg-teal-50 text-teal-700'
                    : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                )}
              >
                <Warehouse className="w-3.5 h-3.5 inline mr-1.5" />
                {d.name}
                <span className="text-[10px] ml-1 text-[#9CA3AF]">({d.location})</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <ArrowDownToLine className="w-4 h-4" /> Bon d'entrée
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
              <ArrowUpFromLine className="w-4 h-4" /> Bon de sortie
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
              <ArrowRightLeft className="w-4 h-4" /> Transfert
            </button>
          </div>
        </div>

        {/* Occupancy bar */}
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#6B7280]">{currentDepot.type} — {currentDepot.location}</span>
            <span className="font-semibold text-[#111827]">{currentDepot.used}/{currentDepot.capacity} emplacements ({occupancyPct}%)</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-teal-500')}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveSection('mouvements')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeSection === 'mouvements' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50')}
        >
          Mouvements
        </button>
        <button
          onClick={() => setActiveSection('conteneurs')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeSection === 'conteneurs' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50')}
        >
          Conteneurs
        </button>
      </div>

      {activeSection === 'mouvements' ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex-1 min-h-0">
          <div className="overflow-y-auto max-h-[calc(100vh-520px)]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-2.5 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Réf</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Dossier</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Marchandise</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Colis/Poids</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
                  <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Séjour</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Magasinage</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Obs.</th>
                </tr>
              </thead>
              <tbody>
                {mockMovements.map((m) => {
                  const sty = moveTypeStyle[m.type]
                  const Icon = sty.icon
                  return (
                    <tr key={m.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-teal-700">{m.ref}</td>
                      <td className="py-3 px-3">
                        <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded', sty.bg, sty.text)}>
                          <Icon className="w-3 h-3" />{m.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs font-mono text-[#6B7280]">{m.dossier}</td>
                      <td className="py-3 px-3 text-xs text-[#374151] truncate max-w-[120px]">{m.merchandise}</td>
                      <td className="py-3 px-3 text-right text-xs text-[#111827]">{m.colis} / {m.poids}</td>
                      <td className="py-3 px-3 text-xs text-[#6B7280]">{m.date}</td>
                      <td className="py-3 px-3 text-center text-xs font-semibold text-[#111827]">{m.dureeSejour}</td>
                      <td className="py-3 px-3 text-right text-xs font-bold text-[#111827]">{m.fraisMag}</td>
                      <td className="py-3 px-3 text-xs text-[#6B7280] truncate max-w-[100px]">{m.observations}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockContainers.map((c) => (
              <div key={c.id} className={cn('border rounded-xl p-4', c.surestaries ? 'border-rose-200 bg-rose-50/30' : 'border-[#E5E7EB]')}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-[#111827]">{c.number}</span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', c.status === 'Plein' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600')}>
                    {c.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-[#6B7280]">
                  <div className="flex justify-between"><span>Type</span><span className="font-medium text-[#111827]">{c.type}</span></div>
                  <div className="flex justify-between"><span>Scellé</span><span className="font-mono text-[#111827]">{c.scelle}</span></div>
                  <div className="flex justify-between"><span>Dossier</span><span className="font-mono text-teal-700">{c.dossier}</span></div>
                </div>
                {c.surestaries && (
                  <div className="mt-2 pt-2 border-t border-rose-200 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Surestaries (demurrage)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
