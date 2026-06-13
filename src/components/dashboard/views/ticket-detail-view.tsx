'use client'

import React, { useState, useRef } from 'react'
import {
  ArrowLeft,
  MessageSquare,
  Send,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  User,
  Headphones,
  Clock,
  Paperclip,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
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
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type Message = {
  id: string
  sender: 'agent' | 'user'
  name: string
  content: string
  time: string
}

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    sender: 'user',
    name: 'Fatoumata Diallo',
    content:
      'Bonjour, j\'ai été facturée deux fois pour ma course de ce matin (Course #C-3041). Le montant de 3 500 FCFA a été débité deux fois de mon compte.',
    time: '10:32',
  },
  {
    id: 'msg-2',
    sender: 'agent',
    name: 'Support BestTrans',
    content:
      'Bonjour Madame Diallo, merci de nous avoir contactés. Nous vérifions votre dossier. Pouvez-vous nous confirmer l\'heure exacte de la course et le mode de paiement utilisé ?',
    time: '10:45',
  },
  {
    id: 'msg-3',
    sender: 'user',
    name: 'Fatoumata Diallo',
    content:
      'La course était à 8h15 ce matin. J\'ai payé par Mobile Money (Orange Money). Le premier débit est apparu immédiatement après la course, et le second environ 30 minutes plus tard.',
    time: '10:52',
  },
  {
    id: 'msg-4',
    sender: 'agent',
    name: 'Support BestTrans',
    content:
      'Merci pour ces détails. Nous avons identifié une double transaction dans notre système. Nous allons procéder au remboursement du montant en double dans les 24 à 48 heures ouvrables. Vous recevrez une confirmation par SMS.',
    time: '11:05',
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const prioriteColor: Record<string, string> = {
  'Haute': 'text-rose-700',
  'Moyenne': 'text-amber-700',
  'Basse': 'text-orange-700',
}
const statutBadgeClass: Record<string, string> = {
  'Ouvert': 'bg-rose-100 text-rose-700 hover:bg-rose-100',
  'En cours': 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  'Résolu': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
}

export function TicketDetailView() {
  const { setActiveView, pendingTicket, clearPendingTicket } = useDashboard()
  const [replyText, setReplyText] = useState('')
  const [ticketStatus, setTicketStatus] = useState<string | null>(null)
  const [escaladerDialog, setEscaladerDialog] = useState(false)
  const [cloturerDialog, setCloturerDialog] = useState(false)
  const [rembourserDialog, setRembourserDialog] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBack = () => {
    clearPendingTicket()
    setActiveView('tickets')
  }

  if (!pendingTicket) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-[#6B7280]">
        <MessageSquare className="w-12 h-12 opacity-30" />
        <p className="text-sm">Aucun ticket sélectionné</p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux tickets
        </button>
      </div>
    )
  }

  const ticket = pendingTicket
  const currentTicketStatus = ticketStatus ?? ticket.statut

  return (
    <div className="h-full w-full flex flex-col gap-5">
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
              {ticket.numero}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge className={cn('text-xs', statutBadgeClass[currentTicketStatus] ?? 'bg-orange-100 text-orange-700 hover:bg-orange-100')}>
                {currentTicketStatus}
              </Badge>
              <span className="text-xs text-[#9CA3AF]">
                {ticket.sujet || ticket.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
            onClick={() => textareaRef.current?.focus()}
          >
            <Send className="w-3.5 h-3.5" />
            Répondre
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-amber-600 border-amber-200 hover:bg-amber-50 gap-1.5"
            onClick={() => setEscaladerDialog(true)}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Escalader
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50 gap-1.5"
            onClick={() => setCloturerDialog(true)}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Clôturer
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-orange-600 border-orange-200 hover:bg-orange-50 gap-1.5"
            onClick={() => setRembourserDialog(true)}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Rembourser
          </Button>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Client</p>
          <p className="text-sm font-medium text-[#111827] mt-0.5">{ticket.personne}</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Type</p>
          <p className="text-sm font-medium text-orange-600 mt-0.5">{ticket.type}</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Date de création</p>
          <p className="text-sm font-medium text-[#111827] mt-0.5">{ticket.date}</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Priorité</p>
          <p className={cn('text-sm font-medium mt-0.5 flex items-center gap-1', prioriteColor[ticket.priorite] ?? 'text-amber-600')}>
            <AlertTriangle className="w-3 h-3" />
            {ticket.priorite}
          </p>
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl flex flex-col flex-1 min-h-0">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-600" />
          <h2 className="text-sm font-semibold text-[#111827]">Conversation</h2>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[400px] p-5 flex flex-col gap-4">
          {mockMessages.map((msg) => {
            const isAgent = msg.sender === 'agent'
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3',
                  isAgent ? 'flex-row' : 'flex-row-reverse'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold',
                    isAgent
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-orange-50 text-orange-600'
                  )}
                >
                  {isAgent ? (
                    <Headphones className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-4 py-3',
                    isAgent
                      ? 'bg-orange-50 border border-orange-100'
                      : 'bg-[#F3F4F6] border border-[#E5E7EB]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        isAgent ? 'text-orange-700' : 'text-[#111827]'
                      )}
                    >
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-sm text-[#374151] leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Reply area */}
        <div className="p-4 flex flex-col gap-3">
          <Textarea
            ref={textareaRef}
            placeholder="Écrire une réponse..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex items-center justify-between">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  toast.success('Fichier joint', { description: file.name })
                  e.target.value = ''
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-[#9CA3AF] gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4" />
              Joindre un fichier
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
              onClick={() => {
                if (replyText.trim()) {
                  toast.success('Réponse envoyée')
                  setReplyText('')
                }
              }}
            >
              <Send className="w-3.5 h-3.5" />
              Envoyer
            </Button>
          </div>
        </div>
      </div>

      {/* Historique des interventions */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-600" />
          Historique des interventions
        </h3>
        <div className="space-y-4">
          {[
            { time: ticket.date, action: 'Ticket ouvert', actor: ticket.personne, type: 'user' as const },
            { time: ticket.date, action: 'Assigné à Support BestTrans', actor: 'Système', type: 'agent' as const },
            ...(ticket.statut !== 'Ouvert' ? [{ time: ticket.date, action: 'Première réponse envoyée', actor: 'Support BestTrans', type: 'agent' as const }] : []),
            ...(ticket.statut === 'Résolu' ? [{ time: ticket.date, action: 'Ticket clôturé', actor: 'Support BestTrans', type: 'agent' as const }] : []),
          ].map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                entry.type === 'agent' ? 'bg-orange-100' : 'bg-gray-100'
              )}>
                {entry.type === 'agent'
                  ? <Headphones className="w-3.5 h-3.5 text-orange-600" />
                  : <User className="w-3.5 h-3.5 text-gray-500" />}
              </div>
              <div className="flex-1 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#111827]">{entry.action}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">par {entry.actor}</p>
                </div>
                <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap shrink-0">{entry.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Development Notice */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-700">
            Fonctionnalité en cours de développement
          </p>
          <p className="text-xs text-orange-600 mt-0.5">
            La messagerie en temps réel et les notifications push pour les tickets
            seront disponibles prochainement.
          </p>
        </div>
      </div>

      {/* ── AlertDialog: Escalader ── */}
      <AlertDialog open={escaladerDialog} onOpenChange={setEscaladerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Escalader le ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Le ticket <strong className="text-amber-700">{ticket.numero}</strong> sera transmis à l&apos;équipe de niveau supérieur. Le statut passera à &quot;En cours&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setTicketStatus('En cours')
                setEscaladerDialog(false)
                toast.success('Ticket escaladé', { description: `${ticket.numero} a été transmis à l'équipe N2.` })
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Escalader
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── AlertDialog: Clôturer ── */}
      <AlertDialog open={cloturerDialog} onOpenChange={setCloturerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clôturer le ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Clôturer le ticket <strong className="text-emerald-700">{ticket.numero}</strong>. Le client sera notifié que son problème est résolu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setTicketStatus('Résolu')
                setCloturerDialog(false)
                toast.success('Ticket clôturé', { description: `${ticket.numero} a été marqué comme résolu.` })
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Clôturer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── AlertDialog: Rembourser ── */}
      <AlertDialog open={rembourserDialog} onOpenChange={setRembourserDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Initier un remboursement</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmer le remboursement au client <strong>{ticket.personne}</strong> pour le ticket <strong className="text-orange-700">{ticket.numero}</strong>. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRembourserDialog(false)
                toast.success('Remboursement initié', { description: `Le remboursement pour ${ticket.personne} sera traité sous 24-48h.` })
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Confirmer le remboursement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
