'use client'

import React, { useState } from 'react'
import {
  HelpCircle,
  Plus,
  Search,
  UserCircle,
  Car,
  CreditCard,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type FaqEntry = {
  question: string
  answer: string
}

type FaqCategory = {
  id: string
  label: string
  icon: React.ElementType
  color: { bg: string; text: string }
  entries: FaqEntry[]
}

const faqCategories: FaqCategory[] = [
  {
    id: 'compte',
    label: 'Compte',
    icon: UserCircle,
    color: { bg: 'bg-blue-50', text: 'text-blue-600' },
    entries: [
      {
        question: 'Comment créer un compte BestTrans ?',
        answer:
          'Téléchargez l\'application BestTrans depuis le Google Play Store ou l\'App Store, puis suivez les étapes d\'inscription avec votre numéro de téléphone. Vous recevrez un code de vérification par SMS pour activer votre compte.',
      },
      {
        question: 'Comment réinitialiser mon mot de passe ?',
        answer:
          'Sur l\'écran de connexion, appuyez sur "Mot de passe oublié". Entrez votre numéro de téléphone associé au compte. Un code de vérification vous sera envoyé par SMS pour créer un nouveau mot de passe.',
      },
    ],
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: Car,
    color: { bg: 'bg-blue-100', text: 'text-blue-700' },
    entries: [
      {
        question: 'Comment réserver une course ?',
        answer:
          'Ouvrez l\'application, entrez votre destination dans la barre de recherche, sélectionnez le type de véhicule souhaité, puis confirmez votre demande. Un chauffeur vous sera assigné en quelques secondes.',
      },
      {
        question: 'Puis-je annuler une course ?',
        answer:
          'Oui, vous pouvez annuler une course avant que le chauffeur ne soit arrivé. Des frais d\'annulation peuvent s\'appliquer si l\'annulation est effectuée plus de 2 minutes après la confirmation du chauffeur.',
      },
      {
        question: 'Comment signaler un problème avec un chauffeur ?',
        answer:
          'Après votre course, allez dans "Historique des courses", sélectionnez la course concernée, puis appuyez sur "Signaler un problème". Vous pouvez également contacter notre support directement depuis l\'application.',
      },
    ],
  },
  {
    id: 'paiements',
    label: 'Paiements',
    icon: CreditCard,
    color: { bg: 'bg-blue-50', text: 'text-blue-600' },
    entries: [
      {
        question: 'Quels modes de paiement sont acceptés ?',
        answer:
          'BestTrans accepte les paiements en espèces, par Mobile Money (Orange Money, Malitel), et par carte bancaire. Vous pouvez gérer vos méthodes de paiement dans les paramètres de votre compte.',
      },
      {
        question: 'Comment obtenir un remboursement ?',
        answer:
          'Si vous avez été facturé incorrectement, contactez notre support via la section "Aide" de l\'application ou soumettez un ticket. Les remboursements sont traités sous 24 à 48 heures ouvrables.',
      },
    ],
  },
  {
    id: 'technique',
    label: 'Technique',
    icon: Settings,
    color: { bg: 'bg-blue-100', text: 'text-blue-700' },
    entries: [
      {
        question: 'L\'application ne fonctionne pas, que faire ?',
        answer:
          'Vérifiez que vous avez la dernière version de l\'application. Essayez de fermer et rouvrir l\'application. Si le problème persiste, effacez le cache de l\'application dans les paramètres de votre téléphone ou contactez notre support technique.',
      },
      {
        question: 'Comment activer la géolocalisation ?',
        answer:
          'Allez dans les paramètres de votre téléphone > Applications > BestTrans > Permissions, puis activez l\'accès à la localisation. Assurez-vous que le GPS de votre téléphone est activé.',
      },
      {
        question: 'Mes données sont-elles sécurisées ?',
        answer:
          'Oui, BestTrans utilise un chiffrement de bout en bout pour protéger vos données personnelles et financières. Nous respectons les normes internationales de sécurité et ne partageons jamais vos informations avec des tiers sans votre consentement.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FaqView() {
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['compte'])
  )
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set([])
  )

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
      }
      return next
    })
  }

  const toggleQuestion = (key: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // Filter entries based on search
  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      entries: cat.entries.filter(
        (entry) =>
          entry.question.toLowerCase().includes(search.toLowerCase()) ||
          entry.answer.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.entries.length > 0)

  const totalEntries = faqCategories.reduce(
    (acc, cat) => acc + cat.entries.length,
    0
  )

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">
            FAQ BestTrans
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Gestion des questions fréquentes
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
          onClick={() =>
            toast.info('Fonctionnalité à venir', {
              description: 'L\'ajout de nouvelles questions sera bientôt disponible.',
            })
          }
        >
          <Plus className="w-4 h-4" />
          Ajouter une question
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            {totalEntries} questions
          </span>
          <span>{faqCategories.length} catégories</span>
        </div>
      </div>

      {/* Category Cards */}
      <div className="flex flex-col gap-4">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon
          const isExpanded = expandedCategories.has(cat.id)
          return (
            <div
              key={cat.id}
              className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      cat.color.bg
                    )}
                  >
                    <Icon className={cn('w-5 h-5', cat.color.text)} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-[#111827]">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-[#9CA3AF]">
                      {cat.entries.length} question{cat.entries.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-[#9CA3AF] transition-transform duration-200',
                    isExpanded && 'rotate-180'
                  )}
                />
              </button>

              {/* Questions */}
              {isExpanded && (
                <div className="border-t border-[#E5E7EB]">
                  {cat.entries.map((entry, idx) => {
                    const qKey = `${cat.id}-${idx}`
                    const isQExpanded = expandedQuestions.has(qKey)
                    return (
                      <div
                        key={qKey}
                        className="border-b border-[#F3F4F6] last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => toggleQuestion(qKey)}
                          className="w-full px-5 py-3.5 flex items-start justify-between gap-3 hover:bg-blue-50/20 transition-colors text-left"
                        >
                          <span className="text-sm font-medium text-[#111827] group-hover:text-blue-700">
                            {entry.question}
                          </span>
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5 transition-transform duration-200',
                              isQExpanded && 'rotate-180'
                            )}
                          />
                        </button>
                        {isQExpanded && (
                          <div className="px-5 pb-4">
                            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                              <p className="text-sm text-[#374151] leading-relaxed">
                                {entry.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {filteredCategories.length === 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-sm text-[#6B7280]">
              Aucune question ne correspond à votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
