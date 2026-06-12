'use client'

import React from 'react'
import {
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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

/* ------------------------------------------------------------------ */
/*  Summary Cards Data                                                 */
/* ------------------------------------------------------------------ */

const summaryCards = [
  {
    label: 'CA total période',
    value: '142,5M FCFA',
    icon: DollarSign,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    sub: '+14% vs période préc.',
  },
  {
    label: 'Commission plateforme',
    value: '21,4M FCFA',
    icon: TrendingUp,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    sub: '15% du CA',
  },
  {
    label: 'Reversements chauffeurs',
    value: '121,1M FCFA',
    icon: BarChart3,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    sub: '85% du CA',
  },
]

/* ------------------------------------------------------------------ */
/*  Chart Data                                                         */
/* ------------------------------------------------------------------ */

const monthlyCAData = [
  { month: 'Oct', ca: 18.2, commission: 2.7, reversements: 15.5 },
  { month: 'Nov', ca: 21.5, commission: 3.2, reversements: 18.3 },
  { month: 'Déc', ca: 24.8, commission: 3.7, reversements: 21.1 },
  { month: 'Jan', ca: 22.3, commission: 3.3, reversements: 19.0 },
  { month: 'Fév', ca: 26.1, commission: 3.9, reversements: 22.2 },
  { month: 'Mar', ca: 29.6, commission: 4.4, reversements: 25.2 },
]

const monthlyCAConfig: ChartConfig = {
  ca:           { label: 'CA total',          color: '#2563eb' },
  commission:   { label: 'Commission',        color: '#60a5fa' },
  reversements: { label: 'Reversements',      color: '#93c5fd' },
}

const repartitionData = [
  { name: 'Commission plateforme', value: 15, color: '#2563eb' },
  { name: 'Reversements chauffeurs', value: 85, color: '#93c5fd' },
]

const repartitionConfig: ChartConfig = {
  'Commission plateforme':  { label: 'Commission (15%)', color: '#2563eb' },
  'Reversements chauffeurs': { label: 'Reversements (85%)', color: '#93c5fd' },
}

/* ------------------------------------------------------------------ */
/*  Financial Details Table                                            */
/* ------------------------------------------------------------------ */

const financialDetails = [
  { mois: 'Octobre 2025',   ca: '18,2M FCFA', commission: '2,7M FCFA',  reversements: '15,5M FCFA', courses: 1245, panierMoyen: '14 620 FCFA' },
  { mois: 'Novembre 2025',  ca: '21,5M FCFA', commission: '3,2M FCFA',  reversements: '18,3M FCFA', courses: 1482, panierMoyen: '14 508 FCFA' },
  { mois: 'Décembre 2025',  ca: '24,8M FCFA', commission: '3,7M FCFA',  reversements: '21,1M FCFA', courses: 1710, panierMoyen: '14 503 FCFA' },
  { mois: 'Janvier 2026',   ca: '22,3M FCFA', commission: '3,3M FCFA',  reversements: '19,0M FCFA', courses: 1536, panierMoyen: '14 518 FCFA' },
  { mois: 'Février 2026',   ca: '26,1M FCFA', commission: '3,9M FCFA',  reversements: '22,2M FCFA', courses: 1798, panierMoyen: '14 516 FCFA' },
  { mois: 'Mars 2026',      ca: '29,6M FCFA', commission: '4,4M FCFA',  reversements: '25,2M FCFA', courses: 2040, panierMoyen: '14 510 FCFA' },
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
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SyntheseFinanceView() {
  return (
    <div className="h-full flex flex-col gap-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Synthèse Financière</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Vue d&apos;ensemble des revenus et répartitions</p>
        </div>
      </div>

      {/* ---- Summary Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', card.bg)}>
                  <Icon className={cn('w-5 h-5', card.color)} />
                </div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{card.label}</p>
                <p className="text-xl font-bold text-[#111827] mt-0.5">{card.value}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">{card.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Charts Row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Area Chart - Monthly CA */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-blue-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Évolution mensuelle du CA</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Clock className="w-3.5 h-3.5" />
              <span>6 derniers mois</span>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ChartContainer config={monthlyCAConfig} className="h-[240px] w-full">
              <AreaChart data={monthlyCAData}>
                <defs>
                  <linearGradient id="caGradientBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickFormatter={(v: number) => `${v}M`}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="ca" stroke="#2563eb" strokeWidth={2.5} fill="url(#caGradientBlue)" />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">CA moyen/mois</p>
              <p className="text-sm font-bold text-[#111827]">23,8M FCFA</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur mois</p>
              <p className="text-sm font-bold text-blue-600">Mars 2026</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Croissance</p>
              <p className="text-sm font-bold text-blue-600">+62,6%</p>
              <p className="text-[10px] text-[#9CA3AF]">Oct → Mar</p>
            </div>
          </div>
        </div>

        {/* Pie Chart - Commission vs Reversements */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4.5 h-4.5 text-blue-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Répartition CA</h2>
            </div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <ChartContainer config={repartitionConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={repartitionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={PieCustomLabel}
                  strokeWidth={0}
                >
                  {repartitionData.map((entry, index) => (
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
            <div className="w-full mt-4 space-y-2">
              {repartitionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#6B7280] flex-1">{item.name}</span>
                  <span className="text-xs font-bold text-[#111827]">{item.value}%</span>
                </div>
              ))}
            </div>

            {/* Amount summary */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E5E7EB] w-full">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Commission</p>
                <p className="text-sm font-bold text-[#2563eb]">21,4M FCFA</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Reversements</p>
                <p className="text-sm font-bold text-[#93c5fd]">121,1M FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Financial Details Table ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Détails financiers mensuels</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {financialDetails.length}
            </span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-y-auto max-h-[320px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Mois</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">CA</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Commission</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Reversements</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Courses</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Panier moyen</th>
              </tr>
            </thead>
            <tbody>
              {financialDetails.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <td className="py-3 px-5 text-xs font-semibold text-[#111827] group-hover:text-blue-700 transition-colors">{row.mois}</td>
                  <td className="py-3 px-3 text-right font-bold text-xs text-[#111827] whitespace-nowrap">{row.ca}</td>
                  <td className="py-3 px-3 text-right text-xs font-medium text-[#2563eb] whitespace-nowrap">{row.commission}</td>
                  <td className="py-3 px-3 text-right text-xs font-medium text-[#374151] whitespace-nowrap">{row.reversements}</td>
                  <td className="py-3 px-3 text-right text-xs text-[#374151]">{row.courses.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-xs font-medium text-[#6B7280] whitespace-nowrap">{row.panierMoyen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden overflow-y-auto max-h-[320px]">
          <div className="divide-y divide-[#F3F4F6]">
            {financialDetails.map((row, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#111827]">{row.mois}</p>
                  <span className="text-sm font-bold text-[#111827]">{row.ca}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  <div>
                    <p className="text-[10px] text-[#9CA3AF]">Commission</p>
                    <p className="text-xs font-semibold text-blue-600">{row.commission}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9CA3AF]">Reversements</p>
                    <p className="text-xs font-semibold text-[#374151]">{row.reversements}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9CA3AF]">Courses</p>
                    <p className="text-xs font-semibold text-[#374151]">{row.courses.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <p className="text-xs text-[#9CA3AF]">Période : Oct 2025 — Mar 2026</p>
        </div>
      </div>
    </div>
  )
}
