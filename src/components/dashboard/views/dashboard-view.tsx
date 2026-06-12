'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import {
  Map,
  Car,
  DollarSign,
  XCircle,
  Star,
  Users,
  CreditCard,
  Headphones,
  BarChart3,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  KPI Data                                                           */
/* ------------------------------------------------------------------ */

const kpiCards = [
  {
    label: 'Courses en cours',
    sublabel: 'Temps réel',
    value: '47',
    icon: Map,
    color: 'blue' as const,
  },
  {
    label: 'Chauffeurs en ligne',
    sublabel: 'Actifs maintenant',
    value: '132',
    icon: Car,
    color: 'emerald' as const,
  },
  {
    label: 'CA du jour',
    sublabel: 'Chiffre d\'affaires',
    value: '2,4 M FCFA',
    icon: DollarSign,
    color: 'amber' as const,
  },
  {
    label: 'Taux d\'annulation',
    sublabel: 'Sur les dernières 24h',
    value: '4,2%',
    icon: XCircle,
    color: 'rose' as const,
  },
  {
    label: 'Note moyenne chauffeurs',
    sublabel: 'Évaluation passagers',
    value: '4,6/5',
    icon: Star,
    color: 'violet' as const,
  },
]

const colorMap: Record<string, { bg: string; iconBg: string; iconText: string; border: string }> = {
  blue:    { bg: 'bg-blue-50',    iconBg: 'bg-blue-100',    iconText: 'text-blue-600',    border: 'border-blue-200' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', border: 'border-emerald-200' },
  amber:   { bg: 'bg-amber-50',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600',   border: 'border-amber-200' },
  rose:    { bg: 'bg-rose-50',    iconBg: 'bg-rose-100',    iconText: 'text-rose-600',    border: 'border-rose-200' },
  violet:  { bg: 'bg-violet-50',  iconBg: 'bg-violet-100',  iconText: 'text-violet-600',  border: 'border-violet-200' },
}

/* ------------------------------------------------------------------ */
/*  Quick Actions                                                      */
/* ------------------------------------------------------------------ */

const quickActionItems = [
  { label: 'Passagers',     icon: Users,      view: 'passagers' },
  { label: 'Chauffeurs',    icon: Car,        view: 'chauffeurs' },
  { label: 'Courses',       icon: Map,        view: 'courses' },
  { label: 'Transactions',  icon: CreditCard, view: 'transactions' },
  { label: 'Tickets',       icon: Headphones, view: 'tickets' },
  { label: 'Rapports',      icon: BarChart3,  view: 'rapports' },
  { label: 'Paramètres',    icon: Settings,   view: 'parametres' },
  { label: 'Carte',         icon: Map,        view: 'carte-operations' },
] as const

/* ------------------------------------------------------------------ */
/*  Chart Data                                                         */
/* ------------------------------------------------------------------ */

const coursesParJourData = [
  { day: 'Lun', courses: 52 },
  { day: 'Mar', courses: 61 },
  { day: 'Mer', courses: 48 },
  { day: 'Jeu', courses: 67 },
  { day: 'Ven', courses: 59 },
  { day: 'Sam', courses: 43 },
  { day: 'Dim', courses: 38 },
]

const paiementData = [
  { name: 'Mobile Money', value: 45, color: '#2563eb' },
  { name: 'Cash',         value: 30, color: '#10b981' },
  { name: 'Carte',        value: 20, color: '#f59e0b' },
  { name: 'Autre',        value: 5,  color: '#8b5cf6' },
]

const activiteHoraireData = [
  { heure: '6h',  courses: 12 },
  { heure: '7h',  courses: 28 },
  { heure: '8h',  courses: 52 },
  { heure: '9h',  courses: 38 },
  { heure: '10h', courses: 30 },
  { heure: '11h', courses: 25 },
  { heure: '12h', courses: 32 },
  { heure: '13h', courses: 27 },
  { heure: '14h', courses: 22 },
  { heure: '15h', courses: 20 },
  { heure: '16h', courses: 24 },
  { heure: '17h', courses: 35 },
  { heure: '18h', courses: 55 },
  { heure: '19h', courses: 40 },
  { heure: '20h', courses: 28 },
  { heure: '21h', courses: 18 },
  { heure: '22h', courses: 12 },
  { heure: '23h', courses: 6 },
]

/* ------------------------------------------------------------------ */
/*  Recent Courses Data                                                */
/* ------------------------------------------------------------------ */

type CourseStatus = 'En cours' | 'Terminée' | 'Annulée'

const statusStyle: Record<CourseStatus, { bg: string; text: string; dot: string }> = {
  'En cours':  { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Terminée':  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Annulée':   { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500' },
}

const recentCourses: {
  number: string
  passager: string
  chauffeur: string
  trajet: string
  prix: string
  statut: CourseStatus
  date: string
}[] = [
  { number: 'BT-2026-0847', passager: 'Aminata Diallo',   chauffeur: 'Ibrahim Keita',  trajet: 'Bamako-Kaloum → Hamdallaye',    prix: '3 500 FCFA',  statut: 'En cours',  date: '12 Mars 14:32' },
  { number: 'BT-2026-0846', passager: 'Moussa Traoré',    chauffeur: 'Oumar Sidibé',   trajet: 'ACI 2000 → Sébenikoro',         prix: '2 800 FCFA',  statut: 'Terminée',  date: '12 Mars 14:15' },
  { number: 'BT-2026-0845', passager: 'Fatoumata Coulibaly', chauffeur: 'Daouda Camara', trajet: 'Badalabougou → Korofina',     prix: '4 200 FCFA',  statut: 'Terminée',  date: '12 Mars 13:58' },
  { number: 'BT-2026-0844', passager: 'Seydou Dembélé',   chauffeur: 'Mamadou Diarra', trajet: 'Niamakoro → Quartier du Fleuve', prix: '1 800 FCFA', statut: 'Annulée',   date: '12 Mars 13:40' },
  { number: 'BT-2026-0843', passager: 'Awa Sissoko',      chauffeur: 'Boubacar Bah',   trajet: 'Lafiabougou → Magnambougou',    prix: '2 200 FCFA',  statut: 'Terminée',  date: '12 Mars 13:22' },
]

/* ------------------------------------------------------------------ */
/*  Custom Tooltip for Charts                                          */
/* ------------------------------------------------------------------ */

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-[#111827] mb-1">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="text-[#6B7280]">
          <span className="font-medium text-[#111827]">{item.value}</span> {item.name}
        </p>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Pie Chart Custom Label                                             */
/* ------------------------------------------------------------------ */

function PieCustomLabel(props: Record<string, unknown>) {
  const cx = Number(props.cx ?? 0)
  const cy = Number(props.cy ?? 0)
  const midAngle = Number(props.midAngle ?? 0)
  const innerRadius = Number(props.innerRadius ?? 0)
  const outerRadius = Number(props.outerRadius ?? 0)
  const percent = Number(props.percent ?? 0)
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

export function DashboardView({ setActiveView }: { setActiveView: (view: string) => void }) {
  const { navigateToCourseDetail } = useDashboard()

  const handleCourseClick = (course: typeof recentCourses[number]) => {
    navigateToCourseDetail({
      id: course.number,
      number: course.number,
      passager: course.passager,
      chauffeur: course.chauffeur,
      depart: course.trajet.split('→')[0].trim(),
      arrivee: course.trajet.split('→')[1]?.trim() ?? '',
      statut: course.statut,
      prix: course.prix,
      modePaiement: '-',
      date: course.date,
    })
  }

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* ---- KPI Cards ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => {
          const colors = colorMap[kpi.color]
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.iconBg)}>
                  <Icon className={cn('w-5 h-5', colors.iconText)} />
                </div>
                <TrendingUp className="w-4 h-4 text-[#9CA3AF]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{kpi.value}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{kpi.label}</p>
                <p className="text-[10px] text-[#9CA3AF]">{kpi.sublabel}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Quick Actions ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-[#111827]">Actions rapides</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {quickActionItems.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => setActiveView(action.view)}
                className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl hover:bg-blue-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[11px] font-medium text-[#6B7280] group-hover:text-blue-700 whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- Charts Section ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area Chart - Courses par jour */}
        <div className="lg:col-span-1 bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Courses par jour</h2>
            </div>
            <span className="text-[10px] text-[#9CA3AF]">7 derniers jours</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={coursesParJourData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="courses" name="courses" stroke="#2563eb" strokeWidth={2.5} fill="url(#courseGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Modes de paiement */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Modes de paiement</h2>
            </div>
            <span className="text-[10px] text-[#9CA3AF]">Répartition</span>
          </div>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={paiementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={PieCustomLabel as unknown as boolean}
                  strokeWidth={0}
                >
                  {paiementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 w-full">
              {paiementData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-[#6B7280] truncate">{item.name}</span>
                  <span className="text-[11px] font-semibold text-[#111827] ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart - Pic d'activité horaire */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-[#111827]">Pic d'activité horaire</h2>
            </div>
            <span className="text-[10px] text-[#9CA3AF]">6h - 23h</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activiteHoraireData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="heure" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={1} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="courses"
                name="courses"
                fill="#2563eb"
                radius={[3, 3, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- Recent Activity (Courses) ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Courses récentes</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {recentCourses.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('courses')}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Voir tout
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB] sticky top-0">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">N° Course</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Passager</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Chauffeur</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Trajet</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Prix</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.map((c) => {
                const style = statusStyle[c.statut]
                return (
                  <tr
                    key={c.number}
                    onClick={() => handleCourseClick(c)}
                    className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-5">
                      <span className="font-mono text-xs font-semibold text-blue-700 group-hover:text-blue-800">{c.number}</span>
                    </td>
                    <td className="py-3 px-3 text-[#374151] text-xs font-medium truncate max-w-[130px]">{c.passager}</td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs truncate max-w-[120px]">{c.chauffeur}</td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs truncate max-w-[180px]">{c.trajet}</td>
                    <td className="py-3 px-3 text-right font-bold text-xs text-[#111827] whitespace-nowrap">{c.prix}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', style.bg, style.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
                        {c.statut}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#9CA3AF] text-xs whitespace-nowrap">{c.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-[#F3F4F6]">
          {recentCourses.map((c) => {
            const style = statusStyle[c.statut]
            return (
              <div
                key={c.number}
                onClick={() => handleCourseClick(c)}
                className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Map className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#111827] truncate font-mono">{c.number}</p>
                    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ml-2', style.bg, style.text)}>
                      <span className={cn('w-1 h-1 rounded-full', style.dot)} />
                      {c.statut}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-[#9CA3AF] truncate">{c.passager} · {c.chauffeur}</p>
                    <span className="text-xs font-bold text-[#111827] ml-2 whitespace-nowrap">{c.prix}</span>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{c.trajet}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
