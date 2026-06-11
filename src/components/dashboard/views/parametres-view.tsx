'use client'

import React, { useState } from 'react'
import {
  User,
  Lock,
  Shield,
  Globe,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Phone,
  Mail,
  MapPin,
  Building2,
  BadgeCheck,
  KeyRound,
  Smartphone,
  Fingerprint,
  AlertTriangle,
  FileText,
  Share2,
  Wallet,
  Languages,
  Clock,
  Coins,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  FileBarChart,
  CheckCircle2,
  Save,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { exportCsv, exportJson } from '@/lib/export-utils'
import { loadProfileSettings, saveProfileSettings } from '@/lib/agent-store'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabKey = 'profil' | 'securite' | 'confidentialite' | 'langue' | 'notifications'

interface TabDef {
  key: TabKey
  label: string
  icon: React.ElementType
  description: string
}

const tabs: TabDef[] = [
  { key: 'profil',           label: 'Profil',              icon: User,     description: 'Informations personnelles' },
  { key: 'securite',         label: 'Sécurité',            icon: Lock,     description: 'Mot de passe et 2FA' },
  { key: 'confidentialite',  label: 'Confidentialité',     icon: Shield,   description: 'Données et permissions' },
  { key: 'langue',           label: 'Langue & Région',     icon: Globe,    description: 'Français · Mali (UTC+1)' },
  { key: 'notifications',    label: 'Notifications',       icon: Bell,     description: 'SMS, email, push' },
]

/* ------------------------------------------------------------------ */
/*  Toggle Switch                                                      */
/* ------------------------------------------------------------------ */

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'relative w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0',
        enabled ? 'bg-emerald-500' : 'bg-gray-300'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 bg-white rounded-full shadow-sm transition-transform',
          enabled ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Profil Tab                                                         */
/* ------------------------------------------------------------------ */

function ProfilTab() {
  const [formData, setFormData] = useState(() => ({
    name: 'Amadou Moussa',
    phone: '+223 70 00 00 00',
    email: 'amadou.moussa@ricash.com',
    agency: 'Bamako — Badalabougou',
    address: 'Bamako, Badalabougou Centre',
    idType: 'Carte nationale',
    idNumber: 'BN-9876543',
    ...(loadProfileSettings() ?? {}),
  }))

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl">
              AM
            </div>
            <button
              type="button"
              className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#111827]">{formData.name}</h2>
            <p className="text-sm text-[#6B7280] mt-0.5">Agent · Bamako</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                <BadgeCheck className="w-3.5 h-3.5" />
                Actif
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                <KeyRound className="w-3.5 h-3.5" />
                Agent principal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Informations personnelles</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            icon={User}
            label="Nom complet"
            value={formData.name}
            onChange={(v) => handleChange('name', v)}
          />
          <FormField
            icon={Phone}
            label="Téléphone"
            value={formData.phone}
            onChange={(v) => handleChange('phone', v)}
          />
          <FormField
            icon={Mail}
            label="Email"
            value={formData.email}
            onChange={(v) => handleChange('email', v)}
            type="email"
          />
          <FormField
            icon={Building2}
            label="Agence"
            value={formData.agency}
            onChange={(v) => handleChange('agency', v)}
          />
          <FormField
            icon={MapPin}
            label="Adresse"
            value={formData.address}
            onChange={(v) => handleChange('address', v)}
          />
          <FormField
            icon={FileText}
            label="Type de document"
            value={formData.idType}
            onChange={(v) => handleChange('idType', v)}
          />
        </div>

        <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={() => {
              saveProfileSettings(formData)
              toast.success('Profil mis à jour', { description: 'Vos informations personnelles ont été enregistrées' })
            }}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sécurité Tab                                                       */
/* ------------------------------------------------------------------ */

function SecuriteTab() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFASMS, setTwoFASMS] = useState(true)
  const [twoFAApp, setTwoFAApp] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(true)

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Changer le mot de passe</h3>
        </div>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="text-sm font-medium text-[#6B7280] mb-1.5 block">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 pr-10 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#6B7280] mb-1.5 block">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 pr-10 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength indicator */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-amber-500 rounded-full" />
              </div>
              <span className="text-[10px] font-medium text-amber-600">Moyen</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#6B7280] mb-1.5 block">Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.success('Mot de passe mis à jour', { description: 'Votre mot de passe a été modifié avec succès' })}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Lock className="w-4 h-4" />
            Mettre à jour le mot de passe
          </button>
        </div>
      </div>

      {/* 2FA Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Fingerprint className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Authentification à deux facteurs</h3>
        </div>
        <div className="space-y-3">
          <SettingRow
            icon={Smartphone}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title="2FA par SMS"
            description="Recevez un code OTP par SMS à chaque connexion"
            enabled={twoFASMS}
            onToggle={() => setTwoFASMS(!twoFASMS)}
          />
          <SettingRow
            icon={Fingerprint}
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
            title="2FA par application"
            description="Utilisez Google Authenticator ou Authy pour générer des codes"
            enabled={twoFAApp}
            onToggle={() => setTwoFAApp(!twoFAApp)}
          />
          <SettingRow
            icon={Clock}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            title="Expiration de session"
            description="Verrouillage automatique après 15 minutes d'inactivité"
            enabled={sessionTimeout}
            onToggle={() => setSessionTimeout(!sessionTimeout)}
          />
        </div>
      </div>

      {/* Security info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Conseil de sécurité</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Nous vous recommandons d&apos;activer l&apos;authentification à deux facteurs par SMS et par application pour une sécurité maximale de votre compte agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Confidentialité Tab                                                */
/* ------------------------------------------------------------------ */

function ConfidentialiteTab() {
  const [auditLog, setAuditLog] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)
  const [transactionLimits, setTransactionLimits] = useState(true)

  return (
    <div className="space-y-6">
      {/* Data Privacy */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Confidentialité des données</h3>
        </div>
        <div className="space-y-3">
          <SettingRow
            icon={FileText}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title="Journal d'audit"
            description="Toutes vos actions sont enregistrées pour sécurité"
            enabled={auditLog}
            onToggle={() => setAuditLog(!auditLog)}
            badge="Activé"
            badgeStyle="bg-emerald-50 text-emerald-700"
          />
          <SettingRow
            icon={Share2}
            iconBg="bg-gray-100"
            iconColor="text-gray-600"
            title="Partage de données partenaires"
            description="Autoriser le partage avec les partenaires agréés"
            enabled={dataSharing}
            onToggle={() => setDataSharing(!dataSharing)}
            badge="Désactivé"
            badgeStyle="bg-gray-100 text-gray-600"
          />
          <SettingRow
            icon={Wallet}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            title="Limites transactionnelles"
            description="Plafond journalier: 5,000,000 FCFA"
            enabled={transactionLimits}
            onToggle={() => setTransactionLimits(!transactionLimits)}
            badge="Configuré"
            badgeStyle="bg-amber-50 text-amber-700"
          />
        </div>
      </div>

      {/* Recent sessions */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Sessions actives</h3>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {[
            { device: 'Chrome · Windows', location: 'Bamako, Mali', time: 'Session actuelle', active: true },
            { device: 'Safari · iPhone 15', location: 'Bamako, Mali', time: 'Il y a 2 heures', active: false },
            { device: 'Chrome · Android', location: 'Sikasso, Mali', time: 'Hier, 16:30', active: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center',
                  session.active ? 'bg-emerald-100' : 'bg-gray-100'
                )}>
                  <Smartphone className={cn('w-4 h-4', session.active ? 'text-emerald-600' : 'text-gray-500')} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#111827]">{session.device}</p>
                    {session.active && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9CA3AF]">{session.location} · {session.time}</p>
                </div>
              </div>
              {!session.active && (
                <button
                  type="button"
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors"
                >
                  Déconnecter
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data export */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileBarChart className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Export de données</h3>
        </div>
        <p className="text-sm text-[#6B7280] mb-4">Téléchargez une copie de vos données personnelles et historique de transactions.</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              exportJson(
                { profil: loadProfileSettings(), exportDate: new Date().toISOString() },
                'ricash-donnees.json'
              )
              toast.success('Export JSON téléchargé')
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors"
          >
            <FileText className="w-4 h-4" />
            Exporter en PDF
          </button>
          <button
            type="button"
            onClick={() => {
              exportCsv(
                [
                  { Champ: 'Agent', Valeur: 'Amadou Moussa' },
                  { Champ: 'Agence', Valeur: 'Bamako' },
                  { Champ: 'Export', Valeur: new Date().toLocaleString('fr-FR') },
                ],
                'ricash-donnees.csv'
              )
              toast.success('Export CSV téléchargé')
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors"
          >
            <FileBarChart className="w-4 h-4" />
            Exporter en CSV
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Langue & Région Tab                                                */
/* ------------------------------------------------------------------ */

function LangueTab() {
  return (
    <div className="space-y-6">
      {/* Language & Region Settings */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Paramètres régionaux</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] mb-1.5">
              <Languages className="w-3.5 h-3.5" />
              Langue
            </label>
            <select className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none cursor-pointer transition-shadow">
              <option>Français</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] mb-1.5">
              <Clock className="w-3.5 h-3.5" />
              Fuseau horaire
            </label>
            <select className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none cursor-pointer transition-shadow">
              <option>UTC+1 (Afrique de l&apos;Ouest)</option>
              <option>UTC+0 (GMT)</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] mb-1.5">
              <Coins className="w-3.5 h-3.5" />
              Devise
            </label>
            <select className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none cursor-pointer transition-shadow">
              <option>FCFA (Franc CFA)</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Pays
            </label>
            <select className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none cursor-pointer transition-shadow">
              <option>Mali</option>
              <option>Guinée</option>
              <option>Côte d&apos;Ivoire</option>
              <option>Sénégal</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex items-center justify-between">
          <p className="text-xs text-[#9CA3AF]">Les changements seront appliqués après rechargement</p>
          <button
            type="button"
            onClick={() => toast.success('Paramètres appliqués', { description: 'Les changements seront appliqués après rechargement' })}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Appliquer
          </button>
        </div>
      </div>

      {/* Display preferences */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Préférences d&apos;affichage</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            <div>
              <p className="text-sm font-medium text-[#111827]">Format de date</p>
              <p className="text-xs text-[#6B7280]">Format d&apos;affichage des dates dans l&apos;application</p>
            </div>
            <select className="h-9 bg-white border border-[#E5E7EB] rounded-lg px-3 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none cursor-pointer">
              <option>JJ/MM/AAAA</option>
              <option>MM/JJ/AAAA</option>
              <option>AAAA-MM-JJ</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            <div>
              <p className="text-sm font-medium text-[#111827]">Format des montants</p>
              <p className="text-xs text-[#6B7280]">Séparateur de milliers et décimales</p>
            </div>
            <select className="h-9 bg-white border border-[#E5E7EB] rounded-lg px-3 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none cursor-pointer">
              <option>1 000 000 FCFA</option>
              <option>1,000,000 FCFA</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Notifications Tab                                                  */
/* ------------------------------------------------------------------ */

function NotificationsTab() {
  const [settings, setSettings] = useState({
    sms: true,
    cashAlerts: true,
    txConfirm: true,
    fraudAlerts: true,
    dailyReport: false,
    weeklyReport: true,
    emailNotif: false,
    pushNotif: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const notificationGroups = [
    {
      title: 'Alertes critiques',
      icon: ShieldAlert,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      items: [
        { key: 'fraudAlerts' as const, label: 'Alertes fraude', desc: 'Notification immédiate en cas de suspicion', icon: ShieldAlert },
        { key: 'cashAlerts' as const, label: 'Alertes de caisse', desc: 'Notification quand la caisse est basse', icon: Wallet },
      ],
    },
    {
      title: 'Transactions',
      icon: TrendingUp,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      items: [
        { key: 'txConfirm' as const, label: 'Confirmation de transaction', desc: 'SMS de confirmation après chaque opération', icon: CheckCircle2 },
        { key: 'sms' as const, label: 'Notifications SMS', desc: 'Alertes et OTP par SMS', icon: MessageSquare },
      ],
    },
    {
      title: 'Rapports',
      icon: FileBarChart,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      items: [
        { key: 'dailyReport' as const, label: 'Rapport quotidien', desc: 'Résumé journalier par SMS', icon: FileBarChart },
        { key: 'weeklyReport' as const, label: 'Rapport hebdomadaire', desc: 'Résumé de la semaine par email', icon: FileBarChart },
      ],
    },
    {
      title: 'Canaux',
      icon: Bell,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      items: [
        { key: 'emailNotif' as const, label: 'Notifications email', desc: 'Recevoir les notifications par email', icon: Mail },
        { key: 'pushNotif' as const, label: 'Notifications push', desc: 'Notifications push sur votre appareil', icon: Smartphone },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {notificationGroups.map((group) => {
        const GroupIcon = group.icon
        return (
          <div key={group.title} className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', group.iconBg)}>
                <GroupIcon className={cn('w-4 h-4', group.iconColor)} />
              </div>
              <h3 className="text-sm font-semibold text-[#111827]">{group.title}</h3>
            </div>
            <div className="space-y-3">
              {group.items.map((item) => {
                const ItemIcon = item.icon
                return (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-3">
                      <ItemIcon className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{item.label}</p>
                        <p className="text-xs text-[#6B7280]">{item.desc}</p>
                      </div>
                    </div>
                    <Toggle
                      enabled={settings[item.key]}
                      onToggle={() => toggleSetting(item.key)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Quiet hours */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-[#111827]">Heures silencieuses</h3>
        </div>
        <p className="text-sm text-[#6B7280] mb-4">Désactiver les notifications pendant certaines heures</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">De</span>
            <input
              type="time"
              defaultValue="22:00"
              className="h-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">À</span>
            <input
              type="time"
              defaultValue="07:00"
              className="h-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.success('Heures silencieuses enregistrées', { description: 'Vos préférences de notification ont été mises à jour' })}
            className="ml-auto inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Reusable Components                                                */
/* ------------------------------------------------------------------ */

function FormField({ icon: Icon, label, value, onChange, type = 'text' }: {
  icon: React.ElementType
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
      />
    </div>
  )
}

function SettingRow({ icon: Icon, iconBg, iconColor, title, description, enabled, onToggle, badge, badgeStyle }: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
  badge?: string
  badgeStyle?: string
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
      <div className="flex items-center gap-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-4 h-4', iconColor)} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[#111827]">{title}</p>
            {badge && (
              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', badgeStyle)}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280]">{description}</p>
        </div>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ParametresView() {
  const [activeTab, setActiveTab] = useState<TabKey>('profil')

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Paramètres</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">Configuration de votre compte</p>
      </div>

      {/* Horizontal tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-1.5">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-600' : 'text-[#9CA3AF]')} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'profil' && <ProfilTab />}
        {activeTab === 'securite' && <SecuriteTab />}
        {activeTab === 'confidentialite' && <ConfidentialiteTab />}
        {activeTab === 'langue' && <LangueTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  )
}
