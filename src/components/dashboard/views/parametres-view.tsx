'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ParametresView() {
  const [activeSection, setActiveSection] = useState<'profil' | 'entreprise' | 'notifications' | 'securite'>('profil')

  const sections = [
    { key: 'profil' as const, label: 'Mon profil', icon: User },
    { key: 'entreprise' as const, label: 'Entreprise', icon: Building2 },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'securite' as const, label: 'Sécurité', icon: Shield },
  ]

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="flex gap-2">
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors border',
                activeSection === s.key
                  ? 'border-teal-300 bg-teal-50 text-teal-700'
                  : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          )
        })}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        {activeSection === 'profil' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-[#111827] mb-6">Informations personnelles</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                SD
              </div>
              <div>
                <p className="font-semibold text-[#111827]">Seydou Diarra</p>
                <p className="text-sm text-[#6B7280]">Directeur</p>
                <button className="text-xs text-teal-600 font-medium mt-1 hover:underline">Changer la photo</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Nom complet</label>
                <input type="text" defaultValue="Seydou Diarra" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Email</label>
                <input type="email" defaultValue="s.diarra@transitpro.ml" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Téléphone</label>
                <input type="tel" defaultValue="+223 70 00 00 00" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Rôle</label>
                <input type="text" defaultValue="Directeur" disabled className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-gray-50 text-[#6B7280]" />
              </div>
            </div>
            <button className="mt-6 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        )}

        {activeSection === 'entreprise' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-[#111827] mb-6">Paramètres de l&apos;entreprise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Raison sociale</label>
                <input type="text" defaultValue="TransitPro SARL" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">NIF</label>
                <input type="text" defaultValue="NIF-12-45-6789-Z" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">RCCM</label>
                <input type="text" defaultValue="RCCM-BKO-2020-1234" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Devise</label>
                <input type="text" defaultValue="FCFA" disabled className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-gray-50 text-[#6B7280]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Zone d'opération</label>
                <input type="text" defaultValue="Mali / UEMOA" disabled className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-gray-50 text-[#6B7280]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Franchise dépôt (jours)</label>
                <input type="number" defaultValue="21" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <button className="mt-6 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-[#111827] mb-6">Préférences de notifications</h3>
            <div className="space-y-4">
              {[
                { label: 'Alertes de franchise dépôt', desc: 'Notification quand un dossier approche la franchise', default: true },
                { label: 'Factures en retard', desc: 'Rappel pour les factures non réglées après échéance', default: true },
                { label: 'Échéances déclarations', desc: 'Rappel pour les déclarations en douane à déposer', default: true },
                { label: 'Missions de transport', desc: 'Mise à jour du statut des missions', default: false },
                { label: 'Rapports hebdomadaires', desc: 'Synthèse hebdomadaire par email', default: false },
                { label: 'Alertes sécurité', desc: 'Tentatives de connexion suspectes', default: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                    <p className="text-xs text-[#6B7280]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'securite' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-[#111827] mb-6">Sécurité du compte</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Authentification double facteur (2FA)</p>
                  <p className="text-xs text-[#6B7280]">Renforcez la sécurité de votre compte</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-[#F3F4F6]">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Déconnexion automatique</p>
                  <p className="text-xs text-[#6B7280]">Après 30 minutes d&apos;inactivité</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
            <button className="mt-6 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <Save className="w-4 h-4" /> Mettre à jour
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
