'use client'

import { useState } from 'react'
import {
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Smartphone,
  Banknote,
  Wallet,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/* ------------------------------------------------------------------ */
/*  Types & Styles                                                     */
/* ------------------------------------------------------------------ */

type PaymentMode = 'Mobile Money' | 'Cash' | 'Carte' | 'Orange Money' | 'Wave'
type TxStatus = 'Réussi' | 'En attente' | 'Échoué'

const statusStyle: Record<TxStatus, { bg: string; text: string; dot: string }> = {
  'Réussi':     { bg: 'bg-blue-50',     text: 'text-blue-700',     dot: 'bg-blue-500' },
  'En attente': { bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-500' },
  'Échoué':     { bg: 'bg-rose-50',     text: 'text-rose-700',     dot: 'bg-rose-500' },
}

const modeIcon: Record<PaymentMode, React.ElementType> = {
  'Mobile Money':  Smartphone,
  'Cash':          Banknote,
  'Carte':         CreditCard,
  'Orange Money':  Smartphone,
  'Wave':          Wallet,
}

const modeStyle: Record<PaymentMode, { bg: string; text: string }> = {
  'Mobile Money':  { bg: 'bg-blue-50',   text: 'text-blue-700' },
  'Cash':          { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Carte':         { bg: 'bg-violet-50',  text: 'text-violet-700' },
  'Orange Money':  { bg: 'bg-orange-50',  text: 'text-orange-700' },
  'Wave':          { bg: 'bg-sky-50',     text: 'text-sky-700' },
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const kpiCards = [
  { label: 'Total transactions', value: '142,5M FCFA', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+14%', trendUp: true },
  { label: "Aujourd'hui", value: '2,4M FCFA', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%', trendUp: true },
  { label: 'En attente', value: '850K FCFA', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '', trendUp: true },
  { label: 'Échouées', value: '12', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-3', trendUp: false },
]

interface Transaction {
  id: string
  numero: string
  course: string
  passager: string
  montant: string
  mode: PaymentMode
  statut: TxStatus
  date: string
}

const mockTransactions: Transaction[] = [
  { id: '1', numero: 'TXN-2026-0342', course: 'CRS-4821', passager: 'Amadou Diallo',       montant: '3 500 FCFA',  mode: 'Mobile Money',  statut: 'Réussi',     date: '05 Mar 2026 14:32' },
  { id: '2', numero: 'TXN-2026-0341', course: 'CRS-4820', passager: 'Fatoumata Traoré',     montant: '7 800 FCFA',  mode: 'Wave',           statut: 'Réussi',     date: '05 Mar 2026 14:18' },
  { id: '3', numero: 'TXN-2026-0340', course: 'CRS-4819', passager: 'Ibrahim Keita',        montant: '12 500 FCFA', mode: 'Carte',          statut: 'En attente', date: '05 Mar 2026 13:55' },
  { id: '4', numero: 'TXN-2026-0339', course: 'CRS-4818', passager: 'Aminata Coulibaly',    montant: '5 200 FCFA',  mode: 'Orange Money',   statut: 'Réussi',     date: '05 Mar 2026 13:41' },
  { id: '5', numero: 'TXN-2026-0338', course: 'CRS-4817', passager: 'Moussa Sissoko',       montant: '4 000 FCFA',  mode: 'Cash',           statut: 'Réussi',     date: '05 Mar 2026 12:58' },
  { id: '6', numero: 'TXN-2026-0337', course: 'CRS-4816', passager: 'Kadiatou Bah',         montant: '9 300 FCFA',  mode: 'Mobile Money',   statut: 'Échoué',     date: '05 Mar 2026 12:30' },
  { id: '7', numero: 'TXN-2026-0336', course: 'CRS-4815', passager: 'Oumar Sidibé',         montant: '2 800 FCFA',  mode: 'Wave',           statut: 'Réussi',     date: '05 Mar 2026 11:45' },
  { id: '8', numero: 'TXN-2026-0335', course: 'CRS-4814', passager: 'Mariam Diabaté',       montant: '15 000 FCFA', mode: 'Carte',          statut: 'En attente', date: '05 Mar 2026 11:12' },
  { id: '9', numero: 'TXN-2026-0334', course: 'CRS-4813', passager: 'Seydou Maiga',         montant: '6 700 FCFA',  mode: 'Orange Money',   statut: 'Réussi',     date: '05 Mar 2026 10:38' },
  { id: '10', numero: 'TXN-2026-0333', course: 'CRS-4812', passager: 'Awa Dembélé',         montant: '8 100 FCFA',  mode: 'Mobile Money',   statut: 'Réussi',     date: '05 Mar 2026 09:55' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TransactionsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMode, setFilterMode] = useState<string>('all')

  const filtered = mockTransactions.filter((t) => {
    const matchSearch =
      searchTerm === '' ||
      t.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.passager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || t.statut === filterStatus
    const matchMode = filterMode === 'all' || t.mode === filterMode
    return matchSearch && matchStatus && matchMode
  })

  const handleView = (tx: Transaction) => {
    alert(`Détail transaction : ${tx.numero}`)
  }

  const handleRefund = (tx: Transaction) => {
    alert(`Remboursement initié pour : ${tx.numero} - ${tx.montant}`)
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Transactions</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Historique et suivi des paiements</p>
        </div>
      </div>

      {/* ---- KPI Cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', kpi.bg)}>
                  <Icon className={cn('w-5 h-5', kpi.color)} />
                </div>
                {kpi.trend && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
                      kpi.trendUp ? 'text-blue-700 bg-blue-50' : 'text-rose-700 bg-rose-50'
                    )}
                  >
                    {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                    {kpi.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{kpi.label}</p>
                <p className="text-xl font-bold text-[#111827] mt-0.5">{kpi.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Search & Filters ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par N°, passager, course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="Réussi">Réussi</option>
              <option value="En attente">En attente</option>
              <option value="Échoué">Échoué</option>
            </select>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous modes</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Cash">Cash</option>
              <option value="Carte">Carte</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Wave">Wave</option>
            </select>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* ---- Transactions Table ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0 flex-1">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Liste des transactions</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {filtered.length}
            </span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block flex-1 overflow-y-auto min-h-0 max-h-[460px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">N° Transaction</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Course</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Passager</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Montant</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Mode</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const ModeIcon = modeIcon[tx.mode] ?? CreditCard
                const mSty = modeStyle[tx.mode] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }
                const sSty = statusStyle[tx.statut] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="py-3 px-5">
                      <span className="font-mono text-xs font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">
                        {tx.numero}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#374151] text-xs font-medium">{tx.course}</td>
                    <td className="py-3 px-3 text-[#374151] text-xs font-medium truncate max-w-[120px]">{tx.passager}</td>
                    <td className="py-3 px-3 text-right font-bold text-xs text-[#111827] whitespace-nowrap">{tx.montant}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', mSty.bg, mSty.text)}>
                        <ModeIcon className="w-3 h-3" />
                        {tx.mode}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sSty.bg, sSty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sSty.dot)} />
                        {tx.statut}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => handleView(tx)} className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-blue-700">Voir</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRefund(tx)} className="cursor-pointer">
                            <RotateCcw className="w-4 h-4 mr-2 text-amber-600" />
                            <span className="text-amber-700">Rembourser</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex-1 overflow-y-auto min-h-0 max-h-[460px]">
          <div className="divide-y divide-[#F3F4F6]">
            {filtered.map((tx) => {
              const ModeIcon = modeIcon[tx.mode] ?? CreditCard
              const mSty = modeStyle[tx.mode] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }
              const sSty = statusStyle[tx.statut] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
              return (
                <div key={tx.id} className="px-4 py-3 flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', mSty.bg)}>
                    <ModeIcon className={cn('w-4.5 h-4.5', mSty.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#111827] font-mono truncate">{tx.numero}</p>
                      <span className="text-sm font-bold text-[#111827] whitespace-nowrap ml-2">{tx.montant}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#9CA3AF] truncate">{tx.passager} · {tx.course}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold', sSty.bg, sSty.text)}>
                        <span className={cn('w-1 h-1 rounded-full', sSty.dot)} />
                        {tx.statut}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">{tx.date}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <p className="text-xs text-[#9CA3AF]">{filtered.length} transactions affichées</p>
        </div>
      </div>
    </div>
  )
}
