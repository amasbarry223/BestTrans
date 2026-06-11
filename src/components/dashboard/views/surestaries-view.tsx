'use client'

import { useState, useMemo } from 'react'
import {
  Container,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Zap,
  Shield,
  Ship,
  Calculator,
  Timer,
  AlertOctagon,
  ChevronDown,
  Search,
  FileText,
  HandshakeIcon,
  Warehouse,
  PackageOpen,
  PhoneCall,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

type ContainerType = "20'" | "40'" | "40' HC" | 'Reefer'
type SurestariesStatus = 'En franchise' | 'Approche fin' | 'En surestaries' | 'Critique'

interface ContainerEntry {
  id: string
  number: string
  type: ContainerType
  compagnie: string
  dossier: string
  client: string
  dateEntree: string
  franchise: number
  joursPasses: number
  statut: SurestariesStatus
  coutJournalier: number
}

const statusStyle: Record<SurestariesStatus, { bg: string; text: string; dot: string; border: string }> = {
  'En franchise':    { bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500',  border: 'border-emerald-200' },
  'Approche fin':    { bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-500',    border: 'border-amber-200' },
  'En surestaries':  { bg: 'bg-orange-50',   text: 'text-orange-700',   dot: 'bg-orange-500',   border: 'border-orange-200' },
  'Critique':        { bg: 'bg-rose-50',     text: 'text-rose-700',     dot: 'bg-rose-500',     border: 'border-rose-200' },
}

const containerTypeRates: Record<ContainerType, number> = {
  "20'": 25_000,
  "40'": 50_000,
  "40' HC": 60_000,
  'Reefer': 80_000,
}

const mockContainers: ContainerEntry[] = [
  { id: '1', number: 'MSKU-1234567', type: "40' HC", compagnie: 'MAERSK', dossier: 'TRS-2026-0139', client: 'CMA CGM Mali', dateEntree: '22/02/2026', franchise: 21, joursPasses: 16, statut: 'En franchise', coutJournalier: 60_000 },
  { id: '2', number: 'CMAU-2345678', type: "20'", compagnie: 'CMA CGM', dossier: 'TRS-2026-0137', client: 'TOTAL MALI', dateEntree: '13/02/2026', franchise: 21, joursPasses: 25, statut: 'En surestaries', coutJournalier: 25_000 },
  { id: '3', number: 'OOLU-3456789', type: "40'", compagnie: 'OOCL', dossier: 'TRS-2026-0142', client: 'SCOPEX Mali', dateEntree: '25/02/2026', franchise: 21, joursPasses: 13, statut: 'En franchise', coutJournalier: 50_000 },
  { id: '4', number: 'TCLU-4567890', type: 'Reefer', compagnie: 'CMA CGM', dossier: 'TRS-2026-0140', client: 'SOMADIA', dateEntree: '15/02/2026', franchise: 14, joursPasses: 23, statut: 'Critique', coutJournalier: 80_000 },
  { id: '5', number: 'FCIU-5678901', type: "20'", compagnie: 'MAERSK', dossier: 'TRS-2026-0135', client: 'MAERSK MALI', dateEntree: '18/02/2026', franchise: 21, joursPasses: 20, statut: 'Approche fin', coutJournalier: 25_000 },
  { id: '6', number: 'HLXU-6789012', type: "40' HC", compagnie: 'Hapag-Lloyd', dossier: 'TRS-2026-0136', client: 'BRAMALI SA', dateEntree: '20/02/2026', franchise: 21, joursPasses: 18, statut: 'En franchise', coutJournalier: 60_000 },
]

function computeSurestariesCost(joursPasses: number, franchise: number, coutJournalier: number): number {
  const joursSurestaries = Math.max(0, joursPasses - franchise)
  if (joursSurestaries <= 0) return 0
  const first7 = Math.min(joursSurestaries, 7)
  const beyond7 = Math.max(joursSurestaries - 7, 0)
  return first7 * coutJournalier + beyond7 * coutJournalier * 2
}

function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' FCFA'
}

function formatFCFAShort(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return millions % 1 === 0 ? `${millions} M FCFA` : `${millions.toFixed(1)} M FCFA`
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000
    return `${thousands.toFixed(0)} k FCFA`
  }
  return `${amount} FCFA`
}

export function SurestariesView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [simType, setSimType] = useState<ContainerType>("20'")
  const [simDays, setSimDays] = useState([5])

  // Computed stats
  const stats = useMemo(() => {
    const sousFranchise = mockContainers.filter(c => c.statut === 'En franchise' || c.statut === 'Approche fin').length
    const enSurestaries = mockContainers.filter(c => c.statut === 'En surestaries' || c.statut === 'Critique').length
    const coutTotal = mockContainers.reduce((sum, c) => sum + computeSurestariesCost(c.joursPasses, c.franchise, c.coutJournalier), 0)
    const economiePotentielle = Math.round(coutTotal * 0.6)
    return { sousFranchise, enSurestaries, coutTotal, economiePotentielle }
  }, [])

  // Urgent alerts
  const urgentAlerts = useMemo(() => {
    return mockContainers
      .filter(c => c.statut === 'Critique' || c.statut === 'Approche fin' || c.statut === 'En surestaries')
      .sort((a, b) => {
        const order: Record<SurestariesStatus, number> = { 'Critique': 0, 'En surestaries': 1, 'Approche fin': 2, 'En franchise': 3 }
        return order[a.statut] - order[b.statut]
      })
  }, [])

  // Filtered containers
  const filteredContainers = useMemo(() => {
    return mockContainers.filter(c => {
      const matchesSearch = searchQuery === '' ||
        c.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dossier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.compagnie.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || c.statut === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  // Simulator calculation
  const simResult = useMemo(() => {
    const days = simDays[0]
    const rate = containerTypeRates[simType]
    const first7 = Math.min(days, 7)
    const beyond7 = Math.max(days - 7, 0)
    const coutNormal = first7 * rate
    const coutPenalite = beyond7 * rate * 2
    const total = coutNormal + coutPenalite
    return { days, rate, first7, beyond7, coutNormal, coutPenalite, total }
  }, [simType, simDays])

  const statCards = [
    { label: 'Sous franchise', value: String(stats.sousFranchise), sublabel: 'conteneurs', icon: Shield, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'En surestaries', value: String(stats.enSurestaries), sublabel: 'conteneurs', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Coût total ce mois', value: formatFCFAShort(stats.coutTotal), sublabel: 'surestaries', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Économie potentielle', value: formatFCFAShort(stats.economiePotentielle), sublabel: 'si action immédiate', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  const actionRecommendations = [
    {
      id: '1',
      title: 'Enlèvement urgent',
      description: 'Programmer l\'enlèvement immédiat des conteneurs en surestaries critiques pour stopper les pénalités.',
      icon: Zap,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      urgency: 'Urgent',
      urgencyColor: 'text-rose-700 bg-rose-100',
      affectedContainers: mockContainers.filter(c => c.statut === 'Critique').length,
    },
    {
      id: '2',
      title: 'Négocier extension franchise',
      description: 'Contacter les compagnies maritimes pour obtenir une extension de la période de franchise (14→21j ou plus).',
      icon: HandshakeIcon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      urgency: 'Recommandé',
      urgencyColor: 'text-amber-700 bg-amber-100',
      affectedContainers: mockContainers.filter(c => c.statut === 'Approche fin').length,
    },
    {
      id: '3',
      title: 'Dépotage sur quai',
      description: 'Procéder au dépotage des conteneurs au port et retourner les vides à la compagnie pour limiter les frais.',
      icon: PackageOpen,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      urgency: 'Stratégique',
      urgencyColor: 'text-teal-700 bg-teal-100',
      affectedContainers: mockContainers.filter(c => c.statut === 'En surestaries' || c.statut === 'Critique').length,
    },
    {
      id: '4',
      title: 'Relancer clients importateurs',
      description: 'Notifier les clients des frais accumulés et les relancer pour accélérer les procédures de dédouanement.',
      icon: PhoneCall,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      urgency: 'Action',
      urgencyColor: 'text-sky-700 bg-sky-100',
      affectedContainers: mockContainers.filter(c => c.statut !== 'En franchise').length,
    },
  ]

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <Icon className={cn('w-5 h-5', s.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-[#111827] truncate">{s.value}</p>
                <p className="text-xs text-[#6B7280]">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alert Banner */}
      {urgentAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon className="w-4.5 h-4.5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-rose-900 mb-1">
                Alertes surestaries — {urgentAlerts.length} conteneur{urgentAlerts.length > 1 ? 's' : ''} nécessite{urgentAlerts.length === 1 ? '' : 'nt'} une attention
              </h3>
              <div className="space-y-1.5">
                {urgentAlerts.map((c) => {
                  const sty = statusStyle[c.statut]
                  const joursDepasses = Math.max(0, c.joursPasses - c.franchise)
                  return (
                    <div key={c.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold', sty.bg, sty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                        {c.statut}
                      </span>
                      <span className="font-mono font-semibold text-[#111827]">{c.number}</span>
                      <span className="text-[#6B7280]">—</span>
                      <span className="text-[#374151]">{c.client}</span>
                      {c.statut === 'Approche fin' ? (
                        <span className="text-amber-700 font-medium">
                          (reste {c.franchise - c.joursPasses}j de franchise)
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium">
                          (+{joursDepasses}j → {formatFCFA(computeSurestariesCost(c.joursPasses, c.franchise, c.coutJournalier))})
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Container Tracking Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        {/* Header with filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Container className="w-4.5 h-4.5 text-teal-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Suivi des conteneurs</h2>
            <span className="text-[10px] font-medium text-[#9CA3AF] bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredContainers.length} résultat{filteredContainers.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher conteneur, client, dossier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En franchise">En franchise</SelectItem>
                <SelectItem value="Approche fin">Approche fin</SelectItem>
                <SelectItem value="En surestaries">En surestaries</SelectItem>
                <SelectItem value="Critique">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table — desktop */}
        <div className="hidden md:block overflow-y-auto max-h-[calc(100vh-480px)]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Conteneur</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Compagnie</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Dossier</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Entrée dépôt</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Franchise</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Coût accumulé</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider min-w-[140px]">Progression</th>
              </tr>
            </thead>
            <tbody>
              {filteredContainers.map((c) => {
                const sty = statusStyle[c.statut]
                const joursDepasses = Math.max(0, c.joursPasses - c.franchise)
                const progressPct = Math.min(100, Math.round((c.joursPasses / c.franchise) * 100))
                const coutAccumule = computeSurestariesCost(c.joursPasses, c.franchise, c.coutJournalier)
                const isOver = c.joursPasses > c.franchise

                let progressColor = 'bg-emerald-500'
                if (progressPct >= 100) progressColor = c.statut === 'Critique' ? 'bg-rose-500' : 'bg-orange-500'
                else if (progressPct >= 85) progressColor = 'bg-amber-500'

                return (
                  <tr key={c.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                    <td className="py-3 px-3 font-mono text-xs font-semibold text-teal-700">{c.number}</td>
                    <td className="py-3 px-3 text-xs text-[#374151] font-medium">{c.type}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                        <Ship className="w-3 h-3" />{c.compagnie}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-mono text-[#6B7280]">{c.dossier}</td>
                    <td className="py-3 px-3 text-xs text-[#374151] truncate max-w-[100px]">{c.client}</td>
                    <td className="py-3 px-3 text-xs text-[#6B7280]">{c.dateEntree}</td>
                    <td className="py-3 px-3 text-center text-xs">
                      {isOver ? (
                        <span className="text-rose-700 font-bold">+{joursDepasses}j</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">{c.franchise - c.joursPasses}j rest.</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                        {c.statut}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-xs font-bold text-[#111827] whitespace-nowrap">
                      {coutAccumule > 0 ? formatFCFA(coutAccumule) : <span className="text-emerald-600 font-medium">0 FCFA</span>}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all', progressColor)}
                            style={{ width: `${Math.min(progressPct, 100)}%` }}
                          />
                        </div>
                        <span className={cn('text-[10px] font-medium min-w-[32px] text-right',
                          progressPct >= 100 ? 'text-rose-600' : progressPct >= 85 ? 'text-amber-600' : 'text-emerald-600'
                        )}>
                          {progressPct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {filteredContainers.map((c) => {
            const sty = statusStyle[c.statut]
            const joursDepasses = Math.max(0, c.joursPasses - c.franchise)
            const progressPct = Math.min(100, Math.round((c.joursPasses / c.franchise) * 100))
            const coutAccumule = computeSurestariesCost(c.joursPasses, c.franchise, c.coutJournalier)
            const isOver = c.joursPasses > c.franchise

            let progressColor = 'bg-emerald-500'
            if (progressPct >= 100) progressColor = c.statut === 'Critique' ? 'bg-rose-500' : 'bg-orange-500'
            else if (progressPct >= 85) progressColor = 'bg-amber-500'

            return (
              <div key={c.id} className={cn('border rounded-xl p-4', sty.border, sty.bg + '/30')}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-[#111827]">{c.number}</span>
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                    {c.statut}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Type</span>
                    <span className="font-medium text-[#111827]">{c.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Compagnie</span>
                    <span className="inline-flex items-center gap-1 font-medium text-[#111827]">
                      <Ship className="w-3 h-3 text-sky-600" />{c.compagnie}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Dossier</span>
                    <span className="font-mono text-teal-700">{c.dossier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Client</span>
                    <span className="font-medium text-[#374151]">{c.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Entrée dépôt</span>
                    <span className="text-[#374151]">{c.dateEntree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Franchise</span>
                    {isOver ? (
                      <span className="text-rose-700 font-bold">+{joursDepasses}j dépassés</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">{c.franchise - c.joursPasses}j restants</span>
                    )}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', progressColor)}
                      style={{ width: `${Math.min(progressPct, 100)}%` }}
                    />
                  </div>
                  <span className={cn('text-[10px] font-medium', progressPct >= 100 ? 'text-rose-600' : progressPct >= 85 ? 'text-amber-600' : 'text-emerald-600')}>
                    {progressPct}%
                  </span>
                </div>
                {/* Cost */}
                <div className="mt-2 pt-2 border-t border-[#E5E7EB]/60 flex justify-between items-center">
                  <span className="text-xs text-[#6B7280]">Coût accumulé</span>
                  {coutAccumule > 0 ? (
                    <span className="text-sm font-bold text-rose-700">{formatFCFA(coutAccumule)}</span>
                  ) : (
                    <span className="text-sm font-medium text-emerald-600">0 FCFA</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredContainers.length === 0 && (
          <div className="py-12 text-center">
            <Container className="w-10 h-10 text-[#D1D5DB] mx-auto mb-2" />
            <p className="text-sm text-[#9CA3AF]">Aucun conteneur trouvé</p>
          </div>
        )}
      </div>

      {/* Cost Simulator + Actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Cost Simulator */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <Calculator className="w-4.5 h-4.5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Simulateur de coûts</h3>
              <p className="text-[10px] text-[#9CA3AF]">Estimer les frais de surestaries</p>
            </div>
          </div>

          {/* Container type selector */}
          <div className="mb-4">
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Type de conteneur</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(containerTypeRates) as ContainerType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSimType(type)}
                  className={cn(
                    'px-2 py-2.5 text-[11px] font-semibold rounded-lg border transition-colors text-center',
                    simType === type
                      ? 'border-teal-300 bg-teal-50 text-teal-700'
                      : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Days slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#6B7280]">Jours de surestaries</label>
              <span className="text-sm font-bold text-[#111827]">{simResult.days}j</span>
            </div>
            <Slider
              value={simDays}
              onValueChange={setSimDays}
              min={1}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#9CA3AF]">1j</span>
              <span className="text-[10px] text-[#9CA3AF]">30j</span>
            </div>
          </div>

          {/* Rate info */}
          <div className="bg-[#F9FAFB] rounded-lg p-3 mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase">Tarifs applicables</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Tarif journalier {simType}</span>
                <span className="font-semibold text-[#111827]">{formatFCFA(simResult.rate)}/j</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">1er–7e jour (taux normal)</span>
                <span className="font-medium text-[#374151]">{formatFCFA(simResult.rate)}/j</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">8e jour+ (pénalités ×2)</span>
                <span className="font-medium text-rose-600">{formatFCFA(simResult.rate * 2)}/j</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="border border-teal-200 bg-teal-50/50 rounded-xl p-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Jours 1–7 ({simResult.first7}j × {formatFCFA(simResult.rate)})</span>
                <span className="font-medium text-[#111827]">{formatFCFA(simResult.coutNormal)}</span>
              </div>
              {simResult.beyond7 > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Jours 8+ ({simResult.beyond7}j × {formatFCFA(simResult.rate * 2)})</span>
                  <span className="font-medium text-rose-600">{formatFCFA(simResult.coutPenalite)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-teal-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-teal-900">Total estimé</span>
                <span className="text-lg font-bold text-teal-700">{formatFCFA(simResult.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Recommandations d&apos;action</h3>
              <p className="text-[10px] text-[#9CA3AF]">Actions prioritaires pour réduire les coûts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actionRecommendations.map((rec) => {
              const Icon = rec.icon
              return (
                <div
                  key={rec.id}
                  className={cn('border rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer', rec.border)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', rec.bg)}>
                      <Icon className={cn('w-4.5 h-4.5', rec.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-semibold text-[#111827]">{rec.title}</h4>
                        <span className={cn('text-[9px] font-semibold px-1.5 py-0.5 rounded', rec.urgencyColor)}>
                          {rec.urgency}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] leading-relaxed mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#9CA3AF]">
                          {rec.affectedContainers} conteneur{rec.affectedContainers > 1 ? 's' : ''} concerné{rec.affectedContainers > 1 ? 's' : ''}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-teal-600 hover:text-teal-700">
                          Action <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Rate summary bar */}
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <h4 className="text-[10px] font-semibold text-[#9CA3AF] uppercase mb-2">Grille tarifaire surestaries</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(containerTypeRates) as [ContainerType, number][]).map(([type, rate]) => (
                <div key={type} className="bg-[#F9FAFB] rounded-lg p-2.5 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Container className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-xs font-semibold text-[#111827]">{type}</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280]">{formatFCFA(rate)}/j</p>
                  <p className="text-[9px] text-rose-500 font-medium">×2 après 7j</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
