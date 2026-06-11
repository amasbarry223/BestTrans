'use client'

import {
  ArrowLeft,
  FileText,
  Truck,
  Warehouse,
  Receipt,
  Clock,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  Edit,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '../dashboard-context'

const workflowSteps = [
  'Ouvert', 'Docs reçus', 'Déclaration', 'Liquidation', 'Paiement', 'BAE', 'Enlèvement', 'Livré', 'Clôturé'
]

export function DossierDetailView() {
  const { pendingDossier, clearPendingDossier, setActiveView } = useDashboard()
  const dossier = pendingDossier

  const handleBack = () => {
    clearPendingDossier()
    setActiveView('dossiers')
  }

  if (!dossier) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-[#6B7280]">
        <FileText className="w-12 h-12" />
        <p>Aucun dossier sélectionné</p>
        <button
          onClick={handleBack}
          className="text-teal-600 text-sm font-medium hover:underline"
        >
          Retour aux dossiers
        </button>
      </div>
    )
  }

  const currentStepIndex = workflowSteps.indexOf(dossier.status)

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-[#111827] font-mono">{dossier.number}</h2>
            <p className="text-sm text-[#6B7280]">{dossier.type} · {dossier.regime}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Imprimer
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
            <Copy className="w-4 h-4" /> Dupliquer
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
            <Edit className="w-4 h-4" /> Modifier
          </button>
        </div>
      </div>

      {/* Workflow */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Workflow du dossier</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {workflowSteps.map((step, i) => (
            <div key={step} className="flex items-center shrink-0">
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                i < currentStepIndex ? 'bg-emerald-50 text-emerald-700' :
                i === currentStepIndex ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-300' :
                'bg-gray-50 text-gray-400'
              )}>
                {i < currentStepIndex ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className={cn('w-1.5 h-1.5 rounded-full', i === currentStepIndex ? 'bg-teal-500' : 'bg-gray-300')} />
                )}
                {step}
              </div>
              {i < workflowSteps.length - 1 && (
                <div className={cn('w-4 h-0.5 mx-0.5', i < currentStepIndex ? 'bg-emerald-300' : 'bg-gray-200')} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Info principale */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" /> Informations du dossier
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">N° Dossier</dt><dd className="text-sm font-medium text-[#111827] font-mono">{dossier.number}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Type</dt><dd className="text-sm font-medium text-[#111827]">{dossier.type}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Client</dt><dd className="text-sm font-medium text-[#111827]">{dossier.client}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Régime douanier</dt><dd className="text-sm font-medium text-[#111827]">{dossier.regime}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">BL / LTA</dt><dd className="text-sm font-medium text-[#111827] font-mono">{dossier.bl}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Bureau de douane</dt><dd className="text-sm font-medium text-[#111827]">{dossier.bureau}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Corridor</dt><dd className="text-sm font-medium text-[#111827]">{dossier.corridor}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Date ouverture</dt><dd className="text-sm font-medium text-[#111827]">{dossier.date}</dd></div>
            <div className="col-span-2"><dt className="text-[10px] text-[#9CA3AF] uppercase">Marchandise</dt><dd className="text-sm font-medium text-[#111827]">{dossier.merchandise}</dd></div>
          </dl>
        </div>

        {/* Infos financières */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-600" /> Données financières
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Honoraires de transit</dt><dd className="text-sm font-bold text-teal-700">{dossier.honoraires}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Droits & taxes</dt><dd className="text-sm font-bold text-amber-700">{dossier.droitsTaxes}</dd></div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Statut</dt>
              <dd>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {dossier.status}
                </span>
              </dd>
            </div>
            <div><dt className="text-[10px] text-[#9CA3AF] uppercase">Mode paiement</dt><dd className="text-sm font-medium text-[#111827]">Virement</dd></div>
          </dl>

          <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Truck className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span className="text-[#6B7280]">Transport: ML-1234-AB — Amadou Coulibaly</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Warehouse className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span className="text-[#6B7280]">Dépôt: Magasin sous douane Bamako</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-600 font-medium">Franchise dépôt: 18/21 jours restants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pièces justificatives */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" /> Pièces justificatives
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Connaissement (BL)', 'Déclaration en douane', 'Facture fournisseur', 'Packing list', 'Certificat d\'origine', 'BAE'].map((doc, i) => (
            <div key={doc} className={cn(
              'border rounded-lg p-3 flex items-center gap-2 text-xs',
              i < 3 ? 'border-emerald-200 bg-emerald-50' : 'border-[#E5E7EB] bg-gray-50'
            )}>
              {i < 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              )}
              <span className={cn(i < 3 ? 'text-emerald-700 font-medium' : 'text-[#6B7280]')}>{doc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
