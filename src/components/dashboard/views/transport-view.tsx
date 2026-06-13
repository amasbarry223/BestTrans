'use client'

import { useState } from 'react'
import {
  Truck,
  Wrench,
  User,
  MapPin,
  Route,
  Search,
  Plus,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  Calendar,
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

type VehicleType = 'Tracteur' | 'Camion' | 'Remorque'
type VehicleStatus = 'Disponible' | 'En mission' | 'En maintenance'
type MissionStatus = 'Préparée' | 'En route' | 'Livrée' | 'Retour'

interface Vehicle {
  id: string
  immat: string
  type: VehicleType
  capacite: string
  status: VehicleStatus
  chauffeur: string
  visite: string
  assurance: string
}

interface Mission {
  id: string
  number: string
  dossier: string
  vehicle: string
  chauffeur: string
  corridor: string
  depart: string
  destination: string
  status: MissionStatus
  dateDepart: string
  eta: string
  frais: string
}

type DeleteItem = { type: 'vehicle'; data: Vehicle } | { type: 'mission'; data: Mission } | null
type EditItem = { type: 'vehicle'; data: Vehicle } | { type: 'mission'; data: Mission } | null
type ViewItem = { type: 'vehicle'; data: Vehicle } | { type: 'mission'; data: Mission } | null

const vehicleStatusStyle: Record<VehicleStatus, { bg: string; text: string }> = {
  'Disponible':   { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'En mission':   { bg: 'bg-amber-50',   text: 'text-amber-700' },
  'En maintenance': { bg: 'bg-rose-50',  text: 'text-rose-700' },
}

const missionStatusStyle: Record<MissionStatus, { bg: string; text: string; dot: string }> = {
  'Préparée': { bg: 'bg-sky-50',   text: 'text-sky-700',   dot: 'bg-sky-500' },
  'En route': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Livrée':   { bg: 'bg-emerald-50',text:'text-emerald-700',dot: 'bg-emerald-500' },
  'Retour':   { bg: 'bg-violet-50',text: 'text-violet-700', dot: 'bg-violet-500' },
}

const initialVehicles: Vehicle[] = [
  { id: '1', immat: 'ML-1234-AB', type: 'Tracteur' as VehicleType, capacite: '40T', status: 'En mission' as VehicleStatus, chauffeur: 'Amadou Coulibaly', visite: '15/06/2026', assurance: 'Valide' },
  { id: '2', immat: 'ML-5678-CD', type: 'Camion' as VehicleType, capacite: '25T', status: 'Disponible' as VehicleStatus, chauffeur: '—', visite: '22/08/2026', assurance: 'Valide' },
  { id: '3', immat: 'ML-9012-EF', type: 'Remorque' as VehicleType, capacite: '30T', status: 'En mission' as VehicleStatus, chauffeur: '—', visite: '03/04/2026', assurance: 'Valide' },
  { id: '4', immat: 'ML-3456-GH', type: 'Tracteur' as VehicleType, capacite: '40T', status: 'En maintenance' as VehicleStatus, chauffeur: '—', visite: 'Expirée', assurance: 'Renouveler' },
  { id: '5', immat: 'ML-7890-IJ', type: 'Camion' as VehicleType, capacite: '20T', status: 'Disponible' as VehicleStatus, chauffeur: '—', visite: '18/09/2026', assurance: 'Valide' },
  { id: '6', immat: 'ML-2345-KL', type: 'Remorque' as VehicleType, capacite: '35T', status: 'En mission' as VehicleStatus, chauffeur: '—', visite: '30/07/2026', assurance: 'Valide' },
]

const initialChauffeurs = [
  { id: '1', name: 'Amadou Coulibaly', permis: 'C+E', validite: '12/2026', perDiem: '15 000 FCFA/j', mission: 'TRS-2026-0142' },
  { id: '2', name: 'Ibrahim Traoré', permis: 'C', validite: '08/2026', perDiem: '12 000 FCFA/j', mission: '—' },
  { id: '3', name: 'Moussa Keita', permis: 'C+E', validite: '03/2027', perDiem: '15 000 FCFA/j', mission: 'TRS-2026-0139' },
  { id: '4', name: 'Oumar Sidibé', permis: 'C', validite: '06/2026', perDiem: '12 000 FCFA/j', mission: '—' },
]

const initialMissions: Mission[] = [
  { id: '1', number: 'MSN-2026-0045', dossier: 'TRS-2026-0142', vehicle: 'ML-1234-AB', chauffeur: 'Amadou Coulibaly', corridor: 'Dakar → Bamako', depart: 'Bamako', destination: 'Dakar', status: 'En route' as MissionStatus, dateDepart: '06/03/2026', eta: '10/03/2026', frais: '850 000 FCFA' },
  { id: '2', number: 'MSN-2026-0044', dossier: 'TRS-2026-0139', vehicle: 'ML-9012-EF', chauffeur: 'Moussa Keita', corridor: 'Lomé → Bamako', depart: 'Bamako', destination: 'Lomé', status: 'En route' as MissionStatus, dateDepart: '05/03/2026', eta: '11/03/2026', frais: '1 200 000 FCFA' },
  { id: '3', number: 'MSN-2026-0043', dossier: 'TRS-2026-0136', vehicle: 'ML-5678-CD', chauffeur: 'Ibrahim Traoré', corridor: 'Abidjan → Bamako', depart: 'Bamako', destination: 'Abidjan', status: 'Livrée' as MissionStatus, dateDepart: '01/03/2026', eta: '04/03/2026', frais: '950 000 FCFA' },
  { id: '4', number: 'MSN-2026-0042', dossier: 'TRS-2026-0135', vehicle: 'ML-2345-KL', chauffeur: 'Oumar Sidibé', corridor: 'Tema → Bamako', depart: 'Bamako', destination: 'Tema', status: 'Préparée' as MissionStatus, dateDepart: '09/03/2026', eta: '—', frais: '1 400 000 FCFA' },
]

const flotteStats = [
  { label: 'Véhicules actifs', value: '6', icon: Truck, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'En mission', value: '3', icon: Route, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'En maintenance', value: '1', icon: Wrench, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Chauffeurs', value: '4', icon: User, color: 'text-sky-600', bg: 'bg-sky-50' },
]

const missionStats = [
  { label: 'Missions en cours', value: '2', icon: Route, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Livrées ce mois', value: '8', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'En préparation', value: '1', icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50' },
]

export function TransportView() {
  const [activeTab, setActiveTab] = useState<'flotte' | 'missions'>('flotte')
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [missions, setMissions] = useState<Mission[]>(initialMissions)

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<DeleteItem>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<EditItem>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [itemToView, setItemToView] = useState<ViewItem>(null)

  // Edit form states
  const [editVehicleForm, setEditVehicleForm] = useState<Vehicle | null>(null)
  const [editMissionForm, setEditMissionForm] = useState<Mission | null>(null)

  // Handlers
  const handleView = (item: ViewItem) => {
    setItemToView(item)
    setViewDialogOpen(true)
  }

  const handleEdit = (item: EditItem) => {
    setItemToEdit(item)
    if (item.type === 'vehicle') {
      setEditVehicleForm({ ...item.data })
    } else {
      setEditMissionForm({ ...item.data })
    }
    setEditDialogOpen(true)
  }

  const handleDelete = (item: DeleteItem) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    if (itemToDelete.type === 'vehicle') {
      setVehicles((prev) => prev.filter((v) => v.id !== itemToDelete.data.id))
    } else {
      setMissions((prev) => prev.filter((m) => m.id !== itemToDelete.data.id))
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const confirmEdit = () => {
    if (!itemToEdit) return
    if (itemToEdit.type === 'vehicle' && editVehicleForm) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editVehicleForm.id ? editVehicleForm : v))
      )
    } else if (itemToEdit.type === 'mission' && editMissionForm) {
      setMissions((prev) =>
        prev.map((m) => (m.id === editMissionForm.id ? editMissionForm : m))
      )
    }
    setEditDialogOpen(false)
    setItemToEdit(null)
    setEditVehicleForm(null)
    setEditMissionForm(null)
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('flotte')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'flotte' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50'
          )}
        >
          <Truck className="w-4 h-4 inline mr-1.5" />Flotte
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'missions' ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50'
          )}
        >
          <Route className="w-4 h-4 inline mr-1.5" />Missions
        </button>
      </div>

      {activeTab === 'flotte' ? (
        <>
          {/* Flotte Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {flotteStats.map((s) => {
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

          {/* Vehicle List */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#111827]">Véhicules</h3>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
                <Plus className="w-4 h-4" /> Ajouter véhicule
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v) => {
                const sty = vehicleStatusStyle[v.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }
                return (
                  <div key={v.id} className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-teal-600" />
                        <span className="font-bold text-sm text-[#111827] font-mono">{v.immat}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', sty.bg, sty.text)}>{v.status}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleView({ type: 'vehicle', data: v })}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit({ type: 'vehicle', data: v })}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete({ type: 'vehicle', data: v })}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#6B7280]">
                      <div className="flex justify-between">
                        <span>Type</span><span className="font-medium text-[#111827]">{v.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacité</span><span className="font-medium text-[#111827]">{v.capacite}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chauffeur</span><span className="font-medium text-[#111827]">{v.chauffeur}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Visite tech.</span>
                        <span className={cn('font-medium', v.visite === 'Expirée' ? 'text-rose-600' : 'text-[#111827]')}>
                          {v.visite === 'Expirée' && <AlertTriangle className="w-3 h-3 inline mr-1" />}{v.visite}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assurance</span>
                        <span className={cn('font-medium', v.assurance === 'Renouveler' ? 'text-amber-600' : 'text-emerald-600')}>
                          {v.assurance}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chauffeurs */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Chauffeurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {initialChauffeurs.map((ch) => (
                <div key={ch.id} className="flex items-center gap-3 border border-[#E5E7EB] rounded-lg p-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
                    {ch.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827]">{ch.name}</p>
                    <p className="text-xs text-[#6B7280]">Permis {ch.permis} · Val. {ch.validite}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#111827]">{ch.perDiem}</p>
                    <p className={cn('text-[10px] font-semibold', ch.mission === '—' ? 'text-emerald-600' : 'text-amber-600')}>
                      {ch.mission === '—' ? 'Disponible' : ch.mission}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mission Stats */}
          <div className="grid grid-cols-3 gap-4">
            {missionStats.map((s) => {
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

          {/* Missions */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#111827]">Missions de transport</h3>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
                <Plus className="w-4 h-4" /> Nouvelle Mission
              </button>
            </div>
            <div className="space-y-3">
              {missions.map((m) => {
                const sty = missionStatusStyle[m.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
                return (
                  <div key={m.id} className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-teal-700">{m.number}</span>
                        <span className="text-xs text-[#6B7280]">Dossier: {m.dossier}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit', sty.bg, sty.text)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />
                          {m.status}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleView({ type: 'mission', data: m })}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit({ type: 'mission', data: m })}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete({ type: 'mission', data: m })}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-1.5">
                        <Route className="w-3.5 h-3.5" />
                        <span className="font-medium text-[#111827]">{m.corridor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{m.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{m.chauffeur}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{m.dateDepart} → {m.eta}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[#111827]">{m.frais}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'vehicle' ? (
                <>
                  Êtes-vous sûr de vouloir supprimer le véhicule{' '}
                  <span className="font-semibold text-[#111827]">{itemToDelete.data.immat}</span> ?
                  Cette action est irréversible.
                </>
              ) : itemToDelete?.type === 'mission' ? (
                <>
                  Êtes-vous sûr de vouloir supprimer la mission{' '}
                  <span className="font-semibold text-[#111827]">{itemToDelete.data.number}</span> ?
                  Cette action est irréversible.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteDialogOpen(false); setItemToDelete(null) }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {itemToEdit?.type === 'vehicle' ? 'Modifier le véhicule' : 'Modifier la mission'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Modifiez les informations ci-dessous puis enregistrez.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {itemToEdit?.type === 'vehicle' && editVehicleForm ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Immatriculation</label>
                  <input
                    type="text"
                    value={editVehicleForm.immat}
                    onChange={(e) => setEditVehicleForm({ ...editVehicleForm, immat: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Type</label>
                  <select
                    value={editVehicleForm.type}
                    onChange={(e) => setEditVehicleForm({ ...editVehicleForm, type: e.target.value as VehicleType })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    <option value="Tracteur">Tracteur</option>
                    <option value="Camion">Camion</option>
                    <option value="Remorque">Remorque</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Capacité</label>
                  <input
                    type="text"
                    value={editVehicleForm.capacite}
                    onChange={(e) => setEditVehicleForm({ ...editVehicleForm, capacite: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Statut</label>
                  <select
                    value={editVehicleForm.status}
                    onChange={(e) => setEditVehicleForm({ ...editVehicleForm, status: e.target.value as VehicleStatus })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En mission">En mission</option>
                    <option value="En maintenance">En maintenance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Chauffeur</label>
                  <input
                    type="text"
                    value={editVehicleForm.chauffeur}
                    onChange={(e) => setEditVehicleForm({ ...editVehicleForm, chauffeur: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Visite technique</label>
                  <input
                    type="text"
                    value={editVehicleForm.visite}
                    onChange={(e) => setEditVehicleForm({ ...editVehicleForm, visite: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Assurance</label>
                  <select
                    value={editVehicleForm.assurance}
                    onChange={(e) => setEditVehicleForm({ ...editVehicleForm, assurance: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    <option value="Valide">Valide</option>
                    <option value="Renouveler">Renouveler</option>
                  </select>
                </div>
              </div>
            ) : itemToEdit?.type === 'mission' && editMissionForm ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Numéro de mission</label>
                  <input
                    type="text"
                    value={editMissionForm.number}
                    onChange={(e) => setEditMissionForm({ ...editMissionForm, number: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Dossier</label>
                  <input
                    type="text"
                    value={editMissionForm.dossier}
                    onChange={(e) => setEditMissionForm({ ...editMissionForm, dossier: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Véhicule</label>
                  <input
                    type="text"
                    value={editMissionForm.vehicle}
                    onChange={(e) => setEditMissionForm({ ...editMissionForm, vehicle: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Chauffeur</label>
                  <input
                    type="text"
                    value={editMissionForm.chauffeur}
                    onChange={(e) => setEditMissionForm({ ...editMissionForm, chauffeur: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Corridor</label>
                  <input
                    type="text"
                    value={editMissionForm.corridor}
                    onChange={(e) => setEditMissionForm({ ...editMissionForm, corridor: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Statut</label>
                  <select
                    value={editMissionForm.status}
                    onChange={(e) => setEditMissionForm({ ...editMissionForm, status: e.target.value as MissionStatus })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    <option value="Préparée">Préparée</option>
                    <option value="En route">En route</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Retour">Retour</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#111827]">Date départ</label>
                    <input
                      type="text"
                      value={editMissionForm.dateDepart}
                      onChange={(e) => setEditMissionForm({ ...editMissionForm, dateDepart: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#111827]">ETA</label>
                    <input
                      type="text"
                      value={editMissionForm.eta}
                      onChange={(e) => setEditMissionForm({ ...editMissionForm, eta: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#111827]">Frais</label>
                  <input
                    type="text"
                    value={editMissionForm.frais}
                    onChange={(e) => setEditMissionForm({ ...editMissionForm, frais: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            ) : null}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setEditDialogOpen(false); setItemToEdit(null); setEditVehicleForm(null); setEditMissionForm(null) }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEdit}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Enregistrer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {itemToView?.type === 'vehicle' ? 'Détails du véhicule' : 'Détails de la mission'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Informations détaillées ci-dessous.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {itemToView?.type === 'vehicle' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#111827] font-mono">{itemToView.data.immat}</p>
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded',
                      (vehicleStatusStyle[itemToView.data.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }).bg,
                      (vehicleStatusStyle[itemToView.data.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700' }).text
                    )}>
                      {itemToView.data.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Type</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.type}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Capacité</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.capacite}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Chauffeur</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.chauffeur}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Visite tech.</p>
                    <p className={cn('font-medium', itemToView.data.visite === 'Expirée' ? 'text-rose-600' : 'text-[#111827]')}>
                      {itemToView.data.visite === 'Expirée' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {itemToView.data.visite}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-[#6B7280] mb-1">Assurance</p>
                    <p className={cn('font-medium', itemToView.data.assurance === 'Renouveler' ? 'text-amber-600' : 'text-emerald-600')}>
                      {itemToView.data.assurance}
                    </p>
                  </div>
                </div>
              </div>
            ) : itemToView?.type === 'mission' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Route className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#111827] font-mono">{itemToView.data.number}</p>
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                      (missionStatusStyle[itemToView.data.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }).bg,
                      (missionStatusStyle[itemToView.data.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }).text
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', (missionStatusStyle[itemToView.data.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }).dot)} />
                      {itemToView.data.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Dossier</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.dossier}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Corridor</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.corridor}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Véhicule</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.vehicle}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Chauffeur</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.chauffeur}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Départ</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.depart}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Destination</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.destination}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">Date départ</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.dateDepart}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-[#6B7280] mb-1">ETA</p>
                    <p className="font-medium text-[#111827]">{itemToView.data.eta}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-[#6B7280] mb-1">Frais</p>
                    <p className="font-semibold text-[#111827]">{itemToView.data.frais}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => { setViewDialogOpen(false); setItemToView(null) }}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
