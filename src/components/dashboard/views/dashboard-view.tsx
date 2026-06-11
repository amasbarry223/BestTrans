'use client'

import React from 'react'
import {
  FolderOpen,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Truck,
  Warehouse,
  Receipt,
  Clock,
  Users,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  DollarSign,
  FileCheck,
  Route,
  Container,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ViewKey } from '../navigation'
import { useDashboard, type TransitDossier } from '@/components/dashboard/dashboard-context'
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
    label: 'Dossiers en cours',
    value: '34',
    trend: '+12%',
    trendUp: true,
    icon: FolderOpen,
    accent: 'teal' as const,
  },
  {
    label: "Chiffre d'affaires",
    value: '127,5 M FCFA',
    trend: '+18%',
    trendUp: true,
    icon: DollarSign,
    accent: 'sky' as const,
  },
  {
    label: 'Débours en cours',
    value: '42,3 M FCFA',
    trend: '+8%',
    trendUp: true,
    icon: Receipt,
    accent: 'amber' as const,
  },
  {
    label: 'Créances clients',
    value: '28,7 M FCFA',
    trend: '-5%',
    trendUp: false,
    icon: AlertTriangle,
    accent: 'rose' as const,
  },
]

const expertKPIs = [
  { label: 'Délai moy. dédouane', value: '4,2 j', target: '5 j', icon: Timer, color: 'text-teal-600', bg: 'bg-teal-50', status: 'good' as const },
  { label: 'Conteneurs en surestaries', value: '3', alert: '+2 ce mois', icon: Container, color: 'text-rose-600', bg: 'bg-rose-50', status: 'warning' as const },
  { label: 'Taux occupation dépôts', value: '72%', target: '<85%', icon: Warehouse, color: 'text-amber-600', bg: 'bg-amber-50', status: 'good' as const },
  { label: 'DSO moyen', value: '32 j', target: '<45 j', icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50', status: 'good' as const },
]

const accentMap: Record<string, { bg: string; iconBg: string; iconText: string; ring: string }> = {
  teal:  { bg: 'bg-teal-50',  iconBg: 'bg-teal-100',  iconText: 'text-teal-600',  ring: 'ring-teal-200' },
  sky:   { bg: 'bg-sky-50',   iconBg: 'bg-sky-100',   iconText: 'text-sky-600',   ring: 'ring-sky-200' },
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconText: 'text-amber-600', ring: 'ring-amber-200' },
  rose:  { bg: 'bg-rose-50',  iconBg: 'bg-rose-100',  iconText: 'text-rose-600',  ring: 'ring-rose-200' },
  violet:{ bg: 'bg-violet-50',iconBg: 'bg-violet-100',iconText: 'text-violet-600',ring: 'ring-violet-200' },
  emerald:{ bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', ring: 'ring-emerald-200' },
}

const quickActionViewMap: Record<string, ViewKey> = {
  'Nouveau Dossier': 'dossiers',
  'Clients': 'clients',
  'Transport': 'transport',
  'Dépôts': 'depots',
  'Facturation': 'facturation',
  'Documents': 'ged',
  'Corridors': 'corridors',
  'Calcul Douanes': 'calculatrice',
  'Surestaries': 'surestaries',
}

const quickActions = [
  { label: 'Nouveau Dossier', icon: FolderOpen, accent: 'teal' },
  { label: 'Clients',         icon: Users,      accent: 'sky' },
  { label: 'Transport',       icon: Truck,      accent: 'amber' },
  { label: 'Dépôts',         icon: Warehouse,  accent: 'violet' },
  { label: 'Facturation',     icon: Receipt,    accent: 'rose' },
  { label: 'Documents',       icon: FileCheck,  accent: 'emerald' },
  { label: 'Corridors',       icon: Route,      accent: 'teal' },
  { label: 'Calcul Douanes',  icon: Zap,        accent: 'amber' },
  { label: 'Surestaries',     icon: Container,  accent: 'rose' },
] as const

type DossierStatus = 'Ouvert' | 'En cours' | 'BAE' | 'Livré' | 'Clôturé'
type DossierType = 'Import' | 'Export' | 'Transit' | 'Réexport.'

const statusStyle: Record<DossierStatus, { bg: string; text: string; dot: string }> = {
  'Ouvert':   { bg: 'bg-sky-50',   text: 'text-sky-700',   dot: 'bg-sky-500' },
  'En cours': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'BAE':      { bg: 'bg-teal-50',  text: 'text-teal-700',  dot: 'bg-teal-500' },
  'Livré':    { bg: 'bg-violet-50',text: 'text-violet-700', dot: 'bg-violet-500' },
  'Clôturé':  { bg: 'bg-emerald-50',text: 'text-emerald-700',dot: 'bg-emerald-500' },
}

const recentDossiers: {
  id: string
  number: string
  type: DossierType
  client: string
  merchandise: string
  corridor: string
  status: DossierStatus
  honoraires: string
  date: string
}[] = [
  { id: '1', number: 'TRS-2026-0142', type: 'Import',     client: 'SCOPEX Mali',        merchandise: 'Matériel agricole', corridor: 'Dakar-Bamako', status: 'En cours', honoraires: '2 500 000 FCFA',  date: '08 Mars' },
  { id: '2', number: 'TRS-2026-0141', type: 'Import',     client: 'MALI TEXTILES',       merchandise: 'Tissus & vêtements', corridor: 'Abidjan-Bamako', status: 'BAE',     honoraires: '1 800 000 FCFA',  date: '07 Mars' },
  { id: '3', number: 'TRS-2026-0140', type: 'Export',     client: 'SOMADIA',             merchandise: 'Noix de cajou',      corridor: 'Bamako-Abidjan', status: 'Ouvert',   honoraires: '950 000 FCFA',    date: '07 Mars' },
  { id: '4', number: 'TRS-2026-0139', type: 'Transit',    client: 'CMA CGM Mali',        merchandise: "Conteneurs 40' HC", corridor: 'Lomé-Bamako',   status: 'En cours', honoraires: '3 200 000 FCFA',  date: '06 Mars' },
  { id: '5', number: 'TRS-2026-0138', type: 'Import',     client: 'PHARMACIE POPULAIRE', merchandise: 'Produits pharmaceutiques', corridor: 'Dakar-Bamako', status: 'Livré',  honoraires: '1 200 000 FCFA',  date: '06 Mars' },
  { id: '6', number: 'TRS-2026-0137', type: 'Réexport.',  client: 'TOTAL MALI',          merchandise: 'Équipements pétroliers', corridor: 'Conakry-Bamako', status: 'Clôturé', honoraires: '4 100 000 FCFA',  date: '05 Mars' },
  { id: '7', number: 'TRS-2026-0136', type: 'Import',     client: 'BRAMALI',             merchandise: 'Ciments & matériaux',  corridor: 'Abidjan-Bamako', status: 'BAE',    honoraires: '1 600 000 FCFA',  date: '05 Mars' },
  { id: '8', number: 'TRS-2026-0135', type: 'Transit',    client: 'MAERSK MALI',         merchandise: 'Marchandises diverses', corridor: 'Tema-Bamako',   status: 'En cours', honoraires: '2 800 000 FCFA',  date: '04 Mars' },
]

/* Top Clients */
const topClients = [
  { name: 'CMA CGM Mali', ca: '22,0 M', dossiers: 56, trend: '+15%', color: '#0d9488' },
  { name: 'MAERSK MALI', ca: '18,0 M', dossiers: 48, trend: '+8%', color: '#0ea5e9' },
  { name: 'SCOPEX Mali', ca: '15,2 M', dossiers: 34, trend: '+22%', color: '#f59e0b' },
  { name: 'TOTAL MALI', ca: '12,4 M', dossiers: 41, trend: '+5%', color: '#8b5cf6' },
  { name: 'MALI TEXTILES', ca: '8,5 M', dossiers: 22, trend: '+12%', color: '#f43f5e' },
]

/* ------------------------------------------------------------------ */
/*  Chart Data                                                         */
/* ------------------------------------------------------------------ */

const monthlyVolumeData = [
  { month: 'Oct', import: 28, export: 12, transit: 8 },
  { month: 'Nov', import: 32, export: 15, transit: 10 },
  { month: 'Déc', import: 35, export: 18, transit: 12 },
  { month: 'Jan', import: 30, export: 14, transit: 9 },
  { month: 'Fév', import: 38, export: 20, transit: 14 },
  { month: 'Mar', import: 34, export: 16, transit: 11 },
]

const monthlyVolumeConfig: ChartConfig = {
  import:  { label: 'Import',     color: '#0d9488' },
  export:  { label: 'Export',     color: '#0ea5e9' },
  transit: { label: 'Transit',    color: '#f59e0b' },
}

const revenueTrendData = [
  { month: 'Oct', ca: 95, debours: 32 },
  { month: 'Nov', ca: 108, debours: 38 },
  { month: 'Déc', ca: 118, debours: 35 },
  { month: 'Jan', ca: 102, debours: 30 },
  { month: 'Fév', ca: 125, debours: 42 },
  { month: 'Mar', ca: 127, debours: 40 },
]

const revenueTrendConfig: ChartConfig = {
  ca:      { label: 'CA Honoraires', color: '#0d9488' },
  debours: { label: 'Débours',      color: '#f59e0b' },
}

const corridorDistributionData = [
  { name: 'Dakar-Bamako',    value: 35, color: '#0d9488' },
  { name: 'Abidjan-Bamako',  value: 28, color: '#0ea5e9' },
  { name: 'Lomé-Bamako',     value: 18, color: '#f59e0b' },
  { name: 'Tema-Bamako',     value: 12, color: '#8b5cf6' },
  { name: 'Conakry-Bamako',  value: 7,  color: '#f43f5e' },
]

const corridorConfig: ChartConfig = {
  'Dakar-Bamako':   { label: 'Dakar-Bamako',   color: '#0d9488' },
  'Abidjan-Bamako': { label: 'Abidjan-Bamako', color: '#0ea5e9' },
  'Lomé-Bamako':    { label: 'Lomé-Bamako',    color: '#f59e0b' },
  'Tema-Bamako':    { label: 'Tema-Bamako',    color: '#8b5cf6' },
  'Conakry-Bamako': { label: 'Conakry-Bamako', color: '#f43f5e' },
}

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
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DashboardView({ setActiveView }: { setActiveView: (view: ViewKey) => void }) {
  const { navigateToDossierDetail } = useDashboard()

  const handleRecentDossierClick = (d: typeof recentDossiers[number]) => {
    const dossier: TransitDossier = {
      id: d.id,
      number: d.number,
      type: d.type as TransitDossier['type'],
      client: d.client,
      regime: 'Consommation',
      bl: '-',
      bureau: 'Bamako-Sénou',
      merchandise: d.merchandise,
      status: d.status,
      honoraires: d.honoraires,
      droitsTaxes: '-',
      date: d.date,
      corridor: d.corridor,
    }
    navigateToDossierDetail(dossier)
  }
  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const colors = accentMap[s.accent]
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.iconBg)}>
                  <Icon className={cn('w-5 h-5', colors.iconText)} />
                </div>
                <span className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
                  s.trendUp ? 'text-teal-700 bg-teal-50' : 'text-rose-700 bg-rose-50'
                )}>
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

      {/* ---- Expert KPIs ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-[#111827]">KPIs Opérationnels</h2>
          </div>
          <span className="text-[10px] text-[#9CA3AF]">Mise à jour temps réel</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {expertKPIs.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', kpi.bg)}>
                  <Icon className={cn('w-4 h-4', kpi.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{kpi.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-[#111827]">{kpi.value}</span>
                    {kpi.target && <span className="text-[10px] text-[#9CA3AF]">/ {kpi.target}</span>}
                    {kpi.alert && <span className="text-[10px] text-rose-500 font-medium">{kpi.alert}</span>}
                  </div>
                </div>
                <span className={cn(
                  'ml-auto w-2 h-2 rounded-full shrink-0',
                  kpi.status === 'good' ? 'bg-emerald-400' : 'bg-amber-400'
                )} />
              </div>
            )
          })}
        </div>
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
        {/* Volume mensuel - Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-teal-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Volume mensuel (dossiers)</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Calendar className="w-3.5 h-3.5" />
              <span>6 derniers mois</span>
            </div>
          </div>
          <ChartContainer config={monthlyVolumeConfig} className="h-[220px] w-full">
            <BarChart data={monthlyVolumeData} barGap={2} barCategoryGap="20%">
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="import" fill="var(--color-import)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="export" fill="var(--color-export)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="transit" fill="var(--color-transit)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
          <div className="flex items-center justify-center gap-5 mt-3">
            {Object.entries(monthlyVolumeConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cfg.color }} />
                <span className="text-xs text-[#6B7280]">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par corridor - Donut */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4.5 h-4.5 text-amber-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Corridors</h2>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ChartContainer config={corridorConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie data={corridorDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" labelLine={false} label={PieCustomLabel} strokeWidth={0}>
                  {corridorDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number, name: string) => [`${value}%`, name]} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 w-full">
              {corridorDistributionData.map((item) => (
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

      {/* ---- Bottom Row: Top Clients + Revenue + Dossiers ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
        {/* Top Clients */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Top Clients</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('clients')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {topClients.map((client, i) => (
              <div key={client.name} className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-[#9CA3AF] w-4 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111827] truncate">{client.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#9CA3AF]">{client.ca} FCFA</span>
                    <span className="text-[10px] font-medium text-teal-600">{client.trend}</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#6B7280]">{client.dossiers} dos.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-1 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-teal-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Tendance</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Clock className="w-3.5 h-3.5" />
              <span>6 mois</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ChartContainer config={revenueTrendConfig} className="h-full w-full min-h-[140px]">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="caGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(v: number) => `${v}M`} width={35} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="ca" stroke="#0d9488" strokeWidth={2.5} fill="url(#caGradient)" />
                <Area type="monotone" dataKey="debours" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase">Délai dédouane</p>
              <p className="text-xs font-bold text-[#111827]">4,2 j <span className="text-teal-600 font-normal">-0,8</span></p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase">DSO moyen</p>
              <p className="text-xs font-bold text-teal-600">32 j</p>
            </div>
          </div>
        </div>

        {/* Dossiers récents */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Dossiers récents</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                {recentDossiers.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('dossiers')}
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Voir tout
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">N° Dossier</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Client</th>
                  <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Corridor</th>
                  <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Honoraires</th>
                  <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentDossiers.map((d) => {
                  const status = statusStyle[d.status]
                  return (
                    <tr key={d.id} onClick={() => handleRecentDossierClick(d)} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group">
                      <td className="py-3 px-5">
                        <span className="font-mono text-xs font-semibold text-teal-700 group-hover:text-teal-800">{d.number}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded',
                          d.type === 'Import' ? 'bg-teal-50 text-teal-700' :
                          d.type === 'Export' ? 'bg-sky-50 text-sky-700' :
                          d.type === 'Transit' ? 'bg-amber-50 text-amber-700' :
                          'bg-violet-50 text-violet-700'
                        )}>
                          {d.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#374151] text-xs font-medium truncate max-w-[120px]">{d.client}</td>
                      <td className="py-3 px-3 text-[#6B7280] text-xs">{d.corridor}</td>
                      <td className="py-3 px-3 text-right font-bold text-xs text-[#111827] whitespace-nowrap">{d.honoraires}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', status.bg, status.text)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                          {d.status}
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
              {recentDossiers.slice(0, 5).map((d) => {
                const status = statusStyle[d.status]
                return (
                  <div key={d.id} onClick={() => handleRecentDossierClick(d)} className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-4.5 h-4.5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#111827] truncate font-mono">{d.number}</p>
                        <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ml-2', status.bg, status.text)}>
                          <span className={cn('w-1 h-1 rounded-full', status.dot)} />
                          {d.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-[#9CA3AF] truncate">{d.client} · {d.corridor}</p>
                        <span className="text-xs font-bold text-[#111827] ml-2 whitespace-nowrap">{d.honoraires}</span>
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
