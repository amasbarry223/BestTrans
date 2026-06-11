'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  QrCode,
  Smartphone,
  Percent,
  FileText,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { exportCsv, printDocument } from '@/lib/export-utils'
import { buildHistoriqueReportPrintHtml } from '@/lib/print-templates'
import { useAuthUser } from '@/hooks/use-auth-user'
import { toast } from 'sonner'
import { useDashboard } from '@/components/dashboard/dashboard-context'

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

type TxType = 'Dépôt' | 'Retrait' | 'Transfert' | 'Retrait Transfert' | 'Airtime' | 'Commission'
type TxStatus = 'Succès' | 'En cours' | 'Échoué' | 'Payé'
type PeriodFilter = "Aujourd'hui" | 'Hier' | 'Cette semaine' | 'Ce mois'

const txTypeIcon: Record<TxType, React.ElementType> = {
  'Dépôt': ArrowDownToLine,
  'Retrait': ArrowUpFromLine,
  'Transfert': Send,
  'Retrait Transfert': QrCode,
  'Airtime': Smartphone,
  'Commission': Percent,
}

const txTypeAccent: Record<TxType, { iconBg: string; iconText: string; rowHover?: string }> = {
  'Dépôt':             { iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
  'Retrait':           { iconBg: 'bg-sky-100',     iconText: 'text-sky-600' },
  'Transfert':         { iconBg: 'bg-amber-100',   iconText: 'text-amber-600' },
  'Retrait Transfert': { iconBg: 'bg-violet-100',  iconText: 'text-violet-600' },
  'Airtime':           { iconBg: 'bg-rose-100',    iconText: 'text-rose-600' },
  'Commission':        { iconBg: 'bg-teal-100',    iconText: 'text-teal-600' },
}

const statusStyle: Record<TxStatus, { bg: string; text: string; dot: string }> = {
  'Succès':   { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'En cours': { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Échoué':   { bg: 'bg-rose-50',     text: 'text-rose-700',    dot: 'bg-rose-500' },
  'Payé':     { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

const periodTabs: PeriodFilter[] = ["Aujourd'hui", 'Hier', 'Cette semaine', 'Ce mois']

const typeOptions: { label: string; value: TxType | 'Tous' }[] = [
  { label: 'Tous les types', value: 'Tous' },
  { label: 'Dépôt', value: 'Dépôt' },
  { label: 'Retrait', value: 'Retrait' },
  { label: 'Transfert', value: 'Transfert' },
  { label: 'Retrait Transfert', value: 'Retrait Transfert' },
  { label: 'Airtime', value: 'Airtime' },
  { label: 'Commission', value: 'Commission' },
]

const statusOptions: { label: string; value: TxStatus | 'Tous' }[] = [
  { label: 'Tous les statuts', value: 'Tous' },
  { label: 'Succès', value: 'Succès' },
  { label: 'En cours', value: 'En cours' },
  { label: 'Échoué', value: 'Échoué' },
  { label: 'Payé', value: 'Payé' },
]

/* ------------------------------------------------------------------ */
/*  Transaction Data (15 rows)                                         */
/* ------------------------------------------------------------------ */

interface Transaction {
  id: string
  type: TxType
  description: string
  client: string
  amount: string
  positive: boolean
  date: string
  time: string
  status: TxStatus
  reference: string
  period: PeriodFilter
}

const transactions: Transaction[] = [
  { id: '1',  type: 'Dépôt',             description: 'Dépôt wallet Orange Money', client: 'Koffi Dossou',       amount: '150,000 FCFA',  positive: true,  date: "Aujourd'hui", time: '14:30', status: 'Succès',   reference: 'RIC-2025-001247', period: "Aujourd'hui" },
  { id: '2',  type: 'Retrait',           description: 'Retrait wallet',            client: 'Fatou Alazar',       amount: '25,000 FCFA',   positive: false, date: "Aujourd'hui", time: '13:45', status: 'Succès',   reference: 'RIC-2025-001246', period: "Aujourd'hui" },
  { id: '3',  type: 'Transfert',         description: 'Transfert national',        client: 'Ibrahim Saka',       amount: '50,750 FCFA',   positive: false, date: "Aujourd'hui", time: '12:20', status: 'En cours', reference: 'RIC-2025-001245', period: "Aujourd'hui" },
  { id: '4',  type: 'Retrait Transfert', description: 'Retrait transfert MTN',     client: 'Aminata Diallo',     amount: '80,000 FCFA',   positive: true,  date: "Aujourd'hui", time: '11:15', status: 'Succès',   reference: 'RIC-2025-001244', period: "Aujourd'hui" },
  { id: '5',  type: 'Airtime',           description: 'Recharge Orange 1000',      client: '+223 70 12 34 56',   amount: '1,000 FCFA',    positive: false, date: "Aujourd'hui", time: '10:50', status: 'Succès',   reference: 'RIC-2025-001243', period: "Aujourd'hui" },
  { id: '6',  type: 'Dépôt',             description: 'Dépôt wallet MTN',          client: 'Moussa Bello',       amount: '200,000 FCFA',  positive: true,  date: "Aujourd'hui", time: '10:30', status: 'Succès',   reference: 'RIC-2025-001242', period: "Aujourd'hui" },
  { id: '7',  type: 'Commission',        description: 'Commission transaction',    client: '—',                  amount: '3,750 FCFA',    positive: true,  date: "Aujourd'hui", time: '09:00', status: 'Payé',     reference: 'RIC-2025-001241', period: "Aujourd'hui" },
  { id: '8',  type: 'Transfert',         description: 'Transfert national',        client: 'Adèle Kpéka',        amount: '75,500 FCFA',   positive: false, date: 'Hier',        time: '16:45', status: 'En cours', reference: 'RIC-2025-001240', period: 'Hier' },
  { id: '9',  type: 'Dépôt',             description: 'Dépôt wallet Orange Money', client: 'Seydou Traoré',      amount: '500,000 FCFA',  positive: true,  date: 'Hier',        time: '14:10', status: 'Succès',   reference: 'RIC-2025-001239', period: 'Hier' },
  { id: '10', type: 'Retrait',           description: 'Retrait wallet',            client: '+223 76 55 67 89',   amount: '30,000 FCFA',   positive: false, date: 'Hier',        time: '11:30', status: 'Échoué',   reference: 'RIC-2025-001238', period: 'Hier' },
  { id: '11', type: 'Airtime',           description: 'Recharge MTN 500',          client: 'Awa Konaté',         amount: '500 FCFA',      positive: false, date: 'Hier',        time: '09:20', status: 'Succès',   reference: 'RIC-2025-001237', period: 'Hier' },
  { id: '12', type: 'Commission',        description: 'Commission hebdomadaire',   client: '—',                  amount: '12,500 FCFA',   positive: true,  date: '25 Fév',      time: '08:00', status: 'Payé',     reference: 'RIC-2025-001230', period: 'Cette semaine' },
  { id: '13', type: 'Transfert',         description: 'Transfert international',   client: 'Oumar Sidibé',       amount: '250,000 FCFA',  positive: false, date: '24 Fév',      time: '15:30', status: 'Succès',   reference: 'RIC-2025-001225', period: 'Cette semaine' },
  { id: '14', type: 'Dépôt',             description: 'Dépôt wallet Orange Money', client: 'Mariam Cissé',       amount: '75,000 FCFA',   positive: true,  date: '20 Fév',      time: '10:00', status: 'Succès',   reference: 'RIC-2025-001210', period: 'Ce mois' },
  { id: '15', type: 'Retrait Transfert', description: 'Retrait transfert Orange',  client: '+223 77 88 99 00',   amount: '45,000 FCFA',   positive: true,  date: '18 Fév',      time: '14:15', status: 'Échoué',   reference: 'RIC-2025-001200', period: 'Ce mois' },
]

/* ------------------------------------------------------------------ */
/*  Helper: matches period filter                                       */
/* ------------------------------------------------------------------ */

function matchesPeriod(txPeriod: PeriodFilter, filter: PeriodFilter): boolean {
  if (filter === 'Ce mois') return true
  if (filter === 'Cette semaine') return txPeriod === "Aujourd'hui" || txPeriod === 'Hier' || txPeriod === 'Cette semaine'
  if (filter === 'Hier') return txPeriod === 'Hier'
  return txPeriod === "Aujourd'hui"
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function HistoriqueView() {
  const { navigateToTransactionDetails } = useDashboard()
  const user = useAuthUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("Ce mois")
  const [typeFilter, setTypeFilter] = useState<TxType | 'Tous'>('Tous')
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'Tous'>('Tous')
  const [showExport, setShowExport] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  /* ---- Filtered data ---- */
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase())
      const matchType = typeFilter === 'Tous' || tx.type === typeFilter
      const matchStatus = statusFilter === 'Tous' || tx.status === statusFilter
      const matchPeriod = matchesPeriod(tx.period, periodFilter)
      return matchSearch && matchType && matchStatus && matchPeriod
    })
  }, [searchQuery, typeFilter, statusFilter, periodFilter])

  /* ---- Dynamic stats from filtered data ---- */
  const filteredStats = useMemo(() => {
    const success = filtered.filter(tx => tx.status === 'Succès' || tx.status === 'Payé').length
    const failed = filtered.filter(tx => tx.status === 'Échoué').length
    const totalVolume = filtered.reduce((sum, tx) => {
      const num = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 0
      return sum + num
    }, 0)
    return {
      total: filtered.length,
      volume: totalVolume,
      successRate: filtered.length > 0 ? ((success / filtered.length) * 100).toFixed(1) : '0',
      failed,
    }
  }, [filtered])

  /* ---- Pagination ---- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * pageSize
  const pageData = filtered.slice(startIdx, startIdx + pageSize)
  const showingFrom = filtered.length === 0 ? 0 : startIdx + 1
  const showingTo = Math.min(startIdx + pageSize, filtered.length)

  /* ---- Reset page on filter change ---- */
  const handlePeriodChange = (p: PeriodFilter) => { setPeriodFilter(p); setCurrentPage(1) }
  const handleTypeChange = (t: TxType | 'Tous') => { setTypeFilter(t); setCurrentPage(1) }
  const handleStatusChange = (s: TxStatus | 'Tous') => { setStatusFilter(s); setCurrentPage(1) }

  const openDetails = (tx: Transaction) => {
    navigateToTransactionDetails({
      id: tx.id,
      type: tx.type,
      status: tx.status,
      period: tx.period,
      date: tx.date,
      time: tx.time,
      amount: tx.amount,
      positive: tx.positive,
      description: tx.description,
      client: tx.client,
      reference: tx.reference,
    })
  }

  function handleExportCsv() {
    exportCsv(
      filtered.map((tx) => ({
        Référence: tx.reference,
        Type: tx.type,
        Client: tx.client,
        Description: tx.description,
        Montant: tx.amount,
        Statut: tx.status,
        Période: tx.period,
      })),
      `historique-ricash-${Date.now()}.csv`
    )
    toast.success('Export CSV téléchargé')
    setShowExport(false)
  }

  function handleExportPdf() {
    const ok = printDocument(
      buildHistoriqueReportPrintHtml({
        rows: filtered.map((tx) => ({
          reference: tx.reference,
          type: tx.type,
          client: tx.client,
          description: tx.description,
          amount: tx.amount,
          status: tx.status,
          period: tx.period,
          date: tx.date,
          time: tx.time,
          positive: tx.positive,
        })),
        period: periodFilter,
        type: typeFilter,
        status: statusFilter,
        search: searchQuery,
        stats: filteredStats,
        agentName: user?.name,
        agentLocation: user?.location,
      }),
      'Historique Ricash'
    )
    if (ok) {
      toast.success('Aperçu PDF ouvert pour impression')
    } else {
      toast.error('Impossible d\'ouvrir la fenêtre d\'impression')
    }
    setShowExport(false)
  }

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* ============================================================ */}
      {/* 1. HEADER                                                     */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Historique</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Historique complet de vos transactions</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="h-10 inline-flex items-center gap-2 px-4 bg-white border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#111827] hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#6B7280]" />
            Exporter
          </button>
          {showExport && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-20 min-w-[160px] animate-in fade-in-0 slide-in-from-top-1">
              <button
                onClick={handleExportPdf}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
              >
                <FileText className="w-4 h-4 text-rose-500" />
                Exporter PDF
              </button>
              <button
                onClick={handleExportCsv}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                Exporter Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STATS ROW (dynamic based on filters)                       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total transactions */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-sky-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">Transactions</p>
            <p className="text-lg font-bold text-[#111827] mt-0.5">{filteredStats.total}</p>
          </div>
        </div>

        {/* Volume total */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">Volume total</p>
            <p className="text-lg font-bold text-[#111827] mt-0.5">
              {filteredStats.volume >= 1000000
                ? `${(filteredStats.volume / 1000000).toFixed(1)}M`
                : `${(filteredStats.volume / 1000).toFixed(0)}K`
              }{' '}
              <span className="text-sm font-medium text-[#6B7280]">FCFA</span>
            </p>
          </div>
        </div>

        {/* Taux de succès */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">Taux de succès</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">{filteredStats.successRate}%</p>
          </div>
        </div>

        {/* Échouées */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">Échouées</p>
            <p className="text-lg font-bold text-rose-600 mt-0.5">{filteredStats.failed}</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MAIN CONTENT: 2-COLUMN LAYOUT                             */}
      {/* ============================================================ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
        {/* ---- Left Column (3/5): Filter bar + Transaction list ---- */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
          {/* Filter Bar */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Top row: search + dropdowns + results count */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                    placeholder="Rechercher par client, description, référence..."
                    className="w-full h-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-9 pr-9 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); setCurrentPage(1) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Type dropdown */}
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => handleTypeChange(e.target.value as TxType | 'Tous')}
                    className="h-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-3 pr-8 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer transition-colors"
                  >
                    {typeOptions.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                </div>

                {/* Status dropdown */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value as TxStatus | 'Tous')}
                    className="h-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-3 pr-8 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer transition-colors"
                  >
                    {statusOptions.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                </div>

                {/* Results count (inline, hidden on small) */}
                <span className="hidden lg:inline text-sm text-[#9CA3AF] whitespace-nowrap">
                  {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Period tabs (pill-style buttons) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                {periodTabs.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                      periodFilter === p
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827]'
                    )}
                  >
                    {p}
                  </button>
                ))}
                {/* Results count on mobile/tablet */}
                <span className="lg:hidden text-xs text-[#9CA3AF] ml-auto whitespace-nowrap">
                  {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* ---- Transaction List ---- */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex-1 flex flex-col min-h-0 shadow-sm">
            {/* ---- Desktop Table ---- */}
            <div className="hidden md:block overflow-auto flex-1">
              <table className="w-full">
                {/* Sticky header */}
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Description</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Montant</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Date / Heure</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Référence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {pageData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16">
                        <EmptyState />
                      </td>
                    </tr>
                  ) : (
                    pageData.map((tx) => {
                      const Icon = txTypeIcon[tx.type]
                      const accent = txTypeAccent[tx.type]
                      const sStyle = statusStyle[tx.status]
                      return (
                        <tr
                          key={tx.id}
                          onClick={() => openDetails(tx)}
                          className={cn(
                            'transition-colors cursor-pointer hover:bg-emerald-50/50'
                          )}
                        >
                          {/* Type icon + label */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', accent.iconBg)}>
                                <Icon className={cn('w-4 h-4', accent.iconText)} />
                              </div>
                              <span className="text-sm font-medium text-[#111827]">{tx.type}</span>
                            </div>
                          </td>
                          {/* Description */}
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-semibold text-[#111827]">{tx.description}</span>
                          </td>
                          {/* Client */}
                          <td className="px-5 py-3.5">
                            <span className="text-sm text-[#6B7280]">{tx.client}</span>
                          </td>
                          {/* Amount */}
                          <td className="px-5 py-3.5 text-right">
                            <span className={cn(
                              'text-sm font-bold',
                              tx.positive ? 'text-emerald-600' : 'text-rose-600'
                            )}>
                              {tx.positive ? '+' : '−'}{tx.amount}
                            </span>
                          </td>
                          {/* Date/Time */}
                          <td className="px-5 py-3.5">
                            <div className="text-sm text-[#111827]">{tx.date}</div>
                            <div className="text-xs text-[#9CA3AF]">{tx.time}</div>
                          </td>
                          {/* Status badge */}
                          <td className="px-5 py-3.5 text-center">
                            <span className={cn(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                              sStyle.bg, sStyle.text
                            )}>
                              <span className={cn('w-1.5 h-1.5 rounded-full', sStyle.dot)} />
                              {tx.status}
                            </span>
                          </td>
                          {/* Reference */}
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-mono text-[#9CA3AF]">{tx.reference}</span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ---- Mobile Card List ---- */}
            <div className="md:hidden overflow-y-auto flex-1">
              {pageData.length === 0 ? (
                <div className="py-16">
                  <EmptyState />
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {pageData.map((tx) => {
                    const Icon = txTypeIcon[tx.type]
                    const accent = txTypeAccent[tx.type]
                    const sStyle = statusStyle[tx.status]
                    return (
                      <div
                        key={tx.id}
                        onClick={() => openDetails(tx)}
                        className={cn(
                          'p-4 transition-colors cursor-pointer hover:bg-emerald-50/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', accent.iconBg)}>
                            <Icon className={cn('w-5 h-5', accent.iconText)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Top line: type + status */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-[#111827]">{tx.type}</span>
                              <span className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                                sStyle.bg, sStyle.text
                              )}>
                                <span className={cn('w-1.5 h-1.5 rounded-full', sStyle.dot)} />
                                {tx.status}
                              </span>
                            </div>
                            {/* Description */}
                            <p className="text-sm text-[#6B7280] mt-0.5 truncate">{tx.description}</p>
                            {/* Client */}
                            <p className="text-xs text-[#9CA3AF] mt-1">{tx.client}</p>
                            {/* Bottom line: amount + date + ref */}
                            <div className="flex items-center justify-between mt-2">
                              <span className={cn(
                                'text-sm font-bold',
                                tx.positive ? 'text-emerald-600' : 'text-rose-600'
                              )}>
                                {tx.positive ? '+' : '−'}{tx.amount}
                              </span>
                              <span className="text-xs text-[#9CA3AF]">{tx.date}, {tx.time}</span>
                            </div>
                            <p className="text-xs font-mono text-[#D1D5DB] mt-1">{tx.reference}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ---- Pagination Footer (inside left column for 2-col layout) ---- */}
            <div className="border-t border-[#E5E7EB] px-5 py-3 flex items-center justify-between bg-[#F9FAFB]">
              <p className="text-sm text-[#6B7280]">
                Affichage {showingFrom}–{showingTo} sur {filtered.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-9 h-9 rounded-lg text-sm font-medium transition-all',
                      page === safePage
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                         */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center">
        <Inbox className="w-7 h-7 text-[#9CA3AF]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#111827]">Aucune transaction trouvée</p>
        <p className="text-xs text-[#9CA3AF] mt-1">Essayez de modifier vos critères de recherche</p>
      </div>
    </div>
  )
}
