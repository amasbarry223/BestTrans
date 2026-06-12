'use client'

import { useState } from 'react'
import {
  Users,
  TrendingUp,
  Map,
  UserCheck,
  Search,
  Download,
  Eye,
  Ban,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PassagerStatus = 'Actif' | 'Suspendu' | 'Inactif'

interface Passager {
  id: string
  name: string
  phone: string
  email: string
  dateInscription: string
  courses: number
  status: PassagerStatus
}

/* ------------------------------------------------------------------ */
/*  Status Styles                                                      */
/* ------------------------------------------------------------------ */

const statusStyle: Record<PassagerStatus, { bg: string; text: string; dot: string }> = {
  'Actif':     { bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500' },
  'Suspendu':  { bg: 'bg-rose-50',     text: 'text-rose-700',     dot: 'bg-rose-500' },
  'Inactif':   { bg: 'bg-gray-100',    text: 'text-gray-500',     dot: 'bg-gray-400' },
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockPassagers: Passager[] = [
  { id: '1',  name: 'Amadou Diallo',           phone: '+223 70 12 34 56', email: 'amadou.diallo@orange.ml',       dateInscription: '15 Jan 2025', courses: 42,  status: 'Actif' },
  { id: '2',  name: 'Fatoumata Traoré',         phone: '+223 96 55 44 33', email: 'f.traore@malinet.ml',           dateInscription: '03 Fév 2025', courses: 28,  status: 'Actif' },
  { id: '3',  name: 'Ibrahim Keita',            phone: '+223 95 88 77 66', email: 'ibrahim.keita@gmail.com',       dateInscription: '21 Mar 2025', courses: 15,  status: 'Inactif' },
  { id: '4',  name: 'Aminata Coulibaly',        phone: '+223 97 33 22 11', email: 'a.coulibaly@orange.ml',         dateInscription: '10 Avr 2025', courses: 67,  status: 'Actif' },
  { id: '5',  name: 'Moussa Sissoko',           phone: '+223 70 99 88 77', email: 'm.sissoko@malinet.ml',          dateInscription: '28 Mai 2025', courses: 5,   status: 'Suspendu' },
  { id: '6',  name: 'Seydou Diabaté',           phone: '+223 96 11 22 33', email: 'seydou.diabate@gmail.com',      dateInscription: '14 Juin 2025', courses: 33,  status: 'Actif' },
  { id: '7',  name: 'Oumou Sangaré',            phone: '+223 95 44 55 66', email: 'o.sangare@orange.ml',           dateInscription: '02 Juil 2025', courses: 0,   status: 'Inactif' },
  { id: '8',  name: 'Boubacar Dembélé',         phone: '+223 97 66 55 44', email: 'b.dembele@malinet.ml',          dateInscription: '19 Aoû 2025', courses: 21,  status: 'Actif' },
  { id: '9',  name: 'Mariam Cissé',             phone: '+223 70 77 88 99', email: 'mariam.cisse@gmail.com',        dateInscription: '05 Sep 2025', courses: 8,   status: 'Suspendu' },
  { id: '10', name: 'Abdoulaye Kamissoko',      phone: '+223 96 22 33 44', email: 'a.kamissoko@orange.ml',         dateInscription: '22 Oct 2025', courses: 54,  status: 'Actif' },
]

/* ------------------------------------------------------------------ */
/*  KPI Stats                                                          */
/* ------------------------------------------------------------------ */

const kpiStats = [
  { label: 'Passagers inscrits', value: '3 847', icon: Users,     color: 'text-blue-600',   bg: 'bg-blue-50' },
  { label: 'Nouveaux ce mois',   value: '234',   icon: TrendingUp,color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Courses totales',    value: '24 516', icon: Map,      color: 'text-amber-600',   bg: 'bg-amber-50' },
  { label: 'Passagers actifs',   value: '1 892', icon: UserCheck, color: 'text-violet-600',  bg: 'bg-violet-50' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PassagersView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [passagers, setPassagers] = useState<Passager[]>(mockPassagers)

  // Dialog states
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [passagerToSuspend, setPassagerToSuspend] = useState<Passager | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [passagerToDelete, setPassagerToDelete] = useState<Passager | null>(null)

  /* ---- Filtering ---- */
  const filtered = passagers.filter((p) => {
    const matchSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  /* ---- Handlers ---- */
  const handleView = (p: Passager) => {
    alert(`Voir le passager : ${p.name}`)
  }

  const handleSuspend = (p: Passager) => {
    setPassagerToSuspend(p)
    setSuspendDialogOpen(true)
  }

  const confirmSuspend = () => {
    if (passagerToSuspend) {
      setPassagers((prev) =>
        prev.map((p) =>
          p.id === passagerToSuspend.id
            ? { ...p, status: p.status === 'Suspendu' ? 'Actif' : 'Suspendu' }
            : p
        )
      )
      setPassagerToSuspend(null)
      setSuspendDialogOpen(false)
    }
  }

  const handleDelete = (p: Passager) => {
    setPassagerToDelete(p)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (passagerToDelete) {
      setPassagers((prev) => prev.filter((p) => p.id !== passagerToDelete.id))
      setPassagerToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Nom', 'Téléphone', 'Email', 'Date inscription', 'Courses', 'Statut']
    const rows = filtered.map((p) =>
      [p.name, p.phone, p.email, p.dateInscription, String(p.courses), p.status].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'passagers.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  /* ---- Render ---- */
  return (
    <div className="h-full flex flex-col gap-5">
      {/* ---- KPI Stats ---- */}
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

      {/* ---- Search & Filter Bar ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="Actif">Actif</option>
              <option value="Suspendu">Suspendu</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* ---- Desktop: DataTable ---- */}
      <div className="hidden md:block flex-1 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden min-h-0">
        <div className="overflow-y-auto max-h-[calc(100vh-360px)]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Nom</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Téléphone</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Email</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date inscription</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Courses</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const sty = statusStyle[p.status]
                return (
                  <tr key={p.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                          {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-[#111827] text-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs font-mono">{p.phone}</td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs truncate max-w-[180px]">{p.email}</td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs">{p.dateInscription}</td>
                    <td className="py-3 px-3 text-center font-semibold text-xs text-[#111827]">{p.courses}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => handleView(p)} className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-blue-700">Voir</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSuspend(p)} className="cursor-pointer">
                            <Ban className="w-4 h-4 mr-2 text-amber-600" />
                            <span className="text-amber-700">
                              {p.status === 'Suspendu' ? 'Réactiver' : 'Suspendre'}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(p)} className="cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2 text-rose-600" />
                            <span className="text-rose-700">Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[#9CA3AF]">
                    Aucun passager trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Mobile: Cards ---- */}
      <div className="md:hidden flex-1 overflow-y-auto min-h-0">
        <div className="space-y-3">
          {filtered.map((p) => {
            const sty = statusStyle[p.status]
            return (
              <div key={p.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                      {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{p.name}</p>
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5', sty.bg, sty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleView(p)} className="cursor-pointer">
                        <Eye className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-blue-700">Voir</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSuspend(p)} className="cursor-pointer">
                        <Ban className="w-4 h-4 mr-2 text-amber-600" />
                        <span className="text-amber-700">
                          {p.status === 'Suspendu' ? 'Réactiver' : 'Suspendre'}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(p)} className="cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2 text-rose-600" />
                        <span className="text-rose-700">Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono">{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{p.dateInscription}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#111827]">
                    <Map className="w-3.5 h-3.5 text-blue-600" />
                    <span>{p.courses} courses</span>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-[#9CA3AF]">
              Aucun passager trouvé
            </div>
          )}
        </div>
      </div>

      {/* ---- Suspend Confirmation AlertDialog ---- */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {passagerToSuspend?.status === 'Suspendu' ? 'Réactiver le passager' : 'Suspendre le passager'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {passagerToSuspend?.status === 'Suspendu' ? (
                <>
                  Êtes-vous sûr de vouloir réactiver le passager <strong>{passagerToSuspend?.name}</strong> ? Il pourra à nouveau réserver des courses.
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir suspendre le passager <strong>{passagerToSuspend?.name}</strong> ? Il ne pourra plus réserver de courses.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSuspendDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSuspend}
              className={cn(
                'text-white',
                passagerToSuspend?.status === 'Suspendu'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              )}
            >
              {passagerToSuspend?.status === 'Suspendu' ? 'Réactiver' : 'Suspendre'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---- Delete Confirmation AlertDialog ---- */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le passager <strong>{passagerToDelete?.name}</strong> ? Cette action est irréversible et toutes ses données seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
