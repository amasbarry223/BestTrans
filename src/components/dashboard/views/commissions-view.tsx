'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  Calendar,
  Hash,
  BarChart3,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Smartphone,
  MoreHorizontal,
  ChevronRight,
  Clock,
  Activity,
  PieChart as PieChartIcon,
  RefreshCw,
  Circle,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'

/* ------------------------------------------------------------------ */
/*  Types & Accent Map                                                 */
/* ------------------------------------------------------------------ */

type TxType = 'Course standard' | 'Course premium' | 'Aéroport' | 'Abonnement' | 'Autres'
type TxStatus = 'Versé' | 'En attente' | 'Annulé'

const accentMap: Record<string, { bg: string; iconBg: string; iconText: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', ring: 'ring-emerald-200' },
  sky:     { bg: 'bg-sky-50',     iconBg: 'bg-sky-100',     iconText: 'text-sky-600',     ring: 'ring-sky-200' },
  amber:   { bg: 'bg-amber-50',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600',   ring: 'ring-amber-200' },
  teal:    { bg: 'bg-teal-50',    iconBg: 'bg-teal-100',    iconText: 'text-teal-600',    ring: 'ring-teal-200' },
  violet:  { bg: 'bg-violet-50',  iconBg: 'bg-violet-100',  iconText: 'text-violet-600',  ring: 'ring-violet-200' },
  rose:    { bg: 'bg-rose-50',    iconBg: 'bg-rose-100',    iconText: 'text-rose-600',    ring: 'ring-rose-200' },
}

const txTypeIcon: Record<TxType, React.ElementType> = {
  'Course standard': Send,
  'Course premium':  ArrowUpFromLine,
  'Aéroport':        ArrowDownToLine,
  'Abonnement':      Smartphone,
  'Autres':          MoreHorizontal,
}

const txTypeAccent: Record<TxType, string> = {
  'Course standard': 'emerald',
  'Course premium':  'sky',
  'Aéroport':        'amber',
  'Abonnement':      'teal',
  'Autres':          'violet',
}

const statusStyle: Record<TxStatus, { bg: string; text: string; dot: string }> = {
  'Versé':      { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'En attente': { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Annulé':     { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500' },
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const summaryCards = [
  {
    label: "Commission aujourd'hui",
    value: '42,500 FCFA',
    trend: '+14%',
    trendUp: true,
    icon: TrendingUp,
    accent: 'emerald' as const,
  },
  {
    label: 'Commission ce mois',
    value: '876,200 FCFA',
    trend: '+11%',
    trendUp: true,
    icon: Calendar,
    accent: 'sky' as const,
  },
  {
    label: 'Courses commissionnées',
    value: '312',
    trend: '',
    trendUp: true,
    icon: Hash,
    accent: 'amber' as const,
  },
  {
    label: 'Taux moyen plateforme',
    value: '15%',
    trend: '',
    trendUp: true,
    icon: BarChart3,
    accent: 'teal' as const,
  },
]

const periodTabs = ['Aujourd\'hui', 'Cette semaine', 'Ce mois'] as const

// Daily commission trend (7 days)
const dailyCommissionData = [
  { day: 'Lun', commission: 28500 },
  { day: 'Mar', commission: 35200 },
  { day: 'Mer', commission: 42800 },
  { day: 'Jeu', commission: 31400 },
  { day: 'Ven', commission: 48600 },
  { day: 'Sam', commission: 22300 },
  { day: 'Dim', commission: 15250 },
]

const dailyCommissionConfig: ChartConfig = {
  commission: { label: 'Commission', color: '#10b981' },
}

// Commission breakdown by type (donut chart)
const typeBreakdownData = [
  { name: 'Course standard', value: 55, color: '#10b981' },
  { name: 'Course premium',  value: 22, color: '#0ea5e9' },
  { name: 'Aéroport',        value: 12, color: '#f59e0b' },
  { name: 'Abonnement',      value: 7,  color: '#14b8a6' },
  { name: 'Autres',          value: 4,  color: '#8b5cf6' },
]

const typeBreakdownConfig: ChartConfig = {
  'Course standard': { label: 'Course standard', color: '#10b981' },
  'Course premium':  { label: 'Course premium',  color: '#0ea5e9' },
  'Aéroport':        { label: 'Aéroport',        color: '#f59e0b' },
  'Abonnement':      { label: 'Abonnement',      color: '#14b8a6' },
  'Autres':          { label: 'Autres',          color: '#8b5cf6' },
}

// Commission history (10 rows)
const commissionHistory: {
  date: string
  transaction: string
  type: TxType
  montant: string
  commission: string
  statut: TxStatus
}[] = [
  { date: '13 Jun 2026', transaction: 'BT-2026-003412', type: 'Course standard', montant: '8,500 FCFA',  commission: '1,275 FCFA', statut: 'Versé' },
  { date: '13 Jun 2026', transaction: 'BT-2026-003408', type: 'Course premium',  montant: '15,000 FCFA', commission: '2,700 FCFA', statut: 'Versé' },
  { date: '13 Jun 2026', transaction: 'BT-2026-003405', type: 'Aéroport',        montant: '25,000 FCFA', commission: '4,375 FCFA', statut: 'Versé' },
  { date: '12 Jun 2026', transaction: 'BT-2026-003399', type: 'Course standard', montant: '6,200 FCFA',  commission: '930 FCFA',   statut: 'En attente' },
  { date: '12 Jun 2026', transaction: 'BT-2026-003394', type: 'Course premium',  montant: '18,500 FCFA', commission: '3,330 FCFA', statut: 'Versé' },
  { date: '12 Jun 2026', transaction: 'BT-2026-003388', type: 'Abonnement',      montant: '20,000 FCFA', commission: '3,000 FCFA', statut: 'Versé' },
  { date: '11 Jun 2026', transaction: 'BT-2026-003381', type: 'Course standard', montant: '7,800 FCFA',  commission: '1,170 FCFA', statut: 'Versé' },
  { date: '11 Jun 2026', transaction: 'BT-2026-003375', type: 'Aéroport',        montant: '30,000 FCFA', commission: '5,250 FCFA', statut: 'Annulé' },
  { date: '11 Jun 2026', transaction: 'BT-2026-003368', type: 'Course standard', montant: '5,500 FCFA',  commission: '825 FCFA',   statut: 'Versé' },
  { date: '10 Jun 2026', transaction: 'BT-2026-003360', type: 'Course premium',  montant: '12,000 FCFA', commission: '2,160 FCFA', statut: 'Versé' },
]

/* ------------------------------------------------------------------ */
/*  Pie Label                                                          */
/* ------------------------------------------------------------------ */

function PieCustomLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}) {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.08) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CommissionsView() {
  const { setActiveView } = useDashboard()
  const [activePeriod, setActivePeriod] = useState<number>(1)

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Commissions</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Revenus plateforme et taux de commission par course</p>
        </div>
        <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-full p-1">
          {periodTabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActivePeriod(i)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                activePeriod === i
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#374151]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Stats row ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const colors = accentMap[card.accent]
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.iconBg)}>
                  <Icon className={cn('w-5 h-5', colors.iconText)} />
                </div>
                {card.trend && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
                      card.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                    )}
                  >
                    {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                    {card.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{card.label}</p>
                <p className="text-xl font-bold text-[#111827] mt-0.5">{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Charts row (3:2) ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Area chart - Daily commission trend */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-emerald-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Tendance des commissions</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Clock className="w-3.5 h-3.5" />
              <span>7 derniers jours</span>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ChartContainer config={dailyCommissionConfig} className="h-[220px] w-full">
              <AreaChart data={dailyCommissionData}>
                <defs>
                  <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="commission"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#commissionGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Quick stats under chart */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur jour</p>
              <p className="text-sm font-bold text-[#111827]">Ven</p>
              <p className="text-xs text-emerald-600">48,600 FCFA</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moyenne</p>
              <p className="text-sm font-bold text-[#111827]">32,008</p>
              <p className="text-xs text-[#6B7280]">FCFA/jour</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Variation</p>
              <p className="text-sm font-bold text-emerald-600">+18%</p>
              <p className="text-xs text-[#6B7280]">vs sem. dern.</p>
            </div>
          </div>
        </div>

        {/* Right: Donut chart - Commission breakdown by type */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4.5 h-4.5 text-sky-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Répartition par type</h2>
            </div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <ChartContainer config={typeBreakdownConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={typeBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={PieCustomLabel}
                  strokeWidth={0}
                >
                  {typeBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [`${value ?? ''}%`, String(name)] as [string, string]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 w-full">
              {typeBreakdownData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-[#6B7280] truncate">{item.name}</span>
                  <span className="text-[11px] font-semibold text-[#111827] ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Commission history table ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Historique des commissions</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {commissionHistory.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('transactions')}
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Voir tout
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop: Enhanced Table */}
        <div className="hidden md:block flex-1 overflow-x-auto overflow-y-auto min-h-0 max-h-[420px]">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Transaction</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Montant</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Commission</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {commissionHistory.map((row, i) => {
                const TxIcon = txTypeIcon[row.type]
                const colors = accentMap[txTypeAccent[row.type]]
                const status = statusStyle[row.statut]
                return (
                  <tr
                    key={i}
                    className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.iconBg)}>
                          <TxIcon className={cn('w-4 h-4', colors.iconText)} />
                        </div>
                        <span className={cn(
                          'inline-block px-2 py-0.5 rounded-full text-xs font-semibold',
                          colors.bg, colors.iconText
                        )}>
                          {row.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-3 font-medium text-[#111827] font-mono text-xs group-hover:text-emerald-600 transition-colors">
                      {row.transaction}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-[#111827] text-xs whitespace-nowrap">{row.montant}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 text-xs whitespace-nowrap">{row.commission}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                          status.bg,
                          status.text
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                        {row.statut}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card list */}
        <div className="md:hidden flex-1 overflow-y-auto min-h-0 max-h-[420px]">
          <div className="divide-y divide-[#F3F4F6]">
            {commissionHistory.map((row, i) => {
              const TxIcon = txTypeIcon[row.type]
              const colors = accentMap[txTypeAccent[row.type]]
              const status = statusStyle[row.statut]
              return (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colors.iconBg)}>
                    <TxIcon className={cn('w-4.5 h-4.5', colors.iconText)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#111827] truncate">{row.type}</p>
                      <span className="text-sm font-bold text-emerald-600 whitespace-nowrap ml-2">
                        {row.commission}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-[#9CA3AF] truncate">{row.date} · {row.transaction.slice(-6)}</p>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ml-2',
                          status.bg,
                          status.text
                        )}
                      >
                        <span className={cn('w-1 h-1 rounded-full', status.dot)} />
                        {row.statut}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <p className="text-xs text-[#9CA3AF]">
            {commissionHistory.length} commissions affichées
          </p>
          <button
            type="button"
            onClick={() => setActiveView('transactions')}
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Voir tout
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
