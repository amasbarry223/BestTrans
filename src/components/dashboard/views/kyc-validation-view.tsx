'use client'

import React, { useState } from 'react'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type KycDocument = {
  id: string
  driverName: string
  documentType: string
  submittedDate: string
  driverId: string
}

type DialogState = {
  open: boolean
  mode: 'validate' | 'reject'
  document: KycDocument | null
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const pendingDocuments: KycDocument[] = [
  {
    id: 'KYC-001',
    driverName: 'Amadou Keïta',
    documentType: 'Permis de conduire',
    submittedDate: '2025-03-04',
    driverId: 'CH-1042',
  },
  {
    id: 'KYC-002',
    driverName: 'Fatoumata Diallo',
    documentType: 'Carte grise',
    submittedDate: '2025-03-04',
    driverId: 'CH-1087',
  },
  {
    id: 'KYC-003',
    driverName: 'Ibrahim Traoré',
    documentType: 'Assurance',
    submittedDate: '2025-03-03',
    driverId: 'CH-1123',
  },
  {
    id: 'KYC-004',
    driverName: 'Mariam Coulibaly',
    documentType: "Pièce d'identité",
    submittedDate: '2025-03-03',
    driverId: 'CH-0956',
  },
  {
    id: 'KYC-005',
    driverName: 'Oumar Sidibé',
    documentType: 'Permis de conduire',
    submittedDate: '2025-03-02',
    driverId: 'CH-0734',
  },
  {
    id: 'KYC-006',
    driverName: 'Aminata Sissoko',
    documentType: 'Carte grise',
    submittedDate: '2025-03-02',
    driverId: 'CH-0891',
  },
]

const docTypeIcon: Record<string, React.ElementType> = {
  'Permis de conduire': FileText,
  'Carte grise': FileText,
  'Assurance': ShieldCheck,
  "Pièce d'identité": FileText,
}

const docTypeColor: Record<string, { bg: string; text: string }> = {
  'Permis de conduire': { bg: 'bg-orange-100', text: 'text-orange-600' },
  'Carte grise': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Assurance': { bg: 'bg-orange-100', text: 'text-orange-600' },
  "Pièce d'identité": { bg: 'bg-orange-50', text: 'text-orange-700' },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function KycValidationView() {
  const [search, setSearch] = useState('')
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    mode: 'validate',
    document: null,
  })
  const [rejectReason, setRejectReason] = useState('')

  const filteredDocs = pendingDocuments.filter(
    (doc) =>
      doc.driverName.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(search.toLowerCase())
  )

  const openValidateDialog = (doc: KycDocument) => {
    setDialogState({ open: true, mode: 'validate', document: doc })
    setRejectReason('')
  }

  const openRejectDialog = (doc: KycDocument) => {
    setDialogState({ open: true, mode: 'reject', document: doc })
    setRejectReason('')
  }

  const handleConfirm = () => {
    if (dialogState.mode === 'validate') {
      toast.success('Document validé', {
        description: `${dialogState.document?.documentType} de ${dialogState.document?.driverName} a été validé.`,
      })
    } else {
      toast.error('Document rejeté', {
        description: `${dialogState.document?.documentType} de ${dialogState.document?.driverName} a été rejeté.`,
      })
    }
    setDialogState({ open: false, mode: 'validate', document: null })
    setRejectReason('')
  }

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Validation KYC</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Vérification des documents chauffeurs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm w-full sm:w-[240px]"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtrer</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">En attente</p>
            <p className="text-2xl font-bold text-orange-700">18</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Validés aujourd&apos;hui</p>
            <p className="text-2xl font-bold text-green-600">5</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Rejetés</p>
            <p className="text-2xl font-bold text-red-600">2</p>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-semibold text-[#111827]">
              Documents en attente
            </h2>
            <Badge
              variant="secondary"
              className="bg-orange-50 text-orange-700 text-xs"
            >
              {filteredDocs.length}
            </Badge>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-y-auto max-h-[480px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Chauffeur
                </th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Type de document
                </th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Date de soumission
                </th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Aperçu
                </th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => {
                const Icon = docTypeIcon[doc.documentType] || FileText
                const colors = docTypeColor[doc.documentType] || {
                  bg: 'bg-orange-50',
                  text: 'text-orange-600',
                }
                return (
                  <tr
                    key={doc.id}
                    className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-xs shrink-0">
                          {doc.driverName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#111827] group-hover:text-orange-700 transition-colors">
                            {doc.driverName}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF]">
                            {doc.driverId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center',
                            colors.bg
                          )}
                        >
                          <Icon className={cn('w-3.5 h-3.5', colors.text)} />
                        </div>
                        <span className="text-sm text-[#111827]">
                          {doc.documentType}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#6B7280]">
                      {new Date(doc.submittedDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        Aperçu
                      </Button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1.5"
                          onClick={() => openValidateDialog(doc)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs gap-1.5"
                          onClick={() => openRejectDialog(doc)}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Rejeter
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-[#F3F4F6] max-h-[480px] overflow-y-auto">
          {filteredDocs.map((doc) => {
            const Icon = docTypeIcon[doc.documentType] || FileText
            const colors = docTypeColor[doc.documentType] || {
              bg: 'bg-orange-50',
              text: 'text-orange-600',
            }
            return (
              <div key={doc.id} className="px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-xs shrink-0">
                    {doc.driverName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">
                      {doc.driverName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div
                        className={cn(
                          'w-5 h-5 rounded flex items-center justify-center',
                          colors.bg
                        )}
                      >
                        <Icon className={cn('w-3 h-3', colors.text)} />
                      </div>
                      <span className="text-xs text-[#6B7280]">
                        {doc.documentType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">
                    {new Date(doc.submittedDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 gap-1 h-7 px-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1 h-7 px-2.5"
                      onClick={() => openValidateDialog(doc)}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Valider
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 text-xs gap-1 h-7 px-2.5"
                      onClick={() => openRejectDialog(doc)}
                    >
                      <XCircle className="w-3 h-3" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AlertDialog for Validate / Reject */}
      <AlertDialog
        open={dialogState.open}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState({ open: false, mode: 'validate', document: null })
            setRejectReason('')
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogState.mode === 'validate'
                ? 'Valider le document'
                : 'Rejeter le document'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogState.mode === 'validate' ? (
                <>
                  Êtes-vous sûr de vouloir valider le document{' '}
                  <span className="font-semibold text-[#111827]">
                    {dialogState.document?.documentType}
                  </span>{' '}
                  de{' '}
                  <span className="font-semibold text-[#111827]">
                    {dialogState.document?.driverName}
                  </span>{' '}
                  ?
                </>
              ) : (
                <>
                  Veuillez indiquer la raison du rejet du document{' '}
                  <span className="font-semibold text-[#111827]">
                    {dialogState.document?.documentType}
                  </span>{' '}
                  de{' '}
                  <span className="font-semibold text-[#111827]">
                    {dialogState.document?.driverName}
                  </span>
                  .
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {dialogState.mode === 'reject' && (
            <Textarea
              placeholder="Raison du rejet..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                dialogState.mode === 'validate'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }
            >
              {dialogState.mode === 'validate' ? 'Confirmer la validation' : 'Confirmer le rejet'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
