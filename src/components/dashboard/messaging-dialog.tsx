'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Paperclip, Smile, ShieldCheck, MoreVertical } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Msg { id: string; author: 'admin' | 'other'; text: string; time: string; status?: 'sent' | 'read' }

function ts() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const AUTO_REPLIES: Record<string, string[]> = {
  passager: [
    "Bonjour, j'ai bien reçu votre message. Je vérifie ça tout de suite.",
    "Merci pour votre retour, nous allons traiter votre demande rapidement.",
    "D'accord, j'en prends note. Merci pour l'information !",
    "Compris, un agent du support va vous répondre plus en détail d'ici peu.",
  ],
  chauffeur: [
    "Bien reçu. Je m'en occupe immédiatement, restez en ligne.",
    "Compris, l'information a été transmise à l'équipe opérationnelle.",
    "Merci pour l'alerte, on fait le nécessaire côté système.",
    "OK, c'est validé de notre côté. Bonne route !",
  ],
  default: [
    "Message bien reçu par le support BestTrans. Merci.",
    "Nous avons pris connaissance de votre message, un agent revient vers vous.",
  ],
}

export interface MessagingDialogProps {
  open: boolean
  onClose: () => void
  recipientName: string
  recipientRole?: 'passager' | 'chauffeur' | 'default'
  recipientPhone?: string
}

export function MessagingDialog({
  open,
  onClose,
  recipientName,
  recipientRole = 'default',
  recipientPhone,
}: MessagingDialogProps) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{
        id: 'init',
        author: 'other',
        text: `Bonjour, c'est ${recipientName.split(' ')[0]}. J'ai une question concernant ma dernière opération.`,
        time: ts(),
        status: 'read'
      }])
    }
  }, [open, recipientName, msgs.length])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  function send() {
    const text = input.trim()
    if (!text || typing) return
    
    const newMsg: Msg = { id: Date.now().toString(), author: 'admin', text, time: ts(), status: 'sent' }
    setMsgs(p => [...p, newMsg])
    setInput('')
    
    // Simulate reading after 1s
    setTimeout(() => {
      setMsgs(p => p.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m))
    }, 1000)

    // Simulate typing and reply
    setTyping(true)
    const replies = AUTO_REPLIES[recipientRole] ?? AUTO_REPLIES.default
    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)]
      setMsgs(p => [...p, { id: (Date.now() + 1).toString(), author: 'other', text: reply, time: ts() }])
      setTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const initials = recipientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const roleLabel = recipientRole === 'passager' ? 'Passager' : recipientRole === 'chauffeur' ? 'Chauffeur' : 'Utilisateur'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-w-md [&>button]:hidden border-none shadow-2xl rounded-3xl bg-white h-[550px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] px-5 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-sm shrink-0 select-none border border-orange-500/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white truncate leading-tight">{recipientName}</p>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {roleLabel}{recipientPhone ? ` · ${recipientPhone}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-all">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="bg-orange-50/50 px-4 py-2 border-b border-orange-100 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
          <span className="text-[10px] font-medium text-orange-800 tracking-wide uppercase">Support Sécurisé BestTrans</span>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-[#FAFBFF] space-y-6">
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-medium">Aujourd'hui</span>
          </div>

          {msgs.map((m, idx) => {
            const isMe = m.author === 'admin'
            return (
              <div key={m.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[85%] flex flex-col',
                  isMe ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
                    isMe 
                      ? 'bg-orange-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                  )}>
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 px-1">
                    <span className="text-[10px] text-slate-400 font-medium">{m.time}</span>
                    {isMe && (
                      <span className={cn(
                        'text-[10px] font-bold',
                        m.status === 'read' ? 'text-orange-500' : 'text-slate-300'
                      )}>
                        {m.status === 'read' ? 'Lu' : 'Envoyé'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 150, 300].map(d => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
            <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-white rounded-xl transition-all">
              <Paperclip className="w-4.5 h-4.5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 text-slate-900 placeholder:text-slate-400"
            />
            <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-white rounded-xl transition-all">
              <Smile className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg',
                input.trim() && !typing
                  ? 'bg-orange-600 text-white shadow-orange-600/20 hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none',
              )}
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
