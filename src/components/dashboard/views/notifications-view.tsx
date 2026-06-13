'use client'

import { useState } from 'react'
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Map,
  CreditCard,
  Car,
  Shield,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NotifType = 'alerte' | 'info' | 'succès' | 'rappel'
type NotifCategory = 'course' | 'paiement' | 'chauffeur' | 'kyc' | 'système'

const notifTypeStyle: Record<NotifType, { bg: string; text: string; icon: React.ElementType; iconColor: string }> = {
  'alerte': { bg: 'bg-rose-50', text: 'text-rose-700', icon: AlertTriangle, iconColor: 'text-rose-500' },
  'info':   { bg: 'bg-sky-50',  text: 'text-sky-700',  icon: Info,           iconColor: 'text-sky-500' },
  'succès': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  'rappel': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock, iconColor: 'text-amber-500' },
}

const categoryIcon: Record<NotifCategory, React.ElementType> = {
  'course': Map,
  'paiement': CreditCard,
  'chauffeur': Car,
  'kyc': Shield,
  'système': FileText,
}

const mockNotifications = [
  { id: '1', type: 'alerte' as NotifType, category: 'kyc' as NotifCategory, title: 'Chauffeur en attente de validation', message: 'Le chauffeur Oumar Dembélé a soumis ses documents KYC pour validation.', time: 'Il y a 2h', read: false },
  { id: '2', type: 'alerte' as NotifType, category: 'course' as NotifCategory, title: 'Course annulée', message: 'La course CRS-2025-0234 a été annulée par le passager. Remboursement en attente.', time: 'Il y a 3h', read: false },
  { id: '3', type: 'alerte' as NotifType, category: 'paiement' as NotifCategory, title: 'Paiement échoué', message: 'Le paiement Mobile Money de 3 200 FCFA pour la course CRS-2025-0231 a échoué.', time: 'Il y a 5h', read: false },
  { id: '4', type: 'succès' as NotifType, category: 'course' as NotifCategory, title: 'Course terminée', message: 'La course CRS-2025-0229 a été complétée avec succès. Note passager: 5/5.', time: 'Hier 16:30', read: true },
  { id: '5', type: 'info' as NotifType, category: 'chauffeur' as NotifCategory, title: 'Nouveau passager inscrit', message: 'Fatoumata Traoré s\'est inscrit sur la plateforme BestTrans.', time: 'Hier 14:00', read: true },
  { id: '6', type: 'rappel' as NotifType, category: 'kyc' as NotifCategory, title: 'Document KYC rejeté', message: 'Le permis de conduire de Ibrahim Keita a été rejeté. Mot: Photo illisible.', time: 'Hier 09:00', read: true },
  { id: '7', type: 'succès' as NotifType, category: 'paiement' as NotifCategory, title: 'Paiement reçu', message: 'Versement de 1 200 000 FCFA effectué vers le compte du chauffeur Amadou Coulibaly.', time: '05/03/2026', read: true },
  { id: '8', type: 'info' as NotifType, category: 'système' as NotifCategory, title: 'Sauvegarde effectuée', message: 'La sauvegarde quotidienne des données a été effectuée avec succès.', time: '05/03/2026', read: true },
  { id: '9', type: 'alerte' as NotifType, category: 'chauffeur' as NotifCategory, title: 'Paiement en retard', message: 'Le chauffeur Moussa Keita a un solde en attente de 450 000 FCFA depuis 7 jours.', time: '04/03/2026', read: true },
  { id: '10', type: 'rappel' as NotifType, category: 'course' as NotifCategory, title: 'Ticket support escaladé', message: 'Le ticket TK-2025-0087 a été escaladé par l\'agent Ibrahim Sidibé.', time: '04/03/2026', read: true },
]

export function NotificationsView() {
  const [filterType, setFilterType] = useState<string>('all')
  const [notifications, setNotifications] = useState(mockNotifications)

  const filtered = notifications.filter((n) => filterType === 'all' || n.type === filterType)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#111827]">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
            <p className="text-xs text-[#6B7280]">{notifications.length} notification{notifications.length > 1 ? 's' : ''} au total</p>
          </div>
        </div>
        <button
          onClick={markAllRead}
          className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          Tout marquer comme lu
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'alerte', 'rappel', 'info', 'succès'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border',
              filterType === type
                ? 'border-orange-300 bg-orange-50 text-orange-700'
                : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
            )}
          >
            {type === 'all' ? 'Toutes' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {filtered.map((notif) => {
            const sty = notifTypeStyle[notif.type]
            const TypeIcon = sty.icon
            const CatIcon = categoryIcon[notif.category]
            return (
              <div
                key={notif.id}
                className={cn(
                  'bg-white border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer',
                  notif.read ? 'border-[#E5E7EB]' : 'border-orange-200 bg-orange-50/30'
                )}
              >
                <div className="flex gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', sty.bg)}>
                    <TypeIcon className={cn('w-5 h-5', sty.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={cn('text-sm font-semibold', notif.read ? 'text-[#374151]' : 'text-[#111827]')}>
                        {!notif.read && <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2" />}
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-[#9CA3AF] shrink-0 ml-2">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#6B7280] mb-2">{notif.message}</p>
                    <div className="flex items-center gap-1.5">
                      <CatIcon className="w-3 h-3 text-[#9CA3AF]" />
                      <span className="text-[10px] font-medium text-[#9CA3AF] uppercase">{notif.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
