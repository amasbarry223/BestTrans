'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  Download,
  Building2,
  Phone,
  Mail,
  FileText,
  CreditCard,
  TrendingUp,
  Shield,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
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

type ClientType = 'Importateur' | 'Exportateur' | 'Transitaire'
type ClientStatus = 'Actif' | 'Inactif'

interface Client {
  id: string
  name: string
  nif: string
  rccm: string
  contact: string
  phone: string
  email: string
  type: ClientType
  encours: string
  plafond: string
  dossiers: number
  status: ClientStatus
}

const typeStyle: Record<ClientType, { bg: string; text: string }> = {
  'Importateur': { bg: 'bg-teal-50', text: 'text-teal-700' },
  'Exportateur': { bg: 'bg-sky-50',  text: 'text-sky-700' },
  'Transitaire': { bg: 'bg-amber-50',text: 'text-amber-700' },
}

const mockClients: Client[] = [
  { id: '1', name: 'SCOPEX Mali', nif: 'NIF-08-12-3456-A', rccm: 'RCCM-BKO-2018-4521', contact: 'Amadou Diallo', phone: '+223 70 12 34 56', email: 'contact@scopex.ml', type: 'Importateur', encours: '15 200 000 FCFA', plafond: '25 000 000 FCFA', dossiers: 34, status: 'Actif' },
  { id: '2', name: 'MALI TEXTILES SA', nif: 'NIF-06-08-1234-B', rccm: 'RCCM-BKO-2015-1234', contact: 'Fatoumata Traoré', phone: '+223 96 55 44 33', email: 'info@malitextiles.ml', type: 'Importateur', encours: '8 500 000 FCFA', plafond: '20 000 000 FCFA', dossiers: 22, status: 'Actif' },
  { id: '3', name: 'SOMADIA', nif: 'NIF-04-15-5678-C', rccm: 'RCCM-BKO-2012-5678', contact: 'Ibrahim Keita', phone: '+223 95 88 77 66', email: 'somadia@orange.ml', type: 'Exportateur', encours: '3 200 000 FCFA', plafond: '10 000 000 FCFA', dossiers: 8, status: 'Actif' },
  { id: '4', name: 'CMA CGM Mali', nif: 'NIF-09-22-9012-D', rccm: 'RCCM-BKO-2020-9012', contact: 'Jean-Pierre Martin', phone: '+223 97 33 22 11', email: 'jp.martin@cma-cgm.ml', type: 'Transitaire', encours: '22 000 000 FCFA', plafond: '50 000 000 FCFA', dossiers: 56, status: 'Actif' },
  { id: '5', name: 'PHARMACIE POPULAIRE', nif: 'NIF-07-30-3456-E', rccm: 'RCCM-BKO-2016-3456', contact: 'Dr. Aminata Coulibaly', phone: '+223 96 11 22 33', email: 'pharmacie.pop@orange.ml', type: 'Importateur', encours: '6 800 000 FCFA', plafond: '15 000 000 FCFA', dossiers: 15, status: 'Actif' },
  { id: '6', name: 'TOTAL MALI', nif: 'NIF-01-05-7890-F', rccm: 'RCCM-BKO-2005-7890', contact: 'Moussa Sissoko', phone: '+223 95 44 55 66', email: 'm.sissoko@total.ml', type: 'Importateur', encours: '12 400 000 FCFA', plafond: '30 000 000 FCFA', dossiers: 41, status: 'Actif' },
  { id: '7', name: 'BRAMALI SA', nif: 'NIF-03-18-2345-G', rccm: 'RCCM-BKO-2010-2345', contact: 'Seydou Diabaté', phone: '+223 70 99 88 77', email: 'bramali@malinet.ml', type: 'Importateur', encours: '4 100 000 FCFA', plafond: '12 000 000 FCFA', dossiers: 12, status: 'Actif' },
  { id: '8', name: 'MAERSK MALI', nif: 'NIF-10-25-6789-H', rccm: 'RCCM-BKO-2021-6789', contact: 'Lars Andersen', phone: '+223 97 66 55 44', email: 'l.andersen@maersk.ml', type: 'Transitaire', encours: '18 000 000 FCFA', plafond: '40 000 000 FCFA', dossiers: 48, status: 'Actif' },
]

const miniStats = [
  { label: 'Clients actifs', value: '24', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Encours total', value: '90,2 M FCFA', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Crédit moyen', value: '3,76 M FCFA', icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50' },
  { label: 'Dossiers/client', value: '29,5', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50' },
]

export function ClientsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>(mockClients)

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    nif: '',
    rccm: '',
    contact: '',
    phone: '',
    email: '',
    type: '' as ClientType | '',
    plafond: '',
  })

  const filtered = clients.filter((c) => {
    const matchSearch = searchTerm === '' ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    const matchType = filterType === 'all' || c.type === filterType
    return matchSearch && matchType
  })

  const handleViewClient = (client: Client) => {
    // Navigate to client detail view (placeholder)
    alert(`Voir le client : ${client.name}`)
  }

  const handleEditClient = (client: Client) => {
    setClientToEdit(client)
    setEditForm({
      name: client.name,
      nif: client.nif,
      rccm: client.rccm,
      contact: client.contact,
      phone: client.phone,
      email: client.email,
      type: client.type,
      plafond: client.plafond,
    })
    setEditDialogOpen(true)
  }

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id))
      setClientToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSaveEdit = () => {
    if (clientToEdit) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientToEdit.id
            ? {
                ...c,
                name: editForm.name,
                nif: editForm.nif,
                rccm: editForm.rccm,
                contact: editForm.contact,
                phone: editForm.phone,
                email: editForm.email,
                type: editForm.type as ClientType,
                plafond: editForm.plafond,
              }
            : c
        )
      )
      setClientToEdit(null)
      setEditDialogOpen(false)
    }
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {miniStats.map((s) => {
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

      {/* Search & Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par nom, NIF, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tous types</option>
              <option value="Importateur">Importateur</option>
              <option value="Exportateur">Exportateur</option>
              <option value="Transitaire">Transitaire</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <Plus className="w-4 h-4" /> Nouveau Client
            </button>
          </div>
        </div>
      </div>

      {/* Client Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const tsty = typeStyle[c.type] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }
            const encoursNum = parseInt(c.encours.replace(/[^0-9]/g, '')) || 0
            const plafondNum = parseInt(c.plafond.replace(/[^0-9]/g, '')) || 1
            const ratio = Math.round((encoursNum / plafondNum) * 100)
            return (
              <div key={c.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                      {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{c.name}</p>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', tsty.bg, tsty.text)}>{c.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', c.status === 'Actif' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500')}>
                      {c.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => handleViewClient(c)} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2 text-teal-600" />
                          <span className="text-teal-700">Voir</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClient(c)} className="cursor-pointer">
                          <Pencil className="w-4 h-4 mr-2 text-amber-600" />
                          <span className="text-amber-700">Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClient(c)} className="cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2 text-rose-600" />
                          <span className="text-rose-700">Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{c.nif} · {c.rccm}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6B7280]">Encours / Plafond</span>
                    <span className={cn('font-semibold', ratio > 80 ? 'text-rose-600' : ratio > 50 ? 'text-amber-600' : 'text-teal-600')}>
                      {ratio}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', ratio > 80 ? 'bg-rose-500' : ratio > 50 ? 'bg-amber-500' : 'bg-teal-500')}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-[#9CA3AF]">{c.encours}</span>
                    <span className="text-[10px] text-[#9CA3AF]">{c.plafond}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-[#6B7280]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{c.dossiers} dossiers</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le client <strong>{clientToDelete?.name}</strong> ? Cette action est irréversible.
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

      {/* Edit Client Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier le client</AlertDialogTitle>
            <AlertDialogDescription>
              Modifiez les informations du client <strong>{clientToEdit?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#374151]">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#374151]">NIF</label>
                <input
                  type="text"
                  value={editForm.nif}
                  onChange={(e) => setEditForm({ ...editForm, nif: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#374151]">RCCM</label>
                <input
                  type="text"
                  value={editForm.rccm}
                  onChange={(e) => setEditForm({ ...editForm, rccm: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#374151]">Contact</label>
              <input
                type="text"
                value={editForm.contact}
                onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#374151]">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#374151]">Email</label>
                <input
                  type="text"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#374151]">Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as ClientType })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Importateur">Importateur</option>
                  <option value="Exportateur">Exportateur</option>
                  <option value="Transitaire">Transitaire</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#374151]">Plafond</label>
                <input
                  type="text"
                  value={editForm.plafond}
                  onChange={(e) => setEditForm({ ...editForm, plafond: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEdit} className="bg-teal-600 hover:bg-teal-700 text-white">
              Enregistrer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
