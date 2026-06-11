'use client'

import React from 'react'
import { Printer, X } from 'lucide-react'
import { RICASH_LOGO_SRC } from '@/components/ricash-logo'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { printDocument } from '@/lib/export-utils'
import { buildReceiptPrintHtml } from '@/lib/print-templates'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ReceiptData {
  type: string // "Dépôt Wallet", "Retrait Wallet", "Transfert National", "Retrait Transfert"
  reference: string // e.g., "RIC-2025-001234"
  date: string // e.g., "25 Mai 2025, 14:30"
  agentName: string // "Amadou Moussa"
  agentLocation: string // "Bamako"
  clientName: string
  clientPhone: string
  amount: number
  fees: number
  total: number
  additionalDetails?: { label: string; value: string }[] // For type-specific details
}

interface ReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ReceiptData | null
}

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function formatFCFA(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

/* ------------------------------------------------------------------ */
/*  Receipt Row                                                        */
/* ------------------------------------------------------------------ */

function ReceiptRow({
  label,
  value,
  mono,
  highlight,
  bold,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
  bold?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-xs text-[#6B7280] shrink-0">{label}</span>
      <span
        className={`text-xs text-right break-all ${
          highlight
            ? 'text-emerald-600 font-bold text-sm'
            : bold
              ? 'text-[#111827] font-semibold'
              : 'text-[#111827] font-medium'
        } ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ReceiptDialog({ open, onOpenChange, data }: ReceiptDialogProps) {
  if (!data) return null

  const receipt = data

  function handlePrint() {
    const printed = printDocument(
      buildReceiptPrintHtml(receipt),
      `Reçu - ${receipt.reference}`
    )
    if (printed) {
      toast.success('Impression lancée', {
        description: `Référence : ${receipt.reference}`,
      })
    } else {
      toast.error('Impossible d\'ouvrir la fenêtre d\'impression')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Reçu - {data.type}</DialogTitle>
          <DialogDescription>Reçu de transaction pour la référence {data.reference}</DialogDescription>
        </DialogHeader>

        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Fermer</span>
        </button>

        {/* Receipt Paper */}
        <div className="p-5">
          <div
            id="ricash-receipt-print"
            className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-5 bg-white space-y-4"
          >
            {/* Header / Logo */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#D1D5DB]">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={RICASH_LOGO_SRC}
                  alt="Ricash"
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{ width: 36, height: 36 }}
                />
                <span className="text-xl font-bold text-[#111827]">Ricash</span>
              </div>
              <p className="text-[10px] text-[#9CA3AF] tracking-wider uppercase">Agent Web Platform</p>
            </div>

            {/* Receipt Title */}
            <div className="text-center space-y-0.5">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                REÇU - {data.type.toUpperCase()}
              </h3>
              <p className="font-mono text-xs text-emerald-600 font-semibold tracking-wide">
                {data.reference}
              </p>
            </div>

            {/* Date & Agent */}
            <div className="space-y-1 pt-2 border-t border-dashed border-[#D1D5DB]">
              <ReceiptRow label="Date" value={data.date} />
              <ReceiptRow label="Agent" value={data.agentName} />
              <ReceiptRow label="Point de service" value={data.agentLocation} />
            </div>

            {/* Client */}
            <div className="space-y-1 pt-2 border-t border-dashed border-[#D1D5DB]">
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Client</p>
              <ReceiptRow label="Nom" value={data.clientName} />
              <ReceiptRow label="Téléphone" value={data.clientPhone} mono />
            </div>

            {/* Transaction Details */}
            <div className="space-y-1 pt-2 border-t border-dashed border-[#D1D5DB]">
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Transaction</p>
              <ReceiptRow label="Type" value={data.type} />
              <ReceiptRow label="Montant" value={formatFCFA(data.amount)} highlight />
              <ReceiptRow label="Frais" value={formatFCFA(data.fees)} />
            </div>

            {/* Additional Details */}
            {data.additionalDetails && data.additionalDetails.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-dashed border-[#D1D5DB]">
                {data.additionalDetails.map((detail, i) => (
                  <ReceiptRow
                    key={i}
                    label={detail.label}
                    value={detail.value}
                  />
                ))}
              </div>
            )}

            {/* Total */}
            <div className="pt-2 border-t-2 border-dashed border-[#D1D5DB]">
              <div className="flex items-center justify-between gap-3 py-1.5 px-2 bg-emerald-50 rounded-lg">
                <span className="text-sm font-bold text-[#111827]">Total</span>
                <span className="text-base font-bold text-emerald-600">
                  {formatFCFA(data.total)}
                </span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center pt-2">
              <div className="w-20 h-20 rounded-lg border-2 border-[#D1D5DB] flex flex-col items-center justify-center gap-0.5">
                <div className="grid grid-cols-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-[1px] ${
                        (i + Math.floor(i / 3)) % 2 === 0 ? 'bg-[#111827]' : 'bg-[#D1D5DB]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-semibold text-[#9CA3AF] mt-0.5">QR</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-2 border-t border-dashed border-[#D1D5DB]">
              <p className="text-xs font-medium text-emerald-600">Merci d&apos;utiliser Ricash</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Conservez ce reçu comme preuve de transaction</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-5 pb-5 pt-1">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] active:scale-[0.98] transition-all"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-[2] h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer reçu
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
