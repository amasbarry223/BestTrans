'use client'

import { useState } from 'react'
import {
  Car,
  Clock,
  Star,
  Map,
  Search,
  Eye,
  CheckCircle2,
  Ban,
  Trash2,
  MoreHorizontal,
  Phone,
  Download,
  Shield,
  FileCheck,
  User,
  FileText,
  Calendar,
  ZoomIn,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard, type ChauffeurData } from '@/components/dashboard/dashboard-context'
import { exportToCSV } from '@/lib/export-utils'
import { toast } from 'sonner'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ChauffeurStatus = 'Actif' | 'En attente' | 'Suspendu'

interface Chauffeur extends ChauffeurData {
  vehicle: string
  note: number
  statut: ChauffeurStatus
}

interface KycItem {
  id: string
  name: string
  phone: string
  documentType: string
  submittedDate: string
  status: 'En attente' | 'Approuvé' | 'Rejeté'
}

/* ------------------------------------------------------------------ */
/*  Status Styles                                                      */
/* ------------------------------------------------------------------ */

const statusStyle: Record<ChauffeurStatus, { bg: string; text: string; dot: string }> = {
  'Actif':       { bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500' },
  'En attente':  { bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-500' },
  'Suspendu':    { bg: 'bg-rose-50',     text: 'text-rose-700',     dot: 'bg-rose-500' },
}

const kycStatusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  'En attente': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Approuvé':   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Rejeté':     { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockChauffeurs: Chauffeur[] = [
  { id: '1',  name: 'Mamadou Sidibé',     phone: '+223 70 23 45 67', vehicle: 'Toyota Corolla 2019',    note: 4.8, statut: 'Actif',      courses: 312, solde: '45 000 FCFA' },
  { id: '2',  name: 'Souleymane Diarra',  phone: '+223 96 34 56 78', vehicle: 'Renault Logan 2020',     note: 4.2, statut: 'Actif',      courses: 198, solde: '32 500 FCFA' },
  { id: '3',  name: 'Adama Traoré',       phone: '+223 95 45 67 89', vehicle: 'Hyundai Accent 2021',    note: 4.5, statut: 'En attente', courses: 0,   solde: '0 FCFA' },
  { id: '4',  name: 'Oumar Kouyaté',      phone: '+223 97 56 78 90', vehicle: 'Kia Picanto 2022',       note: 3.9, statut: 'Suspendu',   courses: 87,  solde: '12 000 FCFA' },
  { id: '5',  name: 'Modibo Konaté',      phone: '+223 70 67 89 01', vehicle: 'Toyota Yaris 2020',      note: 4.7, statut: 'Actif',      courses: 256, solde: '38 200 FCFA' },
  { id: '6',  name: 'Drissa Coulibaly',   phone: '+223 96 78 90 12', vehicle: 'Dacia Sandero 2021',     note: 4.1, statut: 'Actif',      courses: 145, solde: '21 000 FCFA' },
  { id: '7',  name: 'Bakary Doumbia',     phone: '+223 95 89 01 23', vehicle: 'Peugeot 208 2022',       note: 4.6, statut: 'En attente', courses: 0,   solde: '0 FCFA' },
  { id: '8',  name: 'Cheick Kanté',       phone: '+223 97 90 12 34', vehicle: 'Renault Clio 2019',      note: 4.3, statut: 'Actif',      courses: 178, solde: '28 700 FCFA' },
  { id: '9',  name: 'Lassina Touré',      phone: '+223 70 01 23 45', vehicle: 'Toyota Camry 2018',      note: 4.9, statut: 'Actif',      courses: 421, solde: '56 300 FCFA' },
  { id: '10', name: 'Samba Diallo',       phone: '+223 96 12 34 56', vehicle: 'Hyundai i10 2023',       note: 3.7, statut: 'En attente', courses: 0,   solde: '0 FCFA' },
]

const mockKycItems: KycItem[] = [
  { id: 'k1', name: 'Adama Traoré',     phone: '+223 95 45 67 89', documentType: 'Permis de conduire',  submittedDate: '28 Fév 2026', status: 'En attente' },
  { id: 'k2', name: 'Bakary Doumbia',   phone: '+223 95 89 01 23', documentType: 'Carte grise',         submittedDate: '27 Fév 2026', status: 'En attente' },
  { id: 'k3', name: 'Samba Diallo',     phone: '+223 96 12 34 56', documentType: 'Pièce d\'identité',   submittedDate: '26 Fév 2026', status: 'En attente' },
  { id: 'k4', name: 'Ibrahim Maïga',    phone: '+223 70 34 56 78', documentType: 'Permis de conduire',  submittedDate: '25 Fév 2026', status: 'Approuvé' },
  { id: 'k5', name: 'Moussa Haïdara',   phone: '+223 96 45 67 89', documentType: 'Assurance véhicule',  submittedDate: '24 Fév 2026', status: 'Rejeté' },
  { id: 'k6', name: 'Fatoumata Sacko',  phone: '+223 97 56 78 90', documentType: 'Carte grise',         submittedDate: '23 Fév 2026', status: 'En attente' },
  { id: 'k7', name: 'Adama Bagayoko',   phone: '+223 70 67 89 01', documentType: 'Pièce d\'identité',   submittedDate: '22 Fév 2026', status: 'Approuvé' },
  { id: 'k8', name: 'Siaka Dembélé',    phone: '+223 95 78 90 12', documentType: 'Permis de conduire',  submittedDate: '21 Fév 2026', status: 'En attente' },
]

/* ------------------------------------------------------------------ */
/*  KPI Stats                                                          */
/* ------------------------------------------------------------------ */

const kpiStats = [
  { label: 'Chauffeurs actifs',      value: '312',    icon: Car,  color: 'text-orange-600',   bg: 'bg-orange-50' },
  { label: 'En attente validation',  value: '18',     icon: Clock,color: 'text-amber-600',   bg: 'bg-amber-50' },
  { label: 'Note moyenne',           value: '4.5/5',  icon: Star, color: 'text-violet-600',  bg: 'bg-violet-50' },
  { label: "Courses aujourd'hui",    value: '89',     icon: Map,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

/* ------------------------------------------------------------------ */
/*  Star Rating Helper                                                 */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'w-3.5 h-3.5',
            i <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : i - 0.5 <= rating
                ? 'text-amber-400 fill-amber-200'
                : 'text-gray-300'
          )}
        />
      ))}
      <span className="text-xs font-semibold text-[#111827] ml-1">{rating}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChauffeursView() {
  const { navigateToChauffeurDetail } = useDashboard()
  const [activeTab, setActiveTab] = useState<'liste' | 'kyc'>('liste')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>(mockChauffeurs)
  const [kycItems, setKycItems] = useState<KycItem[]>(mockKycItems)

  // Dialog states
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [chauffeurToSuspend, setChauffeurToSuspend] = useState<Chauffeur | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chauffeurToDelete, setChauffeurToDelete] = useState<Chauffeur | null>(null)
  const [validateDialogOpen, setValidateDialogOpen] = useState(false)
  const [kycToValidate, setKycToValidate] = useState<KycItem | null>(null)
  const [kycToReject, setKycToReject] = useState<KycItem | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [kycPreviewItem, setKycPreviewItem] = useState<KycItem | null>(null)
  const [kycPreviewOpen, setKycPreviewOpen] = useState(false)
  const [kycFullscreenOpen, setKycFullscreenOpen] = useState(false)

  const openKycPreview = (item: KycItem) => {
    setKycPreviewItem(item)
    setKycPreviewOpen(true)
  }

  /* ---- Filtering ---- */
  const filtered = chauffeurs.filter((c) => {
    const matchSearch =
      searchTerm === '' ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.statut === filterStatus
    return matchSearch && matchStatus
  })

  /* ---- Handlers ---- */
  const handleViewProfile = (c: Chauffeur) => {
    navigateToChauffeurDetail({
      id: c.id,
      name: c.name,
      phone: c.phone,
      vehicle: c.vehicle,
      note: c.note,
      statut: c.statut,
      courses: c.courses,
      solde: c.solde,
    })
  }

  const handleValidate = (c: Chauffeur) => {
    setChauffeurs((prev) =>
      prev.map((ch) =>
        ch.id === c.id ? { ...ch, statut: 'Actif' } : ch
      )
    )
  }

  const handleSuspend = (c: Chauffeur) => {
    setChauffeurToSuspend(c)
    setSuspendDialogOpen(true)
  }

  const confirmSuspend = () => {
    if (chauffeurToSuspend) {
      setChauffeurs((prev) =>
        prev.map((ch) =>
          ch.id === chauffeurToSuspend.id
            ? { ...ch, statut: ch.statut === 'Suspendu' ? 'Actif' : 'Suspendu' }
            : ch
        )
      )
      setChauffeurToSuspend(null)
      setSuspendDialogOpen(false)
    }
  }

  const handleDelete = (c: Chauffeur) => {
    setChauffeurToDelete(c)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (chauffeurToDelete) {
      setChauffeurs((prev) => prev.filter((ch) => ch.id !== chauffeurToDelete.id))
      setChauffeurToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleKycApprove = (item: KycItem) => {
    setKycToValidate(item)
    setValidateDialogOpen(true)
  }

  const confirmKycApprove = () => {
    if (kycToValidate) {
      setKycItems((prev) =>
        prev.map((k) =>
          k.id === kycToValidate.id ? { ...k, status: 'Approuvé' } : k
        )
      )
      setKycToValidate(null)
      setValidateDialogOpen(false)
    }
  }

  const handleKycReject = (item: KycItem) => {
    setKycToReject(item)
    setRejectDialogOpen(true)
  }

  const confirmKycReject = () => {
    if (kycToReject) {
      setKycItems((prev) =>
        prev.map((k) =>
          k.id === kycToReject.id ? { ...k, status: 'Rejeté' } : k
        )
      )
      setKycToReject(null)
      setRejectDialogOpen(false)
    }
  }

  const handleExportCSV = () => {
    exportToCSV<ChauffeurData>(filtered, 'chauffeurs_besttrans', {
      id: 'ID',
      name: 'Nom Complet',
      phone: 'Téléphone',
      vehicle: 'Véhicule',
      note: 'Note',
      statut: 'Statut',
      courses: 'Courses',
      solde: 'Solde',
    })
    toast.success('Export CSV généré')
  }

  /* ---- Render ---- */
  return (
    <div className="h-full flex flex-col gap-5">
      {/* ---- KPI Stats ---- */}
      <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiStats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
              <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
                <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', s.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-xl font-bold text-[#111827] truncate">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-[#6B7280] truncate">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Tabs ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center border-b border-[#E5E7EB] px-2 sm:px-5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('liste')}
            className={cn(
              'px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px shrink-0',
              activeTab === 'liste'
                ? 'border-orange-600 text-orange-700'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            )}
          >
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="whitespace-nowrap">Liste chauffeurs</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={cn(
              'px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px shrink-0',
              activeTab === 'kyc'
                ? 'border-orange-600 text-orange-700'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            )}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="whitespace-nowrap">Validation KYC</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                {kycItems.filter((k) => k.status === 'En attente').length}
              </span>
            </div>
          </button>
        </div>

        {/* ---- Tab: Liste Chauffeurs ---- */}
        {activeTab === 'liste' && (
          <>
            {/* Search & Filter */}
            <div className="p-3 sm:p-4 border-b border-[#E5E7EB]">
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row flex-1 gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="Actif">Actif</option>
                    <option value="En attente">En attente</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>

            {/* Desktop: DataTable */}
            <div className="hidden md:block flex-1 overflow-x-auto overflow-y-auto min-h-0">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Nom</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Téléphone</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Véhicule</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Note</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Courses</th>
                    <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const sty = statusStyle[c.statut]
                    return (
                      <tr key={c.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                        <td className="py-3 px-5">
                          <button
                            onClick={() => handleViewProfile(c)}
                            className="flex items-center gap-3 group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs shrink-0">
                              {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                            </div>
                            <span className="font-medium text-[#111827] text-xs group-hover:text-orange-700 transition-colors">
                              {c.name}
                            </span>
                          </button>
                        </td>
                        <td className="py-3 px-3 text-[#6B7280] text-xs font-mono">{c.phone}</td>
                        <td className="py-3 px-3 text-[#6B7280] text-xs">{c.vehicle}</td>
                        <td className="py-3 px-3">
                          <StarRating rating={c.note} />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                            {c.statut}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-xs text-[#111827]">{c.courses}</td>
                        <td className="py-3 px-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                                <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewProfile(c)} className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2 text-orange-600" />
                                <span className="text-orange-700">Voir profil</span>
                              </DropdownMenuItem>
                              {c.statut === 'En attente' && (
                                <DropdownMenuItem onClick={() => handleValidate(c)} className="cursor-pointer">
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                                  <span className="text-emerald-700">Valider</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSuspend(c)} className="cursor-pointer">
                                <Ban className="w-4 h-4 mr-2 text-amber-600" />
                                <span className="text-amber-700">
                                  {c.statut === 'Suspendu' ? 'Réactiver' : 'Suspendre'}
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(c)} className="cursor-pointer">
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
                        Aucun chauffeur trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile: Cards */}
            <div className="md:hidden flex-1 overflow-y-auto min-h-0 p-4">
              <div className="space-y-3">
                {filtered.map((c) => {
                  const sty = statusStyle[c.statut]
                  return (
                    <div key={c.id} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <button
                          onClick={() => handleViewProfile(c)}
                          className="flex items-center gap-3 group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                            {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-[#111827] group-hover:text-orange-700 transition-colors">{c.name}</p>
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5', sty.bg, sty.text)}>
                              <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                              {c.statut}
                            </span>
                          </div>
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewProfile(c)} className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2 text-orange-600" />
                              <span className="text-orange-700">Voir profil</span>
                            </DropdownMenuItem>
                            {c.statut === 'En attente' && (
                              <DropdownMenuItem onClick={() => handleValidate(c)} className="cursor-pointer">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                                <span className="text-emerald-700">Valider</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleSuspend(c)} className="cursor-pointer">
                              <Ban className="w-4 h-4 mr-2 text-amber-600" />
                              <span className="text-amber-700">
                                {c.statut === 'Suspendu' ? 'Réactiver' : 'Suspendre'}
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(c)} className="cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2 text-rose-600" />
                              <span className="text-rose-700">Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-mono">{c.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                          <Car className="w-3.5 h-3.5 shrink-0" />
                          <span>{c.vehicle}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                        <StarRating rating={c.note} />
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#111827]">
                          <Map className="w-3.5 h-3.5 text-orange-600" />
                          <span>{c.courses} courses</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-sm text-[#9CA3AF]">
                    Aucun chauffeur trouvé
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---- Tab: Validation KYC ---- */}
        {activeTab === 'kyc' && (
          <>
            {/* Desktop: KYC Table */}
            <div className="hidden md:block flex-1 overflow-x-auto overflow-y-auto min-h-0">
              <table className="w-full min-w-[540px] text-sm">
                <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Nom</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Téléphone</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Document</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date soumission</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                    <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kycItems.map((item) => {
                    const sty = kycStatusStyle[item.status]
                    return (
                      <tr key={item.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs shrink-0">
                              {item.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                            </div>
                            <span className="font-medium text-[#111827] text-xs">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#6B7280] text-xs font-mono">{item.phone}</td>
                        <td className="py-3 px-3 text-[#6B7280] text-xs">{item.documentType}</td>
                        <td className="py-3 px-3 text-[#6B7280] text-xs">{item.submittedDate}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {item.status === 'En attente' && (
                              <>
                                <button
                                  onClick={() => handleKycApprove(item)}
                                  className="p-1.5 rounded-md hover:bg-emerald-50 transition-colors"
                                  title="Approuver"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                </button>
                                <button
                                  onClick={() => handleKycReject(item)}
                                  className="p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                                  title="Rejeter"
                                >
                                  <Ban className="w-4 h-4 text-rose-600" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => openKycPreview(item)}
                              className="p-1.5 rounded-md hover:bg-orange-50 transition-colors"
                              title="Voir document"
                            >
                              <Eye className="w-4 h-4 text-orange-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {kycItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-[#9CA3AF]">
                        Aucune demande KYC
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile: KYC Cards */}
            <div className="md:hidden flex-1 overflow-y-auto min-h-0 p-4">
              <div className="space-y-3">
                {kycItems.map((item) => {
                  const sty = kycStatusStyle[item.status]
                  return (
                    <div key={item.id} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm shrink-0">
                            {item.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5', sty.bg, sty.text)}>
                              <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.status === 'En attente' && (
                            <>
                              <button
                                onClick={() => handleKycApprove(item)}
                                className="p-1.5 rounded-md hover:bg-emerald-50 transition-colors"
                                title="Approuver"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              </button>
                              <button
                                onClick={() => handleKycReject(item)}
                                className="p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                                title="Rejeter"
                              >
                                <Ban className="w-4 h-4 text-rose-600" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openKycPreview(item)}
                            className="p-1.5 rounded-md hover:bg-orange-50 transition-colors"
                            title="Voir document"
                          >
                            <Eye className="w-4 h-4 text-orange-500" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-mono">{item.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                          <FileCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.documentType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.submittedDate}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {kycItems.length === 0 && (
                  <div className="py-12 text-center text-sm text-[#9CA3AF]">
                    Aucune demande KYC
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---- Suspend Confirmation AlertDialog ---- */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {chauffeurToSuspend?.statut === 'Suspendu' ? 'Réactiver le chauffeur' : 'Suspendre le chauffeur'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {chauffeurToSuspend?.statut === 'Suspendu' ? (
                <>
                  Êtes-vous sûr de vouloir réactiver le chauffeur <strong>{chauffeurToSuspend?.name}</strong> ? Il pourra à nouveau recevoir des courses.
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir suspendre le chauffeur <strong>{chauffeurToSuspend?.name}</strong> ? Il ne pourra plus recevoir de courses.
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
                chauffeurToSuspend?.statut === 'Suspendu'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              )}
            >
              {chauffeurToSuspend?.statut === 'Suspendu' ? 'Réactiver' : 'Suspendre'}
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
              Êtes-vous sûr de vouloir supprimer le chauffeur <strong>{chauffeurToDelete?.name}</strong> ? Cette action est irréversible et toutes ses données seront perdues.
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

      {/* ---- KYC Approve Confirmation AlertDialog ---- */}
      <AlertDialog open={validateDialogOpen} onOpenChange={setValidateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approuver la validation KYC</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir approuver le document de <strong>{kycToValidate?.name}</strong> ({kycToValidate?.documentType}) ? Le chauffeur sera notifié de l'approbation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setValidateDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmKycApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Approuver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---- KYC Reject Confirmation AlertDialog ---- */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter la validation KYC</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir rejeter le document de <strong>{kycToReject?.name}</strong> ({kycToReject?.documentType}) ? Le chauffeur devra soumettre un nouveau document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmKycReject} className="bg-rose-600 hover:bg-rose-700 text-white">
              Rejeter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---- KYC Document Preview Dialog ---- */}
      <Dialog open={kycPreviewOpen} onOpenChange={setKycPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-600" />
              Aperçu du document KYC
            </DialogTitle>
          </DialogHeader>

          {kycPreviewItem && (() => {
            const sty = kycStatusStyle[kycPreviewItem.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' }
            return (
              <div className="space-y-5">
                {/* Status badge header */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#111827]">{kycPreviewItem.documentType}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Document KYC soumis par le chauffeur</p>
                  </div>
                  <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', sty.bg, sty.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                    {kycPreviewItem.status}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: User,     label: 'Chauffeur',      value: kycPreviewItem.name },
                    { icon: Phone,    label: 'Téléphone',      value: kycPreviewItem.phone },
                    { icon: Hash,     label: 'Référence doc',  value: kycPreviewItem.id },
                    { icon: Calendar, label: 'Date soumission',value: kycPreviewItem.submittedDate },
                  ].map(({ icon: InfoIcon, label, value }) => (
                    <div key={label} className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <InfoIcon className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{label}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#111827]">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Mock document preview */}
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl bg-[#F9FAFB] flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-orange-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#111827]">{kycPreviewItem.documentType}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{kycPreviewItem.name}</p>
                  </div>
                  <button
                    onClick={() => setKycFullscreenOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Voir en plein écran
                  </button>
                </div>

                {/* Action buttons (only if En attente) */}
                {kycPreviewItem.status === 'En attente' && (
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => { setKycPreviewOpen(false); handleKycApprove(kycPreviewItem) }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approuver
                    </button>
                    <button
                      onClick={() => { setKycPreviewOpen(false); handleKycReject(kycPreviewItem) }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors"
                    >
                      <Ban className="w-4 h-4" /> Rejeter
                    </button>
                  </div>
                )}
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* ---- KYC Fullscreen Dialog ---- */}
      <Dialog open={kycFullscreenOpen} onOpenChange={setKycFullscreenOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-[#E5E7EB] shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              {kycPreviewItem?.documentType}
              <span className="text-sm font-normal text-[#9CA3AF] ml-1">— {kycPreviewItem?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center gap-6 bg-[#F9FAFB] min-h-[400px]">
            {/* Simulated document full view */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-[#E5E7EB] overflow-hidden">
              {/* Document header strip */}
              <div className="bg-orange-600 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">Document officiel</p>
                  <p className="text-white text-base font-black mt-0.5">{kycPreviewItem?.documentType}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
              {/* Placeholder content */}
              <div className="px-6 py-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Titulaire</p>
                    <p className="text-lg font-black text-[#111827]">{kycPreviewItem?.name}</p>
                    <p className="text-xs text-[#6B7280] font-mono mt-0.5">{kycPreviewItem?.id}</p>
                  </div>
                </div>
                <div className="h-px bg-[#F3F4F6]" />
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'N° Document', value: kycPreviewItem?.id ?? '—' },
                    { label: 'Date soumission', value: kycPreviewItem?.submittedDate ?? '—' },
                    { label: 'Statut', value: kycPreviewItem?.status ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#F9FAFB] rounded-xl p-3">
                      <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider font-semibold">{label}</p>
                      <p className="text-sm font-bold text-[#374151] mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                {/* Barcode simulation */}
                <div className="bg-[#F9FAFB] rounded-xl p-4 flex flex-col items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div key={i} className={`w-1 bg-[#374151] rounded-sm`} style={{ height: `${24 + (i % 5) * 6}px` }} />
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-[#9CA3AF] tracking-widest">{kycPreviewItem?.id}</p>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#F9FAFB] border-t border-[#F3F4F6] flex items-center justify-between">
                <p className="text-[10px] text-[#9CA3AF]">République du Mali · Document officiel</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-xs text-[#9CA3AF]">Aperçu simulé — les données réelles seront disponibles en production</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
