'use client'

import React, { useMemo, useState } from 'react'
import { Copy, Download, QrCode, ScanLine } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function QrPlaceholder({ className }: { className?: string }) {
  const cells = useMemo(() => Array.from({ length: 25 }), [])
  return (
    <div className={cn('w-40 h-40 rounded-2xl border-2 border-[#E5E7EB] bg-white p-3', className)}>
      <div className="w-full h-full grid grid-cols-5 gap-1">
        {cells.map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-full h-full rounded-[3px]',
              (i * 7 + Math.floor(i / 5)) % 3 === 0 ? 'bg-[#111827]' : 'bg-[#E5E7EB]'
            )}
          />
        ))}
      </div>
    </div>
  )
}

function downloadTextFile(filename: string, content: string) {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    return true
  } catch {
    return false
  }
}

export type QrCodeDialogMode = 'display' | 'scan'

export function QrCodeDialog({
  open,
  onOpenChange,
  mode,
  title,
  description,
  code,
  scanPlaceholder,
  onScan,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: QrCodeDialogMode
  title: string
  description?: string
  code?: string
  scanPlaceholder?: string
  onScan?: (code: string) => void
}) {
  const [scanValue, setScanValue] = useState('')

  const effectiveCode = (code ?? '').trim()
  const canDisplay = mode === 'display' && effectiveCode.length > 0
  const canScan = mode === 'scan' && typeof onScan === 'function'

  function handleCopy() {
    if (!effectiveCode) return
    navigator.clipboard
      .writeText(effectiveCode)
      .then(() => toast.success('Code copié', { description: effectiveCode }))
      .catch(() => toast.error('Impossible de copier le code'))
  }

  function handleDownload() {
    if (!effectiveCode) return
    const ok = downloadTextFile(`qr-${effectiveCode}.txt`, effectiveCode)
    if (ok) toast.success('Fichier téléchargé', { description: 'Le code QR a été exporté en .txt' })
    else toast.error('Téléchargement impossible')
  }

  function handleScan() {
    if (!canScan) return
    const raw = scanValue.trim()
    if (!raw) {
      toast.error('Entrez un code à scanner')
      return
    }
    onScan(raw)
    toast.success('Scan effectué', { description: raw })
    setScanValue('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border border-[#E5E7EB] rounded-2xl max-w-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E7EB] bg-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              {mode === 'scan' ? (
                <ScanLine className="w-5 h-5 text-emerald-600" />
              ) : (
                <QrCode className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-[#111827]">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="text-xs text-[#6B7280] mt-1">
                  {description}
                </DialogDescription>
              ) : null}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 bg-[#F9FAFB]">
          {mode === 'display' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <QrPlaceholder />
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Code</p>
                <p className="mt-1 text-sm font-semibold text-[#111827] font-mono break-all">{effectiveCode}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!canDisplay}
                  onClick={handleCopy}
                  className={cn(
                    'h-11 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2',
                    !canDisplay && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Copy className="w-4 h-4" />
                  Copier
                </button>
                <button
                  type="button"
                  disabled={!canDisplay}
                  onClick={handleDownload}
                  className={cn(
                    'h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2',
                    !canDisplay && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            </div>
          )}

          {mode === 'scan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <QrPlaceholder className="opacity-80" />
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
                <label className="block text-sm font-medium text-[#111827]">Code détecté</label>
                <input
                  type="text"
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  placeholder={scanPlaceholder ?? 'Collez ou saisissez un code…'}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow font-mono"
                />
                <p className="text-xs text-[#6B7280]">
                  Simulation: saisissez un code puis cliquez sur “Valider le scan”.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="h-11 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6] active:scale-[0.98] transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleScan}
                  className={cn(
                    'h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all',
                    !canScan && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Valider le scan
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

