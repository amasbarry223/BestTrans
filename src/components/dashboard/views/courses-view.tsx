'use client'

import { useState } from 'react'
import {
  Map,
  Navigation,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  XCircle,
  RotateCcw,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard, type CourseData } from '@/components/dashboard/dashboard-context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

/* ──────────── Types ──────────── */
type CourseStatut = 'En attente' | 'En cours' | 'Terminée' | 'Annulée'
type ModePaiement = 'Mobile Money' | 'Cash' | 'Carte bancaire'

interface Course extends CourseData {
  depart: string
  arrivee: string
  prix: string
  modePaiement: string
  statut: CourseStatut
}

/* ──────────── Status styling ──────────── */
const statutStyle: Record<CourseStatut, { bg: string; text: string; dot: string }> = {
  'En attente': { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  'En cours': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Terminée': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Annulée': { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
}

const paiementStyle: Record<ModePaiement, { bg: string; text: string }> = {
  'Mobile Money': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Cash': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Carte bancaire': { bg: 'bg-violet-50', text: 'text-violet-700' },
}

/* ──────────── KPI data ──────────── */
const kpiStats = [
  { label: "Courses aujourd'hui", value: '189', icon: Map, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'En cours', value: '47', icon: Navigation, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: "Taux d'achèvement", value: '92%', icon: CheckCircle2, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Prix moyen', value: '3 200 FCFA', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
]

/* ──────────── Mock courses ──────────── */
const mockCourses: Course[] = [
  { id: '1', number: 'BTS-20260305-001', passager: 'Amadou Diallo', chauffeur: 'Ibrahim Keita', depart: 'Kalaban-Coura', arrivee: 'Badalabougou', prix: '2 500 FCFA', modePaiement: 'Mobile Money', statut: 'Terminée', date: '05/03/2026 08:12' },
  { id: '2', number: 'BTS-20260305-002', passager: 'Fatoumata Traoré', chauffeur: 'Moussa Sissoko', depart: 'Hamdallaye', arrivee: 'Sébenikoro', prix: '3 800 FCFA', modePaiement: 'Cash', statut: 'En cours', date: '05/03/2026 08:34' },
  { id: '3', number: 'BTS-20260305-003', passager: 'Kadiatou Bah', chauffeur: 'Seydou Diabaté', depart: 'Lafiabougou', arrivee: 'Kalaban-Coura', prix: '4 200 FCFA', modePaiement: 'Carte bancaire', statut: 'En attente', date: '05/03/2026 09:01' },
  { id: '4', number: 'BTS-20260305-004', passager: 'Oumar Sidibé', chauffeur: 'Amadou Coulibaly', depart: 'Badalabougou', arrivee: 'Hamdallaye', prix: '1 800 FCFA', modePaiement: 'Mobile Money', statut: 'Terminée', date: '05/03/2026 09:15' },
  { id: '5', number: 'BTS-20260305-005', passager: 'Aminata Coulibaly', chauffeur: 'Bakary Traoré', depart: 'Sébenikoro', arrivee: 'Lafiabougou', prix: '5 100 FCFA', modePaiement: 'Cash', statut: 'Annulée', date: '05/03/2026 09:28' },
  { id: '6', number: 'BTS-20260305-006', passager: 'Mamadou Diarra', chauffeur: 'Ibrahim Keita', depart: 'Kalaban-Coura', arrivee: 'Sébenikoro', prix: '3 200 FCFA', modePaiement: 'Mobile Money', statut: 'En cours', date: '05/03/2026 09:45' },
  { id: '7', number: 'BTS-20260305-007', passager: 'Rokia Dembélé', chauffeur: 'Moussa Sissoko', depart: 'Lafiabougou', arrivee: 'Badalabougou', prix: '2 900 FCFA', modePaiement: 'Carte bancaire', statut: 'Terminée', date: '05/03/2026 10:02' },
  { id: '8', number: 'BTS-20260305-008', passager: 'Drissa Sanogo', chauffeur: 'Seydou Diabaté', depart: 'Hamdallaye', arrivee: 'Lafiabougou', prix: '6 300 FCFA', modePaiement: 'Cash', statut: 'En attente', date: '05/03/2026 10:18' },
  { id: '9', number: 'BTS-20260305-009', passager: 'Awa Kamissoko', chauffeur: 'Amadou Coulibaly', depart: 'Badalabougou', arrivee: 'Kalaban-Coura', prix: '2 100 FCFA', modePaiement: 'Mobile Money', statut: 'Terminée', date: '05/03/2026 10:35' },
  { id: '10', number: 'BTS-20260305-010', passager: 'Boubacar Dia', chauffeur: 'Bakary Traoré', depart: 'Sébenikoro', arrivee: 'Hamdallaye', prix: '4 700 FCFA', modePaiement: 'Carte bancaire', statut: 'En cours', date: '05/03/2026 10:50' },
  { id: '11', number: 'BTS-20260305-011', passager: 'Mariam Sacko', chauffeur: 'Ibrahim Keita', depart: 'Lafiabougou', arrivee: 'Sébenikoro', prix: '3 500 FCFA', modePaiement: 'Cash', statut: 'Annulée', date: '05/03/2026 11:05' },
  { id: '12', number: 'BTS-20260305-012', passager: 'Salif Keita', chauffeur: 'Moussa Sissoko', depart: 'Kalaban-Coura', arrivee: 'Hamdallaye', prix: '2 800 FCFA', modePaiement: 'Mobile Money', statut: 'En attente', date: '05/03/2026 11:22' },
]

/* ──────────── Component ──────────── */
export function CoursesView() {
  const { navigateToCourseDetail } = useDashboard()

  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const handleCancelCourse = (c: Course) => {
    setSelectedCourse(c)
    setCancelDialogOpen(true)
  }

  const handleRefundCourse = (c: Course) => {
    setSelectedCourse(c)
    setRefundDialogOpen(true)
  }

  const confirmCancel = () => {
    if (selectedCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id ? { ...c, statut: 'Annulée' as CourseStatut } : c
        )
      )
      setCancelDialogOpen(false)
      setSelectedCourse(null)
    }
  }

  const confirmRefund = () => {
    setRefundDialogOpen(false)
    setSelectedCourse(null)
  }

  const filtered = courses.filter((c) => {
    const q = searchTerm.toLowerCase()
    const matchSearch =
      searchTerm === '' ||
      c.number.toLowerCase().includes(q) ||
      c.passager.toLowerCase().includes(q) ||
      c.chauffeur.toLowerCase().includes(q)
    const matchStatut = filterStatut === 'all' || c.statut === filterStatut
    return matchSearch && matchStatut
  })

  const handleExportCSV = () => {
    const headers = ['N° Course', 'Passager', 'Chauffeur', 'Départ', 'Arrivée', 'Prix', 'Mode paiement', 'Statut', 'Date']
    const rows = filtered.map((c) => [c.number, c.passager, c.chauffeur, c.depart, c.arrivee, c.prix, c.modePaiement, c.statut, c.date])
    const csv = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'courses_export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <Icon className={cn('w-5 h-5', s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#111827]">{s.value}</p>
                <p className="text-xs text-[#6B7280]">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Search & Filter ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par N°, passager, chauffeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
                showFilters
                  ? 'border-orange-300 bg-orange-50 text-orange-700'
                  : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              <ChevronDown className={cn('w-3 h-3 transition-transform', showFilters && 'rotate-180')} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-[#9CA3AF] uppercase">Statut</label>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-[#9CA3AF] uppercase">Date début</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-[#9CA3AF] uppercase">Date fin</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={() => { setFilterStatut('all'); setDateFrom(''); setDateTo(''); setSearchTerm('') }}
              className="px-3 py-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop DataTable ── */}
      <div className="hidden md:block flex-1 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="py-3 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">N° Course</th>
                <th className="py-3 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Passager</th>
                <th className="py-3 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Chauffeur</th>
                <th className="py-3 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Départ</th>
                <th className="py-3 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Arrivée</th>
                <th className="py-3 px-4 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase">Prix</th>
                <th className="py-3 px-4 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Mode paiement</th>
                <th className="py-3 px-4 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Statut</th>
                <th className="py-3 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Date</th>
                <th className="py-3 px-4 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const st = statutStyle[c.statut] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
                const mp = paiementStyle[c.modePaiement as ModePaiement] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }
                return (
                  <tr key={c.id} className="border-b border-[#F3F4F6] hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigateToCourseDetail(c)}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-800 hover:underline font-mono"
                      >
                        {c.number}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#111827]">{c.passager}</td>
                    <td className="py-3 px-4 text-sm text-[#111827]">{c.chauffeur}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{c.depart}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{c.arrivee}</td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-[#111827]">{c.prix}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', mp?.bg, mp?.text)}>
                        {c.modePaiement}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', st.bg, st.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />
                        {c.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6B7280] whitespace-nowrap">{c.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => navigateToCourseDetail(c)}
                          title="Voir détail"
                          className="p-1.5 rounded-md hover:bg-orange-50 text-orange-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancelCourse(c)}
                          title="Annuler"
                          className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRefundCourse(c)}
                          title="Rembourser"
                          className="p-1.5 rounded-md hover:bg-amber-50 text-amber-500 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-sm text-[#9CA3AF]">
                    Aucune course trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden flex-1 overflow-y-auto">
        <div className="space-y-3">
          {filtered.map((c) => {
            const st = statutStyle[c.statut] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
            const mp = paiementStyle[c.modePaiement as ModePaiement] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }
            return (
              <div key={c.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => navigateToCourseDetail(c)}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-800 font-mono"
                  >
                    {c.number}
                  </button>
                  <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', st.bg, st.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />
                    {c.statut}
                  </span>
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <span className="font-medium text-[#111827]">{c.depart}</span>
                  <span className="text-[#9CA3AF]">→</span>
                  <span className="font-medium text-[#111827]">{c.arrivee}</span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-[#9CA3AF]">Passager</span>
                    <p className="font-medium text-[#111827]">{c.passager}</p>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF]">Chauffeur</span>
                    <p className="font-medium text-[#111827]">{c.chauffeur}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#111827]">{c.prix}</span>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', mp?.bg, mp?.text)}>
                      {c.modePaiement}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF]">{c.date}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                  <button
                    onClick={() => navigateToCourseDetail(c)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Détail
                  </button>
                  <button
                    onClick={() => handleCancelCourse(c)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Annuler
                  </button>
                  <button
                    onClick={() => handleRefundCourse(c)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rembourser
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-[#9CA3AF]">
              Aucune course trouvée
            </div>
          )}
        </div>
      </div>

      {/* ── Cancel AlertDialog ── */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la course</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler la course{' '}
              <strong className="text-orange-700 font-mono">{selectedCourse?.number}</strong> ?
              Le passager <strong>{selectedCourse?.passager}</strong> sera notifié.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 my-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Passager</p>
                <p className="font-semibold text-[#111827]">{selectedCourse?.passager}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Chauffeur</p>
                <p className="font-semibold text-[#111827]">{selectedCourse?.chauffeur}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Trajet</p>
                <p className="font-medium text-[#374151]">{selectedCourse?.depart} → {selectedCourse?.arrivee}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Prix</p>
                <p className="font-bold text-orange-600">{selectedCourse?.prix}</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-rose-600 hover:bg-rose-700 text-white">
              <XCircle className="w-4 h-4 mr-2" />
              Confirmer l&apos;annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Refund AlertDialog ── */}
      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rembourser le passager</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de rembourser{' '}
              <strong className="text-orange-700">{selectedCourse?.prix}</strong> à{' '}
              <strong>{selectedCourse?.passager}</strong> pour la course{' '}
              <span className="font-mono text-xs">{selectedCourse?.number}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 my-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Passager</p>
                <p className="font-semibold text-[#111827]">{selectedCourse?.passager}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Montant</p>
                <p className="font-bold text-orange-600">{selectedCourse?.prix}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Mode paiement</p>
                <p className="font-medium text-[#374151]">{selectedCourse?.modePaiement}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Statut actuel</p>
                <p className="font-medium text-[#374151]">{selectedCourse?.statut}</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRefund} className="bg-amber-600 hover:bg-amber-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Confirmer le remboursement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
