'use client'

import { useState } from 'react'
import {
  FolderOpen,
  Search,
  Filter,
  Plus,
  Download,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type DossierStatus = 'Ouvert' | 'Docs reçus' | 'Déclaration' | 'Liquidation' | 'Paiement' | 'BAE' | 'Enlèvement' | 'Livré' | 'Clôturé'
type DossierType = 'Import' | 'Export' | 'Transit' | 'Réexport.'

const statusStyle: Record<DossierStatus, { bg: string; text: string; dot: string }> = {
  'Ouvert':       { bg: 'bg-sky-50',   text: 'text-sky-700',   dot: 'bg-sky-500' },
  'Docs reçus':   { bg: 'bg-indigo-50',text: 'text-indigo-700',dot: 'bg-indigo-500' },
  'Déclaration':  { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Liquidation':  { bg: 'bg-orange-50',text: 'text-orange-700',dot: 'bg-orange-500' },
  'Paiement':     { bg: 'bg-yellow-50',text: 'text-yellow-700',dot: 'bg-yellow-500' },
  'BAE':          { bg: 'bg-teal-50',  text: 'text-teal-700',  dot: 'bg-teal-500' },
  'Enlèvement':   { bg: 'bg-violet-50',text: 'text-violet-700',dot: 'bg-violet-500' },
  'Livré':        { bg: 'bg-emerald-50',text:'text-emerald-700',dot: 'bg-emerald-500' },
  'Clôturé':      { bg: 'bg-gray-50',  text: 'text-gray-600',  dot: 'bg-gray-400' },
}

const typeStyle: Record<DossierType, { bg: string; text: string }> = {
  'Import':     { bg: 'bg-teal-50',  text: 'text-teal-700' },
  'Export':     { bg: 'bg-sky-50',   text: 'text-sky-700' },
  'Transit':    { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Réexport.':  { bg: 'bg-violet-50',text: 'text-violet-700' },
}

const mockDossiers = [
  { id: '1', number: 'TRS-2026-0142', type: 'Import' as DossierType, client: 'SCOPEX Mali', regime: 'Consommation', bl: 'MAEU-123456', bureau: 'Bamako-Sénou', merchandise: 'Matériel agricole x 120 colis', status: 'Déclaration' as DossierStatus, honoraires: '2 500 000 FCFA', droitsTaxes: '8 400 000 FCFA', date: '08/03/2026' },
  { id: '2', number: 'TRS-2026-0141', type: 'Import' as DossierType, client: 'MALI TEXTILES SA', regime: 'Entrepôt', bl: 'CMAU-234567', bureau: 'Bamako-City', merchandise: 'Tissus & vêtements x 85 colis', status: 'BAE' as DossierStatus, honoraires: '1 800 000 FCFA', droitsTaxes: '5 200 000 FCFA', date: '07/03/2026' },
  { id: '3', number: 'TRS-2026-0140', type: 'Export' as DossierType, client: 'SOMADIA', regime: 'Consommation', bl: 'MSKU-345678', bureau: 'Bamako-Sénou', merchandise: 'Noix de cajou x 200 sacs', status: 'Ouvert' as DossierStatus, honoraires: '950 000 FCFA', droitsTaxes: '0 FCFA', date: '07/03/2026' },
  { id: '4', number: 'TRS-2026-0139', type: 'Transit' as DossierType, client: 'CMA CGM Mali', regime: 'Transit T1', bl: 'OOLU-456789', bureau: 'Kayes', merchandise: 'Conteneurs 40\' HC x 4', status: 'Liquidation' as DossierStatus, honoraires: '3 200 000 FCFA', droitsTaxes: '12 600 000 FCFA', date: '06/03/2026' },
  { id: '5', number: 'TRS-2026-0138', type: 'Import' as DossierType, client: 'PHARMACIE POPULAIRE', regime: 'AT', bl: 'TCLU-567890', bureau: 'Bamako-Sénou', merchandise: 'Produits pharmaceutiques x 45 colis', status: 'Livré' as DossierStatus, honoraires: '1 200 000 FCFA', droitsTaxes: '3 800 000 FCFA', date: '06/03/2026' },
  { id: '6', number: 'TRS-2026-0137', type: 'Réexport.' as DossierType, client: 'TOTAL MALI', regime: 'Entrepôt', bl: 'HLXU-678901', bureau: 'Bamako-City', merchandise: 'Équipements pétroliers x 8 colis', status: 'Clôturé' as DossierStatus, honoraires: '4 100 000 FCFA', droitsTaxes: '15 200 000 FCFA', date: '05/03/2026' },
  { id: '7', number: 'TRS-2026-0136', type: 'Import' as DossierType, client: 'BRAMALI SA', regime: 'Consommation', bl: 'FCIU-789012', bureau: 'Sikasso', merchandise: 'Ciments & matériaux x 300 sacs', status: 'BAE' as DossierStatus, honoraires: '1 600 000 FCFA', droitsTaxes: '4 500 000 FCFA', date: '05/03/2026' },
  { id: '8', number: 'TRS-2026-0135', type: 'Transit' as DossierType, client: 'MAERSK MALI', regime: 'Transit T1', bl: 'CRSU-890123', bureau: 'Bamako-Sénou', merchandise: 'Marchandises diverses x 60 colis', status: 'Paiement' as DossierStatus, honoraires: '2 800 000 FCFA', droitsTaxes: '9 800 000 FCFA', date: '04/03/2026' },
  { id: '9', number: 'TRS-2026-0134', type: 'Import' as DossierType, client: 'SCOPEX Mali', regime: 'Consommation', bl: 'TEMU-901234', bureau: 'Bamako-Sénou', merchandise: 'Véhicules x 12 unités', status: 'Enlèvement' as DossierStatus, honoraires: '5 400 000 FCFA', droitsTaxes: '28 000 000 FCFA', date: '03/03/2026' },
  { id: '10', number: 'TRS-2026-0133', type: 'Export' as DossierType, client: 'MALI TEXTILES SA', regime: 'Consommation', bl: 'EISU-012345', bureau: 'Bamako-City', merchandise: 'Coton brut x 500 balles', status: 'Docs reçus' as DossierStatus, honoraires: '2 100 000 FCFA', droitsTaxes: '0 FCFA', date: '03/03/2026' },
]

const miniStats = [
  { label: 'En cours', value: '34', icon: FolderOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Clôturés ce mois', value: '18', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Délai moy. dédouane', value: '4,2 j', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'En attente BAE', value: '7', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
]

export function DossiersView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = mockDossiers.filter((d) => {
    const matchSearch = searchTerm === '' ||
      d.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.bl.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filterType === 'all' || d.type === filterType
    const matchStatus = filterStatus === 'all' || d.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {miniStats.map((s) => {
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

      {/* Search & Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par N°, client, BL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
                showFilters ? 'border-teal-300 bg-teal-50 text-teal-700' : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
              )}
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
              <Plus className="w-4 h-4" />
              Nouveau Dossier
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#E5E7EB]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tous les types</option>
              <option value="Import">Import</option>
              <option value="Export">Export</option>
              <option value="Transit">Transit</option>
              <option value="Réexport.">Réexportation</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="Ouvert">Ouvert</option>
              <option value="Docs reçus">Docs reçus</option>
              <option value="Déclaration">Déclaration</option>
              <option value="Liquidation">Liquidation</option>
              <option value="Paiement">Paiement</option>
              <option value="BAE">BAE</option>
              <option value="Enlèvement">Enlèvement</option>
              <option value="Livré">Livré</option>
              <option value="Clôturé">Clôturé</option>
            </select>
          </div>
        )}
      </div>

      {/* Dossier Table - Desktop */}
      <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex-1 min-h-0">
        <div className="overflow-y-auto max-h-[calc(100vh-380px)]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">N° Dossier</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Régime</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">BL / LTA</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Marchandise</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Honoraires</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const sty = statusStyle[d.status]
                const tsty = typeStyle[d.type]
                return (
                  <tr key={d.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-teal-700">{d.number}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', tsty.bg, tsty.text)}>{d.type}</span>
                    </td>
                    <td className="py-3 px-3 text-xs font-medium text-[#374151] truncate max-w-[120px]">{d.client}</td>
                    <td className="py-3 px-3 text-xs text-[#6B7280]">{d.regime}</td>
                    <td className="py-3 px-3 text-xs font-mono text-[#6B7280]">{d.bl}</td>
                    <td className="py-3 px-3 text-xs text-[#6B7280] truncate max-w-[150px]">{d.merchandise}</td>
                    <td className="py-3 px-3 text-right text-xs font-bold text-[#111827] whitespace-nowrap">{d.honoraires}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-[#6B7280]">{d.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dossier Cards - Mobile */}
      <div className="md:hidden flex-1 overflow-y-auto">
        <div className="space-y-3">
          {filtered.map((d) => {
            const sty = statusStyle[d.status]
            const tsty = typeStyle[d.type]
            return (
              <div key={d.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-semibold text-teal-700">{d.number}</span>
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                    {d.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', tsty.bg, tsty.text)}>{d.type}</span>
                  <span className="text-xs text-[#6B7280]">· {d.regime}</span>
                </div>
                <p className="text-sm font-medium text-[#111827] mb-1">{d.client}</p>
                <p className="text-xs text-[#6B7280] mb-2">{d.merchandise}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">BL: {d.bl} · {d.date}</span>
                  <span className="text-sm font-bold text-[#111827]">{d.honoraires}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
