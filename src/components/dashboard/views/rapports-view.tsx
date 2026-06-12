'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Clock,
  CheckCircle2,
  Download,
  FileText,
  PieChart as PieChartIcon,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Smartphone,
  Calendar,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  Area,
  AreaChart,
  Tooltip as RechartsTooltip,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { exportCsv } from '@/lib/export-utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReportTab = 'overview' | 'transactions' | 'commissions' | 'clients'

const reportTabs: { key: ReportTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
  { key: 'transactions', label: 'Transactions', icon: Activity },
  { key: 'commissions', label: 'Commissions', icon: TrendingUp },
  { key: 'clients', label: 'Clients', icon: Users },
]

const periodTabs = ["Aujourd'hui", 'Cette semaine', 'Ce mois', 'Ce trimestre'] as const

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

// Monthly volume data for grouped bar chart
const monthlyVolumeData = [
  { month: 'Jan', depot: 2850000, retrait: 1620000, transfert: 1340000 },
  { month: 'Fév', depot: 3210000, retrait: 1890000, transfert: 1520000 },
  { month: 'Mar', depot: 2980000, retrait: 1740000, transfert: 1410000 },
  { month: 'Avr', depot: 3540000, retrait: 2100000, transfert: 1780000 },
  { month: 'Mai', depot: 3870000, retrait: 2250000, transfert: 1920000 },
  { month: 'Jun', depot: 4120000, retrait: 2430000, transfert: 2080000 },
]

const monthlyVolumeConfig: ChartConfig = {
  depot: { label: 'Dépôt', color: '#10b981' },
  retrait: { label: 'Retrait', color: '#0ea5e9' },
  transfert: { label: 'Transfert', color: '#f59e0b' },
}

// Daily trend data (30 days)
const dailyTrendData = [
  { day: '01', volume: 3200000, transactions: 42 },
  { day: '02', volume: 2850000, transactions: 38 },
  { day: '03', volume: 4100000, transactions: 55 },
  { day: '04', volume: 3600000, transactions: 48 },
  { day: '05', volume: 4500000, transactions: 62 },
  { day: '06', volume: 3900000, transactions: 51 },
  { day: '07', volume: 2800000, transactions: 35 },
  { day: '08', volume: 3400000, transactions: 45 },
  { day: '09', volume: 4200000, transactions: 57 },
  { day: '10', volume: 4800000, transactions: 65 },
  { day: '11', volume: 3700000, transactions: 49 },
  { day: '12', volume: 3100000, transactions: 41 },
  { day: '13', volume: 2600000, transactions: 33 },
  { day: '14', volume: 3800000, transactions: 50 },
  { day: '15', volume: 4300000, transactions: 58 },
  { day: '16', volume: 4700000, transactions: 63 },
  { day: '17', volume: 3500000, transactions: 47 },
  { day: '18', volume: 4100000, transactions: 55 },
  { day: '19', volume: 5200000, transactions: 71 },
  { day: '20', volume: 4600000, transactions: 62 },
  { day: '21', volume: 3200000, transactions: 43 },
  { day: '22', volume: 3900000, transactions: 52 },
  { day: '23', volume: 4400000, transactions: 59 },
  { day: '24', volume: 5100000, transactions: 69 },
  { day: '25', volume: 4800000, transactions: 65 },
  { day: '26', volume: 3500000, transactions: 46 },
  { day: '27', volume: 4100000, transactions: 55 },
  { day: '28', volume: 4600000, transactions: 62 },
  { day: '29', volume: 5300000, transactions: 72 },
  { day: '30', volume: 4900000, transactions: 66 },
]

const dailyTrendConfig: ChartConfig = {
  volume: { label: 'Volume', color: '#10b981' },
}

// Commission trend data
const commissionTrendData = [
  { month: 'Jan', commission: 156000, transactions: 198 },
  { month: 'Fév', commission: 189000, transactions: 234 },
  { month: 'Mar', commission: 172000, transactions: 215 },
  { month: 'Avr', commission: 215000, transactions: 268 },
  { month: 'Mai', commission: 248000, transactions: 302 },
  { month: 'Jun', commission: 285000, transactions: 347 },
]

const commissionTrendConfig: ChartConfig = {
  commission: { label: 'Commission', color: '#10b981' },
}

// Transaction type donut chart data
const typeDistributionData = [
  { name: 'Dépôt', value: 38, color: '#10b981' },
  { name: 'Retrait', value: 22, color: '#0ea5e9' },
  { name: 'Transfert', value: 18, color: '#f59e0b' },
  { name: 'Airtime', value: 12, color: '#f43f5e' },
  { name: 'Autres', value: 10, color: '#8b5cf6' },
]

const typeDistributionConfig: ChartConfig = {
  'Dépôt': { label: 'Dépôt', color: '#10b981' },
  'Retrait': { label: 'Retrait', color: '#0ea5e9' },
  'Transfert': { label: 'Transfert', color: '#f59e0b' },
  'Airtime': { label: 'Airtime', color: '#f43f5e' },
  'Autres': { label: 'Autres', color: '#8b5cf6' },
}

// Transaction type breakdown icons
const txTypeIcon: Record<string, React.ElementType> = {
  'Dépôt': ArrowDownToLine,
  'Retrait': ArrowUpFromLine,
  'Transfert': Send,
  'Airtime': Smartphone,
  'Autres': BarChart3,
}

const txTypeAccent: Record<string, { bg: string; text: string }> = {
  'Dépôt': { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'Retrait': { bg: 'bg-sky-100', text: 'text-sky-600' },
  'Transfert': { bg: 'bg-amber-100', text: 'text-amber-600' },
  'Airtime': { bg: 'bg-rose-100', text: 'text-rose-600' },
  'Autres': { bg: 'bg-violet-100', text: 'text-violet-600' },
}

// KPI stat cards
const kpiCards = [
  {
    label: 'Volume total',
    value: '20,590,000 FCFA',
    sublabel: 'Ce mois',
    trend: '+15%',
    trendUp: true,
    icon: TrendingUp,
    accent: 'emerald' as const,
  },
  {
    label: 'Transactions',
    value: '1,247',
    sublabel: 'Ce mois',
    trend: '+8%',
    trendUp: true,
    icon: Activity,
    accent: 'sky' as const,
  },
  {
    label: 'Commissions',
    value: '1,542,500 FCFA',
    sublabel: 'Ce mois',
    trend: '+12%',
    trendUp: true,
    icon: BarChart3,
    accent: 'amber' as const,
  },
  {
    label: 'Taux de réussite',
    value: '98.7%',
    sublabel: 'Global',
    trend: '+0.3%',
    trendUp: true,
    icon: CheckCircle2,
    accent: 'teal' as const,
  },
]

const accentMap: Record<string, { bg: string; iconBg: string; iconText: string }> = {
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
  sky: { bg: 'bg-sky-50', iconBg: 'bg-sky-100', iconText: 'text-sky-600' },
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
  teal: { bg: 'bg-teal-50', iconBg: 'bg-teal-100', iconText: 'text-teal-600' },
}

// Top clients
const topClients = [
  { name: 'Fatoumata Diallo', volume: '2,450,000 FCFA', transactions: 48, commission: '24,500 FCFA', growth: '+12%' },
  { name: 'Amadou Keïta', volume: '1,890,000 FCFA', transactions: 35, commission: '18,900 FCFA', growth: '+8%' },
  { name: 'Mariam Traoré', volume: '1,650,000 FCFA', transactions: 31, commission: '16,500 FCFA', growth: '+15%' },
  { name: 'Ibrahim Coulibaly', volume: '1,320,000 FCFA', transactions: 27, commission: '13,200 FCFA', growth: '+5%' },
  { name: 'Aminata Sissoko', volume: '1,150,000 FCFA', transactions: 22, commission: '11,500 FCFA', growth: '+18%' },
  { name: 'Oumar Sidibé', volume: '980,000 FCFA', transactions: 19, commission: '9,800 FCFA', growth: '+3%' },
]

// Quick report buttons
const quickReports = [
  { label: 'Rapport journalier', desc: 'Résumé du jour', icon: FileText },
  { label: 'Rapport mensuel', desc: 'Analyse mensuelle complète', icon: Calendar },
  { label: 'Rapport clients', desc: 'Activité par client', icon: Users },
]

/* ------------------------------------------------------------------ */
/*  Pie Label                                                          */
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

function PieCustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
        <span className="font-medium text-[#111827]">{item.name}</span>
        <span className="font-bold text-[#111827] ml-2">{item.value}%</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RapportsView() {
  const [activePeriod, setActivePeriod] = useState<number>(2)
  const [activeTab, setActiveTab] = useState<ReportTab>('overview')

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Rapports</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Analyses et rapports d&apos;activité</p>
        </div>
        <div className="flex items-center gap-3">
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
          <button
            type="button"
            onClick={() => {
              exportCsv(
                [
                  { Période: periodTabs[activePeriod], Onglet: activeTab, Export: new Date().toLocaleString('fr-FR') },
                ],
                'rapport-ricash.csv'
              )
              toast.success('Rapport exporté', { description: 'Fichier CSV téléchargé' })
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 active:scale-[0.98] shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* ---- Tab Navigation ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-1.5">
        <div className="flex items-center gap-1">
          {reportTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- Tab Content ---- */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'commissions' && <CommissionsTab />}
      {activeTab === 'clients' && <ClientsTab />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Overview Tab                                                       */
/* ------------------------------------------------------------------ */

function OverviewTab() {
  return (
    <>
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
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
                    {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {card.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{card.label}</p>
                <p className="text-xl font-bold text-[#111827] mt-0.5">{card.value}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{card.sublabel}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row (3:2) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Grouped bar chart - Monthly volume */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-emerald-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Volume mensuel</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-[#6B7280]">Dépôt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                <span className="text-[10px] text-[#6B7280]">Retrait</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span className="text-[10px] text-[#6B7280]">Transfert</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ChartContainer config={monthlyVolumeConfig} className="h-[240px] w-full">
              <BarChart data={monthlyVolumeData} barGap={4} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
                  width={45}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="depot" fill="var(--color-depot)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="retrait" fill="var(--color-retrait)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="transfert" fill="var(--color-transfert)" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Quick stats under chart */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur mois</p>
              <p className="text-sm font-bold text-[#111827]">Juin</p>
              <p className="text-xs text-emerald-600">8,630,000 FCFA</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moyenne mensuelle</p>
              <p className="text-sm font-bold text-[#111827]">7,013,000</p>
              <p className="text-xs text-[#6B7280]">FCFA/mois</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Croissance</p>
              <p className="text-sm font-bold text-emerald-600">+22%</p>
              <p className="text-xs text-[#6B7280]">vs trim. préc.</p>
            </div>
          </div>
        </div>

        {/* Right: Donut chart - Transaction type distribution */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4.5 h-4.5 text-sky-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Répartition par type</h2>
            </div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <ChartContainer config={typeDistributionConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={typeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
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
                <RechartsTooltip content={<PieCustomTooltip />} />
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

      {/* Quick reports */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickReports.map((report) => {
          const Icon = report.icon
          return (
            <button
              key={report.label}
              type="button"
              onClick={() => {
                exportCsv(
                  [{ Rapport: report.label, Description: report.desc, Date: new Date().toLocaleDateString('fr-FR') }],
                  `rapport-${report.label.toLowerCase().replace(/\s+/g, '-')}.csv`
                )
                toast.success('Rapport généré', { description: `${report.label} téléchargé` })
              }}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:border-emerald-200 hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] group-hover:bg-emerald-100 flex items-center justify-center transition-colors shrink-0">
                <Icon className="w-5 h-5 text-[#6B7280] group-hover:text-emerald-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111827] group-hover:text-emerald-700 transition-colors">{report.label}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{report.desc}</p>
              </div>
              <Download className="w-4 h-4 text-[#9CA3AF] group-hover:text-emerald-600 transition-colors shrink-0" />
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Transactions Tab                                                   */
/* ------------------------------------------------------------------ */

function TransactionsTab() {
  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {typeDistributionData.map((item) => {
          const Icon = txTypeIcon[item.name]
          const accent = txTypeAccent[item.name]
          return (
            <div key={item.name} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', accent.bg)}>
                <Icon className={cn('w-5 h-5', accent.text)} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">{item.name}</p>
                <p className="text-lg font-bold text-[#111827] mt-0.5">{item.value}%</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Daily trend chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Tendance quotidienne</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            <span>30 derniers jours</span>
          </div>
        </div>

        <ChartContainer config={dailyTrendConfig} className="h-[260px] w-full">
          <AreaChart data={dailyTrendData}>
            <defs>
              <linearGradient id="dailyVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
              width={45}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#dailyVolumeGradient)"
            />
          </AreaChart>
        </ChartContainer>

        {/* Quick stats under chart */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur jour</p>
            <p className="text-sm font-bold text-[#111827]">J29</p>
            <p className="text-xs text-emerald-600">5.3M FCFA</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moyenne</p>
            <p className="text-sm font-bold text-[#111827]">4.0M</p>
            <p className="text-xs text-[#6B7280]">FCFA/jour</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Min / Max</p>
            <p className="text-sm font-bold text-[#111827]">2.6M – 5.3M</p>
            <p className="text-xs text-[#6B7280]">FCFA</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Variation</p>
            <p className="text-sm font-bold text-emerald-600">+18%</p>
            <p className="text-xs text-[#6B7280]">vs mois préc.</p>
          </div>
        </div>
      </div>

      {/* Monthly volume bar chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Volume par mois</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span className="text-[10px] text-[#6B7280]">Dépôt</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-sky-500" /><span className="text-[10px] text-[#6B7280]">Retrait</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-amber-500" /><span className="text-[10px] text-[#6B7280]">Transfert</span></div>
          </div>
        </div>
        <ChartContainer config={monthlyVolumeConfig} className="h-[220px] w-full">
          <BarChart data={monthlyVolumeData} barGap={4} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} width={45} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="depot" fill="var(--color-depot)" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="retrait" fill="var(--color-retrait)" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="transfert" fill="var(--color-transfert)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Commissions Tab                                                    */
/* ------------------------------------------------------------------ */

function CommissionsTab() {
  return (
    <>
      {/* Commission summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Total commissions</p>
            <p className="text-xl font-bold text-[#111827]">1,542,500 FCFA</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Moyenne / transaction</p>
            <p className="text-xl font-bold text-[#111827]">1,236 FCFA</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Meilleur mois</p>
            <p className="text-xl font-bold text-[#111827]">285,000 FCFA</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Croissance</p>
            <p className="text-xl font-bold text-emerald-600">+82%</p>
            <p className="text-[10px] text-[#9CA3AF]">vs sem. préc.</p>
          </div>
        </div>
      </div>

      {/* Commission trend chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Évolution des commissions</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            <span>6 derniers mois</span>
          </div>
        </div>

        <ChartContainer config={commissionTrendConfig} className="h-[240px] w-full">
          <AreaChart data={commissionTrendData}>
            <defs>
              <linearGradient id="commissionGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="commission" stroke="#10b981" strokeWidth={2.5} fill="url(#commissionGradient2)" />
          </AreaChart>
        </ChartContainer>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moyenne</p>
            <p className="text-sm font-bold text-[#111827]">210,833 FCFA</p>
            <p className="text-xs text-[#6B7280]">par mois</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Taux de croissance</p>
            <p className="text-sm font-bold text-emerald-600">+82.7%</p>
            <p className="text-xs text-[#6B7280]">Jan → Jun</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Projection</p>
            <p className="text-sm font-bold text-[#111827]">320,000</p>
            <p className="text-xs text-[#6B7280]">FCFA (Juil.)</p>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Clients Tab                                                        */
/* ------------------------------------------------------------------ */

function ClientsTab() {
  return (
    <>
      {/* Top clients table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Top clients</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {topClients.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              exportCsv(
                topClients.map((c) => ({
                  Client: c.name,
                  Volume: c.volume,
                  Transactions: c.transactions,
                  Commission: c.commission,
                })),
                'rapport-top-clients.csv'
              )
              toast.success('Rapport clients exporté', { description: 'Fichier CSV téléchargé' })
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block flex-1 overflow-y-auto min-h-0 max-h-[420px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">#</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Volume</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Transactions</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Commission</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Croissance</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, i) => (
                <tr
                  key={i}
                  className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-5">
                    <span className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-gray-200 text-gray-600' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-[#F3F4F6] text-[#6B7280]'
                    )}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs shrink-0">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-[#111827] group-hover:text-emerald-600 transition-colors">
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-[#111827] text-xs whitespace-nowrap">{client.volume}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700">
                      {client.transactions}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 text-xs whitespace-nowrap">{client.commission}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      {client.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden flex-1 overflow-y-auto min-h-0 max-h-[420px]">
          <div className="divide-y divide-[#F3F4F6]">
            {topClients.map((client, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-gray-200 text-gray-600' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-[#F3F4F6] text-[#6B7280]'
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#111827] truncate">{client.name}</p>
                    <span className="text-sm font-bold text-emerald-600 whitespace-nowrap ml-2">{client.commission}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-[#9CA3AF] truncate">{client.volume}</p>
                    <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 ml-2">
                      <TrendingUp className="w-3 h-3" />{client.growth}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client distribution summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4.5 h-4.5 text-sky-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Répartition par type</h2>
          </div>
          <div className="flex flex-col items-center flex-1">
            <ChartContainer config={typeDistributionConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={typeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
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
                <RechartsTooltip content={<PieCustomTooltip />} />
              </PieChart>
            </ChartContainer>
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

        {/* Performance metrics */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4.5 h-4.5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Performance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <span className="text-sm text-[#6B7280]">Taux de succès</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">98.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-sky-600" />
                </div>
                <span className="text-sm text-[#6B7280]">Temps moyen</span>
              </div>
              <span className="text-sm font-bold text-[#111827]">2.3 min</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Activity className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <span className="text-sm text-[#6B7280]">Score qualité</span>
              </div>
              <span className="text-sm font-bold text-[#111827]">4.8/5</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Taux de succès</span>
                <span className="text-xs font-semibold text-emerald-600">98.7%</span>
              </div>
              <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.7%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Score qualité</span>
                <span className="text-xs font-semibold text-amber-600">96%</span>
              </div>
              <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '96%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Satisfaction client</span>
                <span className="text-xs font-semibold text-sky-600">94%</span>
              </div>
              <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
