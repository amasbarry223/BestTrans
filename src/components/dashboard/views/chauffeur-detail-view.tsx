'use client'

import React from 'react'
import {
  ArrowLeft,
  Phone,
  Mail,
  Car,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  Wallet,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type KycDoc = {
  label: string
  status: 'Validé' | 'En attente' | 'Rejeté'
  icon: React.ElementType
}

type RecentCourse = {
  id: string
  passager: string
  depart: string
  arrivee: string
  prix: string
  date: string
  statut: string
}

const defaultKycDocs: KycDoc[] = [
  { label: 'Permis de conduire', status: 'Validé', icon: FileText },
  { label: 'Carte grise', status: 'Validé', icon: FileText },
  { label: 'Assurance', status: 'En attente', icon: ShieldCheck },
  { label: "Pièce d'identité", status: 'Rejeté', icon: FileText },
]

const defaultRecentCourses: RecentCourse[] = [
  { id: 'C-3041', passager: 'Aminata Diarra', depart: 'Kalaban-Coura', arrivee: 'Badalabougou', prix: '3 500 FCFA', date: '04/03/2025', statut: 'Terminée' },
  { id: 'C-3039', passager: 'Moussa Traoré', depart: 'Hamdallaye', arrivee: 'Sébenikoro', prix: '2 800 FCFA', date: '04/03/2025', statut: 'Terminée' },
  { id: 'C-3036', passager: 'Kadiatou Bah', depart: 'Lafiabougou', arrivee: 'Kalaban-Coura', prix: '4 200 FCFA', date: '03/03/2025', statut: 'Terminée' },
  { id: 'C-3034', passager: 'Seydou Keïta', depart: 'Badalabougou', arrivee: 'Hamdallaye', prix: '1 900 FCFA', date: '03/03/2025', statut: 'Annulée' },
  { id: 'C-3031', passager: 'Fatoumata Sanogo', depart: 'Sébenikoro', arrivee: 'Lafiabougou', prix: '3 100 FCFA', date: '02/03/2025', statut: 'Terminée' },
]

const kycStatusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  'Validé': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'En attente': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Rejeté': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChauffeurDetailView() {
  const { pendingChauffeur, clearPendingChauffeur, setActiveView } =
    useDashboard()

  if (!pendingChauffeur) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
          <Car className="w-8 h-8 text-orange-300" />
        </div>
        <p className="text-sm text-[#6B7280]">Aucun chauffeur sélectionné</p>
        <Button
          variant="outline"
          onClick={() => setActiveView('chauffeurs')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  const chauffeur = pendingChauffeur

  const handleBack = () => {
    clearPendingChauffeur()
    setActiveView('chauffeurs')
  }

  return (
    <div className="h-full w-full flex flex-col gap-5 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0 hover:bg-orange-50"
          >
            <ArrowLeft className="w-5 h-5 text-orange-600" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">
              {chauffeur.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                className={cn(
                  'text-xs',
                  chauffeur.statut === 'Actif'
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : chauffeur.statut === 'Suspendu'
                      ? 'bg-red-100 text-red-700 hover:bg-red-100'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                )}
              >
                {chauffeur.statut}
              </Badge>
              <span className="text-xs text-[#9CA3AF]">{chauffeur.id || 'CH-1042'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
            onClick={() =>
              toast.success('Chauffeur validé', {
                description: `${chauffeur.name} a été validé.`,
              })
            }
          >
            <CheckCircle2 className="w-4 h-4" />
            Valider
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
            onClick={() =>
              toast.error('Chauffeur suspendu', {
                description: `${chauffeur.name} a été suspendu.`,
              })
            }
          >
            <XCircle className="w-4 h-4" />
            Suspendre
          </Button>
        </div>
      </div>

      {/* Info Grid: Personal + Vehicle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Personal Info */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-orange-600" />
            </div>
            Informations personnelles
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Nom complet</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5">{chauffeur.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Téléphone</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-orange-500" />
                {chauffeur.phone || '+223 76 34 56 78'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-orange-500" />
                {chauffeur.email || 'amadou.keita@email.com'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">N° Permis</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5">ML-2024-1042</p>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Car className="w-4 h-4 text-orange-600" />
            </div>
            Informations véhicule
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Marque</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5">Toyota</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Modèle</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5">Corolla</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Immatriculation</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5">AB-1234-ML</p>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Couleur</p>
              <p className="text-sm font-medium text-[#111827] mt-0.5">Blanc</p>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Documents */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
          </div>
          Documents KYC
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultKycDocs.map((doc) => {
            const Icon = doc.icon
            const styles = kycStatusStyles[doc.status]
            return (
              <div
                key={doc.label}
                className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-orange-600" />
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                      styles.bg,
                      styles.text
                    )}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />
                    {doc.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#111827]">{doc.label}</p>
                <div className="flex items-center gap-2 mt-auto">
                  {doc.status === 'En attente' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1 h-7 px-2.5 flex-1"
                        onClick={() =>
                          toast.success('Document validé', { description: `${doc.label} validé` })
                        }
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 text-xs gap-1 h-7 px-2.5 flex-1"
                        onClick={() =>
                          toast.error('Document rejeté', { description: `${doc.label} rejeté` })
                        }
                      >
                        <XCircle className="w-3 h-3" />
                        Rejeter
                      </Button>
                    </>
                  )}
                  {doc.status === 'Validé' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-orange-600 hover:bg-orange-50 text-xs gap-1 h-7 px-2.5"
                    >
                      Voir document
                    </Button>
                  )}
                  {doc.status === 'Rejeté' && (
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1 h-7 px-2.5 flex-1"
                      onClick={() =>
                        toast.success('Document re-soumis', { description: `${doc.label} en attente de validation` })
                      }
                    >
                      <Clock className="w-3 h-3" />
                      Redemander
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Taux d'acceptation", value: '87%', icon: TrendingUp, color: 'blue' as const },
          { label: 'Ponctualité', value: '92%', icon: Clock, color: 'blue' as const },
          { label: 'Note moyenne', value: '4.5/5', icon: Star, color: 'blue' as const },
          { label: 'Courses totales', value: '845', icon: Car, color: 'blue' as const },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">{stat.label}</p>
                <p className="text-xl font-bold text-orange-700">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Solde disponible</p>
            <p className="text-xl font-bold text-orange-700">125 000 FCFA</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Dernier versement</p>
            <p className="text-xl font-bold text-orange-700">85 000 FCFA</p>
            <p className="text-[10px] text-[#9CA3AF]">28 Fév. 2025</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6 text-orange-700" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Revenus ce mois</p>
            <p className="text-xl font-bold text-orange-700">210 000 FCFA</p>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <Car className="w-4 h-4 text-orange-600" />
          <h2 className="text-sm font-semibold text-[#111827]">
            Courses récentes
          </h2>
          <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-xs">
            {defaultRecentCourses.length}
          </Badge>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-y-auto max-h-[300px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-2.5 px-5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">N°</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Passager</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Départ</th>
                <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Arrivée</th>
                <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Prix</th>
                <th className="py-2.5 px-3 text-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {defaultRecentCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-orange-50/30 transition-colors"
                >
                  <td className="py-2.5 px-5 text-xs font-mono text-orange-600">{course.id}</td>
                  <td className="py-2.5 px-3 text-sm text-[#111827]">{course.passager}</td>
                  <td className="py-2.5 px-3 text-sm text-[#6B7280]">{course.depart}</td>
                  <td className="py-2.5 px-3 text-sm text-[#6B7280]">{course.arrivee}</td>
                  <td className="py-2.5 px-3 text-sm font-medium text-[#111827] text-right">{course.prix}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                        course.statut === 'Terminée'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      )}
                    >
                      {course.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-[#F3F4F6] max-h-[300px] overflow-y-auto">
          {defaultRecentCourses.map((course) => (
            <div key={course.id} className="px-4 py-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-orange-600">{course.id}</span>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                    course.statut === 'Terminée'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}
                >
                  {course.statut}
                </span>
              </div>
              <p className="text-sm font-medium text-[#111827]">{course.passager}</p>
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>{course.depart} → {course.arrivee}</span>
                <span className="font-medium text-[#111827]">{course.prix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
