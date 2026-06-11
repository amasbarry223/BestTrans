'use client'

import React from 'react'
import {
  Wallet,
  ArrowLeftRight,
  Users,
  Percent,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  QrCode,
  Smartphone,
  UserPlus,
  TrendingUp,
  TrendingDown,
  ChevronRight,

  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ViewKey } from '../navigation'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
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

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  {
    label: 'Solde Caisse',
    value: '2 450 000 FCFA',
    trend: '+12%',
    trendUp: true,
    icon: Wallet,
    accent: 'emerald' as const,
  },
  {
    label: 'Transactions du jour',
    value: '47',
    trend: '+8%',
    trendUp: true,
    icon: ArrowLeftRight,
    accent: 'sky' as const,
  },
  {
    label: 'Clients servis',
    value: '23',
    trend: '-3%',
    trendUp: false,
    icon: Users,
    accent: 'amber' as const,
  },
  {
    label: 'Commissions du jour',
    value: '35 250 FCFA',
    trend: '+5%',
    trendUp: true,
    icon: Percent,
    accent: 'teal' as const,
  },
]

const accentMap: Record<string, { bg: string; iconBg: string; iconText: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', ring: 'ring-emerald-200' },
  sky:     { bg: 'bg-sky-50',     iconBg: 'bg-sky-100',     iconText: 'text-sky-600',     ring: 'ring-sky-200' },
  amber:   { bg: 'bg-amber-50',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600',   ring: 'ring-amber-200' },
  teal:    { bg: 'bg-teal-50',    iconBg: 'bg-teal-100',    iconText: 'text-teal-600',    ring: 'ring-teal-200' },
  violet:  { bg: 'bg-violet-50',  iconBg: 'bg-violet-100',  iconText: 'text-violet-600',  ring: 'ring-violet-200' },
  rose:    { bg: 'bg-rose-50',    iconBg: 'bg-rose-100',    iconText: 'text-rose-600',    ring: 'ring-rose-200' },
  blue:    { bg: 'bg-blue-50',    iconBg: 'bg-blue-100',    iconText: 'text-blue-600',    ring: 'ring-blue-200' },
}

const quickActionViewMap: Record<string, ViewKey> = {
  'Dépôt': 'depot',
  'Retrait': 'retrait',
  'Transfert': 'transfert',
  'Retrait Transfert': 'retrait-transfert',
  'Airtime': 'airtime',
  'Nouveau Client': 'clients',
}

const quickActions = [
  { label: 'Dépôt',            icon: ArrowDownToLine, accent: 'emerald' },
  { label: 'Retrait',          icon: ArrowUpFromLine, accent: 'sky' },
  { label: 'Transfert',        icon: Send,            accent: 'amber' },
  { label: 'Retrait Transfert',icon: QrCode,          accent: 'violet' },
  { label: 'Airtime',          icon: Smartphone,      accent: 'rose' },
  { label: 'Nouveau Client',   icon: UserPlus,        accent: 'teal' },
] as const

type TxType = 'Dépôt' | 'Retrait' | 'Transfert' | 'Retrait Transfert' | 'Airtime' | 'Commission'
type TxStatus = 'Succès' | 'En cours' | 'Échoué'

const txTypeIcon: Record<TxType, React.ElementType> = {
  'Dépôt': ArrowDownToLine,
  'Retrait': ArrowUpFromLine,
  'Transfert': Send,
  'Retrait Transfert': QrCode,
  'Airtime': Smartphone,
  'Commission': Percent,
}

const txTypeAccent: Record<TxType, string> = {
  'Dépôt': 'emerald',
  'Retrait': 'sky',
  'Transfert': 'amber',
  'Retrait Transfert': 'violet',
  'Airtime': 'rose',
  'Commission': 'teal',
}

const recentTransactions: {
  id: string
  type: TxType
  description: string
  client: string
  clientInitials: string
  amount: string
  positive: boolean
  time: string
  date: string
  status: TxStatus
  ref: string
}[] = [
  { id: '1', type: 'Dépôt',             description: 'Dépôt wallet',            client: 'Aïcha Diallo',     clientInitials: 'AD', amount: '150 000 FCFA',  positive: true,  time: '09:42', date: "Aujourd'hui", status: 'Succès',   ref: 'RIC-2025-001234' },
  { id: '2', type: 'Retrait',           description: 'Retrait wallet',          client: 'Ibrahim Sow',       clientInitials: 'IS', amount: '75 000 FCFA',   positive: false, time: '09:28', date: "Aujourd'hui", status: 'Succès',   ref: 'RIC-2025-001233' },
  { id: '3', type: 'Transfert',         description: 'Transfert national',      client: 'Mariam Koné',       clientInitials: 'MK', amount: '200 000 FCFA',  positive: false, time: '09:15', date: "Aujourd'hui", status: 'En cours',  ref: 'RIC-2025-001232' },
  { id: '4', type: 'Retrait Transfert', description: 'Retrait transfert',       client: 'Ousmane Bah',       clientInitials: 'OB', amount: '50 000 FCFA',   positive: true,  time: '08:58', date: "Aujourd'hui", status: 'Succès',   ref: 'RIC-2025-001231' },
  { id: '5', type: 'Airtime',           description: 'Recharge Moov 5000',      client: 'Fatou Ndiaye',      clientInitials: 'FN', amount: '5 000 FCFA',    positive: false, time: '08:45', date: "Aujourd'hui", status: 'Succès',   ref: 'RIC-2025-001230' },
  { id: '6', type: 'Commission',        description: 'Commission dépôt',        client: '—',                 clientInitials: '—',  amount: '1 500 FCFA',    positive: true,  time: '08:42', date: "Aujourd'hui", status: 'Succès',   ref: 'RIC-2025-001229' },
  { id: '7', type: 'Dépôt',             description: 'Dépôt wallet',            client: 'Yacouba Touré',     clientInitials: 'YT', amount: '320 000 FCFA',  positive: true,  time: '08:30', date: "Aujourd'hui", status: 'Succès',   ref: 'RIC-2025-001228' },
  { id: '8', type: 'Transfert',         description: 'Transfert international', client: 'Aminata Diop',      clientInitials: 'AD', amount: '500 000 FCFA',  positive: false, time: '08:15', date: "Aujourd'hui", status: 'Échoué',   ref: 'RIC-2025-001227' },
]

const statusStyle: Record<TxStatus, { bg: string; text: string; dot: string }> = {
  'Succès':   { bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500' },
  'En cours': { bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-500' },
  'Échoué':   { bg: 'bg-rose-50',     text: 'text-rose-700',     dot: 'bg-rose-500' },
}



/* ------------------------------------------------------------------ */
/*  Chart Data                                                         */
/* ------------------------------------------------------------------ */

// Weekly volume bar chart
const weeklyVolumeData = [
  { day: 'Lun', depot: 850000, retrait: 420000, transfert: 280000 },
  { day: 'Mar', depot: 920000, retrait: 510000, transfert: 350000 },
  { day: 'Mer', depot: 780000, retrait: 380000, transfert: 220000 },
  { day: 'Jeu', depot: 1100000, retrait: 620000, transfert: 410000 },
  { day: 'Ven', depot: 1250000, retrait: 580000, transfert: 470000 },
  { day: 'Sam', depot: 640000, retrait: 310000, transfert: 180000 },
  { day: 'Dim', depot: 320000, retrait: 150000, transfert: 90000 },
]

const weeklyVolumeConfig: ChartConfig = {
  depot:     { label: 'Dépôt',     color: '#10b981' },
  retrait:   { label: 'Retrait',   color: '#0ea5e9' },
  transfert: { label: 'Transfert', color: '#f59e0b' },
}

// Daily trend area chart (last 7 days)
const dailyTrendData = [
  { day: 'Lun', volume: 1550000 },
  { day: 'Mar', volume: 1780000 },
  { day: 'Mer', volume: 1380000 },
  { day: 'Jeu', volume: 2130000 },
  { day: 'Ven', volume: 2300000 },
  { day: 'Sam', volume: 1130000 },
  { day: 'Dim', volume: 560000 },
]

const dailyTrendConfig: ChartConfig = {
  volume: { label: 'Volume', color: '#10b981' },
}

// Transaction type distribution (donut chart)
const typeDistributionData = [
  { name: 'Dépôt',             value: 38, color: '#10b981' },
  { name: 'Retrait',           value: 22, color: '#0ea5e9' },
  { name: 'Transfert',         value: 18, color: '#f59e0b' },
  { name: 'Retrait Transfert', value: 10, color: '#8b5cf6' },
  { name: 'Airtime',           value: 8,  color: '#f43f5e' },
  { name: 'Commission',        value: 4,  color: '#14b8a6' },
]

const typeDistributionConfig: ChartConfig = {
  'Dépôt':             { label: 'Dépôt',             color: '#10b981' },
  'Retrait':           { label: 'Retrait',           color: '#0ea5e9' },
  'Transfert':         { label: 'Transfert',         color: '#f59e0b' },
  'Retrait Transfert': { label: 'Retrait Transfert', color: '#8b5cf6' },
  'Airtime':           { label: 'Airtime',           color: '#f43f5e' },
  'Commission':        { label: 'Commission',        color: '#14b8a6' },
}

/* ------------------------------------------------------------------ */
/*  Custom Tooltip for Pie                                             */
/* ------------------------------------------------------------------ */

function PieCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
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

export function DashboardView({ setActiveView }: { setActiveView: (view: ViewKey) => void }) {
  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const colors = accentMap[s.accent]
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.iconBg)}>
                  <Icon className={cn('w-5 h-5', colors.iconText)} />
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
                    s.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                  )}
                >
                  {s.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.trend}
                </span>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{s.label}</p>
                <p className="text-xl font-bold text-[#111827] mt-0.5">{s.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Quick actions ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Actions rapides</h2>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
          {quickActions.map((a) => {
            const colors = accentMap[a.accent]
            const Icon = a.icon
            return (
              <button
                key={a.label}
                type="button"
                onClick={() => setActiveView(quickActionViewMap[a.label])}
                className="flex flex-col items-center gap-2 min-w-[72px] py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform', colors.iconBg)}>
                  <Icon className={cn('w-5 h-5', colors.iconText)} />
                </div>
                <span className="text-xs font-medium text-[#6B7280] group-hover:text-[#111827] whitespace-nowrap">
                  {a.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- Charts Row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Volume hebdomadaire - Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-emerald-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Volume hebdomadaire</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Cette semaine</span>
            </div>
          </div>

          <ChartContainer config={weeklyVolumeConfig} className="h-[220px] w-full">
            <BarChart data={weeklyVolumeData} barGap={2} barCategoryGap="20%">
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
                tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="depot" fill="var(--color-depot)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="retrait" fill="var(--color-retrait)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="transfert" fill="var(--color-transfert)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-3">
            {Object.entries(weeklyVolumeConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cfg.color }} />
                <span className="text-xs text-[#6B7280]">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par type - Donut Chart */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4.5 h-4.5 text-amber-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Répartition par type</h2>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ChartContainer config={typeDistributionConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={typeDistributionData}
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
                  {typeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
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
              {typeDistributionData.map((item) => (
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

      {/* ---- Trend + Transactions Row ---- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
        {/* Daily Trend Area Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-emerald-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Tendance journalière</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Clock className="w-3.5 h-3.5" />
              <span>7 derniers jours</span>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ChartContainer config={dailyTrendConfig} className="h-full w-full min-h-[180px]">
              <AreaChart data={dailyTrendData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#volumeGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Quick stats under chart */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur jour</p>
              <p className="text-sm font-bold text-[#111827]">Ven</p>
              <p className="text-xs text-emerald-600">2.3M FCFA</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moyenne</p>
              <p className="text-sm font-bold text-[#111827]">1.47M</p>
              <p className="text-xs text-[#6B7280]">FCFA/jour</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Variation</p>
              <p className="text-sm font-bold text-emerald-600">+18%</p>
              <p className="text-xs text-[#6B7280]">vs sem. dern.</p>
            </div>
          </div>
        </div>

        {/* Transactions récentes - Refonted */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Transactions récentes</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {recentTransactions.length}
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

          {/* Desktop: Enhanced Table */}
          <div className="hidden md:block flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Description</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Montant</th>
                  <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Réf</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => {
                  const TxIcon = txTypeIcon[tx.type]
                  const colors = accentMap[txTypeAccent[tx.type]]
                  const status = statusStyle[tx.status]
                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.iconBg)}>
                            <TxIcon className={cn('w-4 h-4', colors.iconText)} />
                          </div>
                          <span className="font-medium text-[#111827] text-xs">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#6B7280] text-xs">{tx.description}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold', colors.iconBg, colors.iconText)}>
                            {tx.clientInitials}
                          </div>
                          <span className="text-xs text-[#374151] font-medium truncate max-w-[100px]">{tx.client}</span>
                        </div>
                      </td>
                      <td
                        className={cn(
                          'py-3 px-3 text-right font-bold text-xs whitespace-nowrap',
                          tx.positive ? 'text-emerald-600' : 'text-rose-600'
                        )}
                      >
                        {tx.positive ? '+' : '−'}{tx.amount}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                            status.bg,
                            status.text
                          )}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-[10px] text-[#9CA3AF] font-mono group-hover:text-[#6B7280] transition-colors">
                          {tx.ref.slice(-6)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card list */}
          <div className="md:hidden flex-1 overflow-y-auto min-h-0">
            <div className="divide-y divide-[#F3F4F6]">
              {recentTransactions.map((tx) => {
                const TxIcon = txTypeIcon[tx.type]
                const colors = accentMap[txTypeAccent[tx.type]]
                const status = statusStyle[tx.status]
                return (
                  <div key={tx.id} className="px-4 py-3 flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colors.iconBg)}>
                      <TxIcon className={cn('w-4.5 h-4.5', colors.iconText)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#111827] truncate">{tx.type}</p>
                        <span
                          className={cn(
                            'text-sm font-bold whitespace-nowrap ml-2',
                            tx.positive ? 'text-emerald-600' : 'text-rose-600'
                          )}
                        >
                          {tx.positive ? '+' : '−'}{tx.amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-[#9CA3AF] truncate">{tx.client} · {tx.time}</p>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ml-2',
                            status.bg,
                            status.text
                          )}
                        >
                          <span className={cn('w-1 h-1 rounded-full', status.dot)} />
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
