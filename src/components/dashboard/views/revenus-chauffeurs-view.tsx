'use client'

import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Clock,
  Send,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  ArrowRightLeft,
  User,
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
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface Chauffeur {
  id: string
  nom: string
  courses: number
  revenus: string
  soldeDisponible: string
  dernierVersement: string
}

const kpiCards = [
  { label: 'Total revenus', value: '98,2M FCFA', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+11%', trendUp: true },
  { label: 'Solde en attente', value: '4,8M FCFA', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '', trendUp: true },
  { label: 'Versements ce mois', value: '12,3M FCFA', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+6%', trendUp: true },
]

const mockChauffeurs: Chauffeur[] = [
  { id: '1', nom: 'Amadou Diallo',       courses: 245, revenus: '14 820 000 FCFA', soldeDisponible: '385 000 FCFA',   dernierVersement: '04 Mar 2026' },
  { id: '2', nom: 'Ibrahim Keita',        courses: 198, revenus: '11 450 000 FCFA', soldeDisponible: '220 000 FCFA',   dernierVersement: '03 Mar 2026' },
  { id: '3', nom: 'Moussa Sissoko',       courses: 312, revenus: '18 720 000 FCFA', soldeDisponible: '890 000 FCFA',   dernierVersement: '05 Mar 2026' },
  { id: '4', nom: 'Oumar Sidibé',         courses: 167, revenus: '9 350 000 FCFA',  soldeDisponible: '145 000 FCFA',   dernierVersement: '02 Mar 2026' },
  { id: '5', nom: 'Seydou Diabaté',       courses: 289, revenus: '16 100 000 FCFA', soldeDisponible: '1 250 000 FCFA', dernierVersement: '05 Mar 2026' },
  { id: '6', nom: 'Cheick Traoré',        courses: 143, revenus: '7 860 000 FCFA',  soldeDisponible: '310 000 FCFA',   dernierVersement: '01 Mar 2026' },
  { id: '7', nom: 'Bakary Coulibaly',     courses: 221, revenus: '12 540 000 FCFA', soldeDisponible: '670 000 FCFA',   dernierVersement: '04 Mar 2026' },
  { id: '8', nom: 'Adama Maiga',          courses: 178, revenus: '9 360 000 FCFA',  soldeDisponible: '930 000 FCFA',   dernierVersement: '05 Mar 2026' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RevenusChauffeursView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [selectedChauffeur, setSelectedChauffeur] = useState<Chauffeur | null>(null)

  const filtered = mockChauffeurs.filter((c) => {
    return (
      searchTerm === '' ||
      c.nom.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleViewDetail = (c: Chauffeur) => {
    alert(`Détail chauffeur : ${c.nom} — Revenus: ${c.revenus}`)
  }

  const handleTransfer = (c: Chauffeur) => {
    setSelectedChauffeur(c)
    setTransferDialogOpen(true)
  }

  const confirmTransfer = () => {
    if (selectedChauffeur) {
      alert(`Virement de ${selectedChauffeur.soldeDisponible} déclenché pour ${selectedChauffeur.nom}`)
      setTransferDialogOpen(false)
      setSelectedChauffeur(null)
    }
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Revenus Chauffeurs</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Gestion des revenus et versements</p>
        </div>
      </div>

      {/* ---- KPI Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', kpi.bg)}>
                  <Icon className={cn('w-5 h-5', kpi.color)} />
                </div>
                {kpi.trend && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full text-blue-700 bg-blue-50">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{kpi.label}</p>
                <p className="text-xl font-bold text-[#111827] mt-0.5">{kpi.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Search & Actions ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Rechercher un chauffeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* ---- Chauffeurs Table ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0 flex-1">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Revenus par chauffeur</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {filtered.length}
            </span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block flex-1 overflow-y-auto min-h-0 max-h-[460px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Chauffeur</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Courses</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Revenus</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Solde disponible</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Dernier versement</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        {c.nom.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold text-[#111827] group-hover:text-blue-700 transition-colors">{c.nom}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-xs font-medium text-[#374151]">{c.courses}</td>
                  <td className="py-3 px-3 text-right font-bold text-xs text-[#111827] whitespace-nowrap">{c.revenus}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={cn(
                      'text-xs font-bold',
                      parseInt(c.soldeDisponible.replace(/[^0-9]/g, '')) > 500000 ? 'text-blue-600' : 'text-[#111827]'
                    )}>
                      {c.soldeDisponible}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-[#6B7280] whitespace-nowrap">{c.dernierVersement}</td>
                  <td className="py-3 px-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewDetail(c)} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-blue-700">Voir détail</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTransfer(c)} className="cursor-pointer">
                          <ArrowRightLeft className="w-4 h-4 mr-2 text-emerald-600" />
                          <span className="text-emerald-700">Déclencher virement</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex-1 overflow-y-auto min-h-0 max-h-[460px]">
          <div className="divide-y divide-[#F3F4F6]">
            {filtered.map((c) => (
              <div key={c.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <User className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#111827] truncate">{c.nom}</p>
                    <span className="text-sm font-bold text-[#111827] whitespace-nowrap ml-2">{c.revenus}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-[#9CA3AF]">{c.courses} courses · Solde: {c.soldeDisponible}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#9CA3AF]">Dernier virement: {c.dernierVersement}</span>
                    <button
                      onClick={() => handleTransfer(c)}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      <Send className="w-3 h-3" /> Virement
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <p className="text-xs text-[#9CA3AF]">{filtered.length} chauffeurs affichés</p>
        </div>
      </div>

      {/* ---- AlertDialog for manual transfer ---- */}
      <AlertDialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le virement</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de déclencher un virement de{' '}
              <strong className="text-blue-700">{selectedChauffeur?.soldeDisponible}</strong> au profit de{' '}
              <strong>{selectedChauffeur?.nom}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 my-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Chauffeur</p>
                <p className="font-semibold text-[#111827]">{selectedChauffeur?.nom}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Montant</p>
                <p className="font-bold text-blue-600">{selectedChauffeur?.soldeDisponible}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Courses totales</p>
                <p className="font-semibold text-[#111827]">{selectedChauffeur?.courses}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Revenus totaux</p>
                <p className="font-semibold text-[#111827]">{selectedChauffeur?.revenus}</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransferDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTransfer} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-4 h-4 mr-2" />
              Confirmer le virement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
