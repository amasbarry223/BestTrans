'use client'

import { useState } from 'react'
import {
  Receipt,
  CreditCard,
  Building2,
  DollarSign,
  Search,
  Plus,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Phone,
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

type InvoiceType = 'Honoraire' | 'Débour' | 'Magasinage' | 'Transport'
type InvoiceStatus = 'Payée' | 'En attente' | 'En retard'
type PaymentMode = 'Virement' | 'Chèque' | 'Espèces' | 'Orange Money' | 'Wave'

const invoiceStatusStyle: Record<InvoiceStatus, { bg: string; text: string; dot: string }> = {
  'Payée':     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'En attente':{ bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'En retard': { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500' },
}

const mockInvoices = [
  { id: '1', number: 'FAC-2026-0089', client: 'SCOPEX Mali', dossier: 'TRS-2026-0142', type: 'Honoraire' as InvoiceType, montant: '2 500 000 FCFA', status: 'En attente' as InvoiceStatus, dateEmission: '08/03/2026', echeance: '22/03/2026' },
  { id: '2', number: 'FAC-2026-0088', client: 'SCOPEX Mali', dossier: 'TRS-2026-0142', type: 'Débour' as InvoiceType, montant: '8 400 000 FCFA', status: 'En attente' as InvoiceStatus, dateEmission: '08/03/2026', echeance: '15/03/2026' },
  { id: '3', number: 'FAC-2026-0087', client: 'MALI TEXTILES SA', dossier: 'TRS-2026-0141', type: 'Honoraire' as InvoiceType, montant: '1 800 000 FCFA', status: 'Payée' as InvoiceStatus, dateEmission: '07/03/2026', echeance: '21/03/2026' },
  { id: '4', number: 'FAC-2026-0086', client: 'CMA CGM Mali', dossier: 'TRS-2026-0139', type: 'Transport' as InvoiceType, montant: '3 200 000 FCFA', status: 'En retard' as InvoiceStatus, dateEmission: '01/03/2026', echeance: '08/03/2026' },
  { id: '5', number: 'FAC-2026-0085', client: 'PHARMACIE POPULAIRE', dossier: 'TRS-2026-0138', type: 'Magasinage' as InvoiceType, montant: '450 000 FCFA', status: 'Payée' as InvoiceStatus, dateEmission: '06/03/2026', echeance: '20/03/2026' },
  { id: '6', number: 'FAC-2026-0084', client: 'TOTAL MALI', dossier: 'TRS-2026-0137', type: 'Honoraire' as InvoiceType, montant: '4 100 000 FCFA', status: 'Payée' as InvoiceStatus, dateEmission: '05/03/2026', echeance: '19/03/2026' },
  { id: '7', number: 'FAC-2026-0083', client: 'BRAMALI SA', dossier: 'TRS-2026-0136', type: 'Débour' as InvoiceType, montant: '4 500 000 FCFA', status: 'En retard' as InvoiceStatus, dateEmission: '25/02/2026', echeance: '04/03/2026' },
]

const mockPayments = [
  { id: '1', ref: 'REG-2026-0056', client: 'MALI TEXTILES SA', mode: 'Virement' as PaymentMode, montant: '1 800 000 FCFA', factures: 'FAC-2026-0087', date: '07/03/2026' },
  { id: '2', ref: 'REG-2026-0055', client: 'PHARMACIE POPULAIRE', mode: 'Orange Money' as PaymentMode, montant: '450 000 FCFA', factures: 'FAC-2026-0085', date: '06/03/2026' },
  { id: '3', ref: 'REG-2026-0054', client: 'TOTAL MALI', mode: 'Chèque' as PaymentMode, montant: '4 100 000 FCFA', factures: 'FAC-2026-0084', date: '05/03/2026' },
  { id: '4', ref: 'REG-2026-0053', client: 'SOMADIA', mode: 'Wave' as PaymentMode, montant: '950 000 FCFA', factures: 'FAC-2026-0080', date: '04/03/2026' },
  { id: '5', ref: 'REG-2026-0052', client: 'SCOPEX Mali', mode: 'Virement' as PaymentMode, montant: '6 200 000 FCFA', factures: 'FAC-2026-0078, 079', date: '03/03/2026' },
]

const factStats = [
  { label: 'Factures émises', value: '89', icon: Receipt, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Montant total', value: '142,5 M FCFA', icon: DollarSign, color: 'text-sky-600', bg: 'bg-sky-50' },
  { label: 'Honoraires', value: '68,3 M FCFA', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Débours', value: '74,2 M FCFA', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const reglStats = [
  { label: 'Encaissements', value: '13,5 M FCFA', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Solde à recouvrer', value: '28,7 M FCFA', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'DSO moyen', value: '32 jours', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
]

type DeleteItemType = { id: string; number: string; type: 'invoice' | 'payment' }
type EditItemType = { id: string; number: string; type: 'invoice' | 'payment'; client: string; montant: string }

export function FacturationView() {
  const [activeTab, setActiveTab] = useState<'facturation' | 'reglements' | 'comptabilite'>('facturation')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<DeleteItemType | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<EditItemType | null>(null)
  const [editForm, setEditForm] = useState({ client: '', montant: '' })

  const handleDelete = (item: DeleteItemType) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleEdit = (item: EditItemType) => {
    setItemToEdit(item)
    setEditForm({ client: item.client, montant: item.montant })
    setEditDialogOpen(true)
  }

  const handleView = (item: { id: string; number: string; type: 'invoice' | 'payment' }) => {
    // Navigate or show details - placeholder
    console.log('View', item)
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit">
        {(['facturation', 'reglements', 'comptabilite'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              activeTab === tab ? 'bg-teal-600 text-white' : 'text-[#6B7280] hover:bg-gray-50'
            )}
          >
            {tab === 'facturation' && <Receipt className="w-4 h-4 inline mr-1.5" />}
            {tab === 'reglements' && <CreditCard className="w-4 h-4 inline mr-1.5" />}
            {tab === 'comptabilite' && <Building2 className="w-4 h-4 inline mr-1.5" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'facturation' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {factStats.map((s) => {
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

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input type="text" placeholder="Rechercher facture..." className="pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" /> Export
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
                  <Plus className="w-4 h-4" /> Nouvelle facture
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-420px)]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="py-2.5 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">N° Facture</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Client</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Dossier</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Type</th>
                    <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase">Montant</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Statut</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Émission</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Échéance</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((inv) => {
                    const sty = invoiceStatusStyle[inv.status] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
                    return (
                      <tr key={inv.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-teal-700">{inv.number}</td>
                        <td className="py-3 px-3 text-xs font-medium text-[#374151] truncate max-w-[120px]">{inv.client}</td>
                        <td className="py-3 px-3 text-xs font-mono text-[#6B7280]">{inv.dossier}</td>
                        <td className="py-3 px-3"><span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded',
                          inv.type === 'Honoraire' ? 'bg-teal-50 text-teal-700' :
                          inv.type === 'Débour' ? 'bg-amber-50 text-amber-700' :
                          inv.type === 'Magasinage' ? 'bg-violet-50 text-violet-700' :
                          'bg-sky-50 text-sky-700'
                        )}>{inv.type}</span></td>
                        <td className="py-3 px-3 text-right text-xs font-bold text-[#111827] whitespace-nowrap">{inv.montant}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold', sty.bg, sty.text)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', sty.dot)} />{inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-[#6B7280]">{inv.dateEmission}</td>
                        <td className="py-3 px-3 text-xs text-[#6B7280]">{inv.echeance}</td>
                        <td className="py-3 px-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 transition-colors">
                                <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => handleView({ id: inv.id, number: inv.number, type: 'invoice' })}>
                                <Eye className="w-4 h-4 mr-2" /> Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit({ id: inv.id, number: inv.number, type: 'invoice', client: inv.client, montant: inv.montant })}>
                                <Pencil className="w-4 h-4 mr-2" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" onClick={() => handleDelete({ id: inv.id, number: inv.number, type: 'invoice' })}>
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
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
          </div>
        </>
      )}

      {activeTab === 'reglements' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {reglStats.map((s) => {
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

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Derniers règlements</h3>
            <div className="overflow-y-auto max-h-[calc(100vh-440px)]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#F9FAFB]">
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="py-2.5 px-4 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Réf</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Client</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Mode</th>
                    <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase">Montant</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Factures</th>
                    <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Date</th>
                    <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((p) => (
                    <tr key={p.id} className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] cursor-pointer">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-teal-700">{p.ref}</td>
                      <td className="py-3 px-3 text-xs font-medium text-[#374151]">{p.client}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-50 text-[#374151]">
                          {(p.mode === 'Orange Money' || p.mode === 'Wave') && <Phone className="w-3 h-3" />}
                          {p.mode}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-xs font-bold text-emerald-600">{p.montant}</td>
                      <td className="py-3 px-3 text-xs font-mono text-[#6B7280]">{p.factures}</td>
                      <td className="py-3 px-3 text-xs text-[#6B7280]">{p.date}</td>
                      <td className="py-3 px-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => handleView({ id: p.id, number: p.ref, type: 'payment' })}>
                              <Eye className="w-4 h-4 mr-2" /> Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit({ id: p.id, number: p.ref, type: 'payment', client: p.client, montant: p.montant })}>
                              <Pencil className="w-4 h-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => handleDelete({ id: p.id, number: p.ref, type: 'payment' })}>
                              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'comptabilite' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" /> États comptables
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Journal général', desc: 'Ensemble des écritures comptables' },
                { label: 'Grand livre', desc: 'Détail des comptes' },
                { label: 'Balance', desc: 'Solde des comptes' },
                { label: 'Rapprochement bancaire', desc: 'Banque vs comptabilité' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                    <p className="text-xs text-[#6B7280]">{item.desc}</p>
                  </div>
                  <button className="text-xs font-medium text-teal-600 hover:text-teal-700">Consulter</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Synthèse financière</h3>
            <dl className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                <dt className="text-sm text-[#6B7280]">Total produits (Honoraires)</dt>
                <dd className="text-sm font-bold text-emerald-600">68,3 M FCFA</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                <dt className="text-sm text-[#6B7280]">Total charges</dt>
                <dd className="text-sm font-bold text-rose-600">42,1 M FCFA</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                <dt className="text-sm text-[#6B7280]">Résultat net</dt>
                <dd className="text-sm font-bold text-teal-600">26,2 M FCFA</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                <dt className="text-sm text-[#6B7280]">TVA collectée</dt>
                <dd className="text-sm font-bold text-[#111827]">7,5 M FCFA</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm text-[#6B7280]">TVA déductible</dt>
                <dd className="text-sm font-bold text-[#111827]">3,2 M FCFA</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {itemToDelete?.type === 'invoice' ? 'la facture' : 'le règlement'}{' '}
              <span className="font-semibold text-[#111827]">{itemToDelete?.number}</span> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                // Delete logic placeholder
                setDeleteDialogOpen(false)
                setItemToDelete(null)
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Modifier {itemToEdit?.type === 'invoice' ? 'la facture' : 'le règlement'} {itemToEdit?.number}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Modifiez les informations ci-dessous et enregistrez vos changements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">Client</label>
              <input
                type="text"
                value={editForm.client}
                onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">Montant</label>
              <input
                type="text"
                value={editForm.montant}
                onChange={(e) => setEditForm({ ...editForm, montant: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setEditDialogOpen(false); setItemToEdit(null) }}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                // Save edit logic placeholder
                setEditDialogOpen(false)
                setItemToEdit(null)
              }}
            >
              Enregistrer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
