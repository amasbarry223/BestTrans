'use client'

import React, { useState } from 'react'
import {
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Clock,
  ShieldCheck,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Smartphone,
  ChevronRight,
  Activity,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useDashboard } from '@/components/dashboard/dashboard-context'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const reconciliationData: {
  heure: string
  type: 'Dépôt' | 'Retrait' | 'Transfert' | 'Commission' | 'Airtime'
  montant: string
  soldeApres: string
  reference: string
}[] = [
  { heure: '16:45', type: 'Dépôt',      montant: '+150,000 FCFA',  soldeApres: '2,450,000 FCFA', reference: 'RIC-25-001242' },
  { heure: '15:30', type: 'Retrait',     montant: '-75,000 FCFA',   soldeApres: '2,300,000 FCFA', reference: 'RIC-25-001241' },
  { heure: '14:15', type: 'Transfert',   montant: '-200,000 FCFA',  soldeApres: '2,375,000 FCFA', reference: 'RIC-25-001240' },
  { heure: '12:40', type: 'Dépôt',      montant: '+320,000 FCFA',  soldeApres: '2,575,000 FCFA', reference: 'RIC-25-001239' },
  { heure: '11:20', type: 'Commission',  montant: '+8,500 FCFA',    soldeApres: '2,255,000 FCFA', reference: 'RIC-25-001238' },
  { heure: '10:05', type: 'Retrait',     montant: '-125,000 FCFA',  soldeApres: '2,246,500 FCFA', reference: 'RIC-25-001237' },
  { heure: '09:30', type: 'Airtime',     montant: '-15,000 FCFA',   soldeApres: '2,371,500 FCFA', reference: 'RIC-25-001236' },
  { heure: '08:15', type: 'Dépôt',      montant: '+500,000 FCFA',  soldeApres: '2,386,500 FCFA', reference: 'RIC-25-001235' },
]

type ReconciliationType = typeof reconciliationData[number]['type']

const typeStyle: Record<ReconciliationType, { badge: string; amount: string; iconBg: string; iconText: string }> = {
  'Dépôt':     { badge: 'bg-emerald-50 text-emerald-700',  amount: 'text-emerald-600', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
  'Retrait':   { badge: 'bg-rose-50 text-rose-700',         amount: 'text-rose-600',    iconBg: 'bg-rose-100',    iconText: 'text-rose-600' },
  'Transfert': { badge: 'bg-amber-50 text-amber-700',       amount: 'text-amber-600',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600' },
  'Commission':{ badge: 'bg-teal-50 text-teal-700',         amount: 'text-teal-600',    iconBg: 'bg-teal-100',    iconText: 'text-teal-600' },
  'Airtime':   { badge: 'bg-violet-50 text-violet-700',     amount: 'text-violet-600',  iconBg: 'bg-violet-100',  iconText: 'text-violet-600' },
}

const typeIcon: Record<ReconciliationType, React.ElementType> = {
  'Dépôt': ArrowDownToLine,
  'Retrait': ArrowUpFromLine,
  'Transfert': Send,
  'Commission': TrendingUp,
  'Airtime': Smartphone,
}

const recentOperations: {
  label: string
  amount: string
  positive: boolean
  time: string
  icon: React.ElementType
  iconBg: string
  iconText: string
}[] = [
  { label: 'Dépôt - A. Diallo',        amount: '+150,000 FCFA',  positive: true,  time: '16:45', icon: ArrowDownToLine, iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
  { label: 'Retrait - I. Sow',          amount: '-75,000 FCFA',   positive: false, time: '15:30', icon: ArrowUpFromLine, iconBg: 'bg-rose-100',    iconText: 'text-rose-600' },
  { label: 'Transfert - M. Koné',       amount: '-200,000 FCFA',  positive: false, time: '14:15', icon: Send,            iconBg: 'bg-amber-100',   iconText: 'text-amber-600' },
  { label: 'Dépôt - Y. Touré',          amount: '+320,000 FCFA',  positive: true,  time: '12:40', icon: ArrowDownToLine, iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
]

/* ------------------------------------------------------------------ */
/*  Threshold calculations                                             */
/* ------------------------------------------------------------------ */

/* ---- Balance trend chart data ---- */
const balanceTrendData = [
  { time: '08h', balance: 1800000 },
  { time: '09h', balance: 2371500 },
  { time: '10h', balance: 2386500 },
  { time: '11h', balance: 2255000 },
  { time: '12h', balance: 2575000 },
  { time: '13h', balance: 2575000 },
  { time: '14h', balance: 2375000 },
  { time: '15h', balance: 2300000 },
  { time: '16h', balance: 2450000 },
]

const balanceTrendConfig: ChartConfig = {
  balance: { label: 'Solde', color: '#10b981' },
}

const currentBalance = 2_450_000
const minThreshold = 500_000
const maxThreshold = 5_000_000
const thresholdPercent = Math.round(
  ((currentBalance - minThreshold) / (maxThreshold - minThreshold)) * 100
)

const dailyIn = 850_000
const dailyOut = 625_000
const dailyNet = dailyIn - dailyOut

function formatFcfa(amount: number, compact = false) {
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2).replace('.', ',')}M`
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `${Math.round(amount / 1_000)}K`
  }
  return amount.toLocaleString('fr-FR')
}

function liquidityStatus(percent: number) {
  if (percent < 20) {
    return {
      label: 'Critique',
      badge: 'bg-rose-50 text-rose-700 ring-rose-200/80',
      dot: 'bg-rose-500',
      bar: 'bg-rose-500',
    }
  }
  if (percent < 50) {
    return {
      label: 'Attention',
      badge: 'bg-amber-50 text-amber-800 ring-amber-200/80',
      dot: 'bg-amber-500',
      bar: 'bg-amber-500',
    }
  }
  return {
    label: 'Disponible',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CaisseView() {
  const { setActiveView } = useDashboard()
  const [refreshing, setRefreshing] = useState(false)
  const [reapproOpen, setReapproOpen] = useState(false)
  const [reapproSubmitting, setReapproSubmitting] = useState(false)
  const [reapproAmount, setReapproAmount] = useState('')
  const [reapproMethod, setReapproMethod] = useState<
    'Cash' | 'Virement' | 'Orange Money' | 'MTN' | 'Autre'
  >('Cash')
  const [reapproReference, setReapproReference] = useState('')
  const [reapproNote, setReapproNote] = useState('')
  const status = liquidityStatus(thresholdPercent)

  function parseFcfaInput(raw: string) {
    const cleaned = raw.replace(/[^\d]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : NaN
  }

  function handleRefresh() {
    setRefreshing(true)
    toast.success('Solde actualisé', { description: 'Les données de caisse sont à jour' })
    window.setTimeout(() => setRefreshing(false), 800)
  }

  async function submitReappro() {
    const amount = parseFcfaInput(reapproAmount)
    if (!amount || amount <= 0) {
      toast.error('Montant invalide', { description: 'Veuillez saisir un montant supérieur à 0' })
      return
    }

    setReapproSubmitting(true)
    try {
      await new Promise((r) => window.setTimeout(r, 600))
      toast.success('Demande envoyée', {
        description: 'Votre demande de réapprovisionnement a été envoyée',
      })
      setReapproOpen(false)
      setReapproAmount('')
      setReapproMethod('Cash')
      setReapproReference('')
      setReapproNote('')
    } finally {
      setReapproSubmitting(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col gap-5 overflow-y-auto">
      {/* ============================================================ */}
      {/*  Header                                                       */}
      {/* ============================================================ */}
      <div>
        <h1 className="text-xl font-bold text-[#111827] tracking-tight">Caisse</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">Gestion de votre caisse et liquidités</p>
      </div>

      {/* ============================================================ */}
      {/*  Solde de caisse — barre principale                           */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-600" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-50/80 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-teal-50/60 blur-2xl pointer-events-none" />

        <div className="relative px-5 py-5 sm:px-6 sm:py-6">
          {/* Ligne 1 : titre + statut + refresh */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm shadow-emerald-600/25">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Solde de caisse
                </p>
                <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                  Liquidités disponibles au point de service
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
                  status.badge
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                {status.label}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                aria-label="Actualiser le solde"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 disabled:opacity-60"
              >
                <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
              </button>
            </div>
          </div>

          {/* Ligne 2 : montant */}
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-[#F3F4F6] pb-5">
            <div>
              <p className="text-3xl sm:text-[2.5rem] font-bold tracking-tight text-[#111827] tabular-nums leading-none">
                {formatFcfa(currentBalance)}
              </p>
              <p className="mt-1.5 text-sm font-medium text-[#6B7280]">FCFA</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Niveau de liquidité
              </p>
              <p className="mt-0.5 text-lg font-bold text-emerald-600 tabular-nums">
                {thresholdPercent}%
              </p>
              <p className="text-[10px] text-[#9CA3AF]">du plafond max</p>
            </div>
          </div>

          {/* Ligne 3 : jauge seuil */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mb-1.5">
              <span>Min {formatFcfa(minThreshold, true)}</span>
              <span className="font-medium text-[#6B7280]">Actuel</span>
              <span>Max {formatFcfa(maxThreshold, true)}</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
              <div
                className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-700', status.bar)}
                style={{ width: `${Math.min(Math.max(thresholdPercent, 4), 100)}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-600 shadow-sm"
                style={{ left: `calc(${Math.min(thresholdPercent, 98)}% - 7px)` }}
              />
            </div>
          </div>

          {/* Ligne 4 : flux du jour + MAJ */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50/80 px-3 py-2 ring-1 ring-emerald-100/80">
                <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-[#6B7280]">Entrées</p>
                  <p className="text-xs font-bold text-emerald-700 tabular-nums">
                    +{formatFcfa(dailyIn)} F
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-rose-50/80 px-3 py-2 ring-1 ring-rose-100/80">
                <ArrowUpRight className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-[#6B7280]">Sorties</p>
                  <p className="text-xs font-bold text-rose-700 tabular-nums">
                    -{formatFcfa(dailyOut)} F
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-teal-50/80 px-3 py-2 ring-1 ring-teal-100/80">
                <TrendingUp className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-[#6B7280]">Net jour</p>
                  <p className="text-xs font-bold text-teal-700 tabular-nums">
                    +{formatFcfa(dailyNet)} F
                  </p>
                </div>
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] shrink-0">
              <Clock className="h-3.5 w-3.5" />
              Dernière mise à jour · il y a 5 min
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Balance trend chart                                           */}
      {/* ============================================================ */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Évolution du solde aujourd&apos;hui</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            <span>En temps réel</span>
          </div>
        </div>
        <ChartContainer config={balanceTrendConfig} className="h-[160px] w-full">
          <AreaChart data={balanceTrendData}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* ============================================================ */}
      {/*  Main content (2 columns: 3:2 on desktop)                    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ---- Left: Réconciliation table (3/5) ---- */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Réconciliation</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {reconciliationData.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('historique')}
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Voir tout
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block flex-1 overflow-y-auto min-h-0 max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Heure</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Montant</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Solde après</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Réf</th>
                </tr>
              </thead>
              <tbody>
                {reconciliationData.map((row, i) => {
                  const style = typeStyle[row.type]
                  const Icon = typeIcon[row.type]
                  return (
                    <tr
                      key={i}
                      className={cn(
                        'border-b border-[#F3F4F6] last:border-b-0',
                        'hover:bg-[#F9FAFB] transition-colors cursor-pointer group'
                      )}
                    >
                      <td className="py-3 px-5 text-[#6B7280] text-xs whitespace-nowrap">{row.heure}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', style.iconBg)}>
                            <Icon className={cn('w-3.5 h-3.5', style.iconText)} />
                          </div>
                          <span
                            className={cn(
                              'inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold',
                              style.badge
                            )}
                          >
                            {row.type}
                          </span>
                        </div>
                      </td>
                      <td className={cn('py-3 px-3 text-right font-bold text-xs whitespace-nowrap', style.amount)}>
                        {row.montant}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-[#111827] text-xs whitespace-nowrap">
                        {row.soldeApres}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-[10px] text-[#9CA3AF] font-mono group-hover:text-[#6B7280] transition-colors">
                          {row.reference.slice(-6)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card list */}
          <div className="md:hidden flex-1 overflow-y-auto min-h-0 max-h-96">
            <div className="divide-y divide-[#F3F4F6]">
              {reconciliationData.map((row, i) => {
                const style = typeStyle[row.type]
                const Icon = typeIcon[row.type]
                return (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', style.iconBg)}>
                      <Icon className={cn('w-4 h-4', style.iconText)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold',
                              style.badge
                            )}
                          >
                            {row.type}
                          </span>
                          <span className="text-[10px] text-[#9CA3AF]">{row.heure}</span>
                        </div>
                        <span className={cn('text-sm font-bold whitespace-nowrap ml-2', style.amount)}>
                          {row.montant}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                        Solde: {row.soldeApres} · {row.reference.slice(-6)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ---- Right column (2/5) ---- */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Alert card */}
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111827]">Alerte liquidité</p>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Votre caisse approche le seuil minimum de <span className="font-semibold text-amber-700">500,000 FCFA</span>. Pensez à réapprovisionner.
                </p>
              </div>
            </div>
          </div>

          {/* Dernières opérations */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#111827]">Dernières opérations</h2>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Tout voir
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {recentOperations.map((op, i) => {
                const OpIcon = op.icon
                return (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', op.iconBg)}>
                      <OpIcon className={cn('w-4 h-4', op.iconText)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#111827] truncate group-hover:text-emerald-600 transition-colors">
                        {op.label}
                      </p>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{op.time}</p>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-bold whitespace-nowrap',
                        op.positive ? 'text-emerald-600' : 'text-rose-600'
                      )}
                    >
                      {op.amount}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Approvisionnement button */}
          <button
            type="button"
            onClick={() => setReapproOpen(true)}
            className="w-full h-12 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Effectuer un réapprovisionnement
          </button>

          <Dialog open={reapproOpen} onOpenChange={setReapproOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
              <DialogHeader className="p-5 pb-2">
                <DialogTitle>Demande de réapprovisionnement</DialogTitle>
                <DialogDescription>
                  Saisissez les informations et envoyez la demande.
                </DialogDescription>
              </DialogHeader>

              <div className="px-5 pb-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#111827]">Montant (FCFA)</label>
                  <input
                    value={reapproAmount}
                    onChange={(e) => setReapproAmount(e.target.value)}
                    inputMode="numeric"
                    placeholder="Ex: 500000"
                    className="mt-1 w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <p className="mt-1 text-[11px] text-[#6B7280]">
                    Exemple : 500 000
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#111827]">Moyen</label>
                  <select
                    value={reapproMethod}
                    onChange={(e) =>
                      setReapproMethod(
                        e.target.value as 'Cash' | 'Virement' | 'Orange Money' | 'MTN' | 'Autre'
                      )
                    }
                    className="mt-1 w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Virement">Virement</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN">MTN</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#111827]">
                    Référence (optionnel)
                  </label>
                  <input
                    value={reapproReference}
                    onChange={(e) => setReapproReference(e.target.value)}
                    placeholder="N° reçu / ID transaction"
                    className="mt-1 w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#111827]">
                    Note (optionnel)
                  </label>
                  <textarea
                    value={reapproNote}
                    onChange={(e) => setReapproNote(e.target.value)}
                    rows={3}
                    placeholder="Détails ou contexte"
                    className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setReapproOpen(false)}
                    className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#374151] hover:bg-gray-50 active:scale-[0.98] transition-all"
                    disabled={reapproSubmitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={submitReappro}
                    className="flex-1 h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-60"
                    disabled={reapproSubmitting}
                  >
                    {reapproSubmitting ? 'Envoi…' : 'Envoyer la demande'}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Threshold indicator                                          */}
      {/* ============================================================ */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-semibold text-[#111827]">Seuil de liquidité</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Suivi du solde par rapport aux seuils définis</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-[#6B7280]">Min: <span className="font-semibold text-[#111827]">500,000 FCFA</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#6B7280]">Max: <span className="font-semibold text-[#111827]">5,000,000 FCFA</span></span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-3 w-full rounded-full bg-[#F3F4F6] overflow-hidden">
            {/* Min threshold marker zone (0-10% = danger) */}
            <div
              className="absolute top-0 left-0 h-full bg-rose-100 rounded-l-full"
              style={{ width: '10%' }}
            />
            {/* Actual bar */}
            <div
              className={cn(
                'absolute top-0 left-0 h-full rounded-full transition-all duration-700',
                thresholdPercent < 20
                  ? 'bg-rose-500'
                  : thresholdPercent < 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(thresholdPercent, 100)}%` }}
            />
          </div>
          {/* Min threshold marker */}
          <div
            className="absolute -top-1 w-0.5 h-5 bg-rose-400 rounded-full"
            style={{ left: '10%' }}
          />
          {/* Current balance marker */}
          <div
            className="absolute -top-0.5 flex flex-col items-center"
            style={{ left: `${Math.min(thresholdPercent, 98)}%` }}
          >
            <div className="w-4 h-4 rounded-full bg-white border-2 border-emerald-500 shadow-sm" />
          </div>
        </div>

        {/* Labels under bar */}
        <div className="flex justify-between mt-2 text-[10px] text-[#9CA3AF]">
          <span>0 FCFA</span>
          <span className="text-rose-500 font-semibold">500K</span>
          <span>2.5M</span>
          <span>5M FCFA</span>
        </div>

        {/* Current status text */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">Solde actuel:</span>
          <span className="text-sm font-bold text-emerald-600">2,450,000 FCFA</span>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-3 h-3" />
            {thresholdPercent}% du max
          </span>
        </div>
      </div>
    </div>
  )
}
