'use client'

import { useState } from 'react'
import {
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle2,
  Timer,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  ArrowUpRight,
  XCircle,
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
/*  Types & Styles                                                     */
/* ------------------------------------------------------------------ */

type TicketType = 'Réclamation' | 'Technique' | 'Remboursement' | 'Autre'
type TicketPriority = 'Haute' | 'Moyenne' | 'Basse'
type TicketStatus = 'Ouvert' | 'En cours' | 'Résolu'

const priorityStyle: Record<TicketPriority, { bg: string; text: string; dot: string }> = {
  'Haute':  { bg: 'bg-rose-50',   text: 'text-rose-700',   dot: 'bg-rose-500' },
  'Moyenne': { bg: 'bg-amber-50', text: 'text-amber-700',  dot: 'bg-amber-500' },
  'Basse':  { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
}

const statusStyle: Record<TicketStatus, { bg: string; text: string; dot: string }> = {
  'Ouvert':    { bg: 'bg-rose-50',   text: 'text-rose-700',   dot: 'bg-rose-500' },
  'En cours':  { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Résolu':    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

const typeStyle: Record<TicketType, { bg: string; text: string }> = {
  'Réclamation':  { bg: 'bg-rose-50',    text: 'text-rose-700' },
  'Technique':    { bg: 'bg-blue-50',    text: 'text-blue-700' },
  'Remboursement': { bg: 'bg-amber-50',  text: 'text-amber-700' },
  'Autre':        { bg: 'bg-gray-100',   text: 'text-gray-700' },
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const kpiCards = [
  { label: 'Tickets ouverts', value: '23', icon: Ticket, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'En cours', value: '15', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Résolus aujourd\'hui', value: '8', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Temps moyen', value: '2,4h', icon: Timer, color: 'text-blue-600', bg: 'bg-blue-50' },
]

interface SupportTicket {
  id: string
  numero: string
  personne: string
  personneRole: 'Passager' | 'Chauffeur'
  type: TicketType
  priorite: TicketPriority
  statut: TicketStatus
  assigneA: string
  date: string
}

const mockTickets: SupportTicket[] = [
  { id: '1', numero: 'TKT-2026-0234', personne: 'Amadou Diallo',       personneRole: 'Passager',  type: 'Réclamation',   priorite: 'Haute',  statut: 'Ouvert',    assigneA: 'Support A', date: '05 Mar 2026 14:20' },
  { id: '2', numero: 'TKT-2026-0233', personne: 'Ibrahim Keita',       personneRole: 'Chauffeur', type: 'Technique',      priorite: 'Moyenne', statut: 'En cours',  assigneA: 'Tech B',    date: '05 Mar 2026 13:45' },
  { id: '3', numero: 'TKT-2026-0232', personne: 'Fatoumata Traoré',    personneRole: 'Passager',  type: 'Remboursement',  priorite: 'Haute',  statut: 'Ouvert',    assigneA: 'Finance C',  date: '05 Mar 2026 12:30' },
  { id: '4', numero: 'TKT-2026-0231', personne: 'Moussa Sissoko',      personneRole: 'Chauffeur', type: 'Réclamation',    priorite: 'Basse',  statut: 'Résolu',    assigneA: 'Support A', date: '05 Mar 2026 11:15' },
  { id: '5', numero: 'TKT-2026-0230', personne: 'Aminata Coulibaly',   personneRole: 'Passager',  type: 'Technique',      priorite: 'Moyenne', statut: 'En cours',  assigneA: 'Tech B',    date: '05 Mar 2026 10:40' },
  { id: '6', numero: 'TKT-2026-0229', personne: 'Seydou Diabaté',      personneRole: 'Chauffeur', type: 'Autre',          priorite: 'Basse',  statut: 'En cours',  assigneA: 'Support D', date: '04 Mar 2026 18:55' },
  { id: '7', numero: 'TKT-2026-0228', personne: 'Kadiatou Bah',        personneRole: 'Passager',  type: 'Remboursement',  priorite: 'Haute',  statut: 'Ouvert',    assigneA: 'Finance C',  date: '04 Mar 2026 16:20' },
  { id: '8', numero: 'TKT-2026-0227', personne: 'Oumar Sidibé',        personneRole: 'Chauffeur', type: 'Réclamation',    priorite: 'Moyenne', statut: 'Résolu',    assigneA: 'Support A', date: '04 Mar 2026 14:05' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TicketsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  // Dialog states
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const filtered = mockTickets.filter((t) => {
    const matchSearch =
      searchTerm === '' ||
      t.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.personne.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assigneA.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || t.statut === filterStatus
    const matchPriority = filterPriority === 'all' || t.priorite === filterPriority
    const matchType = filterType === 'all' || t.type === filterType
    return matchSearch && matchStatus && matchPriority && matchType
  })

  const handleView = (ticket: SupportTicket) => {
    alert(`Détail ticket : ${ticket.numero} — ${ticket.personne}`)
  }

  const handleEscalate = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setEscalateDialogOpen(true)
  }

  const handleClose = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setCloseDialogOpen(true)
  }

  const confirmEscalate = () => {
    if (selectedTicket) {
      alert(`Ticket ${selectedTicket.numero} escaladé avec succès`)
      setEscalateDialogOpen(false)
      setSelectedTicket(null)
    }
  }

  const confirmClose = () => {
    if (selectedTicket) {
      alert(`Ticket ${selectedTicket.numero} clôturé avec succès`)
      setCloseDialogOpen(false)
      setSelectedTicket(null)
    }
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Tickets Support</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Gestion des réclamations et incidents</p>
        </div>
      </div>

      {/* ---- KPI Cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{kpi.label}</p>
                <p className="text-xl font-bold text-[#111827] mt-0.5">{kpi.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- Search & Filters ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par N°, personne, assigné..."
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
              <option value="Ouvert">Ouvert</option>
              <option value="En cours">En cours</option>
              <option value="Résolu">Résolu</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes priorités</option>
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous types</option>
              <option value="Réclamation">Réclamation</option>
              <option value="Technique">Technique</option>
              <option value="Remboursement">Remboursement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* ---- Tickets Table ---- */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0 flex-1">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-[#111827]">Liste des tickets</h2>
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
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">N° Ticket</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Passager / Chauffeur</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Type</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Priorité</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Assigné à</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const tSty = typeStyle[t.type]
                const pSty = priorityStyle[t.priorite]
                const sSty = statusStyle[t.statut]
                return (
                  <tr
                    key={t.id}
                    className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="py-3 px-5">
                      <span className="font-mono text-xs font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">
                        {t.numero}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                          t.personneRole === 'Passager' ? 'bg-blue-100' : 'bg-sky-100'
                        )}>
                          <User className={cn(
                            'w-3 h-3',
                            t.personneRole === 'Passager' ? 'text-blue-600' : 'text-sky-600'
                          )} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#111827] truncate max-w-[120px]">{t.personne}</p>
                          <p className="text-[10px] text-[#9CA3AF]">{t.personneRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold', tSty.bg, tSty.text)}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', pSty.bg, pSty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', pSty.dot)} />
                        {t.priorite}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sSty.bg, sSty.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sSty.dot)} />
                        {t.statut}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-[#374151] font-medium">{t.assigneA}</td>
                    <td className="py-3 px-3 text-[#6B7280] text-xs whitespace-nowrap">{t.date}</td>
                    <td className="py-3 px-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => handleView(t)} className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-blue-700">Voir</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEscalate(t)} className="cursor-pointer">
                            <ArrowUpRight className="w-4 h-4 mr-2 text-amber-600" />
                            <span className="text-amber-700">Escalader</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleClose(t)} className="cursor-pointer">
                            <XCircle className="w-4 h-4 mr-2 text-rose-600" />
                            <span className="text-rose-700">Clôturer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex-1 overflow-y-auto min-h-0 max-h-[460px]">
          <div className="divide-y divide-[#F3F4F6]">
            {filtered.map((t) => {
              const pSty = priorityStyle[t.priorite]
              const sSty = statusStyle[t.statut]
              const tSty = typeStyle[t.type]
              return (
                <div key={t.id} className="px-4 py-3 flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', sSty.bg)}>
                    <AlertCircle className={cn('w-4.5 h-4.5', sSty.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#111827] font-mono truncate">{t.numero}</p>
                      <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ml-2', pSty.bg, pSty.text)}>
                        <span className={cn('w-1 h-1 rounded-full', pSty.dot)} />
                        {t.priorite}
                      </span>
                    </div>
                    <p className="text-xs text-[#374151] font-medium truncate mt-0.5">{t.personne} <span className="text-[#9CA3AF]">({t.personneRole})</span></p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold', tSty.bg, tSty.text)}>{t.type}</span>
                      <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold', sSty.bg, sSty.text)}>
                        <span className={cn('w-1 h-1 rounded-full', sSty.dot)} />
                        {t.statut}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-[#9CA3AF]">{t.assigneA} · {t.date}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <p className="text-xs text-[#9CA3AF]">{filtered.length} tickets affichés</p>
        </div>
      </div>

      {/* ---- AlertDialog for Escalate ---- */}
      <AlertDialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Escalader le ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point d&apos;escalader le ticket{' '}
              <strong className="text-blue-700">{selectedTicket?.numero}</strong>.
              Cette action augmentera sa priorité et notifiera l&apos;équipe de supervision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 my-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Personne</p>
                <p className="font-semibold text-[#111827]">{selectedTicket?.personne}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Type</p>
                <p className="font-semibold text-[#111827]">{selectedTicket?.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Priorité actuelle</p>
                <p className="font-semibold text-amber-600">{selectedTicket?.priorite}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Assigné à</p>
                <p className="font-semibold text-[#111827]">{selectedTicket?.assigneA}</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEscalateDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEscalate} className="bg-amber-600 hover:bg-amber-700 text-white">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Confirmer l&apos;escalade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---- AlertDialog for Close ---- */}
      <AlertDialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clôturer le ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de clôturer le ticket{' '}
              <strong className="text-blue-700">{selectedTicket?.numero}</strong>.
              Cette action est irréversible. Le ticket sera marqué comme résolu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 my-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Personne</p>
                <p className="font-semibold text-[#111827]">{selectedTicket?.personne}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Type</p>
                <p className="font-semibold text-[#111827]">{selectedTicket?.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Priorité</p>
                <p className="font-semibold text-[#111827]">{selectedTicket?.priorite}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Assigné à</p>
                <p className="font-semibold text-[#111827]">{selectedTicket?.assigneA}</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCloseDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="bg-rose-600 hover:bg-rose-700 text-white">
              <XCircle className="w-4 h-4 mr-2" />
              Clôturer le ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
