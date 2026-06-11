'use client'

import React, { useState } from 'react'
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Wallet,
  Wrench,
  ShieldAlert,
  Check,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Filter,
  X,
  ChevronRight,
  ArrowRight,
  Inbox,
  BellRing,
  CircleAlert,
  Settings2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type NotifVariant = 'danger' | 'warning' | 'success' | 'info' | 'money' | 'maintenance'
type FilterTab = 'all' | 'unread' | 'alerts' | 'system'

interface Notification {
  id: string
  variant: NotifVariant
  title: string
  description: string
  time: string
  read: boolean
  detail: string
}

const variantConfig: Record<NotifVariant, {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  stripe: string
  badge: string
  badgeText: string
  label: string
  category: 'alerts' | 'system'
}> = {
  danger:      { icon: ShieldAlert,   iconBg: 'bg-rose-100',    iconColor: 'text-rose-600',    stripe: 'border-l-rose-500',    badge: 'bg-rose-100 text-rose-700', badgeText: 'Critique', label: 'Alerte', category: 'alerts' },
  warning:     { icon: AlertTriangle, iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',   stripe: 'border-l-amber-400',   badge: 'bg-amber-100 text-amber-700', badgeText: 'Attention', label: 'Attention', category: 'alerts' },
  success:     { icon: CheckCircle2,  iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',  stripe: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700', badgeText: 'Succès', label: 'Succès', category: 'system' },
  info:        { icon: Smartphone,    iconBg: 'bg-sky-100',     iconColor: 'text-sky-600',     stripe: 'border-l-sky-500',     badge: 'bg-sky-100 text-sky-700', badgeText: 'Info', label: 'Info', category: 'system' },
  money:       { icon: Wallet,        iconBg: 'bg-teal-100',    iconColor: 'text-teal-600',    stripe: 'border-l-teal-500',    badge: 'bg-teal-100 text-teal-700', badgeText: 'Finance', label: 'Finance', category: 'system' },
  maintenance: { icon: Wrench,        iconBg: 'bg-gray-100',    iconColor: 'text-gray-500',    stripe: 'border-l-gray-400',    badge: 'bg-gray-100 text-gray-600', badgeText: 'Maintenance', label: 'Maintenance', category: 'system' },
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    variant: 'danger',
    title: 'Alerte fraude détectée',
    description: 'Transaction suspecte détectée — Ref #TRF-4455',
    time: 'Il y a 5 min',
    read: false,
    detail: 'Une transaction suspecte a été détectée sur le compte client. Le montant de 4,500,000 FCFA a été bloqué automatiquement. Veuillez vérifier cette transaction immédiatement et contacter le support si nécessaire. Référence : TRF-4455. Date : 04 Mars 2025, 09:15.',
  },
  {
    id: '2',
    variant: 'warning',
    title: 'Caisse basse — Seuil minimum',
    description: 'Solde de caisse inférieur au seuil minimum',
    time: 'Il y a 30 min',
    read: false,
    detail: 'Le solde de votre caisse est actuellement de 25,000 FCFA, ce qui est inférieur au seuil minimum recommandé de 100,000 FCFA. Veuillez effectuer un approvisionnement dès que possible pour éviter toute interruption de service.',
  },
  {
    id: '3',
    variant: 'success',
    title: 'Transfert complété avec succès',
    description: 'Retrait #TRF-8472 effectué par Aminata Diallo',
    time: 'Il y a 1h',
    read: true,
    detail: 'Le retrait de 75,000 FCFA a été effectué avec succès par Aminata Diallo. Référence : TRF-8472. Commission agent : 750 FCFA. Le client a reçu une confirmation SMS.',
  },
  {
    id: '4',
    variant: 'info',
    title: 'OTP envoyé au client',
    description: 'Code OTP envoyé au +223 96 ** ** 33',
    time: 'Il y a 2h',
    read: true,
    detail: 'Un code OTP a été envoyé au numéro +223 96 ** ** 33 pour vérification d\'opération. Le code expire dans 5 minutes. Si le client n\'a pas reçu le code, vous pouvez le renvoyer.',
  },
  {
    id: '5',
    variant: 'money',
    title: 'Commission créditée',
    description: 'Commission de 750 FCFA créditée sur votre compte',
    time: 'Il y a 3h',
    read: true,
    detail: 'Une commission de 750 FCFA a été créditée sur votre compte agent suite à la transaction #TRF-8472. Votre solde de commissions cumulées s\'élève maintenant à 12,500 FCFA pour ce mois.',
  },
  {
    id: '6',
    variant: 'maintenance',
    title: 'Maintenance système planifiée',
    description: 'Maintenance système prévue demain 02h-04h',
    time: 'Hier',
    read: true,
    detail: 'Une maintenance système est planifiée demain entre 02h00 et 04h00. Pendant cette période, les services de transaction seront temporairement indisponibles. Veuillez informer vos clients et planifier vos opérations en conséquence.',
  },
  {
    id: '7',
    variant: 'warning',
    title: 'Limite journalière atteinte',
    description: 'Volume de transactions proche de la limite journalière',
    time: 'Hier',
    read: true,
    detail: 'Vous avez atteint 85% de votre limite journalière de transactions. Le montant restant autorisé est de 450,000 FCFA sur un plafond de 3,000,000 FCFA. Les transactions au-delà de cette limite seront bloquées jusqu\'à demain.',
  },
  {
    id: '8',
    variant: 'success',
    title: 'Vérification KYC réussie',
    description: 'Client Kofi Mensah — Niveau 2 validé',
    time: 'Hier',
    read: true,
    detail: 'La vérification KYC du client Kofi Mensah a été approuvée. Le client est maintenant au Niveau 2 — Vérifié. Il peut désormais effectuer des transactions jusqu\'à 2,000,000 FCFA par jour.',
  },
  {
    id: '9',
    variant: 'info',
    title: 'Nouvelle version disponible',
    description: 'Mise à jour v2.5.1 disponible avec améliorations',
    time: 'Il y a 2 jours',
    read: true,
    detail: 'Une nouvelle version de l\'application (v2.5.1) est disponible. Cette mise à jour inclut : amélioration des performances de transaction, correction du bug d\'impression des reçus, et nouvelle interface de recherche client.',
  },
  {
    id: '10',
    variant: 'money',
    title: 'Rapport hebdomadaire disponible',
    description: 'Rapport de la semaine 09 disponible pour consultation',
    time: 'Il y a 3 jours',
    read: true,
    detail: 'Le rapport hebdomadaire de la semaine 09 est maintenant disponible. Volume total : 15,200,000 FCFA. Commissions : 45,600 FCFA. Nombre de transactions : 152. Taux de succès : 99.2%.',
  },
]

/* ------------------------------------------------------------------ */
/*  Filter Tabs                                                        */
/* ------------------------------------------------------------------ */

const filterTabs: { key: FilterTab; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Toutes', icon: Inbox },
  { key: 'unread', label: 'Non lues', icon: BellRing },
  { key: 'alerts', label: 'Alertes', icon: CircleAlert },
  { key: 'system', label: 'Système', icon: Settings2 },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mutedIds, setMutedIds] = useState<Set<string>>(new Set())

  const unreadCount = notifications.filter((n) => !n.read).length
  const alertCount = notifications.filter((n) => variantConfig[n.variant].category === 'alerts').length

  const filteredNotifications = notifications.filter((n) => {
    // Filter by tab
    if (activeFilter === 'unread' && n.read) return false
    if (activeFilter === 'alerts' && variantConfig[n.variant].category !== 'alerts') return false
    if (activeFilter === 'system' && variantConfig[n.variant].category !== 'system') return false
    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
    }
    return true
  })

  const selectedNotif = notifications.find((n) => n.id === selectedId)

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const toggleMute = (id: string) => {
    setMutedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectNotif = (id: string) => {
    setSelectedId(id)
    // Auto-mark as read when selected
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Stats
  const dangerCount = notifications.filter((n) => n.variant === 'danger' && !n.read).length
  const warningCount = notifications.filter((n) => n.variant === 'warning' && !n.read).length
  const totalNotifs = notifications.length

  return (
    <div className="h-full w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Notifications</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Alertes et messages système</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            <span>Mis à jour : Maintenant</span>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Tout marquer lu
            </button>
          )}
        </div>
      </div>

      {/* Main content: 2-column layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
        {/* Left Column: Notification List */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          {/* Search + Filters */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une notification..."
                className="w-full h-10 pl-10 pr-10 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F3F4F6] rounded-lg">
              {filterTabs.map((tab) => {
                const Icon = tab.icon
                const count =
                  tab.key === 'all'
                    ? totalNotifs
                    : tab.key === 'unread'
                    ? unreadCount
                    : tab.key === 'alerts'
                    ? alertCount
                    : notifications.filter((n) => variantConfig[n.variant].category === 'system').length

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all',
                      activeFilter === tab.key
                        ? 'bg-white text-[#111827] shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111827]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          'min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1',
                          activeFilter === tab.key
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-[#E5E7EB] text-[#6B7280]'
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col min-h-0">
            {/* List Header */}
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#6B7280]" />
                <span className="text-sm font-medium text-[#111827]">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#9CA3AF]" />
                <span className="text-xs text-[#9CA3AF]">
                  {activeFilter === 'all' ? 'Toutes' : activeFilter === 'unread' ? 'Non lues' : activeFilter === 'alerts' ? 'Alertes' : 'Système'}
                </span>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                    <Bell className="w-7 h-7 text-[#9CA3AF]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#111827]">Aucune notification</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {searchQuery ? 'Essayez une autre recherche' : 'Vous êtes à jour !'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {filteredNotifications.map((notif) => {
                    const config = variantConfig[notif.variant]
                    const Icon = config.icon
                    const isSelected = selectedId === notif.id
                    const isMuted = mutedIds.has(notif.id)

                    return (
                      <div
                        key={notif.id}
                        onClick={() => selectNotif(notif.id)}
                        className={cn(
                          'relative px-4 py-3.5 cursor-pointer transition-all group border-l-4',
                          config.stripe,
                          isSelected
                            ? 'bg-emerald-50/60'
                            : !notif.read
                            ? 'bg-white hover:bg-[#F9FAFB]'
                            : 'bg-[#FAFAFA] hover:bg-[#F3F4F6]',
                          !notif.read && !isSelected && 'bg-white',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                              config.iconBg
                            )}
                          >
                            <Icon className={cn('w-5 h-5', config.iconColor)} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  'text-sm truncate flex-1',
                                  !notif.read
                                    ? 'font-semibold text-[#111827]'
                                    : 'font-medium text-[#6B7280]'
                                )}
                              >
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100" />
                              )}
                              {isMuted && (
                                <VolumeX className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                              )}
                            </div>
                            <p className={cn(
                              'text-sm mt-0.5 truncate',
                              !notif.read ? 'text-[#374151]' : 'text-[#9CA3AF]'
                            )}>
                              {notif.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notif.time}
                              </span>
                              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', config.badge)}>
                                {config.badgeText}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); markRead(notif.id) }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827] transition-colors"
                              title={notif.read ? 'Marquer non lu' : 'Marquer lu'}
                            >
                              {notif.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id) }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <ChevronRight className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detail + Stats */}
        <div className="lg:col-span-2 flex flex-col gap-5 min-h-0 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <BellRing className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                {unreadCount > 0 && (
                  <span className="min-w-[22px] h-[22px] rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Non lues</p>
                <p className="text-lg font-bold text-[#111827]">{unreadCount}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                  <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
                </div>
                {dangerCount > 0 && (
                  <span className="min-w-[22px] h-[22px] rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {dangerCount}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Critiques</p>
                <p className="text-lg font-bold text-[#111827]">{dangerCount}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
                </div>
                {warningCount > 0 && (
                  <span className="min-w-[22px] h-[22px] rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {warningCount}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Avertissements</p>
                <p className="text-lg font-bold text-[#111827]">{warningCount}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Inbox className="w-4.5 h-4.5 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Total</p>
                <p className="text-lg font-bold text-[#111827]">{totalNotifs}</p>
              </div>
            </div>
          </div>

          {/* Notification Detail Panel */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
            {selectedNotif ? (
              <>
                {/* Detail Header */}
                <div className={cn('px-5 py-4 border-b border-[#E5E7EB]', variantConfig[selectedNotif.variant].iconBg)}>
                  <div className="flex items-start gap-3">
                    {(() => {
                      const config = variantConfig[selectedNotif.variant]
                      const Icon = config.icon
                      return (
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/80 shadow-sm')}>
                          <Icon className={cn('w-6 h-6', config.iconColor)} />
                        </div>
                      )
                    })()}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-[#111827]">{selectedNotif.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', variantConfig[selectedNotif.variant].badge)}>
                          {variantConfig[selectedNotif.variant].badgeText}
                        </span>
                        <span className="text-xs text-[#6B7280] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {selectedNotif.time}
                        </span>
                        {selectedNotif.read ? (
                          <span className="text-[10px] font-medium text-[#9CA3AF] flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Lu
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            Non lu
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Résumé</p>
                      <p className="text-sm text-[#374151] leading-relaxed">{selectedNotif.description}</p>
                    </div>

                    {/* Full Detail */}
                    <div>
                      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Détails</p>
                      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                        <p className="text-sm text-[#374151] leading-relaxed">{selectedNotif.detail}</p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Informations</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">Type</span>
                          <span className="font-medium text-[#111827]">{variantConfig[selectedNotif.variant].label}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">Catégorie</span>
                          <span className="font-medium text-[#111827]">
                            {variantConfig[selectedNotif.variant].category === 'alerts' ? 'Alerte' : 'Système'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">Statut</span>
                          <span className={cn(
                            'font-medium',
                            selectedNotif.read ? 'text-[#6B7280]' : 'text-emerald-600'
                          )}>
                            {selectedNotif.read ? 'Lu' : 'Non lu'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">Silencieux</span>
                          <span className="font-medium text-[#111827]">
                            {mutedIds.has(selectedNotif.id) ? 'Oui' : 'Non'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Actions */}
                <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markRead(selectedNotif.id)}
                      className="flex-1 h-9 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-[#F3F4F6] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      {selectedNotif.read ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Marquer non lu
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Marquer lu
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => toggleMute(selectedNotif.id)}
                      className="flex-1 h-9 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-[#F3F4F6] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      {mutedIds.has(selectedNotif.id) ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          Réactiver
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          Silencieux
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteNotif(selectedNotif.id)}
                      className="h-9 px-3 rounded-lg border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600 hover:bg-rose-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-20 h-20 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
                  <Bell className="w-9 h-9 text-[#9CA3AF]" />
                </div>
                <div className="text-center max-w-[200px]">
                  <p className="text-sm font-semibold text-[#111827]">Sélectionnez une notification</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Cliquez sur une notification pour voir ses détails
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Cliquez dans la liste</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
