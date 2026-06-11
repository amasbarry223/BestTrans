'use client'

import React, { useEffect, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Clock,
  Printer,
  Receipt,
  User,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { printDocument } from '@/lib/export-utils'
import { buildTransactionDetailPrintHtml } from '@/lib/print-templates'
import {
  takePendingTransaction,
  useDashboard,
  type PendingTransaction,
} from '@/components/dashboard/dashboard-context'

const dailyVolumeData = [
  { day: 'Lun', volume: 1550000 },
  { day: 'Mar', volume: 1780000 },
  { day: 'Mer', volume: 1380000 },
  { day: 'Jeu', volume: 2130000 },
  { day: 'Ven', volume: 2300000 },
  { day: 'Sam', volume: 1130000 },
  { day: 'Dim', volume: 560000 },
]

const dailyVolumeConfig: ChartConfig = {
  volume: { label: 'Volume', color: '#10b981' },
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-[#6B7280] shrink-0">{label}</span>
      <span
        className={cn(
          'text-sm font-semibold text-[#111827] text-right',
          mono && 'font-mono'
        )}
      >
        {value}
      </span>
    </div>
  )
}

function txAccent(type: string) {
  if (type === 'Dépôt') return { headerBg: 'bg-emerald-50', amount: 'text-emerald-600' }
  if (type === 'Retrait') return { headerBg: 'bg-sky-50', amount: 'text-rose-600' }
  if (type === 'Transfert') return { headerBg: 'bg-amber-50', amount: 'text-rose-600' }
  if (type === 'Retrait Transfert') return { headerBg: 'bg-violet-50', amount: 'text-emerald-600' }
  if (type === 'Airtime') return { headerBg: 'bg-rose-50', amount: 'text-rose-600' }
  return { headerBg: 'bg-teal-50', amount: 'text-emerald-600' }
}

export function HistoriqueDetailsView() {
  const { setActiveView, pendingTransaction, clearPendingTransaction } =
    useDashboard()

  const [tx, setTx] = useState<PendingTransaction | null>(() =>
    takePendingTransaction()
  )

  useEffect(() => {
    if (pendingTransaction) {
      setTx((current) => current ?? pendingTransaction)
    }
    clearPendingTransaction()
  }, [pendingTransaction, clearPendingTransaction])

  const [printBusy, setPrintBusy] = useState(false)

  if (!tx) {
    return (
      <div className="h-full w-full flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveView('historique')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <p className="text-sm text-[#6B7280]">
            Aucune transaction sélectionnée. Ouvrez une transaction depuis la page Historique.
          </p>
        </div>
      </div>
    )
  }

  const transaction = tx
  const accent = txAccent(transaction.type)

  function handlePrint() {
    setPrintBusy(true)
    try {
      const ok = printDocument(
        buildTransactionDetailPrintHtml({
          reference: transaction.reference,
          type: transaction.type,
          status: transaction.status,
          period: transaction.period,
          date: transaction.date,
          time: transaction.time,
          amount: transaction.amount,
          positive: transaction.positive,
          description: transaction.description,
          client: transaction.client,
        }),
        `Transaction ${transaction.reference}`
      )
      if (!ok) {
        toast.error('Impossible d\'ouvrir la fenêtre d\'impression')
      }
    } finally {
      setPrintBusy(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveView('historique')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;historique
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            disabled={printBusy}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all',
              printBusy
                ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm'
            )}
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
        {/* Left Column: Volume */}
        <div className="lg:col-span-3 flex flex-col gap-5 min-h-0">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-emerald-600" />
                <h2 className="text-sm font-semibold text-[#111827]">Volume de transactions</h2>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                <Clock className="w-3.5 h-3.5" />
                <span>7 derniers jours</span>
              </div>
            </div>

            <ChartContainer config={dailyVolumeConfig} className="h-[220px] w-full">
              <AreaChart data={dailyVolumeData}>
                <defs>
                  <linearGradient id="volumeGradientDetails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
                  width={44}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#volumeGradientDetails)"
                />
              </AreaChart>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Meilleur jour</p>
                <p className="text-sm font-bold text-[#111827]">Ven</p>
                <p className="text-xs text-emerald-600">2.3M FCFA</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Moyenne</p>
                <p className="text-sm font-bold text-[#111827]">1.47M</p>
                <p className="text-xs text-[#6B7280]">FCFA/jour</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Variation</p>
                <p className="text-sm font-bold text-emerald-600">+22%</p>
                <p className="text-xs text-[#6B7280]">vs sem. dern.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction details */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex-1 flex flex-col min-h-0 shadow-sm">
            <div className={cn('px-5 py-4 border-b border-[#E5E7EB]', accent.headerBg)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#111827]">{transaction.type}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-semibold text-[#111827]">{transaction.status}</span>
                    <span className="text-xs text-[#6B7280] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {transaction.date}, {transaction.time}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#9CA3AF]">{transaction.reference}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Montant</span>
                  <span className={cn('text-xl font-bold', transaction.positive ? 'text-emerald-600' : 'text-rose-600')}>
                    {transaction.positive ? '+' : '−'}
                    {transaction.amount}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Description</p>
                      <p className="text-sm font-medium text-[#111827] truncate">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Client</p>
                      <p className="text-sm font-medium text-[#111827] truncate">{transaction.client}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB]">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                    Détails complets
                  </p>
                  <div className="space-y-2.5">
                    <DetailRow label="Type de transaction" value={transaction.type} />
                    <DetailRow label="Statut" value={transaction.status} />
                    <DetailRow label="Sens" value={transaction.positive ? 'Crédit' : 'Débit'} />
                    <DetailRow label="Période" value={transaction.period} />
                    <DetailRow label="Date / Heure" value={`${transaction.date} à ${transaction.time}`} />
                    <DetailRow label="Référence" value={transaction.reference} mono />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex gap-3">
              <button
                type="button"
                onClick={() => setActiveView('historique')}
                className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6] active:scale-[0.98] transition-all"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex-[2] h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

