'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const ZonesHeatmapInner = dynamic(
  () => import('./zones-heatmap-inner'),
  { ssr: false, loading: () => <div className="h-full w-full bg-orange-50 animate-pulse rounded-xl" /> }
)
import {
  BarChart3,
  Activity,
  Download,
  FileText,
  MapPin,
  TrendingUp,
  Car,
  Users,
  Calendar,
  Clock,
  Star,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  AlertTriangle,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip as RechartsTooltip,
  Pie,
  PieChart,
  Cell,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReportTab = 'activite' | 'chauffeurs' | 'paiements' | 'zones' | 'export'

const reportTabs: { key: ReportTab; label: string; icon: React.ElementType }[] = [
  { key: 'activite',   label: 'Activité',   icon: Activity },
  { key: 'chauffeurs', label: 'Chauffeurs', icon: Car },
  { key: 'paiements',  label: 'Paiements',  icon: CreditCard },
  { key: 'zones',      label: 'Zones',      icon: MapPin },
  { key: 'export',     label: 'Export',     icon: Download },
]

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

// Daily courses over 30 days
const dailyCoursesData = [
  { day: '01', courses: 142 },
  { day: '02', courses: 128 },
  { day: '03', courses: 165 },
  { day: '04', courses: 153 },
  { day: '05', courses: 189 },
  { day: '06', courses: 174 },
  { day: '07', courses: 112 },
  { day: '08', courses: 145 },
  { day: '09', courses: 178 },
  { day: '10', courses: 201 },
  { day: '11', courses: 156 },
  { day: '12', courses: 134 },
  { day: '13', courses: 118 },
  { day: '14', courses: 162 },
  { day: '15', courses: 185 },
  { day: '16', courses: 198 },
  { day: '17', courses: 147 },
  { day: '18', courses: 172 },
  { day: '19', courses: 215 },
  { day: '20', courses: 192 },
  { day: '21', courses: 138 },
  { day: '22', courses: 167 },
  { day: '23', courses: 186 },
  { day: '24', courses: 209 },
  { day: '25', courses: 195 },
  { day: '26', courses: 148 },
  { day: '27', courses: 173 },
  { day: '28', courses: 188 },
  { day: '29', courses: 221 },
  { day: '30', courses: 204 },
]

const dailyCoursesConfig: ChartConfig = {
  courses: { label: 'Courses', color: '#f97316' },
}

// Zone activity data
const zoneData = [
  { zone: 'Kalaban-Coura', courses: 1245, revenue: 4375000 },
  { zone: 'Badalabougou', courses: 987, revenue: 3456000 },
  { zone: 'Hamdallaye', courses: 834, revenue: 2919000 },
  { zone: 'Sébenikoro', courses: 712, revenue: 2492000 },
  { zone: 'Lafiabougou', courses: 598, revenue: 2093000 },
]

const zoneBarConfig: ChartConfig = {
  courses: { label: 'Courses', color: '#f97316' },
}

// Activity tab stats
const activityStats = [
  {
    label: 'Courses aujourd\'hui',
    value: '204',
    trend: '+12%',
    trendUp: true,
    icon: Car,
  },
  {
    label: 'Chauffeurs actifs',
    value: '132',
    trend: '+5%',
    trendUp: true,
    icon: Users,
  },
  {
    label: 'Revenus du jour',
    value: '714 000 FCFA',
    trend: '+18%',
    trendUp: true,
    icon: TrendingUp,
  },
  {
    label: 'Taux d\'acceptation',
    value: '87%',
    trend: '-2%',
    trendUp: false,
    icon: Activity,
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RapportsView() {
  const [activeTab, setActiveTab] = useState<ReportTab>('activite')

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">
            Rapports & Analyses
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Statistiques et indicateurs de performance BestTrans
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
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
                    ? 'bg-orange-50 text-orange-700 shadow-sm'
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

      {/* Tab Content */}
      {activeTab === 'activite'   && <ActiviteTab />}
      {activeTab === 'chauffeurs' && <ChauffeursTab />}
      {activeTab === 'paiements'  && <PaiementsTab />}
      {activeTab === 'zones'      && <ZonesTab />}
      {activeTab === 'export'     && <ExportTab />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Activité Tab                                                       */
/* ------------------------------------------------------------------ */

function ActiviteTab() {
  return (
    <>
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {activityStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
                    stat.trendUp
                      ? 'text-green-700 bg-green-50'
                      : 'text-red-700 bg-red-50'
                  )}
                >
                  {stat.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3 rotate-180" />
                  )}
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{stat.label}</p>
                <p className="text-xl font-bold text-orange-700">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Daily courses line chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-orange-600" />
            <h2 className="text-sm font-semibold text-[#111827]">
              Courses quotidiennes
            </h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            <span>30 derniers jours</span>
          </div>
        </div>

        <ChartContainer config={dailyCoursesConfig} className="h-[280px] w-full">
          <AreaChart data={dailyCoursesData}>
            <defs>
              <linearGradient id="coursesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
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
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="courses"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#coursesGradient)"
            />
          </AreaChart>
        </ChartContainer>

        {/* Quick stats under chart */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur jour</p>
            <p className="text-sm font-bold text-orange-700">J29</p>
            <p className="text-xs text-[#6B7280]">221 courses</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moyenne</p>
            <p className="text-sm font-bold text-[#111827]">168</p>
            <p className="text-xs text-[#6B7280]">courses/jour</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Min / Max</p>
            <p className="text-sm font-bold text-[#111827]">112 – 221</p>
            <p className="text-xs text-[#6B7280]">courses</p>
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Variation</p>
            <p className="text-sm font-bold text-green-600">+22%</p>
            <p className="text-xs text-[#6B7280]">vs mois préc.</p>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Zones Tab                                                          */
/* ------------------------------------------------------------------ */

function ZonesTab() {
  return (
    <>
      {/* Top zones list */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-semibold text-[#111827]">
              Zones les plus actives
            </h2>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-xs">
              Top 5
            </Badge>
          </div>
        </div>

        <div className="divide-y divide-[#F3F4F6]">
          {zoneData.map((zone, i) => (
            <div
              key={zone.zone}
              className="px-5 py-4 flex items-center gap-4 hover:bg-orange-50/30 transition-colors"
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  i === 0
                    ? 'bg-orange-600 text-white'
                    : i === 1
                      ? 'bg-orange-100 text-orange-700'
                      : i === 2
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                )}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111827]">
                  {zone.zone}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-[#6B7280]">
                    {zone.courses.toLocaleString('fr-FR')} courses
                  </span>
                  <span className="text-xs text-[#9CA3AF]">·</span>
                  <span className="text-xs text-[#6B7280]">
                    {(zone.revenue / 1000000).toFixed(1)}M FCFA
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className="h-2 rounded-full bg-orange-600"
                  style={{
                    width: `${Math.max(20, (zone.courses / zoneData[0].courses) * 120)}px`,
                  }}
                />
                <span className="text-xs font-medium text-orange-700 w-10 text-right">
                  {Math.round((zone.courses / zoneData[0].courses) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Carte de chaleur — Bamako</h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Forte activité</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Moyenne</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky-400 inline-block" /> Faible</span>
          </div>
        </div>
        <div className="h-72 rounded-xl overflow-hidden">
          <ZonesHeatmapInner />
        </div>
      </div>

      {/* Zone bar chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-orange-600" />
            <h2 className="text-sm font-semibold text-[#111827]">
              Courses par zone
            </h2>
          </div>
        </div>

        <ChartContainer config={zoneBarConfig} className="h-[260px] w-full">
          <BarChart data={zoneData} barGap={4} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis
              dataKey="zone"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              width={45}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="courses"
              fill="var(--color-courses)"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Export Tab                                                         */
/* ------------------------------------------------------------------ */

function ExportTab() {
  const [dateFrom, setDateFrom] = useState('2025-02-01')
  const [dateTo, setDateTo] = useState('2025-03-04')

  const handleExport = (format: string) => {
    toast.success(`Export ${format}`, {
      description: `Le fichier ${format} a été généré pour la période du ${dateFrom} au ${dateTo}.`,
    })
  }

  return (
    <>
      {/* Date Range Selector */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-600" />
          Période d&apos;export
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <label className="text-xs font-medium text-[#6B7280] mb-1 block">
              Date de début
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <label className="text-xs font-medium text-[#6B7280] mb-1 block">
              Date de fin
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PDF Export */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleExport('PDF')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleExport('PDF') }}
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
            <FileText className="w-7 h-7 text-red-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#111827] group-hover:text-orange-700 transition-colors">
              Export PDF
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Rapport formaté avec graphiques
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-3 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger PDF
          </span>
        </div>

        {/* CSV Export */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleExport('CSV')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleExport('CSV') }}
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
            <FileText className="w-7 h-7 text-green-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#111827] group-hover:text-orange-700 transition-colors">
              Export CSV
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Données brutes compatibles Excel
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-3 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger CSV
          </span>
        </div>

        {/* Excel Export */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleExport('Excel')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleExport('Excel') }}
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
            <FileText className="w-7 h-7 text-orange-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#111827] group-hover:text-orange-700 transition-colors">
              Export Excel
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Tableur avec mise en forme
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-3 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger Excel
          </span>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-600" />
          <h2 className="text-sm font-semibold text-[#111827]">
            Exports récents
          </h2>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {[
            { name: 'Rapport-mensuel-fevrier-2025.pdf', date: '01/03/2025', size: '2.4 MB' },
            { name: 'courses-janvier-2025.csv', date: '01/02/2025', size: '856 KB' },
            { name: 'zones-activite-Q4-2024.xlsx', date: '02/01/2025', size: '1.8 MB' },
          ].map((file) => (
            <div
              key={file.name}
              className="px-5 py-3 flex items-center justify-between hover:bg-orange-50/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF]">
                    {file.date} · {file.size}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-xs gap-1"
                onClick={() => toast.success('Téléchargement lancé', { description: file.name })}
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════
   CHAUFFEURS TAB
   ══════════════════════════════════════════════════════════════════ */

const topChauffeurs = [
  { nom: 'Amadou Keïta',     courses: 312, revenus: '1,092,000 FCFA', note: 4.9, acceptation: '94%', ponctualite: '98%' },
  { nom: 'Fatoumata Diallo', courses: 287, revenus: '1,004,500 FCFA', note: 4.8, acceptation: '91%', ponctualite: '96%' },
  { nom: 'Oumar Sidibé',     courses: 265, revenus: '927,500 FCFA',   note: 4.7, acceptation: '88%', ponctualite: '95%' },
  { nom: 'Daouda Camara',    courses: 241, revenus: '843,500 FCFA',   note: 4.6, acceptation: '85%', ponctualite: '93%' },
  { nom: 'Mamadou Diarra',   courses: 218, revenus: '763,000 FCFA',   note: 4.5, acceptation: '83%', ponctualite: '91%' },
  { nom: 'Boubacar Bah',     courses: 198, revenus: '693,000 FCFA',   note: 4.4, acceptation: '80%', ponctualite: '89%' },
  { nom: 'Salimata Traoré',  courses: 175, revenus: '612,500 FCFA',   note: 4.3, acceptation: '78%', ponctualite: '88%' },
]

const chauffeursActifData = [
  { sem: 'S1', actifs: 98 }, { sem: 'S2', actifs: 112 }, { sem: 'S3', actifs: 127 },
  { sem: 'S4', actifs: 134 }, { sem: 'S5', actifs: 121 }, { sem: 'S6', actifs: 139 },
  { sem: 'S7', actifs: 145 }, { sem: 'S8', actifs: 152 },
]

const chauffeursActifConfig: ChartConfig = {
  actifs: { label: 'Chauffeurs actifs', color: '#f97316' },
}

function ChauffeursTab() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Chauffeurs actifs',   value: '152',   icon: Car,      color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Note moyenne',        value: '4,6/5', icon: Star,     color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: "Taux d'acceptation",  value: '87%',   icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Taux de ponctualité', value: '93%',   icon: Clock,    color: 'text-sky-600',     bg: 'bg-sky-50' },
        ].map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', card.bg)}>
                <Icon className={cn('w-5 h-5', card.color)} />
              </div>
              <div>
                <p className="text-lg font-bold text-[#111827]">{card.value}</p>
                <p className="text-[11px] text-[#6B7280]">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" /> Évolution chauffeurs actifs (8 semaines)
          </h3>
          <ChartContainer config={chauffeursActifConfig} className="h-[200px] w-full">
            <AreaChart data={chauffeursActifData}>
              <defs>
                <linearGradient id="chaufGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="sem" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="actifs" stroke="#f97316" strokeWidth={2.5} fill="url(#chaufGrad)" />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-600" /> Répartition par statut
          </h3>
          <div className="space-y-3">
            {[
              { label: 'En course',  value: 47, pct: 31, color: 'bg-amber-500' },
              { label: 'En attente', value: 85, pct: 56, color: 'bg-emerald-500' },
              { label: 'Hors ligne', value: 20, pct: 13, color: 'bg-gray-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#6B7280]">{item.label}</span>
                  <span className="font-semibold text-[#111827]">{item.value} ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', item.color)} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moy. courses/jour</p>
              <p className="text-sm font-bold text-[#111827] mt-0.5">8,4</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Revenus moy./chauffeur</p>
              <p className="text-sm font-bold text-[#111827] mt-0.5">234 500 FCFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-[#111827]">Top chauffeurs du mois</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">#</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Chauffeur</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Courses</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Revenus</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Note</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Acceptation</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Ponctualité</th>
              </tr>
            </thead>
            <tbody>
              {topChauffeurs.map((c, i) => (
                <tr key={c.nom} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB]">
                  <td className="py-3 px-5">
                    <span className={cn(
                      'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-gray-100 text-gray-600' :
                      i === 2 ? 'bg-orange-100 text-orange-700' : 'text-[#9CA3AF]'
                    )}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-[10px]">
                        {c.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-[#111827] text-xs">{c.nom}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#111827] text-xs">{c.courses}</td>
                  <td className="py-3 px-3 text-right text-xs text-emerald-600 font-semibold">{c.revenus}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.note}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-[#374151]">{c.acceptation}</td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-[#374151]">{c.ponctualite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════
   PAIEMENTS TAB
   ══════════════════════════════════════════════════════════════════ */

const paiementRepartitionData = [
  { name: 'Mobile Money', value: 42, color: '#f97316' },
  { name: 'Orange Money', value: 28, color: '#ea580c' },
  { name: 'Wave',         value: 15, color: '#06b6d4' },
  { name: 'Cash',         value: 10, color: '#10b981' },
  { name: 'Carte',        value: 5,  color: '#8b5cf6' },
]

const paiementRepartitionConfig: ChartConfig = {
  'Mobile Money': { label: 'Mobile Money', color: '#f97316' },
  'Orange Money': { label: 'Orange Money', color: '#ea580c' },
  'Wave':         { label: 'Wave',         color: '#06b6d4' },
  'Cash':         { label: 'Cash',         color: '#10b981' },
  'Carte':        { label: 'Carte',        color: '#8b5cf6' },
}

const echecTrendData = [
  { jour: 'Lun', echec: 3.2 }, { jour: 'Mar', echec: 2.8 }, { jour: 'Mer', echec: 4.1 },
  { jour: 'Jeu', echec: 2.5 }, { jour: 'Ven', echec: 3.8 }, { jour: 'Sam', echec: 1.9 },
  { jour: 'Dim', echec: 2.2 },
]

const echecConfig: ChartConfig = {
  echec: { label: "Taux d'échec (%)", color: '#f43f5e' },
}

const modeStats = [
  { mode: 'Mobile Money', icon: Smartphone, transactions: 1248, volume: '3,120,000 FCFA', taux_echec: '2.1%', bg: 'bg-orange-50', text: 'text-orange-700' },
  { mode: 'Orange Money', icon: Smartphone, transactions: 831,  volume: '2,077,500 FCFA', taux_echec: '1.8%', bg: 'bg-orange-50', text: 'text-orange-600' },
  { mode: 'Wave',         icon: Wallet,     transactions: 445,  volume: '1,112,500 FCFA', taux_echec: '0.9%', bg: 'bg-sky-50',    text: 'text-sky-700' },
  { mode: 'Cash',         icon: Banknote,   transactions: 297,  volume: '742,500 FCFA',   taux_echec: '0.0%', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  { mode: 'Carte',        icon: CreditCard, transactions: 148,  volume: '370,000 FCFA',   taux_echec: '4.7%', bg: 'bg-violet-50', text: 'text-violet-700' },
]

function PieLabel(props: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number }) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props
  if (percent < 0.08) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 10, fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function PaiementsTab() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Volume total',       value: '7,422,500 FCFA', icon: TrendingUp,    color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Transactions',       value: '2,969',          icon: CreditCard,    color: 'text-sky-600',     bg: 'bg-sky-50' },
          { label: "Taux d'échec moyen", value: '1.9%',           icon: AlertTriangle, color: 'text-rose-600',    bg: 'bg-rose-50' },
          { label: 'Paiement dématér.',  value: '90%',            icon: Smartphone,    color: 'text-orange-600',  bg: 'bg-orange-50' },
        ].map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', card.bg)}>
                <Icon className={cn('w-5 h-5', card.color)} />
              </div>
              <div>
                <p className="text-base font-bold text-[#111827] leading-tight">{card.value}</p>
                <p className="text-[11px] text-[#6B7280]">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-600" /> Répartition par méthode
          </h3>
          <ChartContainer config={paiementRepartitionConfig} className="h-[200px] w-full">
            <PieChart>
              <Pie
                data={paiementRepartitionData}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value"
                labelLine={false} label={PieLabel}
                strokeWidth={0}
              >
                {paiementRepartitionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(v: unknown, n: unknown) => [`${v}%`, n as string]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
              />
            </PieChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {paiementRepartitionData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-[#6B7280] truncate">{item.name}</span>
                <span className="text-[11px] font-semibold text-[#111827] ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Taux d&apos;échec quotidien (%)
          </h3>
          <ChartContainer config={echecConfig} className="h-[200px] w-full">
            <BarChart data={echecTrendData} barSize={28}>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="jour" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={32}
                tickFormatter={(v: number) => `${v}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="echec" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Détail par méthode de paiement</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Méthode</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Transactions</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Volume</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Taux d&apos;échec</th>
              </tr>
            </thead>
            <tbody>
              {modeStats.map(row => {
                const Icon = row.icon
                return (
                  <tr key={row.mode} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB]">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', row.bg)}>
                          <Icon className={cn('w-4 h-4', row.text)} />
                        </div>
                        <span className="font-medium text-[#111827] text-xs">{row.mode}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-[#111827] text-xs">{row.transactions.toLocaleString('fr')}</td>
                    <td className="py-3 px-3 text-right text-xs text-emerald-600 font-semibold">{row.volume}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                        parseFloat(row.taux_echec) === 0 ? 'bg-emerald-50 text-emerald-700' :
                        parseFloat(row.taux_echec) > 3 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      )}>
                        {parseFloat(row.taux_echec) > 0 && <AlertTriangle className="w-2.5 h-2.5" />}
                        {row.taux_echec}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
