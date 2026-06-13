'use client'

import { useState } from 'react'
import {
  Bell, BellRing, AlertTriangle, CheckCircle2, Clock, Info,
  Map, CreditCard, Car, Shield, FileText, Send, Users, User,
  Trash2, Eye, EyeOff, Megaphone, Zap, MailCheck, Settings2,
  ArrowRight, ChevronDown, ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import type { ViewKey } from '@/components/dashboard/navigation'

/* ─────────────────────────── types ─────────────────────────── */

type NotifType     = 'alerte' | 'info' | 'succès' | 'rappel'
type NotifCategory = 'course' | 'paiement' | 'chauffeur' | 'kyc' | 'système'
type NotifTarget   = 'tous' | 'passagers' | 'chauffeurs'
type NotifPriority = 'normale' | 'haute' | 'urgente'

interface Notification {
  id: string
  type: NotifType
  category: NotifCategory
  target: NotifTarget
  priority: NotifPriority
  title: string
  message: string
  time: string
  read: boolean
}

interface SentBroadcast {
  id: string
  title: string
  target: NotifTarget
  type: NotifType
  priority: NotifPriority
  message: string
  time: string
  reach: number
}

/* ─────────────────────────── config ─────────────────────────── */

const TYPE_CFG: Record<NotifType, {
  bg: string; text: string; border: string; bar: string; label: string
  icon: React.ElementType; iconColor: string
}> = {
  alerte: { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    bar: 'bg-rose-500',    label: 'Alerte',  icon: AlertTriangle, iconColor: 'text-rose-500'    },
  info:   { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     bar: 'bg-sky-400',     label: 'Info',    icon: Info,          iconColor: 'text-sky-500'     },
  succès: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500', label: 'Succès',  icon: CheckCircle2,  iconColor: 'text-emerald-500' },
  rappel: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   bar: 'bg-amber-400',   label: 'Rappel',  icon: Clock,         iconColor: 'text-amber-500'   },
}

const PRIORITY_BORDER: Record<NotifPriority, string> = {
  urgente: 'border-l-rose-500',
  haute:   'border-l-amber-400',
  normale: 'border-l-[#E5E7EB]',
}

const PRIORITY_LABEL: Record<NotifPriority, string> = {
  urgente: 'Urgente', haute: 'Haute', normale: 'Normale',
}

const CAT_CFG: Record<NotifCategory, { icon: React.ElementType; label: string; action: ViewKey | null }> = {
  kyc:      { icon: Shield,     label: 'KYC',         action: 'kyc-validation' },
  chauffeur:{ icon: Car,        label: 'Chauffeur',   action: 'chauffeurs'     },
  course:   { icon: Map,        label: 'Course',      action: 'courses'        },
  paiement: { icon: CreditCard, label: 'Paiement',    action: 'transactions'   },
  système:  { icon: FileText,   label: 'Système',     action: null             },
}

const CAT_ACTION_LABEL: Record<NotifCategory, string> = {
  kyc:      'Voir KYC',
  chauffeur:'Chauffeurs',
  course:   'Voir courses',
  paiement: 'Transactions',
  système:  '',
}

const TARGET_CFG: Record<NotifTarget, { icon: React.ElementType; label: string; count: number }> = {
  tous:       { icon: Users, label: 'Tous les utilisateurs', count: 1327 },
  passagers:  { icon: User,  label: 'Passagers',             count: 1240 },
  chauffeurs: { icon: Car,   label: 'Chauffeurs actifs',     count: 87   },
}

/* ─────────────────────────── seed data ─────────────────────────── */

const SEED: Notification[] = [
  {
    id: '1', type: 'alerte', category: 'paiement', target: 'passagers', priority: 'urgente',
    title: 'Paiement Mobile Money échoué × 3',
    message: '3 paiements consécutifs ont échoué pour Fatoumata Diallo (solde insuffisant). La course CRS-0234 a été annulée automatiquement. Remboursement à traiter.',
    time: 'Il y a 5 min', read: false,
  },
  {
    id: '2', type: 'alerte', category: 'kyc', target: 'chauffeurs', priority: 'urgente',
    title: 'Documents KYC expirés — 4 chauffeurs',
    message: 'Oumar Dembélé, Moussa Keïta, Seydou Coulibaly et Issa Traoré ont des documents expirés depuis plus de 30 jours. Ces comptes sont bloqués.',
    time: 'Il y a 12 min', read: false,
  },
  {
    id: '3', type: 'alerte', category: 'chauffeur', target: 'tous', priority: 'haute',
    title: 'Validation KYC en attente — 48h',
    message: 'Adama Traoré a soumis tous ses documents il y a 48h. La validation est toujours en attente. Il n\'a pas pu démarrer son activité.',
    time: 'Il y a 1h', read: false,
  },
  {
    id: '4', type: 'rappel', category: 'course', target: 'passagers', priority: 'haute',
    title: 'Remboursement en attente — CRS-0231',
    message: 'La course CRS-2025-0231 (3 200 FCFA) a été annulée par le chauffeur il y a 3h. Le remboursement passager doit être validé manuellement.',
    time: 'Il y a 3h', read: false,
  },
  {
    id: '5', type: 'alerte', category: 'système', target: 'tous', priority: 'haute',
    title: '5 tickets support sans réponse depuis 24h',
    message: 'Ibrahim Keïta (TK-089), Mariam Sissoko (TK-091), et 3 autres attendent depuis plus de 24h. Délai de réponse dépassé.',
    time: 'Il y a 4h', read: false,
  },
  {
    id: '6', type: 'info', category: 'chauffeur', target: 'tous', priority: 'normale',
    title: 'Nouveau chauffeur inscrit',
    message: 'Boubacar Sanogo (tél. +223 76 00 11 22) a complété son inscription et attend la validation de ses documents KYC.',
    time: 'Il y a 5h', read: false,
  },
  {
    id: '7', type: 'succès', category: 'paiement', target: 'chauffeurs', priority: 'normale',
    title: 'Versements mensuels effectués',
    message: '87 versements traités avec succès pour un total de 4 250 000 FCFA. Tous les chauffeurs actifs ont été crédités.',
    time: 'Hier 17:00', read: true,
  },
  {
    id: '8', type: 'succès', category: 'kyc', target: 'chauffeurs', priority: 'normale',
    title: 'KYC validé — Amadou Coulibaly',
    message: 'Les documents d\'Amadou Coulibaly ont été validés avec succès. Le compte chauffeur est maintenant actif.',
    time: 'Hier 14:30', read: true,
  },
  {
    id: '9', type: 'info', category: 'course', target: 'tous', priority: 'normale',
    title: 'Pic d\'activité — record du mois',
    message: '342 courses complétées entre 07h et 09h ce matin. Le record mensuel précédent était de 298 courses sur cette tranche horaire.',
    time: 'Hier 09:15', read: true,
  },
  {
    id: '10', type: 'info', category: 'système', target: 'tous', priority: 'normale',
    title: 'Sauvegarde automatique réussie',
    message: 'La sauvegarde quotidienne des données a été effectuée avec succès. 2,4 Go archivés. Prochain archivage demain à 02h00.',
    time: 'Hier 02:00', read: true,
  },
]

const SENT_SEED: SentBroadcast[] = [
  {
    id: 's1', title: 'Maintenance planifiée dimanche soir',
    target: 'tous', type: 'rappel', priority: 'haute',
    message: 'BestTrans sera indisponible le dimanche 08 juin de 02h à 04h du matin pour maintenance. Planifiez vos courses en conséquence.',
    time: '03/06/2026', reach: 1327,
  },
  {
    id: 's2', title: 'Mise à jour obligatoire de l\'application',
    target: 'chauffeurs', type: 'alerte', priority: 'urgente',
    message: 'Une mise à jour de sécurité est disponible. Elle est obligatoire avant le 07/06 pour continuer à recevoir des courses.',
    time: '01/06/2026', reach: 87,
  },
  {
    id: 's3', title: 'Offre spéciale — Weekend -20%',
    target: 'passagers', type: 'info', priority: 'normale',
    message: 'Profitez de 20% de réduction sur toutes vos courses ce samedi et dimanche avec le code WEEKEND20.',
    time: '30/05/2026', reach: 1240,
  },
]

/* ─────────────────────────── components ─────────────────────────── */

function NotifCard({
  notif,
  onRead,
  onDelete,
  onAction,
}: {
  notif: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
  onAction: (view: ViewKey) => void
}) {
  const tc  = TYPE_CFG[notif.type]
  const cc  = CAT_CFG[notif.category]
  const Icon = tc.icon
  const CatIcon = cc.icon
  const isUrgente = notif.priority === 'urgente'
  const isHaute   = notif.priority === 'haute'

  return (
    <div
      onClick={() => onRead(notif.id)}
      className={cn(
        'group relative bg-white border border-l-4 rounded-xl p-4 cursor-pointer transition-all',
        'hover:shadow-md hover:border-r-orange-100',
        PRIORITY_BORDER[notif.priority],
        !notif.read ? 'border-t-[#E5E7EB] border-b-[#E5E7EB] border-r-[#E5E7EB]' : 'border-t-[#F3F4F6] border-b-[#F3F4F6] border-r-[#F3F4F6] opacity-80',
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          tc.bg,
        )}>
          <Icon className={cn('w-5 h-5', tc.iconColor)} />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              )}
              <p className={cn(
                'text-sm leading-snug',
                !notif.read ? 'font-bold text-[#111827]' : 'font-semibold text-[#6B7280]',
              )}>
                {notif.title}
              </p>
            </div>
            <span className="text-[11px] text-[#9CA3AF] shrink-0 whitespace-nowrap">{notif.time}</span>
          </div>

          {/* Message */}
          <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 mb-3">
            {notif.message}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category chip */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[10px] font-semibold text-[#6B7280]">
              <CatIcon className="w-3 h-3" />{cc.label}
            </span>

            {/* Priority chip — only if not normale */}
            {(isUrgente || isHaute) && (
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border',
                isUrgente
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200',
              )}>
                <Zap className="w-3 h-3" />{PRIORITY_LABEL[notif.priority]}
              </span>
            )}

            {/* Action button */}
            {cc.action && (
              <button
                onClick={e => { e.stopPropagation(); onAction(cc.action!) }}
                className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
              >
                {CAT_ACTION_LABEL[notif.category]}
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(notif.id) }}
          className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-50 text-[#D1D5DB] hover:text-rose-500 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────── main ─────────────────────────── */

export function NotificationsView() {
  const { navigateTo } = useDashboard()

  /* inbox state */
  const [notifs, setNotifs]           = useState<Notification[]>(SEED)
  const [filterType, setFilterType]   = useState<'toutes' | NotifType>('toutes')
  const [showRead, setShowRead]       = useState(true)

  /* compose state */
  const [sent, setSent]               = useState<SentBroadcast[]>(SENT_SEED)
  const [compTarget, setCompTarget]   = useState<NotifTarget>('tous')
  const [compType, setCompType]       = useState<NotifType>('info')
  const [compPriority, setCompPriority] = useState<NotifPriority>('normale')
  const [compCategory, setCompCategory] = useState<NotifCategory>('système')
  const [compTitle, setCompTitle]     = useState('')
  const [compMessage, setCompMessage] = useState('')
  const [sending, setSending]         = useState(false)

  /* settings state */
  const [settings, setSettings] = useState({
    emailAdmin: true, smsAdmin: false, rapportHebdo: true, resumeQuotidien: false,
    pushPassagers: true, pushChauffeurs: true, alerteKyc: true, alertePaiement: true,
  })

  /* derived */
  const unread    = notifs.filter(n => !n.read).length
  const urgentes  = notifs.filter(n => !n.read && n.priority === 'urgente').length

  const filterFn = (n: Notification) =>
    filterType === 'toutes' || n.type === filterType

  const unreadList = notifs.filter(n => !n.read && filterFn(n))
  const readList   = notifs.filter(n =>  n.read && filterFn(n))

  /* handlers */
  const markRead    = (id: string) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, read: true })))
  const deleteNotif = (id: string) => setNotifs(p => p.filter(n => n.id !== id))

  const handleAction = (view: ViewKey) => navigateTo(view)

  const canSend = compTitle.trim().length > 0 && compMessage.trim().length > 0

  const handleSend = () => {
    if (!canSend) { toast.error('Titre et message requis.'); return }
    setSending(true)
    setTimeout(() => {
      const broadcast: SentBroadcast = {
        id: Date.now().toString(),
        title: compTitle, message: compMessage,
        target: compTarget, type: compType, priority: compPriority,
        time: 'À l\'instant', reach: TARGET_CFG[compTarget].count,
      }
      // add to inbox as received notification
      const incoming: Notification = {
        id: `n${Date.now()}`, type: compType, category: compCategory,
        target: compTarget, priority: compPriority,
        title: compTitle, message: compMessage,
        time: 'À l\'instant', read: false,
      }
      setSent(p => [broadcast, ...p])
      setNotifs(p => [incoming, ...p])
      setCompTitle(''); setCompMessage('')
      setSending(false)
      toast.success('Notification envoyée', {
        description: `${TARGET_CFG[compTarget].count.toLocaleString('fr-FR')} destinataires atteints.`,
      })
    }, 900)
  }

  const toggleSetting = (key: keyof typeof settings) =>
    setSettings(s => ({ ...s, [key]: !s[key] }))

  /* type filter tabs */
  const TYPE_FILTERS: Array<{ key: 'toutes' | NotifType; label: string }> = [
    { key: 'toutes',  label: 'Toutes' },
    { key: 'alerte',  label: 'Alertes' },
    { key: 'rappel',  label: 'Rappels' },
    { key: 'info',    label: 'Infos' },
    { key: 'succès',  label: 'Succès' },
  ]

  const tc = TYPE_CFG[compType]
  const CompIcon = tc.icon

  /* ──────────── render ──────────── */
  return (
    <div className="flex flex-col gap-5 pb-10">

      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center">
            <BellRing className="w-5 h-5 text-orange-600" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center px-1">
                {unread}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-[#111827]">Notifications</h1>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Centre de communication BestTrans</p>
          </div>
        </div>

        {/* KPIs inline */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#374151]">
            <Bell className="w-3.5 h-3.5 text-[#9CA3AF]" />{notifs.length} total
          </div>
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
            unread > 0 ? 'bg-orange-50 text-orange-700' : 'bg-[#F3F4F6] text-[#9CA3AF]',
          )}>
            <EyeOff className="w-3.5 h-3.5" />{unread} non lues
          </div>
          {urgentes > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-xs font-bold text-rose-700 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />{urgentes} urgente{urgentes > 1 ? 's' : ''}
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
            <Megaphone className="w-3.5 h-3.5" />{sent.length} diffusées
          </div>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <Tabs defaultValue="inbox" className="flex flex-col gap-0">

        <TabsList className="bg-white border border-[#E5E7EB] rounded-2xl p-1.5 grid grid-cols-3 gap-1 h-auto w-full">
          <TabsTrigger
            value="inbox"
            className="relative flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#6B7280] rounded-xl
              data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Boîte de réception</span>
            {unread > 0 && (
              <span className="min-w-[20px] h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center px-1
                data-[state=active]:hidden">
                {unread}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="diffuser"
            className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#6B7280] rounded-xl
              data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Diffuser</span>
          </TabsTrigger>

          <TabsTrigger
            value="parametres"
            className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#6B7280] rounded-xl
              data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Settings2 className="w-4 h-4 shrink-0" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════
            TAB 1 — BOÎTE DE RÉCEPTION
        ══════════════════════════════════ */}
        <TabsContent value="inbox" className="mt-5">
          <div className="flex flex-col gap-4">

            {/* Urgent banner */}
            {urgentes > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-600 text-white shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black">
                    {urgentes} alerte{urgentes > 1 ? 's urgentes nécessitent' : ' urgente nécessite'} votre attention immédiate
                  </p>
                  <p className="text-[11px] text-rose-200 mt-0.5">Traitez ces alertes en priorité avant de continuer.</p>
                </div>
              </div>
            )}

            {/* Filter + actions bar */}
            <div className="flex flex-wrap items-center gap-2">
              {TYPE_FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                    filterType === f.key
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-orange-200 hover:text-orange-600',
                  )}
                >
                  {f.key !== 'toutes' && (
                    <span className={cn('w-1.5 h-1.5 rounded-full', TYPE_CFG[f.key].bar)} />
                  )}
                  {f.label}
                </button>
              ))}
              <button
                onClick={markAllRead}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6B7280] border border-[#E5E7EB] rounded-lg bg-white hover:border-orange-200 hover:text-orange-600 transition-all"
              >
                <MailCheck className="w-3.5 h-3.5" />Tout marquer lu
              </button>
            </div>

            {/* Unread section */}
            {unreadList.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest px-1">
                  Nouvelles — {unreadList.length}
                </p>
                {unreadList.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={markRead} onDelete={deleteNotif} onAction={handleAction} />
                ))}
              </div>
            )}

            {/* Read section */}
            {readList.length > 0 && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowRead(v => !v)}
                  className="flex items-center gap-2 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest px-1 hover:text-[#6B7280] transition-colors"
                >
                  {showRead ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Déjà lues — {readList.length}
                </button>
                {showRead && readList.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={markRead} onDelete={deleteNotif} onAction={handleAction} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {unreadList.length === 0 && readList.length === 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl py-16 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] flex items-center justify-center">
                  <Bell className="w-7 h-7 text-[#E5E7EB]" />
                </div>
                <p className="text-sm font-semibold text-[#374151]">Aucune notification</p>
                <p className="text-xs text-[#9CA3AF]">Aucun résultat pour ce filtre.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ══════════════════════════════════
            TAB 2 — DIFFUSER
        ══════════════════════════════════ */}
        <TabsContent value="diffuser" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ─── Compose form ─── */}
            <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Nouvelle diffusion</p>
                    <p className="text-[11px] text-orange-100">Envoyez un message à vos utilisateurs</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">

                {/* 1. Destinataires */}
                <div>
                  <Label>Destinataires</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['tous', 'passagers', 'chauffeurs'] as NotifTarget[]).map(t => {
                      const cfg = TARGET_CFG[t]; const Ic = cfg.icon; const on = compTarget === t
                      return (
                        <button key={t} onClick={() => setCompTarget(t)}
                          className={cn(
                            'flex flex-col items-center gap-2 py-4 rounded-xl border text-center transition-all',
                            on ? 'bg-orange-50 border-orange-400 shadow-sm' : 'border-[#E5E7EB] hover:border-orange-200',
                          )}
                        >
                          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', on ? 'bg-orange-100' : 'bg-[#F3F4F6]')}>
                            <Ic className={cn('w-4 h-4', on ? 'text-orange-600' : 'text-[#9CA3AF]')} />
                          </div>
                          <p className={cn('text-xs font-bold leading-none', on ? 'text-orange-700' : 'text-[#374151]')}>{cfg.label}</p>
                          <p className={cn('text-[10px] font-bold', on ? 'text-orange-500' : 'text-[#9CA3AF]')}>
                            {cfg.count.toLocaleString('fr-FR')} pers.
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Type + Priorité */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <div className="flex flex-col gap-1.5">
                      {(['info', 'succès', 'rappel', 'alerte'] as NotifType[]).map(t => {
                        const s = TYPE_CFG[t]; const Ic = s.icon; const on = compType === t
                        return (
                          <button key={t} onClick={() => setCompType(t)}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left',
                              on ? cn(s.bg, s.text, s.border) : 'border-[#F3F4F6] text-[#6B7280] hover:bg-[#FAFAFA]',
                            )}
                          >
                            <Ic className={cn('w-4 h-4 shrink-0', on ? s.iconColor : 'text-[#D1D5DB]')} />
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Priorité</Label>
                    <div className="flex flex-col gap-1.5">
                      {([
                        { v: 'normale' as NotifPriority, label: 'Normale',  cls: 'bg-[#F9FAFB] text-[#374151] border-[#E5E7EB]', on: 'bg-[#F3F4F6] text-[#111827] border-[#9CA3AF]' },
                        { v: 'haute'   as NotifPriority, label: 'Haute',    cls: 'bg-amber-50  text-amber-600  border-amber-100',  on: 'bg-amber-100  text-amber-800  border-amber-300'  },
                        { v: 'urgente' as NotifPriority, label: 'Urgente',  cls: 'bg-rose-50   text-rose-600   border-rose-100',   on: 'bg-rose-100   text-rose-800   border-rose-300'   },
                      ]).map(({ v, label, cls, on }) => (
                        <button key={v} onClick={() => setCompPriority(v)}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all',
                            compPriority === v ? on : cls,
                          )}
                        >
                          <Zap className="w-3.5 h-3.5 shrink-0" />
                          {label}
                          {compPriority === v && <span className="ml-auto w-2 h-2 rounded-full bg-current opacity-60" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Catégorie */}
                <div>
                  <Label>Catégorie</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['système', 'course', 'paiement', 'chauffeur', 'kyc'] as NotifCategory[]).map(c => {
                      const cfg = CAT_CFG[c]; const Ic = cfg.icon; const on = compCategory === c
                      return (
                        <button key={c} onClick={() => setCompCategory(c)}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all',
                            on ? 'bg-orange-50 text-orange-700 border-orange-300' : 'border-[#E5E7EB] text-[#6B7280] hover:border-orange-200',
                          )}
                        >
                          <Ic className={cn('w-3.5 h-3.5', on ? 'text-orange-500' : 'text-[#C4C9D4]')} />
                          {cfg.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 4. Titre */}
                <div>
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Titre <span className="font-normal normal-case text-rose-400">Requis</span>
                  </label>
                  <input
                    type="text" value={compTitle} onChange={e => setCompTitle(e.target.value)}
                    placeholder="Ex: Maintenance prévue dimanche soir…"
                    maxLength={80}
                    className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-[#D1D5DB] transition-all"
                  />
                  <p className="text-[10px] text-[#D1D5DB] text-right mt-1">{compTitle.length}/80</p>
                </div>

                {/* 5. Message */}
                <div>
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Message <span className="font-normal normal-case text-rose-400">Requis</span>
                  </label>
                  <textarea
                    value={compMessage} onChange={e => setCompMessage(e.target.value)}
                    placeholder="Rédigez votre message…"
                    rows={4} maxLength={280}
                    className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none placeholder:text-[#D1D5DB] transition-all"
                  />
                  <p className="text-[10px] text-[#D1D5DB] text-right mt-1">{compMessage.length}/280</p>
                </div>

                {/* Send */}
                <button
                  onClick={handleSend} disabled={!canSend || sending}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-xl transition-all',
                    canSend && !sending
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                      : 'bg-[#F3F4F6] text-[#D1D5DB] cursor-not-allowed',
                  )}
                >
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi…</>
                  ) : (
                    <><Send className="w-4 h-4" />Envoyer à {TARGET_CFG[compTarget].count.toLocaleString('fr-FR')} utilisateurs</>
                  )}
                </button>
              </div>
            </div>

            {/* ─── Preview + sent history ─── */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* Live preview */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-orange-600" />
                  <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Aperçu</p>
                </div>
                {canSend ? (
                  <div className={cn('border border-l-4 rounded-xl p-4', tc.border, PRIORITY_BORDER[compPriority])}>
                    <div className="flex gap-3">
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', tc.bg)}>
                        <CompIcon className={cn('w-4 h-4', tc.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <p className="text-sm font-bold text-[#111827] leading-snug">{compTitle}</p>
                          <span className="text-[10px] text-[#9CA3AF] shrink-0">Maintenant</span>
                        </div>
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">{compMessage}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full border border-violet-100">
                            {TARGET_CFG[compTarget].count.toLocaleString('fr-FR')} pers.
                          </span>
                          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full border', tc.bg, tc.text, tc.border)}>
                            {tc.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#F3F4F6] rounded-xl py-10 flex flex-col items-center gap-2">
                    <Bell className="w-7 h-7 text-[#E5E7EB]" />
                    <p className="text-xs text-[#C4C9D4] text-center">Remplissez le titre et<br />le message pour prévisualiser</p>
                  </div>
                )}
              </div>

              {/* Recent broadcasts */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#F3F4F6] flex items-center justify-between">
                  <p className="text-xs font-bold text-[#374151]">Derniers envois</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">{sent.length}</span>
                </div>
                {sent.length === 0 ? (
                  <div className="py-8 flex flex-col items-center gap-2">
                    <Megaphone className="w-7 h-7 text-[#E5E7EB]" />
                    <p className="text-xs text-[#9CA3AF]">Aucun envoi récent.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F9FAFB]">
                    {sent.slice(0, 5).map(s => {
                      const st = TYPE_CFG[s.type]; const StIc = st.icon; const tgt = TARGET_CFG[s.target]
                      return (
                        <div key={s.id} className="px-5 py-3.5 flex items-start gap-3">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', st.bg)}>
                            <StIc className={cn('w-3.5 h-3.5', st.iconColor)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#111827] truncate">{s.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-[#9CA3AF]">{s.time}</span>
                              <span className="text-[10px] text-violet-600 font-semibold">
                                {s.reach.toLocaleString('fr-FR')} dest.
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════
            TAB 3 — PARAMÈTRES
        ══════════════════════════════════ */}
        <TabsContent value="parametres" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Admin reception */}
            <SettingSection
              icon={Bell} iconBg="bg-orange-50" iconColor="text-orange-600"
              title="Réception admin" desc="Comment vous souhaitez être notifié"
            >
              {([
                { key: 'emailAdmin',     label: 'Alertes par email',      desc: 'Recevez les alertes importantes par email' },
                { key: 'smsAdmin',       label: 'Alertes SMS',            desc: 'SMS pour les alertes urgentes uniquement' },
                { key: 'rapportHebdo',   label: 'Rapport hebdomadaire',   desc: 'Résumé complet chaque lundi à 08h' },
                { key: 'resumeQuotidien',label: 'Résumé quotidien',       desc: 'Synthèse de la journée chaque soir à 18h' },
              ] as { key: keyof typeof settings; label: string; desc: string }[]).map(({ key: k, label, desc }) => (
                <ToggleRow key={k} label={label} desc={desc} value={settings[k]} onChange={() => toggleSetting(k)} />
              ))}
            </SettingSection>

            {/* Push to users */}
            <SettingSection
              icon={Megaphone} iconBg="bg-violet-50" iconColor="text-violet-600"
              title="Push utilisateurs" desc="Notifications envoyées à vos utilisateurs"
            >
              {([
                { key: 'pushPassagers',   label: 'Push vers passagers',   desc: 'Notifications mobiles pour les passagers' },
                { key: 'pushChauffeurs',  label: 'Push vers chauffeurs',  desc: 'Notifications mobiles pour les chauffeurs' },
                { key: 'alerteKyc',       label: 'Relances KYC auto',     desc: 'Relancer les chauffeurs avec KYC en attente' },
                { key: 'alertePaiement',  label: 'Alertes paiement auto', desc: 'Notifier automatiquement en cas d\'échec' },
              ] as { key: keyof typeof settings; label: string; desc: string }[]).map(({ key: k, label, desc }) => (
                <ToggleRow key={k} label={label} desc={desc} value={settings[k]} onChange={() => toggleSetting(k)} />
              ))}
            </SettingSection>

            <div className="md:col-span-2 flex justify-end pt-1">
              <button
                onClick={() => toast.success('Paramètres enregistrés', { description: 'Vos préférences ont été mises à jour.' })}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />Enregistrer les paramètres
              </button>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}

/* ─────────────────────────── helpers ─────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2.5">{children}</p>
  )
}

function SettingSection({ icon: Icon, iconBg, iconColor, title, desc, children }: {
  icon: React.ElementType; iconBg: string; iconColor: string
  title: string; desc: string; children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-4 h-4', iconColor)} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#111827]">{title}</p>
          <p className="text-[11px] text-[#9CA3AF]">{desc}</p>
        </div>
      </div>
      <div className="space-y-0 divide-y divide-[#F9FAFB]">{children}</div>
    </div>
  )
}

function ToggleRow({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#111827] leading-none">{label}</p>
        <p className="text-[11px] text-[#9CA3AF] mt-1">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={cn('relative w-11 h-6 rounded-full transition-colors shrink-0', value ? 'bg-orange-500' : 'bg-[#E5E7EB]')}
      >
        <span className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          value ? 'translate-x-[22px]' : 'translate-x-0.5',
        )} />
      </button>
    </div>
  )
}
