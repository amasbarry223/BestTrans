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
  Route,
  Container,
  DollarSign,
  BarChart3,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '../dashboard-context'

const workflowSteps = [
  'Ouvert', 'Docs reçus', 'Déclaration', 'Liquidation', 'Paiement', 'BAE', 'Enlèvement', 'Livré', 'Clôturé'
]

/* Tableau de Charge - Cost breakdown */
const tableauCharge = [
  { category: 'Honoraires de transit', montant: 2500000, type: 'Honoraires' },
  { category: 'Droits de douane (DVI + DC)', montant: 4200000, type: 'Débours' },
  { category: 'Taxe TCI', montant: 1200000, type: 'Débours' },
  { category: 'TVA 18%', montant: 3000000, type: 'Débours' },
  { category: 'Transport (Dakar-Bamako)', montant: 850000, type: 'Transport' },
  { category: 'Magasinage', montant: 0, type: 'Magasinage' },
  { category: 'Taxe de livraison (TL 2%)', montant: 400000, type: 'Débours' },
  { category: 'Redevance statistique (RS 1%)', montant: 200000, type: 'Débours' },
  { category: 'Frais de dossier', montant: 50000, type: 'Honoraires' },
]

const totalCharge = tableauCharge.reduce((sum, item) => sum + item.montant, 0)

/* BAX Tracking */
const baxTimeline = [
  { step: 'Émission BAX', date: '28/02/2026', status: 'done' as const },
  { step: 'Embarquement Dakar', date: '02/03/2026', status: 'done' as const },
  { step: 'Transit route Dakar-Bamako', date: '03/03/2026', status: 'done' as const },
  { step: 'Arrivée poste Diboli', date: '05/03/2026', status: 'done' as const },
  { step: 'Transit intérieur', date: '06/03/2026', status: 'done' as const },
  { step: 'Arrivée Bamako-Sénou', date: '07/03/2026', status: 'current' as const },
  { step: 'Déclaration en douane', date: '—', status: 'pending' as const },
  { step: 'Apurement BAX', date: '—', status: 'pending' as const },
]

const chargeTypeColors: Record<string, { bg: string; text: string }> = {
  'Honoraires': { bg: 'bg-teal-50', text: 'text-teal-700' },
  'Débours':    { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Transport':  { bg: 'bg-sky-50',   text: 'text-sky-700' },
  'Magasinage': { bg: 'bg-violet-50', text: 'text-violet-700' },
}

function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' FCFA'
}

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

  // Group charges by type for summary
  const chargeByType = tableauCharge.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = 0
    acc[item.type] += item.montant
    return acc
  }, {} as Record<string, number>)

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
            <p className="text-sm text-[#6B7280]">{dossier.type} · {dossier.regime} · {dossier.corridor}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Imprimer
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
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
              <Route className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span className="text-[#6B7280]">BAX: BAX-2026-ML-00456</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-600 font-medium">Franchise dépôt: 18/21 jours restants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau de Charge */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" /> Tableau de Charge
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Detailed breakdown */}
          <div className="lg:col-span-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-2 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase">Poste de charge</th>
                  <th className="py-2 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase">Type</th>
                  <th className="py-2 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase">Montant</th>
                  <th className="py-2 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase">% Total</th>
                </tr>
              </thead>
              <tbody>
                {tableauCharge.map((item) => {
                  const typeColor = chargeTypeColors[item.type] || { bg: 'bg-gray-50', text: 'text-gray-700' }
                  return (
                    <tr key={item.category} className="border-b border-[#F3F4F6] last:border-b-0">
                      <td className="py-2.5 text-xs font-medium text-[#111827]">{item.category}</td>
                      <td className="py-2.5 text-center">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded', typeColor.bg, typeColor.text)}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-xs font-bold text-[#111827]">{formatFCFA(item.montant)}</td>
                      <td className="py-2.5 text-right text-xs text-[#6B7280]">{totalCharge > 0 ? ((item.montant / totalCharge) * 100).toFixed(1) : 0}%</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-teal-200">
                  <td className="py-3 text-sm font-bold text-[#111827]">TOTAL</td>
                  <td />
                  <td className="py-3 text-right text-sm font-bold text-teal-700">{formatFCFA(totalCharge)}</td>
                  <td className="py-3 text-right text-sm font-bold text-[#111827]">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary by type */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Répartition par type</h4>
            {Object.entries(chargeByType).map(([type, montant]) => {
              const typeColor = chargeTypeColors[type] || { bg: 'bg-gray-50', text: 'text-gray-700' }
              const pct = totalCharge > 0 ? (montant / totalCharge) * 100 : 0
              const barColor = type === 'Honoraires' ? 'bg-teal-500' : type === 'Débours' ? 'bg-amber-500' : type === 'Transport' ? 'bg-sky-500' : 'bg-violet-500'
              return (
                <div key={type} className="p-3 bg-[#F9FAFB] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded', typeColor.bg, typeColor.text)}>{type}</span>
                    <span className="text-xs font-bold text-[#111827]">{formatFCFA(montant)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', barColor)} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] text-right mt-0.5">{pct.toFixed(1)}%</p>
                </div>
              )
            })}

            <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-[#6B7280]">Marge honoraires: </span>
                <span className="font-bold text-teal-700">{((chargeByType['Honoraires'] || 0) / totalCharge * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Timer className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[#6B7280]">Délai traitement: </span>
                <span className="font-bold text-[#111827]">4,2 jours</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Container className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[#6B7280]">Surestaries: </span>
                <span className="font-bold text-emerald-600">0 FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BAX Tracking */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <Route className="w-4 h-4 text-teal-600" /> Suivi BAX (Bordereau de Suivi)
          </h3>
          <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg">BAX-2026-ML-00456</span>
        </div>
        <div className="relative">
          {baxTimeline.map((step, i) => (
            <div key={step.step} className="flex items-start gap-3 pb-4 last:pb-0">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center shrink-0">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center',
                  step.status === 'done' ? 'bg-emerald-100' :
                  step.status === 'current' ? 'bg-teal-100 ring-2 ring-teal-400' :
                  'bg-gray-100'
                )}>
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : step.status === 'current' ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                {i < baxTimeline.length - 1 && (
                  <div className={cn(
                    'w-0.5 h-6',
                    step.status === 'done' && baxTimeline[i + 1].status !== 'pending' ? 'bg-emerald-300' :
                    step.status === 'done' ? 'bg-gray-200' : 'bg-gray-200'
                  )} />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 flex items-center justify-between pt-1">
                <div>
                  <p className={cn(
                    'text-sm font-medium',
                    step.status === 'done' ? 'text-emerald-700' :
                    step.status === 'current' ? 'text-teal-700' :
                    'text-[#9CA3AF]'
                  )}>
                    {step.step}
                  </p>
                </div>
                <span className={cn(
                  'text-xs',
                  step.status === 'done' ? 'text-emerald-600 font-medium' :
                  step.status === 'current' ? 'text-teal-600 font-semibold' :
                  'text-[#9CA3AF]'
                )}>
                  {step.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pièces justificatives */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" /> Pièces justificatives
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Connaissement (BL)', status: 'validé' },
            { name: 'Déclaration en douane', status: 'validé' },
            { name: 'Facture fournisseur', status: 'validé' },
            { name: 'Packing list', status: 'en_attente' },
            { name: "Certificat d'origine", status: 'en_attente' },
            { name: 'BAE', status: 'en_attente' },
            { name: 'BAX (Bordereau de suivi)', status: 'validé' },
            { name: 'Déclaration D15', status: 'en_attente' },
          ].map((doc, i) => (
            <div key={doc.name} className={cn(
              'border rounded-lg p-3 flex items-center gap-2 text-xs',
              doc.status === 'validé' ? 'border-emerald-200 bg-emerald-50' : 'border-[#E5E7EB] bg-gray-50'
            )}>
              {doc.status === 'validé' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              )}
              <span className={cn(doc.status === 'validé' ? 'text-emerald-700 font-medium' : 'text-[#6B7280]')}>{doc.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
