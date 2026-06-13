'use client'

import React, { useState } from 'react'
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

type ReportTab = 'activite' | 'zones' | 'export'

const reportTabs: { key: ReportTab; label: string; icon: React.ElementType }[] = [
  { key: 'activite', label: 'Activité', icon: Activity },
  { key: 'zones', label: 'Zones', icon: MapPin },
  { key: 'export', label: 'Export', icon: Download },
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
  courses: { label: 'Courses', color: '#2563eb' },
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
  courses: { label: 'Courses', color: '#2563eb' },
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
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
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
      {activeTab === 'activite' && <ActiviteTab />}
      {activeTab === 'zones' && <ZonesTab />}
      {activeTab === 'export' && <ExportTab />}
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
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
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
                <p className="text-xl font-bold text-blue-700">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Daily courses line chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-blue-600" />
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
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
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
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#coursesGradient)"
            />
          </AreaChart>
        </ChartContainer>

        {/* Quick stats under chart */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
          <div>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur jour</p>
            <p className="text-sm font-bold text-blue-700">J29</p>
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
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-[#111827]">
              Zones les plus actives
            </h2>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
              Top 5
            </Badge>
          </div>
        </div>

        <div className="divide-y divide-[#F3F4F6]">
          {zoneData.map((zone, i) => (
            <div
              key={zone.zone}
              className="px-5 py-4 flex items-center gap-4 hover:bg-blue-50/30 transition-colors"
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  i === 0
                    ? 'bg-blue-600 text-white'
                    : i === 1
                      ? 'bg-blue-100 text-blue-700'
                      : i === 2
                        ? 'bg-blue-50 text-blue-600'
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
                  className="h-2 rounded-full bg-blue-600"
                  style={{
                    width: `${Math.max(20, (zone.courses / zoneData[0].courses) * 120)}px`,
                  }}
                />
                <span className="text-xs font-medium text-blue-700 w-10 text-right">
                  {Math.round((zone.courses / zoneData[0].courses) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone bar chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-blue-600" />
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
          <Calendar className="w-4 h-4 text-blue-600" />
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
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
            <FileText className="w-7 h-7 text-red-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#111827] group-hover:text-blue-700 transition-colors">
              Export PDF
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Rapport formaté avec graphiques
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 transition-colors"
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
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
            <FileText className="w-7 h-7 text-green-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#111827] group-hover:text-blue-700 transition-colors">
              Export CSV
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Données brutes compatibles Excel
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 transition-colors"
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
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <FileText className="w-7 h-7 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#111827] group-hover:text-blue-700 transition-colors">
              Export Excel
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Tableur avec mise en forme
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger Excel
          </span>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
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
              className="px-5 py-3 flex items-center justify-between hover:bg-blue-50/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
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
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs gap-1"
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
